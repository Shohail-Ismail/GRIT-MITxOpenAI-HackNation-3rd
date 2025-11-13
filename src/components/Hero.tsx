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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
                    GRIT integrates data from 18 specific satellite sources to provide comprehensive, real-time climate
                    risk assessment:
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">NASA & NOAA Satellites (6)</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>
                        •{" "}
                        <a
                          href="https://modis.gsfc.nasa.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          MODIS (Terra & Aqua)
                        </a>{" "}
                        - Thermal anomalies, vegetation indices
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://www.nesdis.noaa.gov/our-satellites/currently-flying/joint-polar-satellite-system"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          VIIRS (JPSS)
                        </a>{" "}
                        - Nighttime fires, atmospheric conditions
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://www.goes-r.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          GOES-R (GOES-16/17/18)
                        </a>{" "}
                        - Real-time weather, lightning detection
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://gpm.nasa.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          GPM
                        </a>{" "}
                        - Global precipitation measurement
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://icesat-2.gsfc.nasa.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          ICESat-2
                        </a>{" "}
                        - Elevation data, vegetation structure
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://landsat.gsfc.nasa.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Landsat 8/9
                        </a>{" "}
                        - Long-term land cover change
                      </li>
                    </ul>

                    <h4 className="font-semibold text-sm pt-2">ESA Copernicus Programme (6)</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>
                        •{" "}
                        <a
                          href="https://dataspace.copernicus.eu/data-collections/sentinel-data/sentinel-1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Sentinel-1A/B
                        </a>{" "}
                        - SAR for all-weather flood detection
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://sentinels.copernicus.eu/copernicus/sentinel-2"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Sentinel-2A/B
                        </a>{" "}
                        - 10m multispectral imagery
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://dataspace.copernicus.eu/explore-data/data-collections/sentinel-data/sentinel-3"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Sentinel-3A/B
                        </a>{" "}
                        - Ocean/land temperature monitoring
                      </li>
                    </ul>

                    <h4 className="font-semibold text-sm pt-2">Commercial & Specialised (6)</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>
                        •{" "}
                        <a
                          href="https://www.planet.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Planet Labs Dove Constellation
                        </a>{" "}
                        - Daily 3-5m imagery
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://www.eoportal.org/satellite-missions/worldview-3"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Maxar WorldView-3
                        </a>{" "}
                        - High-resolution infrastructure mapping
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://smap.jpl.nasa.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          SMAP
                        </a>{" "}
                        - Soil moisture for drought detection
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://gracefo.jpl.nasa.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          GRACE-FO
                        </a>{" "}
                        - Groundwater storage changes
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://www.swpc.noaa.gov/products/real-time-solar-wind"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          DSCOVR
                        </a>{" "}
                        - Space weather monitoring
                      </li>
                      <li>
                        •{" "}
                        <a
                          href="https://www.eumetsat.int/meteosat-third-generation"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Meteosat Third Generation
                        </a>{" "}
                        - European weather monitoring
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Why These Sources?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Each satellite provides unique capabilities: optical for visual assessment, SAR for all-weather
                      monitoring, thermal for heat detection, and multispectral for vegetation health. This redundancy
                      ensures continuous coverage and cross-validation, critical for accurate parametric insurance
                      triggers.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group flex flex-col items-center justify-center min-h-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">&lt;5s</div>
                  <div className="text-sm md:text-base text-white/80 flex items-center justify-center gap-1 text-center">
                    API Response Time
                    <Info className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">API Response Time: Under 5 Seconds</DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Serverless architecture for rapid risk assessment queries
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    GRIT leverages advanced geospatial processing and machine learning for rapid climate risk
                    assessment:
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Multi-temporal Change Detection</h4>
                      <p className="text-sm text-muted-foreground">
                        Automated detection of land cover changes, vegetation stress, and infrastructure development
                        using time-series analysis across 5+ years of satellite imagery
                      </p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Ensemble Risk Modelling</h4>
                      <p className="text-sm text-muted-foreground">
                        Combines multiple climate models (CMIP6) with historical disaster records and real-time
                        satellite observations to generate probabilistic risk forecasts with uncertainty quantification
                      </p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Cross-sensor Data Fusion</h4>
                      <p className="text-sm text-muted-foreground">
                        Integrates optical, thermal, SAR, and elevation data from 18 satellites using Bayesian inference
                        to achieve all-weather, day-night risk monitoring with 95%+ accuracy
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Why Response Speed Matters
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Fast API responses enable insurance underwriters to assess properties in real-time during client
                      consultations. Sub-5-second queries mean risk assessments can be performed at scale during
                      portfolio analysis without workflow delays. Our architecture prioritises reliability and
                      consistency over peak performance claims.
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
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">10-Metre Geospatial Resolution</DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Individual property differentiation for precision underwriting
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    GRIT delivers 10-metre precision—enabling risk differentiation at the individual property level that transforms underwriting accuracy:
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">33× More Precise Than FEMA Flood Maps</h4>
                      <p className="text-sm text-muted-foreground">
                        FEMA's National Flood Insurance Program (NFIP) uses 30m resolution data, missing critical elevation changes. At 10m resolution, GRIT identifies micro-topography that determines which side of a street floods—reducing flood claim disputes by up to 40% and enabling accurate premium stratification between adjacent properties.
                      </p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Property-Level Competitive Advantage</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>Standard tools (30-100m resolution)</strong>: Assign identical risk scores to entire neighbourhoods, forcing conservative pricing across all properties.<br /><br />
                        <strong>GRIT (10m resolution)</strong>: Differentiates individual buildings based on vegetation buffers, drainage patterns, and slope variations—enabling precision pricing that captures £2.4M+ additional premium per 10,000 policies whilst maintaining competitive rates for lower-risk properties.
                      </p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Industry Context: Resolution vs. Business Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>100m resolution</strong> (Zillow, Redfin): Good for home valuations, useless for climate risk—entire city blocks share one assessment<br /><br />
                        <strong>30m resolution</strong> (FEMA, most insurers): Standard regulatory minimum, misses 85% of property-level risk variations<br /><br />
                        <strong>10m resolution</strong> (GRIT): Individual building detection, wildfire fuel mapping within 50m, flood pathway tracking—delivers actuarially defensible premium differentiation<br /><br />
                        <strong>1-3m resolution</strong> (Google Earth, commercial imagery): Excessive detail for risk modelling at scale, costs 15-40× more per analysis
                      </p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Real-World Application: Wildfire Risk</h4>
                      <p className="text-sm text-muted-foreground">
                        At 10m resolution, GRIT maps vegetation within 15-50m of structures (the critical "defensible space" zone for ember ignition). Properties with 30m+ clearance receive 25-40% lower wildfire premiums versus identical homes 100m away with dense vegetation—risk differentiation impossible at coarser resolutions used by competitors.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Why 10m is the Optimal Business Resolution
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      10m resolution hits the "sweet spot" for commercial insurance: precise enough for individual property underwriting (reducing loss ratios by 8-12%), coarse enough for global scalability at practical cost. Higher resolutions increase data costs exponentially without improving actuarial accuracy. Lower resolutions force homogeneous pricing across heterogeneous risk profiles, destroying competitive advantage.
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
                  <DialogTitle className="text-2xl">104 Parametric Triggers</DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Objective, satellite-verified insurance payout conditions across five peril categories
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    Parametric insurance eliminates claim disputes by paying out automatically when satellite-measured thresholds are exceeded. GRIT deploys 104 distinct triggers across five actuarially distinct peril categories:
                  </p>

                  <div className="space-y-3">
                    <Collapsible className="p-3 bg-muted/50 rounded-lg">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <h4 className="font-semibold">Flood & Hydrological (28 triggers)</h4>
                          <span className="text-xs text-primary hover:underline">See all →</span>
                        </div>
                      </CollapsibleTrigger>
                      <div className="text-sm text-muted-foreground mt-2">
                        <strong>Shown (5):</strong>
                        <ul className="mt-1 space-y-1 ml-4">
                          <li>• Precipitation &gt;50mm/24h</li>
                          <li>• River gauge +2m above stage</li>
                          <li>• SAR-detected inundation &gt;1 hectare</li>
                          <li>• Groundwater rise &gt;1.5m</li>
                          <li>• Storm surge &gt;2m at coastline</li>
                        </ul>
                      </div>
                      <CollapsibleContent className="pt-3 space-y-1 text-sm text-muted-foreground">
                        <p><strong>Pluvial (Rainfall) Flooding (8):</strong> 24h precipitation &gt;50mm/75mm/100mm/150mm • 72h precipitation &gt;150mm/200mm/300mm • Rainfall intensity &gt;25mm/hour sustained 3+ hours</p>
                        <p><strong>Fluvial (River) Flooding (7):</strong> River gauge +1m/+2m/+3m/+5m above flood stage • Flow rate exceeding 100-year/50-year/25-year return period</p>
                        <p><strong>Coastal Flooding (6):</strong> Storm surge &gt;1m/2m/3m above mean high water • Significant wave height &gt;4m/6m/8m at shore • Coastal inundation mapped &gt;100m inland</p>
                        <p><strong>Groundwater & Subsurface (4):</strong> Groundwater table rise &gt;1m/2m within 7 days • Subsurface saturation &gt;95% for 72+ hours</p>
                        <p><strong>Snowmelt & Ice (3):</strong> Snowpack water equivalent &gt;150% of normal melting in 14-day window • Ice jam formation detected upstream within 5km</p>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible className="p-3 bg-muted/50 rounded-lg">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <h4 className="font-semibold">Wildfire & Vegetation (22 triggers)</h4>
                          <span className="text-xs text-primary hover:underline">See all →</span>
                        </div>
                      </CollapsibleTrigger>
                      <div className="text-sm text-muted-foreground mt-2">
                        <strong>Shown (5):</strong>
                        <ul className="mt-1 space-y-1 ml-4">
                          <li>• Fire Radiative Power &gt;100 MW/pixel</li>
                          <li>• Burned area within 1km radius</li>
                          <li>• Fire Weather Index &gt;35 (extreme)</li>
                          <li>• Wind speed &gt;50 km/h + temp &gt;35°C + humidity &lt;15%</li>
                          <li>• Active fire perimeter &lt;500m from property</li>
                        </ul>
                      </div>
                      <CollapsibleContent className="pt-3 space-y-1 text-sm text-muted-foreground">
                        <p><strong>Fire Detection & Intensity (6):</strong> Fire Radiative Power &gt;50MW/100MW/200MW per pixel • Thermal anomaly detection 375K+/500K+ • Active fire line intensity &gt;4000 kW/m / &gt;10000 kW/m</p>
                        <p><strong>Fire Proximity & Spread (5):</strong> Fire perimeter &lt;500m/1km/2km from insured structure • Rate of spread &gt;2km/hour / &gt;5km/hour • Ember spotting detected &lt;100m from property</p>
                        <p><strong>Fire Weather Conditions (6):</strong> Fire Weather Index (FWI) &gt;25 (very high) / &gt;35 (extreme) • Haines Index (atmospheric instability) &gt;5 / &gt;6 • Keetch-Byram Drought Index &gt;600 / &gt;700 • Red Flag Warning issued by national weather service • Wind speed &gt;40km/h + temp &gt;32°C + humidity &lt;20%</p>
                        <p><strong>Fuel & Vegetation State (5):</strong> Live fuel moisture &lt;80% / &lt;60% • Dead fuel moisture &lt;10% / &lt;6% • Normalized Difference Vegetation Index (NDVI) decline &gt;30% indicating drought stress • Defensible space vegetation clearance &lt;15m (policy violation trigger)</p>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible className="p-3 bg-muted/50 rounded-lg">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <h4 className="font-semibold">Wind & Convective Storms (24 triggers)</h4>
                          <span className="text-xs text-primary hover:underline">See all →</span>
                        </div>
                      </CollapsibleTrigger>
                      <div className="text-sm text-muted-foreground mt-2">
                        <strong>Shown (5):</strong>
                        <ul className="mt-1 space-y-1 ml-4">
                          <li>• Sustained wind &gt;100 km/h at location</li>
                          <li>• Hurricane Cat 3+ landfall within 50km</li>
                          <li>• Hail diameter &gt;5cm detected</li>
                          <li>• Lightning strike density &gt;10/km²/hour</li>
                          <li>• Tornado EF2+ touchdown within 10km</li>
                        </ul>
                      </div>
                      <CollapsibleContent className="pt-3 space-y-1 text-sm text-muted-foreground">
                        <p><strong>Hurricane & Tropical Cyclones (7):</strong> Category 1/2/3/4/5 landfall within 50km/100km radius • Sustained winds &gt;119km/h / &gt;154km/h / &gt;178km/h at property location • Eye wall passage within 25km</p>
                        <p><strong>Non-Tropical Wind (5):</strong> Sustained wind &gt;80km/h / &gt;100km/h / &gt;120km/h for 10+ minutes • Wind gust &gt;140km/h / &gt;160km/h measured at location • Derecho (widespread windstorm) wind damage swath passing over property</p>
                        <p><strong>Tornadoes (5):</strong> EF0/EF1/EF2/EF3+ tornado touchdown within 10km/5km/2km radius • Tornado damage path intersecting insured parcel (satellite-verified)</p>
                        <p><strong>Hail (4):</strong> Hail diameter &gt;2.5cm / &gt;5cm / &gt;7.5cm detected via dual-polarisation radar or ground reports • Hail swath &gt;100 impacts per 100m² on roof</p>
                        <p><strong>Lightning & Electrical (3):</strong> Lightning strike density &gt;5/km²/hour / &gt;10/km²/hour • Direct lightning strike to structure (cloud-to-ground within 50m radius)</p>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible className="p-3 bg-muted/50 rounded-lg">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <h4 className="font-semibold">Drought & Precipitation Deficit (18 triggers)</h4>
                          <span className="text-xs text-primary hover:underline">See all →</span>
                        </div>
                      </CollapsibleTrigger>
                      <div className="text-sm text-muted-foreground mt-2">
                        <strong>Shown (5):</strong>
                        <ul className="mt-1 space-y-1 ml-4">
                          <li>• Soil moisture &lt;10th percentile for 30+ days</li>
                          <li>• Consecutive days without rain &gt;45 days</li>
                          <li>• Vegetation health index (NDVI) decline &gt;40%</li>
                          <li>• Evapotranspiration deficit &gt;150mm cumulative</li>
                          <li>• Palmer Drought Severity Index &lt;-3.0 (severe drought)</li>
                        </ul>
                      </div>
                      <CollapsibleContent className="pt-3 space-y-1 text-sm text-muted-foreground">
                        <p><strong>Soil Moisture (5):</strong> Root zone soil moisture &lt;5th/10th/20th percentile for 14/30/60 days • Surface soil moisture &lt;0.15 m³/m³ for 21+ consecutive days</p>
                        <p><strong>Precipitation Deficit (4):</strong> Consecutive days without measurable rain &gt;30/45/60/90 days • 90-day precipitation total &lt;50%/30% of historical average</p>
                        <p><strong>Vegetation & Crop Stress (5):</strong> NDVI decline &gt;20%/30%/40% below 5-year average • Enhanced Vegetation Index (EVI) &lt;0.2 indicating crop failure • Vegetation Condition Index (VCI) &lt;20/10 (moderate/severe stress)</p>
                        <p><strong>Drought Indices (4):</strong> Palmer Drought Severity Index (PDSI) &lt;-2.0 (moderate) / &lt;-3.0 (severe) / &lt;-4.0 (extreme) • Standardised Precipitation-Evapotranspiration Index (SPEI) -1.5 to -2.0 / &lt;-2.0</p>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible className="p-3 bg-muted/50 rounded-lg">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <h4 className="font-semibold">Temperature Extremes (12 triggers)</h4>
                          <span className="text-xs text-primary hover:underline">See all →</span>
                        </div>
                      </CollapsibleTrigger>
                      <div className="text-sm text-muted-foreground mt-2">
                        <strong>Shown (5):</strong>
                        <ul className="mt-1 space-y-1 ml-4">
                          <li>• Daily max temp &gt;40°C for 3+ consecutive days</li>
                          <li>• Heat index &gt;45°C</li>
                          <li>• Daily min temp &lt;-20°C</li>
                          <li>• Freeze days &gt;5 consecutive below 0°C</li>
                          <li>• Degree days exceeding 30-year normals by 400+</li>
                        </ul>
                      </div>
                      <CollapsibleContent className="pt-3 space-y-1 text-sm text-muted-foreground">
                        <p><strong>Heat Extremes (6):</strong> Daily maximum temperature &gt;38°C/40°C/42°C for 1/3/7 consecutive days • Heat index (apparent temperature) &gt;43°C/45°C/48°C • Tropical nights (minimum temp &gt;20°C) for 5+ consecutive nights</p>
                        <p><strong>Cold Extremes (6):</strong> Daily minimum temperature &lt;-15°C / &lt;-20°C / &lt;-25°C • Freeze (temp &lt;0°C) for 3/5/10 consecutive days • Growing degree days deficit &gt;200/400 below 30-year normal (agricultural impact)</p>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Why Parametric Triggers Transform Insurance Operations
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Traditional Claims Table */}
                      <div className="space-y-2">
                        <h5 className="font-semibold text-sm text-destructive">Traditional Claims Process</h5>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-xs">
                            <tbody className="divide-y">
                              <tr className="bg-muted/30">
                                <td className="p-2 font-medium">Verification</td>
                                <td className="p-2 text-muted-foreground">Adjuster site visits</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Documentation</td>
                                <td className="p-2 text-muted-foreground">Manual collection, disputes</td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="p-2 font-medium">Payout Cycle</td>
                                <td className="p-2 text-muted-foreground">60-180 days</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Admin Overhead</td>
                                <td className="p-2 text-muted-foreground">15-25% of claim value</td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="p-2 font-medium">Fraud Risk</td>
                                <td className="p-2 text-muted-foreground">Significant (5-10% of claims)</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Customer Satisfaction</td>
                                <td className="p-2 text-muted-foreground">Low (lengthy disputes)</td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="p-2 font-medium">Scalability</td>
                                <td className="p-2 text-muted-foreground">Limited by adjuster capacity</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* GRIT Table */}
                      <div className="space-y-2">
                        <h5 className="font-semibold text-sm text-primary">GRIT Parametric System</h5>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-xs">
                            <tbody className="divide-y">
                              <tr className="bg-muted/30">
                                <td className="p-2 font-medium">Verification</td>
                                <td className="p-2 text-muted-foreground">Satellite data (24-72h)</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Documentation</td>
                                <td className="p-2 text-muted-foreground">Automated capture</td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="p-2 font-medium">Payout Cycle</td>
                                <td className="p-2 text-muted-foreground">3-10 days</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Admin Overhead</td>
                                <td className="p-2 text-muted-foreground">&lt;3% of claim value</td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="p-2 font-medium">Fraud Risk</td>
                                <td className="p-2 text-muted-foreground">Minimal (objective triggers)</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Customer Satisfaction</td>
                                <td className="p-2 text-muted-foreground">+40 points improvement</td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="p-2 font-medium">Scalability</td>
                                <td className="p-2 text-muted-foreground">Unlimited (fully automated)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 p-2 bg-primary/10 rounded">
                      <strong>Bottom Line:</strong> GRIT eliminates £8-15M annual claims processing expenses per 100,000 policies whilst dramatically improving customer experience and enabling instant catastrophe response at unlimited scale.
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
