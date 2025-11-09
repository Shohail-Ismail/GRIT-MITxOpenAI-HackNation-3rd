import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CopernicusAuthResponse {
  access_token: string;
  expires_in: number;
}

interface SatelliteDataPoint {
  latitude: number;
  longitude: number;
  acquisition_time: string;
  cloud_coverage: number;
  vegetation_index: number;
  water_index: number;
  temperature: number;
  risk_indicators: {
    flood_risk: number;
    drought_risk: number;
    wildfire_risk: number;
    storm_risk: number;
  };
  source: string;
}

// Get Copernicus OAuth token
async function getCopernicusToken(): Promise<string> {
  const tokenUrl = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token';
  
  // For MVP, we'll use demo mode since Copernicus requires OAuth setup
  // In production, users would configure their Copernicus credentials
  console.log('Using demo mode for satellite data');
  return 'demo-mode';
}

// Fetch satellite data from Copernicus Data Space
async function fetchSatelliteData(lat: number, lng: number, token: string): Promise<SatelliteDataPoint[]> {
  // For MVP: Generate realistic simulated satellite data
  // In production, this would call the actual Copernicus API
  
  console.log(`Fetching satellite data for coordinates: ${lat}, ${lng}`);
  
  // Generate a grid of points around the location (5km radius)
  const gridSize = 7; // 7x7 grid
  const radius = 0.045; // approximately 5km
  const step = (radius * 2) / (gridSize - 1);
  
  const dataPoints: SatelliteDataPoint[] = [];
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const pointLat = lat - radius + (i * step);
      const pointLng = lng - radius + (j * step);
      
      // Simulate realistic satellite data based on location
      const cloudCoverage = Math.random() * 30; // 0-30% cloud coverage
      const vegetationIndex = 0.2 + Math.random() * 0.6; // NDVI: 0.2-0.8
      const waterIndex = -0.3 + Math.random() * 0.5; // NDWI: -0.3 to 0.2
      const temperature = 15 + Math.random() * 15; // 15-30°C
      
      // Calculate risk indicators from satellite data
      const floodRisk = Math.min(100, Math.max(0, (waterIndex + 0.3) * 100 + (100 - cloudCoverage) * 0.3));
      const droughtRisk = Math.min(100, Math.max(0, (1 - vegetationIndex) * 100));
      const wildfireRisk = Math.min(100, Math.max(0, temperature * 2 + (1 - vegetationIndex) * 50));
      const stormRisk = Math.min(100, Math.max(0, cloudCoverage * 2 + Math.random() * 30));
      
      dataPoints.push({
        latitude: pointLat,
        longitude: pointLng,
        acquisition_time: new Date().toISOString(),
        cloud_coverage: Math.round(cloudCoverage * 100) / 100,
        vegetation_index: Math.round(vegetationIndex * 100) / 100,
        water_index: Math.round(waterIndex * 100) / 100,
        temperature: Math.round(temperature * 100) / 100,
        risk_indicators: {
          flood_risk: Math.round(floodRisk),
          drought_risk: Math.round(droughtRisk),
          wildfire_risk: Math.round(wildfireRisk),
          storm_risk: Math.round(stormRisk),
        },
        source: 'copernicus-simulated',
      });
    }
  }
  
  console.log(`Generated ${dataPoints.length} satellite data points`);
  return dataPoints;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trigger, source, latitude, longitude, locations } = await req.json();
    
    console.log(`Satellite data ingestion triggered by: ${trigger} (source: ${source})`);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get Copernicus token
    const token = await getCopernicusToken();
    
    // Default locations to ingest (major risk-prone areas)
    const defaultLocations = [
      { lat: 40.7128, lng: -74.0060 },    // New York
      { lat: 34.0522, lng: -118.2437 },   // Los Angeles
      { lat: 29.7604, lng: -95.3698 },    // Houston (flood-prone)
      { lat: 25.7617, lng: -80.1918 },    // Miami (hurricane-prone)
      { lat: 37.7749, lng: -122.4194 },   // San Francisco (wildfire-prone)
    ];
    
    // Use provided locations or defaults
    const locationsToProcess = locations || 
      (latitude && longitude ? [{ lat: latitude, lng: longitude }] : defaultLocations);
    
    let totalInserted = 0;
    
    // Process each location
    for (const location of locationsToProcess) {
      const satelliteData = await fetchSatelliteData(location.lat, location.lng, token);
      
      // Insert data into database
      const { error } = await supabase
        .from('satellite_data')
        .insert(satelliteData);
      
      if (error) {
        console.error(`Error inserting satellite data for ${location.lat}, ${location.lng}:`, error);
      } else {
        totalInserted += satelliteData.length;
        console.log(`Inserted ${satelliteData.length} satellite data points for ${location.lat}, ${location.lng}`);
      }
    }
    
    const response = {
      success: true,
      message: `Satellite data ingestion complete`,
      trigger: trigger,
      source: source,
      locationsProcessed: locationsToProcess.length,
      dataPointsInserted: totalInserted,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Satellite ingestion summary:', response);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in ingest-satellite-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
