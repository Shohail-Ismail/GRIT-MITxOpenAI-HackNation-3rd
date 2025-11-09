import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, MapPin, Calendar, Satellite } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GeospatialAnalysis {
  id: string;
  analysis_type: string;
  location_name: string | null;
  center_latitude: number;
  center_longitude: number;
  acquisition_date_pre: string | null;
  acquisition_date_post: string | null;
  satellite_source: string | null;
  analysis_results: any;
  geotiff_url: string | null;
  shapefile_url: string | null;
  processing_status: string | null;
  created_at: string;
}

export const GeospatialAnalysisPanel = () => {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['geospatial-analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geospatial_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as GeospatialAnalysis[];
    },
  });

  const getAnalysisTypeLabel = (type: string) => {
    switch (type) {
      case 'sar_change_detection':
        return 'Flood Detection (SAR)';
      case 'burn_severity':
        return 'Burn Severity (NBR)';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Geospatial Analysis</CardTitle>
          <CardDescription>No analyses available yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Geospatial Analysis Results</h2>
        <p className="text-muted-foreground">
          Sentinel-1 SAR change detection and Sentinel-2 burn severity analysis
        </p>
      </div>

      <div className="grid gap-4">
        {analyses.map((analysis) => (
          <Card key={analysis.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {getAnalysisTypeLabel(analysis.analysis_type)}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {analysis.location_name || `${analysis.center_latitude.toFixed(4)}, ${analysis.center_longitude.toFixed(4)}`}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(analysis.processing_status)}>
                  {analysis.processing_status || 'unknown'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Satellite className="h-4 w-4" />
                    <span>Source</span>
                  </div>
                  <p className="font-medium capitalize">{analysis.satellite_source || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Analyzed</span>
                  </div>
                  <p className="font-medium">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {analysis.analysis_results && (
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <h4 className="font-semibold text-sm">Analysis Results</h4>
                  {analysis.analysis_type === 'sar_change_detection' && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Flood Extent:</span>
                        <p className="font-medium">
                          {analysis.analysis_results.floodExtent} {analysis.analysis_results.floodExtentUnit}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Change:</span>
                        <p className="font-medium">
                          {analysis.analysis_results.changePercentage}%
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Backscatter Change:</span>
                        <p className="font-medium">
                          {analysis.analysis_results.meanBackscatterChange} dB
                        </p>
                      </div>
                    </div>
                  )}
                  {analysis.analysis_type === 'burn_severity' && (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Burned Area:</span>
                        <p className="font-medium">
                          {analysis.analysis_results.totalBurnedArea} {analysis.analysis_results.burnedAreaUnit}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Severity Distribution:</span>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <div className="text-center p-2 bg-background rounded">
                            <p className="text-xs text-muted-foreground">Low</p>
                            <p className="font-medium">{analysis.analysis_results.severityClasses?.low || 0}</p>
                          </div>
                          <div className="text-center p-2 bg-background rounded">
                            <p className="text-xs text-muted-foreground">Moderate</p>
                            <p className="font-medium">{analysis.analysis_results.severityClasses?.moderate || 0}</p>
                          </div>
                          <div className="text-center p-2 bg-background rounded">
                            <p className="text-xs text-muted-foreground">High</p>
                            <p className="font-medium">{analysis.analysis_results.severityClasses?.high || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                {analysis.geotiff_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={analysis.geotiff_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      GeoTIFF
                    </a>
                  </Button>
                )}
                {analysis.shapefile_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={analysis.shapefile_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Shapefile (GeoJSON)
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
