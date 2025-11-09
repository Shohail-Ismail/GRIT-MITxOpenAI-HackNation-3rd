import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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

const RiskMap = ({ latitude, longitude, riskScore, riskFactors }: RiskMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [gridData, setGridData] = useState<GridPoint[]>([]);
  const [loading, setLoading] = useState(true);

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
        <div ref={mapRef} className="h-full w-full" />
      </div>
    </Card>
  );
};

export default RiskMap;
