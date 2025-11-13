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
              <RiskChart factors={riskData.factors} />
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
                  calculationMethod="Multi-factor actuarial model:\n• Precipitation intensity-duration-frequency (IDF) curves weighted x2.5\n• Elevation-based vulnerability: Critical zones <10m MSL (+40 pts), Moderate <50m (+25 pts), Low <200m (+12 pts)\n• Hydraulic conductivity & drainage capacity assessment\n• Historical loss ratios from catastrophe models (RMS, AIR, CoreLogic)\n• Climate-adjusted return period calculations for 10, 25, 50, 100, 250-year events\n\nScore represents Probable Maximum Loss (PML) as percentage of Total Insured Value (TIV)"
                  transparencyNote="Risk metrics derived from multi-source integration: NOAA precipitation data, USGS elevation datasets, real-time hydrological sensors, and validated against industry catastrophe models. Incorporates climate change projections (IPCC RCP 8.5 scenario) for forward-looking risk assessment."
                />
                <InteractiveRiskCard
                  title="Wildfire Severity Rating"
                  score={riskData.factors.wildfire}
                  icon={Flame}
                  description="Conflagration risk with defensible space analysis and WUI exposure"
                  explanation="Advanced wildfire risk quantification for Wildland-Urban Interface (WUI) zones incorporating fuel load modeling, fire weather indices, historical burn patterns, and ember transport simulation. Evaluates structure ignitability, community wildfire preparedness, and firefighting resource accessibility. Critical for excess-of-loss treaty structuring and portfolio accumulation management in high-hazard territories."
                  calculationMethod="Catastrophe modeling framework:\n• Fire Weather Index (FWI) incorporating Keetch-Byram Drought Index (KBDI)\n• Temperature threshold analysis: Extreme conditions >35°C weighted x3.5\n• Relative humidity deficit: Critical <25% (+40 pts), Elevated <35% (+25 pts)\n• Wind-driven fire spread potential: Sustained winds >25 km/h exponentially increase loss severity\n• Fuel moisture content <10% triggers critical accumulation scenarios\n• Defensible space compliance within 30m perimeter\n\nIntegrates CALFIRE hazard severity zones and NFPA 1144 standards"
                  transparencyNote="Risk assessment utilizes NASA MODIS fire detection, NOAA fire weather forecasts, and validated against Munich Re NatCatSERVICE wildfire database. Includes real-time Sentinel-2 vegetation indices and historical loss development patterns for accurate reserve estimation."
                />
                <InteractiveRiskCard
                  title="Convective Storm Index"
                  score={riskData.factors.storm}
                  icon={Wind}
                  description="Tropical cyclone & severe thunderstorm exposure with wind field modeling"
                  explanation="Sophisticated severe weather exposure analysis encompassing tropical cyclones (Cat 1-5), derechos, tornadic activity (EF0-EF5), and large hail events. Incorporates pressure gradient analysis, wind field decay modeling, and storm surge inundation zones. Essential for treaty capacity planning, clash loss scenarios, and setting aggregate deductibles in excess-of-loss programs. Evaluates named storm potential and secondary perils including flood and wind-driven rain."
                  calculationMethod="Stochastic catastrophe model:\n• Peak wind gust potential weighted x2.2 for structural damage correlation\n• Convective available potential energy (CAPE) >1500 J/kg indicates severe outbreak potential\n• Atmospheric instability: Temperature lapse rate >15°C/day (+25 pts) signals frontal system volatility\n• Precipitation intensity: >50mm/hour triggers flash flood and wind-driven water intrusion\n• Historical frequency-severity analysis for treaty layer attachment optimization\n\nApplies industry-standard Saffir-Simpson scale and Enhanced Fujita classifications"
                  transparencyNote="Powered by NOAA National Hurricane Center advisories, Storm Prediction Center mesoscale analysis, and European Centre for Medium-Range Weather Forecasts (ECMWF) ensemble modeling. Validated against Swiss Re sigma cat bond trigger metrics and ISO property claim severity distributions."
                />
                <InteractiveRiskCard
                  title="Drought & Agricultural Loss"
                  score={riskData.factors.drought}
                  icon={Sun}
                  description="Standardized Precipitation Index (SPI) with crop yield impact modeling"
                  explanation="Comprehensive agricultural and water scarcity risk assessment utilizing Standardized Precipitation-Evapotranspiration Index (SPEI), Palmer Drought Severity Index (PDSI), and soil moisture anomaly detection. Critical for parametric insurance products, agricultural reinsurance portfolios, and weather derivatives pricing. Evaluates both acute drought conditions and chronic aridification trends affecting crop yields, livestock mortality, and water supply infrastructure. Incorporates irrigation dependency ratios and groundwater depletion rates."
                  calculationMethod="Parametric trigger modeling:\n• Precipitation deficit: Severe <5mm (+50 pts), Moderate <15mm (+30 pts) over 90-day rolling window\n• Evapotranspiration excess: Temperature >30°C exponentially increases water stress coefficient\n• Vapor pressure deficit (VPD): RH <30% (+45 pts) triggers extreme desiccation, <50% (+20 pts) elevated stress\n• Growing Degree Days (GDD) deviation from historical normals\n• Root zone soil moisture below permanent wilting point\n\nCorrelates with USDA crop condition reports and NDVI anomaly detection"
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
