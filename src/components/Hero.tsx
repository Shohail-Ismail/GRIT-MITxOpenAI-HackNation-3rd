import { MapPin, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import earthHero from "@/assets/earth-hero.jpg";

const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Earth Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${earthHero})` }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/80 rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse delay-200"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white/70 rounded-full animate-pulse delay-300"></div>
      </div>
      
      <div className="container relative mx-auto px-4 py-20 md:py-28 z-10">
        <div className="mx-auto max-w-5xl text-center">
          {/* Main title with glow effect */}
          <div className="mb-6 animate-fade-in">
            <h1 className="mb-3 text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white drop-shadow-2xl">
              <span className="bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
                GRIT
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/50 to-white/50"></div>
              <Sparkles className="h-4 w-4 text-white/80" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-white/50 to-white/50"></div>
            </div>
            
            <p className="mb-3 text-xl md:text-2xl font-semibold text-white/95 tracking-wide drop-shadow-lg">
              Geographical Risk Insurance Tool
            </p>
            
            <p className="mb-12 text-2xl md:text-3xl font-light text-white/90 drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
              Instant climate risk insights for any location on Earth
            </p>
          </div>
          
          {/* CTA with enhanced styling */}
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row animate-fade-in">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="group h-14 px-8 gap-3 bg-white text-primary hover:bg-white/95 shadow-2xl hover:shadow-white/20 transition-all duration-500 hover:scale-105 text-lg font-semibold rounded-full"
            >
              <MapPin className="h-6 w-6 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Generate Risk Report
            </Button>
          </div>
          
          {/* Stats or feature highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in">
            <Dialog>
              <DialogTrigger asChild>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group flex flex-col items-center justify-center min-h-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">15+</div>
                  <div className="text-sm md:text-base text-white/80 flex items-center justify-center gap-1 text-center">
                    Satellite Data Feeds
                    <Info className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">18 Satellite Data Feeds</DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Comprehensive multi-source satellite data integration
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    GRIT integrates data from 18 specific satellite sources to provide comprehensive, real-time climate risk assessment:
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">NASA & NOAA Satellites (6)</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• <a href="https://modis.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MODIS (Terra & Aqua)</a> - Thermal anomalies, vegetation indices</li>
                      <li>• <a href="https://www.nesdis.noaa.gov/our-satellites/currently-flying/joint-polar-satellite-system" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">VIIRS (JPSS)</a> - Nighttime fires, atmospheric conditions</li>
                      <li>• <a href="https://www.goes-r.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GOES-R (GOES-16/17/18)</a> - Real-time weather, lightning detection</li>
                      <li>• <a href="https://gpm.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GPM</a> - Global precipitation measurement</li>
                      <li>• <a href="https://icesat-2.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ICESat-2</a> - Elevation data, vegetation structure</li>
                      <li>• <a href="https://landsat.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Landsat 8/9</a> - Long-term land cover change</li>
                    </ul>
                    
                    <h4 className="font-semibold text-sm pt-2">ESA Copernicus Program (6)</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• <a href="https://sentinel.esa.int/web/sentinel/missions/sentinel-1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sentinel-1A/B</a> - SAR for all-weather flood detection</li>
                      <li>• <a href="https://sentinel.esa.int/web/sentinel/missions/sentinel-2" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sentinel-2A/B</a> - 10m multispectral imagery</li>
                      <li>• <a href="https://sentinel.esa.int/web/sentinel/missions/sentinel-3" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sentinel-3A/B</a> - Ocean/land temperature monitoring</li>
                    </ul>
                    
                    <h4 className="font-semibold text-sm pt-2">Commercial & Specialized (6)</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• <a href="https://www.planet.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planet Labs Dove Constellation</a> - Daily 3-5m imagery</li>
                      <li>• <a href="https://www.maxar.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Maxar WorldView-3</a> - High-resolution infrastructure mapping</li>
                      <li>• <a href="https://earth.esa.int/eogateway/missions/smap" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SMAP</a> - Soil moisture for drought detection</li>
                      <li>• <a href="https://gracefo.jpl.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GRACE-FO</a> - Groundwater storage changes</li>
                      <li>• <a href="https://www.nesdis.noaa.gov/current-satellite-missions/currently-flying/dscovr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DSCOVR</a> - Space weather monitoring</li>
                      <li>• <a href="https://www.eumetsat.int/meteosat-third-generation" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meteosat Third Generation</a> - European weather monitoring</li>
                    </ul>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Why These Sources?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Each satellite provides unique capabilities: optical for visual assessment, SAR for all-weather monitoring, 
                      thermal for heat detection, and multispectral for vegetation health. This redundancy ensures continuous coverage 
                      and cross-validation, critical for accurate parametric insurance triggers.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group flex flex-col items-center justify-center min-h-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">&lt;60s</div>
                  <div className="text-sm md:text-base text-white/80 flex items-center justify-center gap-1 text-center">
                    Analysis Speed
                    <Info className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Analysis Speed: Under 60 Seconds</DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Real-time processing architecture for instant risk assessment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    GRIT delivers comprehensive climate risk analysis in under 60 seconds through optimized processing:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Pre-Processed Data Tiles</h4>
                      <p className="text-sm text-muted-foreground">Satellite imagery and climate data pre-processed into global tiles updated daily, eliminating raw data processing time</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Edge Computing Infrastructure</h4>
                      <p className="text-sm text-muted-foreground">Distributed serverless functions that scale automatically and run close to data sources</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Parallel Processing</h4>
                      <p className="text-sm text-muted-foreground">Multiple risk factors (flood, fire, drought, storm) analyzed simultaneously rather than sequentially</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Why Speed Matters
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Rapid analysis enables real-time decision making for insurance underwriting, emergency response, and climate adaptation planning. 
                      Speed doesn't compromise accuracy - our system balances computational efficiency with rigorous validation.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group flex flex-col items-center justify-center min-h-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">10m</div>
                  <div className="text-sm md:text-base text-white/80 flex items-center justify-center gap-1 text-center">
                    Geospatial Resolution
                    <Info className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">10-Meter Geospatial Resolution</DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Building-level precision for accurate risk assessment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    GRIT achieves 10-meter spatial resolution, enabling property-level risk differentiation:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">What 10m Resolution Means</h4>
                      <p className="text-sm text-muted-foreground">Each pixel represents a 10m × 10m area on the ground - approximately the size of a large house. This allows individual building identification and micro-terrain analysis.</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Sentinel-2 Foundation</h4>
                      <p className="text-sm text-muted-foreground">Based on ESA Sentinel-2 multispectral imagery (10m bands), validated against higher-resolution commercial imagery (0.5-3m) and DEMs</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Practical Applications</h4>
                      <p className="text-sm text-muted-foreground">
                        • Distinguish flood risk between adjacent properties<br/>
                        • Identify vegetation buffers around structures<br/>
                        • Map drainage patterns and slope variations<br/>
                        • Detect land use changes over time
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Why This Resolution?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      10m strikes the optimal balance between detail and global coverage. Higher resolution (1-5m) is available but creates 
                      prohibitive storage/processing costs for global analysis. Lower resolution (&gt;30m) misses critical micro-topography that 
                      determines flood paths and fire spread patterns.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group flex flex-col items-center justify-center min-h-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">100+</div>
                  <div className="text-sm md:text-base text-white/80 flex items-center justify-center gap-1 text-center">
                    Parametric Triggers
                    <Info className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">100+ Parametric Triggers</DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Objective, automated insurance payout conditions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    Parametric insurance pays out automatically when predefined, measurable conditions are met, eliminating claim disputes:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Flood Triggers (25+)</h4>
                      <p className="text-sm text-muted-foreground">
                        • Precipitation &gt; X mm in 24 hours<br/>
                        • Water level rise &gt; Y meters<br/>
                        • SAR-detected inundation &gt; Z hectares<br/>
                        • River gauge exceeding flood stage<br/>
                        • Storm surge height thresholds
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Wildfire Triggers (25+)</h4>
                      <p className="text-sm text-muted-foreground">
                        • Fire Radiative Power &gt; threshold<br/>
                        • Burned area within radius<br/>
                        • Fire Weather Index levels<br/>
                        • Wind speed + temperature combinations<br/>
                        • Proximity to active fire perimeter
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Drought Triggers (25+)</h4>
                      <p className="text-sm text-muted-foreground">
                        • Soil moisture below percentile<br/>
                        • Consecutive days without rain<br/>
                        • Vegetation health indices<br/>
                        • Evapotranspiration stress<br/>
                        • Palmer Drought Severity Index
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Storm Triggers (25+)</h4>
                      <p className="text-sm text-muted-foreground">
                        • Wind speed &gt; threshold at location<br/>
                        • Hurricane category at landfall<br/>
                        • Hail size detection<br/>
                        • Lightning strike density<br/>
                        • Tornado proximity and intensity
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Why Parametric Insurance?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Traditional insurance requires claims adjusters, documentation, and weeks of processing. Parametric triggers are objective, 
                      satellite-verified, and enable instant payouts when conditions are met. This reduces administrative costs and provides 
                      immediate liquidity when it's needed most. Every trigger is independently verifiable through public satellite data.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;
