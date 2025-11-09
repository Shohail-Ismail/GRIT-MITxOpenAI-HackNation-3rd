-- Create generic update function for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create storage bucket for geospatial products
INSERT INTO storage.buckets (id, name, public)
VALUES ('geospatial-products', 'geospatial-products', true);

-- Create RLS policies for geospatial products bucket
CREATE POLICY "Geospatial products are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'geospatial-products');

CREATE POLICY "Service role can upload geospatial products"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'geospatial-products' AND auth.role() = 'service_role');

-- Create table for storing geospatial analysis results
CREATE TABLE public.geospatial_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_type TEXT NOT NULL, -- 'sar_change_detection', 'burn_severity', 'hazard_extent'
  location_name TEXT,
  center_latitude DECIMAL(10, 8) NOT NULL,
  center_longitude DECIMAL(11, 8) NOT NULL,
  bbox_north DECIMAL(10, 8),
  bbox_south DECIMAL(10, 8),
  bbox_east DECIMAL(11, 8),
  bbox_west DECIMAL(11, 8),
  acquisition_date_pre TIMESTAMP WITH TIME ZONE,
  acquisition_date_post TIMESTAMP WITH TIME ZONE,
  satellite_source TEXT, -- 'sentinel-1', 'sentinel-2'
  analysis_results JSONB, -- Stores computed metrics, statistics
  geotiff_url TEXT, -- URL to GeoTIFF in storage
  shapefile_url TEXT, -- URL to Shapefile in storage
  thumbnail_url TEXT, -- URL to preview image
  processing_status TEXT DEFAULT 'processing',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.geospatial_analysis ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Geospatial analysis is publicly readable"
ON public.geospatial_analysis
FOR SELECT
USING (true);

-- Create index for efficient querying
CREATE INDEX idx_geospatial_analysis_location ON public.geospatial_analysis(center_latitude, center_longitude);
CREATE INDEX idx_geospatial_analysis_type ON public.geospatial_analysis(analysis_type);
CREATE INDEX idx_geospatial_analysis_date ON public.geospatial_analysis(acquisition_date_post DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_geospatial_analysis_updated_at
BEFORE UPDATE ON public.geospatial_analysis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();