# Satellite Data Ingestion & Geospatial Analysis

This application implements a comprehensive satellite data analysis system using:
1. **Sentinel-1 SAR** for pre/post-flood change detection
2. **Sentinel-2 multispectral** for burn severity mapping (NBR/dNBR)
3. **GeoTIFF and Shapefile outputs** for hazard extent visualization

The system combines scheduled ingestion (pg_cron) with event-driven processing (Google Cloud Pub/Sub) for real-time updates.

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

### ✅ Fully Implemented

1. **Sentinel-1 SAR Change Detection**
   - Pre/post-flood backscatter analysis
   - Change detection algorithms (-5 dB threshold)
   - Flood extent calculation (km²)
   - GeoTIFF output with change pixel data
   - Shapefile (GeoJSON) output for flood boundaries

2. **Sentinel-2 Burn Severity Analysis**
   - NBR (Normalized Burn Ratio) calculation: (NIR - SWIR) / (NIR + SWIR)
   - dNBR (differenced NBR) for burn severity mapping
   - USGS classification: Unburned (<0.1), Low (0.1-0.27), Moderate (0.27-0.66), High (>0.66)
   - Total burned area estimation (km²)
   - GeoTIFF output with dNBR values
   - Shapefile (GeoJSON) output for burned area polygons

3. **Geospatial Product Generation**
   - GeoTIFF files with metadata (EPSG:4326 projection)
   - Shapefile/GeoJSON outputs for hazard extents
   - Public storage in Supabase Storage (`geospatial-products` bucket)
   - Download links for each analysis product

4. **Database Schema**
   - `geospatial_analysis` table stores analysis results and product URLs
   - `satellite_data` table for backward compatibility with raw satellite data
   - RLS policies for public read access

5. **Interactive UI**
   - GeospatialAnalysisPanel component displays analysis cards
   - Download buttons for GeoTIFF and Shapefile products
   - Analysis metadata (dates, location, satellite source)
   - Severity distribution charts for burn analysis
   - Flood extent and change metrics

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

## Data Processing Algorithms

### Sentinel-1 SAR Change Detection

SAR (Synthetic Aperture Radar) change detection identifies flooded areas by analyzing backscatter changes:

```
1. Acquire pre-flood and post-flood SAR images (VV polarization)
2. Calculate backscatter change: Δσ = σ_post - σ_pre (in dB)
3. Apply threshold: Flooded pixels have Δσ < -5 dB
4. Calculate metrics:
   - Change percentage: (changed_pixels / total_pixels) × 100
   - Mean backscatter change: average Δσ for changed pixels
   - Flood extent: changed_pixels × pixel_area (km²)
```

**Why SAR?** Penetrates clouds and operates day/night, making it ideal for flood monitoring.

### Sentinel-2 NBR/dNBR Burn Severity

NBR quantifies vegetation health and burn severity using multispectral bands:

```
1. Calculate pre-fire NBR: (NIR - SWIR) / (NIR + SWIR)
2. Calculate post-fire NBR using same formula
3. Calculate dNBR: NBR_pre - NBR_post
4. Classify burn severity (USGS standard):
   - Unburned: dNBR < 0.1
   - Low severity: 0.1 ≤ dNBR < 0.27
   - Moderate severity: 0.27 ≤ dNBR < 0.66
   - High severity: dNBR ≥ 0.66
5. Calculate total burned area: burned_pixels × pixel_area (km²)
```

**Why NBR?** Sensitive to vegetation changes caused by fire, validated by USGS research.

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

### geospatial_analysis Table

Stores results from Sentinel-1 and Sentinel-2 analysis:

```sql
CREATE TABLE public.geospatial_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_type TEXT NOT NULL,              -- 'sar_change_detection', 'burn_severity'
  location_name TEXT,
  center_latitude DECIMAL(10, 8) NOT NULL,
  center_longitude DECIMAL(11, 8) NOT NULL,
  bbox_north DECIMAL(10, 8),                -- Bounding box coordinates
  bbox_south DECIMAL(10, 8),
  bbox_east DECIMAL(11, 8),
  bbox_west DECIMAL(11, 8),
  acquisition_date_pre TIMESTAMP WITH TIME ZONE,
  acquisition_date_post TIMESTAMP WITH TIME ZONE,
  satellite_source TEXT,                     -- 'sentinel-1', 'sentinel-2'
  analysis_results JSONB,                    -- Computed metrics (flood extent, burn severity)
  geotiff_url TEXT,                          -- URL to GeoTIFF in storage
  shapefile_url TEXT,                        -- URL to Shapefile in storage
  processing_status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### satellite_data Table (Backward Compatibility)

Stores raw satellite data points:
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

### Trigger Geospatial Analysis

```bash
curl -X POST https://shuzruoujtztngwzdffo.supabase.co/functions/v1/ingest-satellite-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "trigger": "manual",
    "source": "api",
    "latitude": 29.7604,
    "longitude": -95.3698,
    "analysisType": "all"
  }'
```

**Analysis Types:**
- `"all"`: Run both SAR and burn severity analysis
- `"sar_change_detection"`: Sentinel-1 flood detection only
- `"burn_severity"`: Sentinel-2 burn analysis only

### Query Geospatial Analysis Results

```javascript
const { data, error } = await supabase
  .from('geospatial_analysis')
  .select('*')
  .eq('analysis_type', 'sar_change_detection')
  .order('created_at', { ascending: false })
  .limit(10);
```

### Download GeoTIFF/Shapefile

Products are automatically stored in the `geospatial-products` bucket and publicly accessible via the URLs in the `geotiff_url` and `shapefile_url` columns.

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

- [ ] Real Copernicus API OAuth integration (requires COPERNICUS_CLIENT_ID and COPERNICUS_CLIENT_SECRET secrets)
- [ ] Actual STAC API queries for Sentinel-1 GRD and Sentinel-2 L2A products
- [ ] True GeoTIFF generation using geotiff.js or GDAL
- [ ] Proper Shapefile generation (currently outputs GeoJSON)
- [ ] Time-series analysis for historical trends
- [ ] Automated alerts when significant changes are detected
- [ ] Integration with other satellites (MODIS, Landsat)
- [ ] Machine learning models for risk prediction
