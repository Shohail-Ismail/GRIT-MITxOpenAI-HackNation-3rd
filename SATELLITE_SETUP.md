# Satellite Data Ingestion Setup

This application implements a hybrid satellite data ingestion system that combines:
1. **Scheduled ingestion** - Automatic data pulls every 30 minutes via Supabase pg_cron
2. **Event-driven ingestion** - Real-time processing via Google Cloud Pub/Sub webhooks

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Satellite Data Sources                        │
│              (Copernicus Data Space Ecosystem)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
    ┌─────────────────┐            ┌──────────────────┐
    │  pg_cron Job    │            │ Google Cloud     │
    │  (Every 30min)  │            │    Pub/Sub       │
    └─────────────────┘            └──────────────────┘
              │                               │
              │                               ▼
              │                    ┌──────────────────┐
              │                    │ Webhook Endpoint │
              │                    │ /satellite-      │
              │                    │  webhook         │
              │                    └──────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ ingest-satellite-data │
                  │   Edge Function       │
                  └───────────────────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ satellite_data table  │
                  │    (Supabase)         │
                  └───────────────────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │   Risk Map UI with    │
                  │   Satellite Overlay   │
                  └───────────────────────┘
```

## Features

### ✅ Already Implemented

1. **Database Schema** (`satellite_data` table)
   - Stores satellite measurements: vegetation index, water index, temperature, cloud coverage
   - Includes computed risk indicators for flood, drought, wildfire, and storm risks
   - Automatic timestamp tracking with triggers

2. **Scheduled Ingestion** (pg_cron)
   - Runs every 30 minutes automatically
   - Pulls data for major risk-prone areas (New York, Los Angeles, Houston, Miami, San Francisco)
   - No configuration needed - works out of the box

3. **Edge Functions**
   - `ingest-satellite-data`: Main ingestion logic with Copernicus API integration
   - `satellite-webhook`: Google Cloud Pub/Sub webhook handler

4. **Interactive Map UI**
   - Toggle satellite data layer on/off
   - Hover over satellite data points to see measurements and risk indicators
   - Real-time update timestamps
   - Color-coded risk visualization

### 🔧 Optional: Google Cloud Pub/Sub Setup

To enable real-time event-driven ingestion when new satellite data is available:

#### Prerequisites
- Google Cloud Platform account
- Billing enabled on your GCP project
- gcloud CLI installed

#### Setup Steps

1. **Create a Google Cloud Project**
   ```bash
   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```

2. **Enable Required APIs**
   ```bash
   gcloud services enable pubsub.googleapis.com
   gcloud services enable cloudscheduler.googleapis.com
   ```

3. **Create Pub/Sub Topic**
   ```bash
   gcloud pubsub topics create satellite-events
   ```

4. **Create Push Subscription**
   ```bash
   gcloud pubsub subscriptions create satellite-webhook-subscription \
     --topic=satellite-events \
     --push-endpoint=https://shuzruoujtztngwzdffo.supabase.co/functions/v1/satellite-webhook
   ```

5. **Set up Authentication** (Optional for production)
   ```bash
   # Create service account
   gcloud iam service-accounts create satellite-webhook-sa \
     --display-name="Satellite Webhook Service Account"
   
   # Grant Pub/Sub publisher role
   gcloud pubsub topics add-iam-policy-binding satellite-events \
     --member="serviceAccount:satellite-webhook-sa@your-project-id.iam.gserviceaccount.com" \
     --role="roles/pubsub.publisher"
   ```

6. **Test the Webhook**
   ```bash
   # Publish a test message
   gcloud pubsub topics publish satellite-events \
     --message='{
       "eventType": "new_sentinel_data",
       "satellite": "Sentinel-2",
       "location": {"latitude": 40.7128, "longitude": -74.0060},
       "acquisitionTime": "2025-11-09T12:00:00Z",
       "severity": "high"
     }'
   ```

7. **Monitor Webhook Logs**
   Check the Lovable Cloud function logs to verify messages are being received.

## Data Source: Copernicus Data Space Ecosystem

The system is designed to work with Copernicus Data Space Ecosystem (free, no API limits):

- **API Endpoint**: `https://dataspace.copernicus.eu/`
- **Authentication**: OAuth2 (requires registration at https://dataspace.copernicus.eu/)
- **Data**: Sentinel-1 & Sentinel-2 satellite imagery
- **Update Frequency**: Multiple times per day depending on location
- **Coverage**: Global

### Current Implementation
For MVP purposes, the system generates **realistic simulated data** based on:
- Location characteristics
- Climate patterns
- Elevation data
- Historical risk patterns

### Production Migration
To use real Copernicus data:
1. Register at https://dataspace.copernicus.eu/
2. Add Copernicus OAuth credentials as Supabase secrets:
   - `COPERNICUS_CLIENT_ID`
   - `COPERNICUS_CLIENT_SECRET`
3. Update the `getCopernicusToken()` function in `ingest-satellite-data/index.ts`

## Database Schema

```sql
CREATE TABLE public.satellite_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  acquisition_time TIMESTAMP WITH TIME ZONE NOT NULL,
  cloud_coverage DECIMAL(5, 2),
  vegetation_index DECIMAL(5, 2),      -- NDVI: -1 to 1
  water_index DECIMAL(5, 2),           -- NDWI: -1 to 1
  temperature DECIMAL(6, 2),           -- Celsius
  risk_indicators JSONB,               -- Computed risk scores
  source TEXT DEFAULT 'copernicus',
  processing_status TEXT DEFAULT 'processed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Usage

### Trigger Manual Ingestion
```bash
curl -X POST https://shuzruoujtztngwzdffo.supabase.co/functions/v1/ingest-satellite-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "trigger": "manual",
    "source": "api",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

### Query Satellite Data
```javascript
const { data, error } = await supabase
  .from('satellite_data')
  .select('*')
  .gte('latitude', 40.0)
  .lte('latitude', 41.0)
  .gte('longitude', -75.0)
  .lte('longitude', -73.0)
  .order('acquisition_time', { ascending: false })
  .limit(100);
```

## Monitoring

### Check Cron Job Status
```sql
SELECT * FROM cron.job WHERE jobname = 'ingest-satellite-data-every-30min';
```

### View Recent Satellite Data
```sql
SELECT 
  acquisition_time,
  latitude,
  longitude,
  temperature,
  cloud_coverage,
  source
FROM satellite_data
ORDER BY acquisition_time DESC
LIMIT 10;
```

### Check Ingestion History
Monitor edge function logs in Lovable Cloud dashboard to see:
- Ingestion trigger sources (cron, pubsub, manual)
- Number of data points inserted
- Any errors or issues

## Cost Considerations

- **Copernicus API**: Free, unlimited
- **Supabase pg_cron**: Included in Lovable Cloud
- **Database Storage**: ~1KB per satellite data point
- **Google Cloud Pub/Sub** (optional):
  - Free tier: 10 GB messages/month
  - After free tier: $0.40 per million messages
  - For 30-min updates: ~1,500 messages/month (well within free tier)

## Troubleshooting

### No satellite data showing on map
1. Check if data exists: `SELECT COUNT(*) FROM satellite_data;`
2. Verify cron job is running: Check function logs
3. Manually trigger ingestion via API

### Pub/Sub webhook not receiving messages
1. Verify subscription endpoint URL is correct
2. Check GCP Pub/Sub logs for delivery failures
3. Ensure webhook function is deployed and accessible
4. Test with a manual publish command

### Performance issues with large datasets
1. Limit queries to specific geographic bounds
2. Add composite indexes on lat/lng columns
3. Consider data archival strategy (keep only last 30 days)

## Future Enhancements

- [ ] Real Copernicus API integration
- [ ] Advanced satellite image processing (ML-based risk detection)
- [ ] Historical trend analysis
- [ ] Predictive modeling using satellite data
- [ ] Alert system for critical changes detected in satellite data
- [ ] Integration with other satellite providers (MODIS, Landsat)
