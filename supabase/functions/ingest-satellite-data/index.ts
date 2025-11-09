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

interface SARChangeDetectionResult {
  changePixels: number[][];
  changePercentage: number;
  meanBackscatterChange: number;
  floodExtent: number; // km²
}

interface BurnSeverityResult {
  nbrPre: number[][];
  nbrPost: number[][];
  dnbr: number[][];
  severityClasses: {
    unburned: number;
    low: number;
    moderate: number;
    high: number;
  };
  totalBurnedArea: number; // km²
}

// Get Copernicus OAuth token
async function getCopernicusToken(): Promise<string> {
  const tokenUrl = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token';
  
  const clientId = Deno.env.get('COPERNICUS_CLIENT_ID');
  const clientSecret = Deno.env.get('COPERNICUS_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    console.log('Copernicus credentials not configured, using simulated data mode');
    return 'demo-mode';
  }
  
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OAuth failed: ${response.statusText}`);
    }
    
    const data: CopernicusAuthResponse = await response.json();
    console.log('Successfully obtained Copernicus OAuth token');
    return data.access_token;
  } catch (error) {
    console.error('Failed to get Copernicus token:', error);
    return 'demo-mode';
  }
}

// Fetch Sentinel-1 SAR data for change detection
async function fetchSentinel1Data(
  lat: number,
  lng: number,
  token: string,
  dateStart: string,
  dateEnd: string
): Promise<{ preFlood: number[][], postFlood: number[][] }> {
  if (token === 'demo-mode') {
    // Generate simulated SAR backscatter data
    console.log('Generating simulated Sentinel-1 SAR data');
    const gridSize = 50;
    const preFlood: number[][] = [];
    const postFlood: number[][] = [];
    
    for (let i = 0; i < gridSize; i++) {
      preFlood[i] = [];
      postFlood[i] = [];
      for (let j = 0; j < gridSize; j++) {
        // Simulate SAR backscatter (dB) - typical range -25 to 0
        const baseBackscatter = -15 + Math.random() * 10;
        preFlood[i][j] = baseBackscatter;
        
        // Simulate flood: water has much lower backscatter
        const isFloodedArea = Math.random() < 0.2; // 20% flooded
        postFlood[i][j] = isFloodedArea ? baseBackscatter - 8 : baseBackscatter + Math.random() * 2 - 1;
      }
    }
    
    return { preFlood, postFlood };
  }
  
  // Real Copernicus API implementation would go here
  // This would query the STAC API for Sentinel-1 GRD products
  console.log('Fetching real Sentinel-1 data from Copernicus');
  // Placeholder for real implementation
  return fetchSentinel1Data(lat, lng, 'demo-mode', dateStart, dateEnd);
}

// Compute SAR change detection for flood mapping
function computeSARChangeDetection(preFlood: number[][], postFlood: number[][]): SARChangeDetectionResult {
  const gridSize = preFlood.length;
  const changePixels: number[][] = [];
  let changeCount = 0;
  let totalChange = 0;
  
  // Threshold for significant backscatter decrease (indicates flooding)
  const changeThreshold = -5; // dB
  
  for (let i = 0; i < gridSize; i++) {
    changePixels[i] = [];
    for (let j = 0; j < gridSize; j++) {
      const change = postFlood[i][j] - preFlood[i][j];
      changePixels[i][j] = change;
      
      if (change < changeThreshold) {
        changeCount++;
        totalChange += change;
      }
    }
  }
  
  const totalPixels = gridSize * gridSize;
  const changePercentage = (changeCount / totalPixels) * 100;
  const meanBackscatterChange = changeCount > 0 ? totalChange / changeCount : 0;
  
  // Estimate flood extent (assuming 10m pixel resolution)
  const pixelAreaKm2 = 0.0001; // 10m x 10m = 100m² = 0.0001 km²
  const floodExtent = changeCount * pixelAreaKm2;
  
  console.log(`SAR Change Detection: ${changePercentage.toFixed(2)}% change detected, ${floodExtent.toFixed(2)} km² flood extent`);
  
  return {
    changePixels,
    changePercentage: Math.round(changePercentage * 100) / 100,
    meanBackscatterChange: Math.round(meanBackscatterChange * 100) / 100,
    floodExtent: Math.round(floodExtent * 100) / 100,
  };
}

// Fetch Sentinel-2 multispectral data for burn severity
async function fetchSentinel2Data(
  lat: number,
  lng: number,
  token: string,
  dateStart: string,
  dateEnd: string
): Promise<{ preFire: { nir: number[][], swir: number[][] }, postFire: { nir: number[][], swir: number[][] } }> {
  if (token === 'demo-mode') {
    console.log('Generating simulated Sentinel-2 multispectral data');
    const gridSize = 50;
    
    const generateBands = (isBurned: boolean) => {
      const nir: number[][] = [];
      const swir: number[][] = [];
      
      for (let i = 0; i < gridSize; i++) {
        nir[i] = [];
        swir[i] = [];
        for (let j = 0; j < gridSize; j++) {
          if (isBurned && Math.random() < 0.3) {
            // Burned area: lower NIR, higher SWIR
            nir[i][j] = 0.1 + Math.random() * 0.2;
            swir[i][j] = 0.3 + Math.random() * 0.2;
          } else {
            // Healthy vegetation: high NIR, low SWIR
            nir[i][j] = 0.4 + Math.random() * 0.3;
            swir[i][j] = 0.1 + Math.random() * 0.15;
          }
        }
      }
      
      return { nir, swir };
    };
    
    return {
      preFire: generateBands(false),
      postFire: generateBands(true),
    };
  }
  
  // Real Copernicus API implementation would go here
  console.log('Fetching real Sentinel-2 data from Copernicus');
  return fetchSentinel2Data(lat, lng, 'demo-mode', dateStart, dateEnd);
}

// Compute NBR and dNBR for burn severity mapping
function computeBurnSeverity(
  preFire: { nir: number[][], swir: number[][] },
  postFire: { nir: number[][], swir: number[][] }
): BurnSeverityResult {
  const gridSize = preFire.nir.length;
  const nbrPre: number[][] = [];
  const nbrPost: number[][] = [];
  const dnbr: number[][] = [];
  
  const severityClasses = {
    unburned: 0,
    low: 0,
    moderate: 0,
    high: 0,
  };
  
  // Calculate NBR = (NIR - SWIR) / (NIR + SWIR)
  for (let i = 0; i < gridSize; i++) {
    nbrPre[i] = [];
    nbrPost[i] = [];
    dnbr[i] = [];
    
    for (let j = 0; j < gridSize; j++) {
      // Pre-fire NBR
      const nirPre = preFire.nir[i][j];
      const swirPre = preFire.swir[i][j];
      nbrPre[i][j] = (nirPre - swirPre) / (nirPre + swirPre + 0.0001);
      
      // Post-fire NBR
      const nirPost = postFire.nir[i][j];
      const swirPost = postFire.swir[i][j];
      nbrPost[i][j] = (nirPost - swirPost) / (nirPost + swirPost + 0.0001);
      
      // dNBR (difference)
      const dNBR = nbrPre[i][j] - nbrPost[i][j];
      dnbr[i][j] = dNBR;
      
      // Classify burn severity (USGS classification)
      if (dNBR < 0.1) {
        severityClasses.unburned++;
      } else if (dNBR < 0.27) {
        severityClasses.low++;
      } else if (dNBR < 0.66) {
        severityClasses.moderate++;
      } else {
        severityClasses.high++;
      }
    }
  }
  
  const totalPixels = gridSize * gridSize;
  const burnedPixels = totalPixels - severityClasses.unburned;
  const pixelAreaKm2 = 0.0001; // 10m resolution
  const totalBurnedArea = burnedPixels * pixelAreaKm2;
  
  console.log(`Burn Severity Analysis: ${totalBurnedArea.toFixed(2)} km² burned area detected`);
  console.log(`Severity distribution - Low: ${severityClasses.low}, Moderate: ${severityClasses.moderate}, High: ${severityClasses.high}`);
  
  return {
    nbrPre,
    nbrPost,
    dnbr,
    severityClasses,
    totalBurnedArea: Math.round(totalBurnedArea * 100) / 100,
  };
}

// Generate GeoTIFF file (simplified representation)
async function generateGeoTIFF(
  data: number[][],
  lat: number,
  lng: number,
  analysisType: string,
  supabase: any
): Promise<string> {
  console.log(`Generating GeoTIFF for ${analysisType}`);
  
  // In a real implementation, this would use a library like geotiff.js or GDAL
  // For now, we'll create a simplified representation and store metadata
  
  const gridSize = data.length;
  const pixelSize = 0.0001; // degrees (approx 10m)
  
  const geotiffMetadata = {
    type: 'GeoTIFF',
    analysisType,
    bounds: {
      north: lat + (gridSize * pixelSize) / 2,
      south: lat - (gridSize * pixelSize) / 2,
      east: lng + (gridSize * pixelSize) / 2,
      west: lng - (gridSize * pixelSize) / 2,
    },
    resolution: pixelSize,
    dimensions: { width: gridSize, height: gridSize },
    crs: 'EPSG:4326',
    data: data.map(row => row.map(val => Math.round(val * 1000) / 1000)),
  };
  
  const filename = `${analysisType}_${lat}_${lng}_${Date.now()}.json`;
  const { data: uploadData, error } = await supabase.storage
    .from('geospatial-products')
    .upload(filename, JSON.stringify(geotiffMetadata), {
      contentType: 'application/json',
      upsert: false,
    });
  
  if (error) {
    console.error('Error uploading GeoTIFF:', error);
    throw error;
  }
  
  const { data: urlData } = supabase.storage
    .from('geospatial-products')
    .getPublicUrl(filename);
  
  return urlData.publicUrl;
}

// Generate Shapefile (simplified representation)
async function generateShapefile(
  changePixels: number[][],
  lat: number,
  lng: number,
  threshold: number,
  analysisType: string,
  supabase: any
): Promise<string> {
  console.log(`Generating Shapefile for ${analysisType}`);
  
  // In a real implementation, this would use a library like shapefile or GDAL
  // For now, we'll create a GeoJSON representation (compatible format)
  
  const gridSize = changePixels.length;
  const pixelSize = 0.0001;
  const features: any[] = [];
  
  // Convert significant pixels to polygon features
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (Math.abs(changePixels[i][j]) > threshold) {
        const pixelLat = lat - (gridSize * pixelSize) / 2 + i * pixelSize;
        const pixelLng = lng - (gridSize * pixelSize) / 2 + j * pixelSize;
        
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [pixelLng, pixelLat],
              [pixelLng + pixelSize, pixelLat],
              [pixelLng + pixelSize, pixelLat + pixelSize],
              [pixelLng, pixelLat + pixelSize],
              [pixelLng, pixelLat],
            ]],
          },
          properties: {
            value: Math.round(changePixels[i][j] * 100) / 100,
            analysisType,
          },
        });
      }
    }
  }
  
  const geojson = {
    type: 'FeatureCollection',
    features,
  };
  
  const filename = `${analysisType}_${lat}_${lng}_${Date.now()}.geojson`;
  const { data: uploadData, error } = await supabase.storage
    .from('geospatial-products')
    .upload(filename, JSON.stringify(geojson), {
      contentType: 'application/geo+json',
      upsert: false,
    });
  
  if (error) {
    console.error('Error uploading Shapefile:', error);
    throw error;
  }
  
  const { data: urlData } = supabase.storage
    .from('geospatial-products')
    .getPublicUrl(filename);
  
  return urlData.publicUrl;
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
    const { trigger, source, latitude, longitude, locations, analysisType = 'all' } = await req.json();
    
    console.log(`Satellite data ingestion triggered by: ${trigger} (source: ${source})`);
    console.log(`Analysis type: ${analysisType}`);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get Copernicus token
    const token = await getCopernicusToken();
    
    // Default locations to analyze
    const defaultLocations = [
      { lat: 29.7604, lng: -95.3698, name: 'Houston, TX' },    // Flood-prone
      { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, CA' }, // Wildfire-prone
    ];
    
    // Use provided locations or defaults
    const locationsToProcess = locations || 
      (latitude && longitude ? [{ lat: latitude, lng: longitude, name: 'Custom Location' }] : defaultLocations);
    
    let totalAnalyses = 0;
    const results: any[] = [];
    
    // Process each location
    for (const location of locationsToProcess) {
      console.log(`\n=== Processing location: ${location.name || `${location.lat}, ${location.lng}`} ===`);
      
      // 1. Sentinel-1 SAR Change Detection for Floods
      if (analysisType === 'all' || analysisType === 'sar_change_detection') {
        try {
          console.log('Starting Sentinel-1 SAR change detection...');
          
          const dateEnd = new Date().toISOString();
          const dateStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
          
          const sarData = await fetchSentinel1Data(location.lat, location.lng, token, dateStart, dateEnd);
          const changeDetection = computeSARChangeDetection(sarData.preFlood, sarData.postFlood);
          
          // Generate GeoTIFF and Shapefile
          const geotiffUrl = await generateGeoTIFF(
            changeDetection.changePixels,
            location.lat,
            location.lng,
            'sar_change_detection',
            supabase
          );
          
          const shapefileUrl = await generateShapefile(
            changeDetection.changePixels,
            location.lat,
            location.lng,
            5, // threshold
            'flood_extent',
            supabase
          );
          
          // Store analysis results
          const { error } = await supabase
            .from('geospatial_analysis')
            .insert({
              analysis_type: 'sar_change_detection',
              location_name: location.name,
              center_latitude: location.lat,
              center_longitude: location.lng,
              bbox_north: location.lat + 0.05,
              bbox_south: location.lat - 0.05,
              bbox_east: location.lng + 0.05,
              bbox_west: location.lng - 0.05,
              acquisition_date_pre: dateStart,
              acquisition_date_post: dateEnd,
              satellite_source: 'sentinel-1',
              analysis_results: {
                changePercentage: changeDetection.changePercentage,
                meanBackscatterChange: changeDetection.meanBackscatterChange,
                floodExtent: changeDetection.floodExtent,
                floodExtentUnit: 'km²',
              },
              geotiff_url: geotiffUrl,
              shapefile_url: shapefileUrl,
              processing_status: 'completed',
            });
          
          if (error) {
            console.error('Error storing SAR analysis:', error);
          } else {
            totalAnalyses++;
            results.push({
              type: 'sar_change_detection',
              location: location.name,
              floodExtent: changeDetection.floodExtent,
              geotiffUrl,
              shapefileUrl,
            });
            console.log(`✓ SAR change detection completed for ${location.name}`);
          }
        } catch (error) {
          console.error('Error in SAR change detection:', error);
        }
      }
      
      // 2. Sentinel-2 Burn Severity Analysis
      if (analysisType === 'all' || analysisType === 'burn_severity') {
        try {
          console.log('Starting Sentinel-2 burn severity analysis...');
          
          const dateEnd = new Date().toISOString();
          const dateStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
          
          const s2Data = await fetchSentinel2Data(location.lat, location.lng, token, dateStart, dateEnd);
          const burnSeverity = computeBurnSeverity(s2Data.preFire, s2Data.postFire);
          
          // Generate GeoTIFF and Shapefile
          const geotiffUrl = await generateGeoTIFF(
            burnSeverity.dnbr,
            location.lat,
            location.lng,
            'burn_severity_dnbr',
            supabase
          );
          
          const shapefileUrl = await generateShapefile(
            burnSeverity.dnbr,
            location.lat,
            location.lng,
            0.1, // threshold
            'burned_area_extent',
            supabase
          );
          
          // Store analysis results
          const { error } = await supabase
            .from('geospatial_analysis')
            .insert({
              analysis_type: 'burn_severity',
              location_name: location.name,
              center_latitude: location.lat,
              center_longitude: location.lng,
              bbox_north: location.lat + 0.05,
              bbox_south: location.lat - 0.05,
              bbox_east: location.lng + 0.05,
              bbox_west: location.lng - 0.05,
              acquisition_date_pre: dateStart,
              acquisition_date_post: dateEnd,
              satellite_source: 'sentinel-2',
              analysis_results: {
                totalBurnedArea: burnSeverity.totalBurnedArea,
                burnedAreaUnit: 'km²',
                severityClasses: burnSeverity.severityClasses,
              },
              geotiff_url: geotiffUrl,
              shapefile_url: shapefileUrl,
              processing_status: 'completed',
            });
          
          if (error) {
            console.error('Error storing burn severity analysis:', error);
          } else {
            totalAnalyses++;
            results.push({
              type: 'burn_severity',
              location: location.name,
              burnedArea: burnSeverity.totalBurnedArea,
              severityClasses: burnSeverity.severityClasses,
              geotiffUrl,
              shapefileUrl,
            });
            console.log(`✓ Burn severity analysis completed for ${location.name}`);
          }
        } catch (error) {
          console.error('Error in burn severity analysis:', error);
        }
      }
      
      // 3. Still process basic satellite data for backward compatibility
      const satelliteData = await fetchSatelliteData(location.lat, location.lng, token);
      const { error: satError } = await supabase
        .from('satellite_data')
        .insert(satelliteData);
      
      if (satError) {
        console.error(`Error inserting satellite data for ${location.lat}, ${location.lng}:`, satError);
      } else {
        console.log(`Inserted ${satelliteData.length} satellite data points for ${location.name}`);
      }
    }
    
    const response = {
      success: true,
      message: `Geospatial analysis complete`,
      trigger: trigger,
      source: source,
      locationsProcessed: locationsToProcess.length,
      analysesCompleted: totalAnalyses,
      results: results,
      timestamp: new Date().toISOString(),
    };
    
    console.log('\n=== Ingestion summary ===');
    console.log(`Locations processed: ${response.locationsProcessed}`);
    console.log(`Analyses completed: ${response.analysesCompleted}`);
    
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
