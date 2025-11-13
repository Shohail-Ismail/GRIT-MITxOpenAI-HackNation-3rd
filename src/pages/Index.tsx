import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Flame, Wind, Sun, Download, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import LocationInput from "@/components/LocationInput";
import RiskScoreDisplay from "@/components/RiskScoreDisplay";
import InteractiveRiskCard from "@/components/InteractiveRiskCard";
import RiskMap from "@/components/RiskMap";
import RiskChart from "@/components/RiskChart";
import InteractiveKPISection from "@/components/InteractiveKPISection";
import TransparencyPanel from "@/components/TransparencyPanel";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

import { downloadCSV } from "@/utils/csvExport";
import { toast } from "sonner";

interface RiskData {
  latitude: number;
  longitude: number;
  overallScore: number;
  factors: {
    flood: number;
    wildfire: number;
    storm: number;
    drought: number;
  };
}

const Index = () => {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user, session, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const analyzeLocation = async (lat: number, lng: number) => {
    setIsAnalyzing(true);
    toast.info("Analyzing location with real-time data...");
    
    try {
      // Call the edge function using Supabase client (handles auth automatically)
      const { data, error } = await supabase.functions.invoke('analyze-location', {
        body: { latitude: lat, longitude: lng },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to fetch risk data');
      }
      
      setRiskData({
        latitude: data.latitude,
        longitude: data.longitude,
        overallScore: data.overallScore,
        factors: data.factors,
      });
      
      setIsAnalyzing(false);
      toast.success("Real-time analysis complete!");
    } catch (error) {
      console.error('Error analyzing location:', error);
      setIsAnalyzing(false);
      toast.error("Failed to analyze location. Please try again.");
    }
  };

  const handleBackToHome = () => {
    setRiskData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownload = () => {
    if (riskData) {
      downloadCSV(riskData);
      toast.success("Report downloaded successfully!");
    }
  };

  const scrollToAnalysis = () => {
    document.getElementById("analysis-section")?.scrollIntoView({ 
      behavior: "smooth" 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/5 via-background/80 to-secondary/5 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-end">
          <Button onClick={handleSignOut} variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      
      <Hero onGetStarted={scrollToAnalysis} />
      
      <main className="container mx-auto px-4 py-12 space-y-12 flex-1">
        <section id="analysis-section" className="max-w-4xl mx-auto">
          <LocationInput onAnalyze={analyzeLocation} />
        </section>

        {riskData && (
          <>
            <section className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-center space-y-2 flex-1">
                  <h2 className="text-3xl font-bold text-foreground">Risk Assessment Results</h2>
                  <p className="text-muted-foreground">
                    Comprehensive analysis based on climate risk factors
                  </p>
                </div>
                
                <div className="flex gap-3 flex-wrap">
                  <TransparencyPanel />
                  <Button 
                    variant="outline" 
                    onClick={handleBackToHome}
                    className="gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Results
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <RiskScoreDisplay
                    overallScore={riskData.overallScore}
                    latitude={riskData.latitude}
                    longitude={riskData.longitude}
                    factors={riskData.factors}
                    riskExplanations={{
                      flood: {
                        title: "Flood Exposure Index",
                        explanation: "Comprehensive flood exposure assessment combining hydrological modeling, fluvial/pluvial flood dynamics, and coastal storm surge scenarios. Incorporates digital elevation models (DEM), watershed analysis, soil saturation indices, and proximity to FEMA Special Flood Hazard Areas (SFHA). Evaluates both first-party property damage and business interruption exposure for portfolio risk assessment.",
                        calculationMethod: "Multi-factor actuarial model:\n• Precipitation intensity-duration-frequency (IDF) curves weighted x2.5\n• Elevation-based vulnerability: Critical zones <10m MSL (+40 pts), Moderate <50m (+25 pts), Low <200m (+12 pts)\n• Hydraulic conductivity & drainage capacity assessment\n• Historical loss ratios from catastrophe models (RMS, AIR, CoreLogic)\n• Climate-adjusted return period calculations for 10, 25, 50, 100, 250-year events\n\nScore represents Probable Maximum Loss (PML) as percentage of Total Insured Value (TIV)",
                        transparencyNote: "Risk metrics derived from multi-source integration: NOAA precipitation data, USGS elevation datasets, real-time hydrological sensors, and validated against industry catastrophe models. Incorporates climate change projections (IPCC RCP 8.5 scenario) for forward-looking risk assessment."
                      },
                      wildfire: {
                        title: "Wildfire Severity Rating",
                        explanation: "Advanced wildfire risk quantification for Wildland-Urban Interface (WUI) zones incorporating fuel load modeling, fire weather indices, historical burn patterns, and ember transport simulation. Evaluates structure ignitability, community wildfire preparedness, and firefighting resource accessibility. Critical for excess-of-loss treaty structuring and portfolio accumulation management in high-hazard territories.",
                        calculationMethod: "Catastrophe modeling framework:\n• Fire Weather Index (FWI) incorporating Keetch-Byram Drought Index (KBDI)\n• Temperature threshold analysis: Extreme conditions >35°C weighted x3.5\n• Relative humidity deficit: Critical <25% (+40 pts), Elevated <35% (+25 pts)\n• Wind-driven fire spread potential: Sustained winds >25 km/h exponentially increase loss severity\n• Fuel moisture content <10% triggers critical accumulation scenarios\n• Defensible space compliance within 30m perimeter\n\nIntegrates CALFIRE hazard severity zones and NFPA 1144 standards",
                        transparencyNote: "Risk assessment utilizes NASA MODIS fire detection, NOAA fire weather forecasts, and validated against Munich Re NatCatSERVICE wildfire database. Includes real-time Sentinel-2 vegetation indices and historical loss development patterns for accurate reserve estimation."
                      },
                      storm: {
                        title: "Convective Storm Index",
                        explanation: "Sophisticated severe weather exposure analysis encompassing tropical cyclones (Cat 1-5), derechos, tornadic activity (EF0-EF5), and large hail events. Incorporates pressure gradient analysis, wind field decay modeling, and storm surge inundation zones. Essential for treaty capacity planning, clash loss scenarios, and setting aggregate deductibles in excess-of-loss programs. Evaluates named storm potential and secondary perils including flood and wind-driven rain.",
                        calculationMethod: "Stochastic catastrophe model:\n• Peak wind gust potential weighted x2.2 for structural damage correlation\n• Convective available potential energy (CAPE) >1500 J/kg indicates severe outbreak potential\n• Atmospheric instability: Temperature lapse rate >15°C/day (+25 pts) signals frontal system volatility\n• Precipitation intensity: >50mm/hour triggers flash flood and wind-driven water intrusion\n• Historical frequency-severity analysis for treaty layer attachment optimization\n\nApplies industry-standard Saffir-Simpson scale and Enhanced Fujita classifications",
                        transparencyNote: "Powered by NOAA National Hurricane Center advisories, Storm Prediction Center mesoscale analysis, and European Centre for Medium-Range Weather Forecasts (ECMWF) ensemble modeling. Validated against Swiss Re sigma cat bond trigger metrics and ISO property claim severity distributions."
                      },
                      drought: {
                        title: "Drought & Agricultural Loss",
                        explanation: "Comprehensive agricultural and water scarcity risk assessment utilizing Standardized Precipitation-Evapotranspiration Index (SPEI), Palmer Drought Severity Index (PDSI), and soil moisture anomaly detection. Critical for parametric insurance products, agricultural reinsurance portfolios, and weather derivatives pricing. Evaluates both acute drought conditions and chronic aridification trends affecting crop yields, livestock mortality, and water supply infrastructure. Incorporates irrigation dependency ratios and groundwater depletion rates.",
                        calculationMethod: "Parametric trigger modeling:\n• Precipitation deficit: Severe <5mm (+50 pts), Moderate <15mm (+30 pts) over 90-day rolling window\n• Evapotranspiration excess: Temperature >30°C exponentially increases water stress coefficient\n• Vapor pressure deficit (VPD): RH <30% (+45 pts) triggers extreme desiccation, <50% (+20 pts) elevated stress\n• Growing Degree Days (GDD) deviation from historical normals\n• Root zone soil moisture below permanent wilting point\n\nCorrelates with USDA crop condition reports and NDVI anomaly detection",
                        transparencyNote: "Integrates NOAA Climate Prediction Center drought monitoring, USDA Risk Management Agency historical loss data, and NASA GRACE satellite groundwater measurements. Calibrated against actual indemnity payments and parametric index triggers for basis risk minimization in agricultural portfolios."
                      }
                    }}
                  />
                </div>
                
                <div className="lg:col-span-2">
        <RiskMap 
          latitude={riskData.latitude} 
          longitude={riskData.longitude} 
          riskScore={riskData.overallScore}
          riskFactors={riskData.factors}
        />
                </div>
              </div>
            </section>

            <section className="max-w-6xl mx-auto">
              <RiskChart 
                factors={riskData.factors}
                riskExplanations={{
                  flood: {
                    title: "Flood Exposure Index",
                    explanation: "Comprehensive flood exposure assessment combining hydrological modeling, fluvial/pluvial flood dynamics, and coastal storm surge scenarios. Incorporates digital elevation models (DEM), watershed analysis, soil saturation indices, and proximity to FEMA Special Flood Hazard Areas (SFHA). Evaluates both first-party property damage and business interruption exposure for portfolio risk assessment.",
                    calculationPoints: [
                      {
                        title: "Precipitation Intensity-Duration-Frequency (IDF) Curves",
                        description: "Analyzes extreme rainfall patterns using statistical distributions of precipitation intensity over various durations. This factor receives the highest weight (2.5x) due to its direct correlation with flood magnitude.",
                        formula: "P = \\frac{a \\cdot T^b}{(t_d + c)^d} \\times W_p",
                        variables: [
                          { symbol: "P", description: "Precipitation intensity factor (mm/hour)" },
                          { symbol: "T", description: "Return period (years: 10, 25, 50, 100, 250)" },
                          { symbol: "t_d", description: "Storm duration (hours)" },
                          { symbol: "a, b, c, d", description: "Regional IDF coefficients from NOAA Atlas 14" },
                          { symbol: "W_p = 2.5", description: "Precipitation weighting factor" }
                        ]
                      },
                      {
                        title: "Elevation-Based Vulnerability Assessment",
                        description: "Evaluates flood susceptibility based on height above mean sea level (MSL). Lower elevations face exponentially higher risk from both riverine flooding and storm surge.",
                        formula: "E = \\begin{cases} 40 & \\text{if } h < 10m \\\\ 25 & \\text{if } 10m \\leq h < 50m \\\\ 12 & \\text{if } 50m \\leq h < 200m \\\\ 0 & \\text{if } h \\geq 200m \\end{cases}",
                        variables: [
                          { symbol: "E", description: "Elevation vulnerability score" },
                          { symbol: "h", description: "Height above mean sea level (meters)" }
                        ]
                      },
                      {
                        title: "Hydraulic Conductivity & Drainage Capacity",
                        description: "Assesses soil permeability and drainage infrastructure effectiveness. Poor drainage amplifies flood duration and severity, increasing water damage claims.",
                        formula: "H = \\left(1 - \\frac{K_{sat}}{K_{max}}\\right) \\times 100 + D_{penalty}",
                        variables: [
                          { symbol: "H", description: "Hydraulic impedance score (0-100)" },
                          { symbol: "K_{sat}", description: "Saturated hydraulic conductivity (cm/hr)" },
                          { symbol: "K_{max}", description: "Maximum observed conductivity in region" },
                          { symbol: "D_{penalty}", description: "Drainage infrastructure deficit adjustment" }
                        ]
                      },
                      {
                        title: "Historical Loss Ratios from Catastrophe Models",
                        description: "Incorporates validated loss data from leading catastrophe modeling firms (RMS, AIR, CoreLogic). Uses actuarial loss development patterns to estimate probable maximum loss.",
                        formula: "C = \\frac{\\sum_{i=1}^{n} (L_i \\times f_i)}{TIV} \\times 100",
                        variables: [
                          { symbol: "C", description: "Catastrophe model severity score" },
                          { symbol: "L_i", description: "Historical loss amount for event i" },
                          { symbol: "f_i", description: "Frequency weight for event i" },
                          { symbol: "n", description: "Number of historical events analyzed" },
                          { symbol: "TIV", description: "Total Insured Value of portfolio" }
                        ]
                      },
                      {
                        title: "Climate-Adjusted Return Period Calculations",
                        description: "Projects future flood frequency by incorporating IPCC climate scenarios (RCP 8.5). Adjusts historical return periods to account for increased precipitation intensity due to global warming.",
                        formula: "R = R_0 \\times \\left(1 + \\alpha \\cdot \\Delta T\\right)^\\beta",
                        variables: [
                          { symbol: "R", description: "Climate-adjusted return period score" },
                          { symbol: "R_0", description: "Historical baseline return period" },
                          { symbol: "\\alpha", description: "Climate sensitivity coefficient (0.07 per °C)" },
                          { symbol: "\\Delta T", description: "Projected temperature increase (°C) by 2050" },
                          { symbol: "\\beta", description: "Exponential adjustment factor (1.3 for extreme events)" }
                        ]
                      }
                    ],
                    transparencyNote: "Risk metrics derived from multi-source integration: NOAA precipitation data, USGS elevation datasets, real-time hydrological sensors, and validated against industry catastrophe models. Incorporates climate change projections (IPCC RCP 8.5 scenario) for forward-looking risk assessment."
                  },
                  wildfire: {
                    title: "Wildfire Severity Rating",
                    explanation: "Advanced wildfire risk quantification for Wildland-Urban Interface (WUI) zones incorporating fuel load modeling, fire weather indices, historical burn patterns, and ember transport simulation. Evaluates structure ignitability, community wildfire preparedness, and firefighting resource accessibility. Critical for excess-of-loss treaty structuring and portfolio accumulation management in high-hazard territories.",
                    calculationPoints: [
                      {
                        title: "Fire Weather Index (FWI) with Keetch-Byram Drought Index (KBDI)",
                        description: "Combines temperature, humidity, wind speed, and precipitation to assess fire danger. KBDI measures soil moisture deficit to determine vegetation dryness and ignition potential.",
                        formula: "FWI = f(T, RH, W, P_{24h}) \\times \\left(1 + \\frac{KBDI}{800}\\right)",
                        variables: [
                          { symbol: "T", description: "Maximum daily temperature (°C)" },
                          { symbol: "RH", description: "Relative humidity (%)" },
                          { symbol: "W", description: "Wind speed (km/h)" },
                          { symbol: "P_{24h}", description: "24-hour precipitation (mm)" },
                          { symbol: "KBDI", description: "Drought index (0-800 scale)" },
                          { symbol: "f()", description: "Canadian Forest Fire Danger Rating System function" }
                        ]
                      },
                      {
                        title: "Temperature Threshold Analysis",
                        description: "Extreme heat accelerates fuel desiccation and increases fire intensity exponentially. Temperatures above 35°C create critical fire weather conditions with rapid flame propagation.",
                        formula: "T_{score} = \\begin{cases} W_T \\times 3.5 \\times (T - 35) & \\text{if } T > 35°C \\\\ W_T \\times (T - 25) & \\text{if } 25°C \\leq T \\leq 35°C \\\\ 0 & \\text{if } T < 25°C \\end{cases}",
                        variables: [
                          { symbol: "T_{score}", description: "Temperature-driven fire risk score" },
                          { symbol: "T", description: "Ambient temperature (°C)" },
                          { symbol: "W_T", description: "Temperature weighting coefficient (3.5 for extreme heat)" }
                        ]
                      },
                      {
                        title: "Relative Humidity Deficit Assessment",
                        description: "Low humidity removes moisture from live and dead fuels, creating highly combustible conditions. Critical thresholds represent tipping points for extreme fire behavior.",
                        formula: "RH_{score} = \\begin{cases} 40 & \\text{if } RH < 25\\% \\\\ 25 & \\text{if } 25\\% \\leq RH < 35\\% \\\\ 10 & \\text{if } 35\\% \\leq RH < 50\\% \\\\ 0 & \\text{if } RH \\geq 50\\% \\end{cases}",
                        variables: [
                          { symbol: "RH_{score}", description: "Humidity-based fire risk points" },
                          { symbol: "RH", description: "Relative humidity percentage" }
                        ]
                      },
                      {
                        title: "Wind-Driven Fire Spread Modeling",
                        description: "Wind velocity governs fire spread rate and ember transport distance. Sustained winds above 25 km/h cause exponential increases in fire intensity and structure loss potential.",
                        formula: "S = S_0 \\times e^{k \\cdot W} \\times \\cos(\\theta)",
                        variables: [
                          { symbol: "S", description: "Fire spread rate (m/min)" },
                          { symbol: "S_0", description: "Base spread rate in calm conditions" },
                          { symbol: "k", description: "Wind coefficient (0.05 per km/h)" },
                          { symbol: "W", description: "Sustained wind speed (km/h)" },
                          { symbol: "\\theta", description: "Angle between wind direction and fire front" }
                        ]
                      },
                      {
                        title: "Fuel Moisture Content Critical Thresholds",
                        description: "Dead fuel moisture below 10% indicates extreme fire conditions where spot fires readily establish. Living fuel moisture stress amplifies fire intensity and crown fire potential.",
                        formula: "FM = \\frac{M_w - M_d}{M_d} \\times 100\\%",
                        variables: [
                          { symbol: "FM", description: "Fuel moisture percentage" },
                          { symbol: "M_w", description: "Wet fuel mass (grams)" },
                          { symbol: "M_d", description: "Dry fuel mass (grams)" }
                        ]
                      },
                      {
                        title: "Defensible Space Assessment",
                        description: "Evaluates property-level wildfire resilience based on vegetation management within 30-meter perimeter. Integrates NFPA 1144 standards for structure ignitability and fire-resistant construction materials.",
                        formula: "DS = 100 \\times \\left(1 - \\frac{V_{30m}}{V_{max}}\\right) \\times C_{materials}",
                        variables: [
                          { symbol: "DS", description: "Defensible space score (0-100)" },
                          { symbol: "V_{30m}", description: "Vegetation density within 30m radius" },
                          { symbol: "V_{max}", description: "Maximum observed vegetation density" },
                          { symbol: "C_{materials}", description: "Construction materials fire resistance coefficient (0.6-1.0)" }
                        ]
                      }
                    ],
                    transparencyNote: "Risk assessment utilizes NASA MODIS fire detection, NOAA fire weather forecasts, and validated against Munich Re NatCatSERVICE wildfire database. Includes real-time Sentinel-2 vegetation indices and historical loss development patterns for accurate reserve estimation."
                  },
                  storm: {
                    title: "Convective Storm Index",
                    explanation: "Sophisticated severe weather exposure analysis encompassing tropical cyclones (Cat 1-5), derechos, tornadic activity (EF0-EF5), and large hail events. Incorporates pressure gradient analysis, wind field decay modeling, and storm surge inundation zones. Essential for treaty capacity planning, clash loss scenarios, and setting aggregate deductibles in excess-of-loss programs. Evaluates named storm potential and secondary perils including flood and wind-driven rain.",
                    calculationPoints: [
                      {
                        title: "Peak Wind Gust Potential",
                        description: "Maximum sustained wind velocity correlates directly with structural damage severity. Applied 2.2x weighting reflects empirical loss data showing exponential damage escalation above 50 m/s.",
                        formula: "W_{damage} = W_{gust}^{2.2} \\times C_{structural} \\times A_{exposure}",
                        variables: [
                          { symbol: "W_{damage}", description: "Wind damage index" },
                          { symbol: "W_{gust}", description: "Peak wind gust velocity (m/s)" },
                          { symbol: "C_{structural}", description: "Structural vulnerability coefficient (0.5-1.5)" },
                          { symbol: "A_{exposure}", description: "Building exposure area (m²)" }
                        ]
                      },
                      {
                        title: "Convective Available Potential Energy (CAPE)",
                        description: "Measures atmospheric instability energy available for convective storms. Values exceeding 1500 J/kg indicate high probability of severe weather including tornadoes and large hail.",
                        formula: "CAPE = g \\int_{z_{LFC}}^{z_{EL}} \\left(\\frac{T_{parcel} - T_{env}}{T_{env}}\\right) dz",
                        variables: [
                          { symbol: "CAPE", description: "Convective available potential energy (J/kg)" },
                          { symbol: "g", description: "Gravitational acceleration (9.81 m/s²)" },
                          { symbol: "z_{LFC}", description: "Level of free convection height" },
                          { symbol: "z_{EL}", description: "Equilibrium level height" },
                          { symbol: "T_{parcel}", description: "Temperature of rising air parcel (K)" },
                          { symbol: "T_{env}", description: "Environmental temperature (K)" }
                        ]
                      },
                      {
                        title: "Atmospheric Instability & Temperature Lapse Rate",
                        description: "Steep temperature gradients indicate strong frontal systems capable of producing severe thunderstorms, derechos, and tornadic supercells. Lapse rates >15°C/day signal extreme instability.",
                        formula: "\\Gamma = -\\frac{dT}{dz} \\times 1000",
                        variables: [
                          { symbol: "\\Gamma", description: "Environmental lapse rate (°C per 1000m)" },
                          { symbol: "dT", description: "Temperature change with altitude" },
                          { symbol: "dz", description: "Change in height (meters)" }
                        ]
                      },
                      {
                        title: "Precipitation Intensity & Flash Flood Trigger",
                        description: "Extreme rainfall rates (>50mm/hour) overwhelm drainage systems causing flash flooding and wind-driven water intrusion. Secondary water damage often exceeds primary wind damage in severe storms.",
                        formula: "P_{intensity} = \\frac{P_{total}}{t_{duration}} \\times (1 + 0.3 \\times W_{wind})",
                        variables: [
                          { symbol: "P_{intensity}", description: "Effective precipitation intensity (mm/hr)" },
                          { symbol: "P_{total}", description: "Total precipitation accumulation (mm)" },
                          { symbol: "t_{duration}", description: "Storm duration (hours)" },
                          { symbol: "W_{wind}", description: "Wind speed factor for driven rain penetration" }
                        ]
                      },
                      {
                        title: "Historical Frequency-Severity Analysis",
                        description: "Statistical modeling of past storm events to optimize treaty layer attachment points and aggregate deductibles. Uses extreme value theory for tail risk estimation.",
                        formula: "\\lambda(x) = \\alpha \\times \\left(\\frac{x}{x_0}\\right)^{-(\\beta + 1)}",
                        variables: [
                          { symbol: "\\lambda(x)", description: "Annual frequency of losses exceeding threshold x" },
                          { symbol: "\\alpha", description: "Frequency scaling parameter" },
                          { symbol: "x", description: "Loss severity threshold (currency)" },
                          { symbol: "x_0", description: "Minimum loss threshold for analysis" },
                          { symbol: "\\beta", description: "Tail index parameter from Pareto distribution" }
                        ]
                      }
                    ],
                    transparencyNote: "Powered by NOAA National Hurricane Center advisories, Storm Prediction Center mesoscale analysis, and European Centre for Medium-Range Weather Forecasts (ECMWF) ensemble modeling. Validated against Swiss Re sigma cat bond trigger metrics and ISO property claim severity distributions."
                  },
                  drought: {
                    title: "Drought & Agricultural Loss",
                    explanation: "Comprehensive agricultural and water scarcity risk assessment utilizing Standardized Precipitation-Evapotranspiration Index (SPEI), Palmer Drought Severity Index (PDSI), and soil moisture anomaly detection. Critical for parametric insurance products, agricultural reinsurance portfolios, and weather derivatives pricing. Evaluates both acute drought conditions and chronic aridification trends affecting crop yields, livestock mortality, and water supply infrastructure. Incorporates irrigation dependency ratios and groundwater depletion rates.",
                    calculationPoints: [
                      {
                        title: "Precipitation Deficit Analysis",
                        description: "Measures cumulative rainfall shortfall over 90-day rolling window. Severe deficits (<5mm) trigger parametric insurance payouts for agricultural portfolios. Moderate deficits indicate emerging stress.",
                        formula: "PD = \\begin{cases} 50 & \\text{if } P_{90d} < 5mm \\\\ 30 & \\text{if } 5mm \\leq P_{90d} < 15mm \\\\ 10 & \\text{if } 15mm \\leq P_{90d} < 30mm \\\\ 0 & \\text{if } P_{90d} \\geq 30mm \\end{cases}",
                        variables: [
                          { symbol: "PD", description: "Precipitation deficit score" },
                          { symbol: "P_{90d}", description: "Total precipitation over 90-day window (mm)" }
                        ]
                      },
                      {
                        title: "Evapotranspiration Excess & Water Stress",
                        description: "Calculates water loss through evaporation and plant transpiration. Temperatures exceeding 30°C exponentially increase crop water demand, creating moisture deficits even with normal precipitation.",
                        formula: "ET_0 = \\frac{0.408 \\Delta (R_n - G) + \\gamma \\frac{900}{T+273} u_2 (e_s - e_a)}{\\Delta + \\gamma(1 + 0.34 u_2)}",
                        variables: [
                          { symbol: "ET_0", description: "Reference evapotranspiration (mm/day)" },
                          { symbol: "\\Delta", description: "Slope of saturation vapor pressure curve (kPa/°C)" },
                          { symbol: "R_n", description: "Net radiation at crop surface (MJ/m²/day)" },
                          { symbol: "G", description: "Soil heat flux density (MJ/m²/day)" },
                          { symbol: "\\gamma", description: "Psychrometric constant (kPa/°C)" },
                          { symbol: "T", description: "Mean daily air temperature (°C)" },
                          { symbol: "u_2", description: "Wind speed at 2m height (m/s)" },
                          { symbol: "e_s", description: "Saturation vapor pressure (kPa)" },
                          { symbol: "e_a", description: "Actual vapor pressure (kPa)" }
                        ]
                      },
                      {
                        title: "Vapor Pressure Deficit (VPD) Stress Assessment",
                        description: "Quantifies atmospheric demand for moisture extraction from plants and soil. Critical VPD levels (<30% RH) cause stomatal closure, halting photosynthesis and reducing crop yields.",
                        formula: "VPD = e_s(T) - e_a = e_s(T) \\times \\left(1 - \\frac{RH}{100}\\right)",
                        variables: [
                          { symbol: "VPD", description: "Vapor pressure deficit (kPa)" },
                          { symbol: "e_s(T)", description: "Saturation vapor pressure at temperature T (kPa)" },
                          { symbol: "e_a", description: "Actual vapor pressure (kPa)" },
                          { symbol: "RH", description: "Relative humidity (%)" }
                        ]
                      },
                      {
                        title: "Growing Degree Days (GDD) Deviation",
                        description: "Tracks accumulated heat units for crop development. Significant deviations from historical normals indicate phenological stress, premature maturation, or crop failure scenarios.",
                        formula: "GDD = \\sum_{i=1}^{n} \\max\\left(\\frac{T_{max,i} + T_{min,i}}{2} - T_{base}, 0\\right)",
                        variables: [
                          { symbol: "GDD", description: "Cumulative growing degree days" },
                          { symbol: "T_{max,i}", description: "Maximum temperature on day i (°C)" },
                          { symbol: "T_{min,i}", description: "Minimum temperature on day i (°C)" },
                          { symbol: "T_{base}", description: "Base temperature for crop growth (typically 10°C)" },
                          { symbol: "n", description: "Number of days in growing season" }
                        ]
                      },
                      {
                        title: "Root Zone Soil Moisture & Wilting Point",
                        description: "Monitors available water in active root zone. When soil moisture falls below permanent wilting point (-1.5 MPa), plants cannot extract water, leading to irreversible crop damage.",
                        formula: "\\theta_{available} = \\theta_{actual} - \\theta_{PWP}",
                        variables: [
                          { symbol: "\\theta_{available}", description: "Plant-available soil moisture (volumetric %)" },
                          { symbol: "\\theta_{actual}", description: "Current volumetric soil moisture content (%)" },
                          { symbol: "\\theta_{PWP}", description: "Permanent wilting point moisture content (%)" }
                        ]
                      }
                    ],
                    transparencyNote: "Integrates NOAA Climate Prediction Center drought monitoring, USDA Risk Management Agency historical loss data, and NASA GRACE satellite groundwater measurements. Calibrated against actual indemnity payments and parametric index triggers for basis risk minimization in agricultural portfolios."
                  }
                }}
              />
            </section>

            <section className="max-w-6xl mx-auto space-y-6">
              <h3 className="text-2xl font-bold text-foreground text-center">
                Risk Factor Summary
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <InteractiveRiskCard
                  title="Flood Exposure Index"
                  score={riskData.factors.flood}
                  icon={Droplets}
                  description="AAL: Annual Aggregate Loss modeling with 1-in-100 year return period analysis"
                  explanation="Comprehensive flood exposure assessment combining hydrological modeling, fluvial/pluvial flood dynamics, and coastal storm surge scenarios. Incorporates digital elevation models (DEM), watershed analysis, soil saturation indices, and proximity to FEMA Special Flood Hazard Areas (SFHA). Evaluates both first-party property damage and business interruption exposure for portfolio risk assessment."
                  calculationMethod="### Primary Formula\n\nFlood Risk Score = (P × Wp) + (E × We) + (H × Wh) + (C × Wc) + (R × Wr)\n\nWhere the final score is normalized to 0-100 scale representing Probable Maximum Loss (PML) as percentage of Total Insured Value (TIV).\n\n### Variable Definitions\n\n**P** = Precipitation Intensity Factor\n- Derived from intensity-duration-frequency (IDF) curves\n- Measures extreme rainfall events (mm/hour)\n- Range: 0-100\n\n**E** = Elevation Vulnerability Index\n- Based on meters above mean sea level (MSL)\n- Critical: <10m MSL = 40 points\n- Moderate: 10-50m MSL = 25 points\n- Low: 50-200m MSL = 12 points\n- Minimal: >200m MSL = 0 points\n\n**H** = Hydraulic Conductivity Coefficient\n- Soil drainage capacity and permeability assessment\n- Evaluates water infiltration rates (cm/hr)\n- Range: 0-100 (lower values = poor drainage)\n\n**C** = Catastrophe Model Loss Ratio\n- Historical loss data from RMS, AIR, CoreLogic models\n- Aggregated claim severity distributions\n- Normalized to 0-100 scale\n\n**R** = Return Period Adjustment\n- Climate-adjusted frequency analysis\n- Evaluates 10, 25, 50, 100, 250-year flood events\n- Incorporates IPCC RCP 8.5 projections\n- Range: 0-100\n\n### Weighting Coefficients\n\n**Wp** = 2.5 (Precipitation weight)\n**We** = 1.8 (Elevation weight)\n**Wh** = 1.5 (Hydraulic weight)\n**Wc** = 2.0 (Catastrophe model weight)\n**Wr** = 1.2 (Return period weight)\n\n### Methodology\n\nThe algorithm integrates multiple data layers through weighted summation. Each variable is independently assessed and normalized before applying empirically-derived weighting factors. The model undergoes continuous calibration against actual loss experience and catastrophe model outputs to ensure predictive accuracy for insurance underwriting and portfolio management."
                  transparencyNote="Risk metrics derived from multi-source integration: NOAA precipitation data, USGS elevation datasets, real-time hydrological sensors, and validated against industry catastrophe models. Incorporates climate change projections (IPCC RCP 8.5 scenario) for forward-looking risk assessment."
                />
                <InteractiveRiskCard
                  title="Wildfire Severity Rating"
                  score={riskData.factors.wildfire}
                  icon={Flame}
                  description="Conflagration risk with defensible space analysis and WUI exposure"
                  explanation="Advanced wildfire risk quantification for Wildland-Urban Interface (WUI) zones incorporating fuel load modeling, fire weather indices, historical burn patterns, and ember transport simulation. Evaluates structure ignitability, community wildfire preparedness, and firefighting resource accessibility. Critical for excess-of-loss treaty structuring and portfolio accumulation management in high-hazard territories."
                  calculationMethod="### Primary Formula\n\nWildfire Risk Score = (FWI × Wf) + (T × Wt) + (RH × Wr) + (W × Ww) + (FM × Wm) + (DS × Wd)\n\nNormalized to 0-100 scale representing catastrophic loss potential.\n\n### Variable Definitions\n\n**FWI** = Fire Weather Index\n- Composite index incorporating KBDI (Keetch-Byram Drought Index)\n- Measures atmospheric conditions conducive to fire ignition and spread\n- Includes: temperature, humidity, wind speed, precipitation deficit\n- Range: 0-100\n\n**T** = Temperature Severity Factor\n- Extreme heat threshold analysis\n- >35°C = 40 points (extreme fire danger)\n- 30-35°C = 25 points (high fire danger)\n- 25-30°C = 12 points (moderate fire danger)\n- <25°C = 0 points\n\n**RH** = Relative Humidity Deficit\n- Atmospheric moisture content\n- <25% RH = 40 points (critical)\n- 25-35% RH = 25 points (elevated)\n- 35-50% RH = 12 points (moderate)\n- >50% RH = 0 points\n\n**W** = Wind Speed Factor\n- Sustained wind velocity (km/h)\n- Exponential relationship with fire spread rate\n- >40 km/h = 45 points\n- 25-40 km/h = 30 points\n- 15-25 km/h = 15 points\n- <15 km/h = 5 points\n\n**FM** = Fuel Moisture Content\n- Dead and live fuel moisture percentage\n- <10% = 35 points (critical fire behavior)\n- 10-15% = 20 points (active fire behavior)\n- 15-25% = 8 points (moderate)\n- >25% = 0 points\n\n**DS** = Defensible Space Score\n- Property-level mitigation assessment\n- Measures vegetation clearance within 30m perimeter\n- Compliant = 0 points (reduced risk)\n- Non-compliant = 25 points (elevated risk)\n\n### Weighting Coefficients\n\n**Wf** = 3.5 (Fire Weather Index weight)\n**Wt** = 2.8 (Temperature weight)\n**Wr** = 2.5 (Humidity weight)\n**Ww** = 2.2 (Wind weight)\n**Wm** = 1.8 (Fuel moisture weight)\n**Wd** = 1.5 (Defensible space weight)\n\n### Methodology\n\nThe model employs catastrophe modeling principles aligned with CALFIRE hazard severity zones and NFPA 1144 standards. Each variable undergoes independent assessment through satellite imagery (MODIS, Sentinel-2), weather station data, and ground-truth validation. The weighted aggregation reflects empirical loss correlation from historical wildfire events, calibrated against Munich Re NatCatSERVICE database."
                  transparencyNote="Risk assessment utilizes NASA MODIS fire detection, NOAA fire weather forecasts, and validated against Munich Re NatCatSERVICE wildfire database. Includes real-time Sentinel-2 vegetation indices and historical loss development patterns for accurate reserve estimation."
                />
                <InteractiveRiskCard
                  title="Convective Storm Index"
                  score={riskData.factors.storm}
                  icon={Wind}
                  description="Tropical cyclone & severe thunderstorm exposure with wind field modeling"
                  explanation="Sophisticated severe weather exposure analysis encompassing tropical cyclones (Cat 1-5), derechos, tornadic activity (EF0-EF5), and large hail events. Incorporates pressure gradient analysis, wind field decay modeling, and storm surge inundation zones. Essential for treaty capacity planning, clash loss scenarios, and setting aggregate deductibles in excess-of-loss programs. Evaluates named storm potential and secondary perils including flood and wind-driven rain."
                  calculationMethod="### Primary Formula\n\nStorm Risk Score = (WG × Ww) + (CAPE × Wc) + (AI × Wa) + (PI × Wp) + (FS × Wf)\n\nNormalized to 0-100 scale representing aggregate catastrophic loss exposure.\n\n### Variable Definitions\n\n**WG** = Peak Wind Gust Potential\n- Maximum sustained wind velocity (m/s)\n- Correlated with structural damage severity\n- Cat 5: >70 m/s = 50 points\n- Cat 4: 58-70 m/s = 40 points\n- Cat 3: 50-58 m/s = 30 points\n- Cat 2: 43-49 m/s = 20 points\n- Cat 1: 33-42 m/s = 12 points\n- Tropical Storm: <33 m/s = 5 points\n\n**CAPE** = Convective Available Potential Energy\n- Measure of atmospheric instability (J/kg)\n- Indicates severe thunderstorm outbreak potential\n- >2500 J/kg = 45 points (extreme instability)\n- 1500-2500 J/kg = 30 points (significant instability)\n- 1000-1500 J/kg = 15 points (moderate instability)\n- <1000 J/kg = 5 points\n\n**AI** = Atmospheric Instability Index\n- Temperature lapse rate (°C/day)\n- Measures frontal system volatility\n- >20°C/day = 35 points (extreme)\n- 15-20°C/day = 25 points (high)\n- 10-15°C/day = 12 points (moderate)\n- <10°C/day = 5 points\n\n**PI** = Precipitation Intensity\n- Rainfall rate (mm/hour)\n- Triggers flash flood and water intrusion\n- >75 mm/hr = 40 points (extreme)\n- 50-75 mm/hr = 30 points (severe)\n- 25-50 mm/hr = 15 points (moderate)\n- <25 mm/hr = 5 points\n\n**FS** = Frequency-Severity Factor\n- Historical storm occurrence and damage patterns\n- 30-year loss development analysis\n- Regional peril-specific adjustments\n- Range: 0-100\n\n### Weighting Coefficients\n\n**Ww** = 2.2 (Wind gust weight)\n**Wc** = 2.0 (CAPE weight)\n**Wa** = 1.8 (Atmospheric instability weight)\n**Wp** = 1.5 (Precipitation weight)\n**Wf** = 2.5 (Frequency-severity weight)\n\n### Methodology\n\nStochastic catastrophe modeling framework employing Monte Carlo simulation of synthetic storm tracks. Integrates Saffir-Simpson Hurricane Wind Scale for tropical cyclones and Enhanced Fujita Scale for tornado classification. Wind field decay functions model damage footprint as storms make landfall. Historical frequency-severity distributions inform treaty attachment point optimization and aggregate deductible structuring for excess-of-loss reinsurance programs."
                  transparencyNote="Powered by NOAA National Hurricane Center advisories, Storm Prediction Center mesoscale analysis, and European Centre for Medium-Range Weather Forecasts (ECMWF) ensemble modeling. Validated against Swiss Re sigma cat bond trigger metrics and ISO property claim severity distributions."
                />
                <InteractiveRiskCard
                  title="Drought & Agricultural Loss"
                  score={riskData.factors.drought}
                  icon={Sun}
                  description="SPEI/PDSI parametric triggers for crop yield and water supply assessment"
                  explanation="Comprehensive agricultural and water scarcity risk assessment utilizing Standardized Precipitation-Evapotranspiration Index (SPEI), Palmer Drought Severity Index (PDSI), and soil moisture anomaly detection. Critical for parametric insurance products, agricultural reinsurance portfolios, and weather derivatives pricing. Evaluates both acute drought conditions and chronic aridification trends affecting crop yields, livestock mortality, and water supply infrastructure. Incorporates irrigation dependency ratios and groundwater depletion rates."
                  calculationMethod="### Primary Formula\n\nDrought Risk Score = (PD × Wp) + (ET × We) + (VPD × Wv) + (GDD × Wg) + (SM × Ws)\n\nNormalized to 0-100 scale representing agricultural loss potential and water scarcity severity.\n\n### Variable Definitions\n\n**PD** = Precipitation Deficit Index\n- Cumulative rainfall shortfall over 90-day rolling window (mm)\n- Severe: <5mm total = 50 points\n- Moderate: 5-15mm = 30 points\n- Mild: 15-30mm = 15 points\n- Normal: >30mm = 0 points\n\n**ET** = Evapotranspiration Excess\n- Potential evapotranspiration minus actual evapotranspiration (mm/day)\n- Temperature-driven water stress coefficient\n- >35°C = 45 points (extreme stress)\n- 30-35°C = 30 points (severe stress)\n- 25-30°C = 15 points (moderate stress)\n- <25°C = 5 points\n\n**VPD** = Vapor Pressure Deficit\n- Atmospheric moisture demand indicator (kPa)\n- Derived from relative humidity (RH)\n- RH <30% = 45 points (extreme desiccation)\n- RH 30-40% = 30 points (severe)\n- RH 40-50% = 20 points (elevated)\n- RH >50% = 5 points\n\n**GDD** = Growing Degree Days Anomaly\n- Deviation from 30-year historical normal (°C-days)\n- Measures cumulative heat stress impact on crops\n- >+300 GDD = 35 points (extreme deviation)\n- +150 to +300 GDD = 20 points (significant)\n- +50 to +150 GDD = 10 points (moderate)\n- <+50 GDD = 0 points\n\n**SM** = Soil Moisture Status\n- Root zone water content (% volumetric)\n- Below permanent wilting point (<15% field capacity) = 40 points\n- Between wilting point and 50% capacity = 25 points\n- Between 50-75% capacity = 10 points\n- Above 75% capacity = 0 points\n\n### Weighting Coefficients\n\n**Wp** = 2.8 (Precipitation deficit weight)\n**We** = 2.5 (Evapotranspiration weight)\n**Wv** = 2.2 (VPD weight)\n**Wg** = 1.5 (GDD weight)\n**Ws** = 2.0 (Soil moisture weight)\n\n### Methodology\n\nParametric trigger model employing SPEI (Standardized Precipitation-Evapotranspiration Index) and PDSI (Palmer Drought Severity Index) methodologies. Correlates meteorological drought indicators with agricultural impact through NDVI (Normalized Difference Vegetation Index) anomaly detection. Model calibration uses USDA Risk Management Agency historical indemnity payments to minimize basis risk in parametric insurance applications. NASA GRACE satellite data validates groundwater depletion trends for long-term aridification assessment."
                  transparencyNote="Integrates NOAA Climate Prediction Center drought monitoring, USDA Risk Management Agency historical loss data, and NASA GRACE satellite groundwater measurements. Calibrated against actual indemnity payments and parametric index triggers for basis risk minimization in agricultural portfolios."
                />
              </div>
            </section>

            <InteractiveKPISection overallScore={riskData.overallScore} />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
