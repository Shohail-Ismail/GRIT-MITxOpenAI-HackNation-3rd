import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Satellite, Layers } from "lucide-react";

interface RiskMapProps {
  latitude: number;
  longitude: number;
  riskScore: number;
  riskFactors?: {
    flood: number;
    wildfire: number;
    storm: number;
    drought: number;
  };
}

interface GridPoint {
  lat: number;
  lng: number;
  risk: number;
  riskLevel: string;
  demographics: {
    population: number;
    populationDensity: number;
    medianAge: number;
    householdIncome: number;
    urbanization: string;
  };
  payoutEstimate: {
    expected: number;
    percentile75: number;
    percentile90: number;
    worstCase: number;
  };
  distance: number;
}

interface SatelliteData {
  id: string;
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

const RiskMap = ({ latitude, longitude, riskScore, riskFactors }: RiskMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [gridData, setGridData] = useState<GridPoint[]>([]);
  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSatelliteLayer, setShowSatelliteLayer] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch satellite data
  useEffect(() => {
    const fetchSatelliteData = async () => {
      try {
        const { data, error } = await supabase
          .from('satellite_data')
          .select('*')
          .gte('latitude', latitude - 0.05)
          .lte('latitude', latitude + 0.05)
          .gte('longitude', longitude - 0.05)
          .lte('longitude', longitude + 0.05)
          .order('acquisition_time', { ascending: false })
          .limit(100);

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Cast risk_indicators from Json to the expected type
          const typedData = data.map(point => ({
            ...point,
            risk_indicators: point.risk_indicators as unknown as {
              flood_risk: number;
              drought_risk: number;
              wildfire_risk: number;
              storm_risk: number;
            }
          }));
          setSatelliteData(typedData);
          setLastUpdate(new Date(data[0].acquisition_time));
        }
      } catch (error) {
        console.error('Error fetching satellite data:', error);
      }
    };

    fetchSatelliteData();
  }, [latitude, longitude]);

  useEffect(() => {
    const fetchDemographics = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('enrich-demographics', {
          body: {
            latitude,
            longitude,
            riskFactors: {
              overallScore: riskScore,
              ...riskFactors
            }
          }
        });

        if (error) throw error;
        setGridData(data.gridData || []);
      } catch (error) {
        console.error('Error fetching demographics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemographics();
  }, [latitude, longitude, riskScore, riskFactors]);

  useEffect(() => {
    if (!mapRef.current || gridData.length === 0) return;

    // Initialize map
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([latitude, longitude], 12);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);
    } else {
      mapInstance.current.setView([latitude, longitude], 12);
    }

    const map = mapInstance.current;

    // Clear existing layers except base tile
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polygon) {
        map.removeLayer(layer);
      }
    });

    // Add center marker
    const centerIcon = L.divIcon({
      className: 'custom-center-marker',
      html: `<div style="background: hsl(var(--primary)); border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([latitude, longitude], { icon: centerIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <strong style="color: hsl(var(--primary));">Analysis Center</strong><br/>
          <span style="font-size: 12px;">Risk Score: <strong>${riskScore}</strong></span>
        </div>
      `);

    // Add 5km radius circle
    L.circle([latitude, longitude], {
      radius: 5000,
      color: 'hsl(var(--primary))',
      fillColor: 'hsl(var(--primary))',
      fillOpacity: 0.05,
      weight: 2,
      dashArray: '5, 10',
    }).addTo(map);

    // Add risk zone markers
    gridData.forEach((point) => {
      const getRiskColor = (level: string) => {
        switch (level) {
          case 'low': return '#10b981';
          case 'medium': return '#f59e0b';
          case 'high': return '#ef4444';
          case 'critical': return '#dc2626';
          default: return '#6b7280';
        }
      };

      const color = getRiskColor(point.riskLevel);
      const size = point.riskLevel === 'critical' ? 12 : point.riskLevel === 'high' ? 10 : 8;

      const icon = L.divIcon({
        className: 'custom-risk-marker',
        html: `<div style="background: ${color}; border: 2px solid white; border-radius: 50%; width: ${size}px; height: ${size}px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); cursor: pointer; transition: transform 0.2s;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const formatCurrency = (value: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

      const marker = L.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 280px; padding: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%;"></div>
              <strong style="font-size: 14px; color: ${color}; text-transform: capitalize;">${point.riskLevel} Risk Zone</strong>
            </div>
            
            <div style="background: hsl(var(--muted)); padding: 8px; border-radius: 6px; margin-bottom: 10px;">
              <div style="font-size: 11px; color: hsl(var(--muted-foreground)); margin-bottom: 4px;">RISK SCORE</div>
              <div style="font-size: 22px; font-weight: bold; color: hsl(var(--foreground));">${point.risk}</div>
              <div style="font-size: 10px; color: hsl(var(--muted-foreground));">${point.distance} km from center</div>
            </div>

            <div style="margin-bottom: 10px;">
              <div style="font-weight: 600; margin-bottom: 6px; font-size: 12px; color: hsl(var(--foreground));">📊 Demographics</div>
              <div style="font-size: 11px; line-height: 1.6; color: hsl(var(--muted-foreground));">
                <div><strong>Population Density:</strong> ${point.demographics.populationDensity.toLocaleString()}/km²</div>
                <div><strong>Area Type:</strong> ${point.demographics.urbanization}</div>
                <div><strong>Median Age:</strong> ${point.demographics.medianAge} years</div>
                <div><strong>Avg. Household Income:</strong> ${formatCurrency(point.demographics.householdIncome)}</div>
              </div>
            </div>

            <div style="border-top: 1px solid hsl(var(--border)); padding-top: 8px;">
              <div style="font-weight: 600; margin-bottom: 6px; font-size: 12px; color: hsl(var(--foreground));">💰 Payout Estimates</div>
              <div style="font-size: 11px; line-height: 1.6; color: hsl(var(--muted-foreground));">
                <div><strong>Expected:</strong> ${formatCurrency(point.payoutEstimate.expected)}</div>
                <div><strong>75th Percentile:</strong> ${formatCurrency(point.payoutEstimate.percentile75)}</div>
                <div><strong>90th Percentile:</strong> ${formatCurrency(point.payoutEstimate.percentile90)}</div>
                <div><strong>Worst Case:</strong> ${formatCurrency(point.payoutEstimate.worstCase)}</div>
              </div>
            </div>
          </div>
        `);

      // Add hover effect
      marker.on('mouseover', function() {
        this.openPopup();
      });
    });

    // Add satellite data layer if enabled
    if (showSatelliteLayer && satelliteData.length > 0) {
      satelliteData.forEach((point) => {
        const getSatelliteColor = (indicators: any) => {
          const avgRisk = (indicators.flood_risk + indicators.drought_risk + indicators.wildfire_risk + indicators.storm_risk) / 4;
          if (avgRisk >= 75) return '#dc2626';
          if (avgRisk >= 50) return '#ef4444';
          if (avgRisk >= 25) return '#f59e0b';
          return '#10b981';
        };

        const color = getSatelliteColor(point.risk_indicators);

        const satelliteIcon = L.divIcon({
          className: 'custom-satellite-marker',
          html: `<div style="background: ${color}; border: 2px solid rgba(255,255,255,0.8); border-radius: 4px; width: 10px; height: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); opacity: 0.8;"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });

        const acquisitionDate = new Date(point.acquisition_time).toLocaleString();

        L.marker([point.latitude, point.longitude], { icon: satelliteIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: system-ui; min-width: 260px; padding: 8px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
                <div style="font-size: 20px;">🛰️</div>
                <strong style="font-size: 13px; color: hsl(var(--primary));">Satellite Data</strong>
              </div>
              
              <div style="background: hsl(var(--muted)); padding: 8px; border-radius: 6px; margin-bottom: 8px; font-size: 10px; color: hsl(var(--muted-foreground));">
                <div><strong>Acquired:</strong> ${acquisitionDate}</div>
                <div><strong>Source:</strong> ${point.source}</div>
              </div>

              <div style="margin-bottom: 8px;">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 11px; color: hsl(var(--foreground));">📡 Measurements</div>
                <div style="font-size: 10px; line-height: 1.5; color: hsl(var(--muted-foreground));">
                  <div><strong>Cloud Coverage:</strong> ${point.cloud_coverage}%</div>
                  <div><strong>Vegetation Index:</strong> ${point.vegetation_index}</div>
                  <div><strong>Water Index:</strong> ${point.water_index}</div>
                  <div><strong>Temperature:</strong> ${point.temperature}°C</div>
                </div>
              </div>

              <div style="border-top: 1px solid hsl(var(--border)); padding-top: 6px;">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 11px; color: hsl(var(--foreground));">⚠️ Risk Indicators</div>
                <div style="font-size: 10px; line-height: 1.5; color: hsl(var(--muted-foreground));">
                  <div style="display: flex; justify-content: space-between;"><span>Flood:</span><strong>${point.risk_indicators.flood_risk}</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span>Drought:</span><strong>${point.risk_indicators.drought_risk}</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span>Wildfire:</span><strong>${point.risk_indicators.wildfire_risk}</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span>Storm:</span><strong>${point.risk_indicators.storm_risk}</strong></div>
                </div>
              </div>
            </div>
          `);
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude, riskScore, gridData]);

  return (
    <Card className="overflow-hidden bg-card border-border">
      <div className="relative h-[500px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading risk zones...</p>
            </div>
          </div>
        )}
        
        {/* Satellite Layer Controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <Button
            onClick={() => setShowSatelliteLayer(!showSatelliteLayer)}
            variant={showSatelliteLayer ? "default" : "outline"}
            size="sm"
            className="bg-background/95 backdrop-blur shadow-lg"
          >
            <Satellite className="h-4 w-4 mr-2" />
            Satellite Data
          </Button>
          
          {satelliteData.length > 0 && lastUpdate && (
            <Badge variant="secondary" className="bg-background/95 backdrop-blur shadow-lg text-xs">
              <Layers className="h-3 w-3 mr-1" />
              {satelliteData.length} points
            </Badge>
          )}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur rounded-lg shadow-lg p-3 text-xs">
          <div className="font-semibold mb-2 text-foreground">Risk Levels</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
              <span className="text-muted-foreground">Low (0-25)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
              <span className="text-muted-foreground">Medium (25-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
              <span className="text-muted-foreground">High (50-75)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#dc2626' }} />
              <span className="text-muted-foreground">Critical (75-100)</span>
            </div>
          </div>
          
          {showSatelliteLayer && satelliteData.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="font-semibold mb-2 text-foreground flex items-center gap-1">
                <Satellite className="h-3 w-3" />
                Satellite Layer
              </div>
              <div className="text-muted-foreground">
                Last update: {lastUpdate?.toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>

        <div ref={mapRef} className="h-full w-full" />
      </div>
    </Card>
  );
};

export default RiskMap;
