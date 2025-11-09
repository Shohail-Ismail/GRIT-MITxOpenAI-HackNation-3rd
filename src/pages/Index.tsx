import { useState } from "react";
import { Droplets, Flame, Wind, Sun, Download, Home } from "lucide-react";
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

  const analyzeLocation = async (lat: number, lng: number) => {
    setIsAnalyzing(true);
    toast.info("Analyzing location with real-time data...");
    
    try {
      // Call the backend function to get real climate data
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-location`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude: lat, longitude: lng }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch risk data');
      }

      const data = await response.json();
      
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                  title="Flood Risk"
                  score={riskData.factors.flood}
                  icon={Droplets}
                  description="Water-related hazards"
                  explanation="Flood risk measures how likely the area is to experience water-related disasters based on elevation, soil saturation, proximity to water bodies, and historical flood events. It considers factors like drainage capacity and topographic vulnerability."
                  calculationMethod="Score is calculated by combining:\n• Average precipitation (weighted x2)\n• Maximum precipitation probability (weighted x0.3)\n• Elevation penalty: +30 points if below 50m, +15 if below 200m\n• Humidity bonus: +15 points if relative humidity exceeds 80%\n\nThe final score is capped at 100 and represents cumulative flood risk factors."
                  transparencyNote="This score uses real-time data from Open-Meteo API, including current weather conditions, 7-day precipitation forecasts, and elevation data. All data is publicly available and updated continuously."
                />
                <InteractiveRiskCard
                  title="Wildfire Risk"
                  score={riskData.factors.wildfire}
                  icon={Flame}
                  description="Fire danger assessment"
                  explanation="Wildfire risk assesses the likelihood of fire hazards based on vegetation density, dryness levels, historical fire patterns, temperature trends, and proximity to fire-prone areas. It includes both natural and human-caused fire susceptibility."
                  calculationMethod="Score is calculated by combining:\n• High temperature penalty: (temp - 30°C) x3 points when above 30°C\n• Low humidity penalty: +30 points if relative humidity is below 30%\n• Wind speed factor: maximum value of (wind speed or 20), capped at 20 points\n• Low precipitation penalty: +20 points if average precipitation is below 2mm\n\nThe final score is capped at 100, reflecting combined fire risk conditions."
                  transparencyNote="This score uses real-time weather data from Open-Meteo API, including temperature, humidity, wind speed, and precipitation measurements from the past 7 days and current conditions."
                />
                <InteractiveRiskCard
                  title="Storm Risk"
                  score={riskData.factors.storm}
                  icon={Wind}
                  description="Severe weather patterns"
                  explanation="Storm risk evaluates exposure to severe weather including hurricanes, tornadoes, severe thunderstorms, and high wind events. It considers geographic location, historical storm paths, and atmospheric conditions that favor storm development."
                  calculationMethod="Score is calculated by combining:\n• Maximum wind speed (weighted x2)\n• Maximum precipitation probability (weighted x0.4)\n• Temperature variation: +20 points if daily variation exceeds 15°C, otherwise uses the variation value directly\n\nThis methodology captures both direct storm indicators (wind, precipitation) and atmospheric instability (temperature swings). The final score is capped at 100."
                  transparencyNote="This score uses real-time data from Open-Meteo API, analyzing 7-day wind speed forecasts, precipitation probabilities, and temperature variations to assess storm likelihood."
                />
                <InteractiveRiskCard
                  title="Drought Risk"
                  score={riskData.factors.drought}
                  icon={Sun}
                  description="Water scarcity potential"
                  explanation="Drought risk measures water scarcity potential by analyzing precipitation patterns, soil moisture levels, temperature trends, and water resource availability. It considers both short-term dry periods and long-term aridification trends."
                  calculationMethod="Score is calculated by combining:\n• Low precipitation penalty: +40 points if below 5mm, +20 if below 10mm\n• High temperature penalty: (temp - 25°C) x2 points when above 25°C\n• Low humidity penalty: +30 points if relative humidity is below 40%, +15 if below 60%\n\nThis captures water deficit conditions through multiple indicators. The final score is capped at 100."
                  transparencyNote="This score uses real-time data from Open-Meteo API, including 7-day precipitation averages, current temperature, and relative humidity measurements to assess drought conditions."
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
