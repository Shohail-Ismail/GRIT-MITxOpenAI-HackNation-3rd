-- Fix function search path security warning

DROP TRIGGER IF EXISTS satellite_data_updated_at ON public.satellite_data;
DROP FUNCTION IF EXISTS update_satellite_data_updated_at();

CREATE OR REPLACE FUNCTION public.update_satellite_data_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER satellite_data_updated_at
  BEFORE UPDATE ON public.satellite_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_satellite_data_updated_at();