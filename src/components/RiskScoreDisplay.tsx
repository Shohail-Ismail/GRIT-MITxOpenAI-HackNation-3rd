import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RiskScoreDisplayProps {
  overallScore: number;
  latitude: number;
  longitude: number;
  factors?: {
    flood: number;
    wildfire: number;
    storm: number;
    drought: number;
  };
}

const getRiskConfig = (score: number) => {
  if (score < 25) {
    return {
      label: "Low Risk",
      color: "text-risk-low",
      bgColor: "bg-risk-low/10",
      borderColor: "border-risk-low/30",
      icon: CheckCircle,
      description: "Minimal environmental hazards detected"
    };
  }
  if (score < 50) {
    return {
      label: "Medium Risk",
      color: "text-risk-medium",
      bgColor: "bg-risk-medium/10",
      borderColor: "border-risk-medium/30",
      icon: AlertCircle,
      description: "Moderate hazard levels present"
    };
  }
  if (score < 75) {
    return {
      label: "High Risk",
      color: "text-risk-high",
      bgColor: "bg-risk-high/10",
      borderColor: "border-risk-high/30",
      icon: AlertTriangle,
      description: "Significant environmental risks identified"
    };
  }
  return {
    label: "Critical Risk",
    color: "text-risk-critical",
    bgColor: "bg-risk-critical/10",
    borderColor: "border-risk-critical/30",
    icon: XCircle,
    description: "Severe hazard conditions detected"
  };
};

const RiskScoreDisplay = ({ overallScore, latitude, longitude, factors }: RiskScoreDisplayProps) => {
  const config = getRiskConfig(overallScore);
  const Icon = config.icon;
  
  return (
    <Card className={`border-2 ${config.borderColor} ${config.bgColor} p-8 text-center transition-all duration-500 hover:shadow-lg`}>
      <div className="flex flex-col items-center gap-4">
        <Icon className={`h-16 w-16 ${config.color} animate-pulse`} />
        
        <div className="w-full">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-sm font-medium text-muted-foreground">Overall Risk Score</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10">
                  <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <Icon className={`h-6 w-6 ${config.color}`} />
                    Overall Risk Score Calculation
                  </DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    How the composite risk score of <span className="font-bold text-foreground text-xl">{overallScore}</span> is calculated
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-base">Calculation Formula</h4>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-muted-foreground font-mono">
                        Overall Score = (Flood + Wildfire + Storm + Drought) ÷ 4
                      </p>
                      {factors && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            = ({factors.flood} + {factors.wildfire} + {factors.storm} + {factors.drought}) ÷ 4
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            = {overallScore}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 text-base">What This Represents</h4>
                    <p className="text-sm text-muted-foreground">
                      The Overall Risk Score is a composite metric that provides a single, comprehensive view of all environmental hazards affecting a location. It equally weights four primary risk factors: Flood, Wildfire, Storm, and Drought.
                    </p>
                  </div>
                  
                  {factors && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-base">Component Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm font-medium">Flood Risk</span>
                          <span className="text-sm font-bold">{factors.flood}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm font-medium">Wildfire Risk</span>
                          <span className="text-sm font-bold">{factors.wildfire}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm font-medium">Storm Risk</span>
                          <span className="text-sm font-bold">{factors.storm}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm font-medium">Drought Risk</span>
                          <span className="text-sm font-bold">{factors.drought}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 text-base">Methodology</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Equal Weighting:</strong> Each risk factor contributes 25% to the overall score, ensuring no single hazard dominates the assessment.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Real-Time Data:</strong> Calculations use current climate data from Open-Meteo API, including temperature, precipitation, wind speed, and humidity.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Multi-Factor Analysis:</strong> Each component risk is calculated from multiple environmental indicators specific to that hazard type.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Normalised Scale:</strong> All scores are normalised to a 0-100 scale for consistent interpretation across different hazard types.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 text-base">Risk Level Interpretation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-risk-low font-medium">0-24: Low Risk</span>
                        <span className="text-muted-foreground">Minimal environmental hazards</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-risk-medium font-medium">25-49: Medium Risk</span>
                        <span className="text-muted-foreground">Moderate hazard levels</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-risk-high font-medium">50-74: High Risk</span>
                        <span className="text-muted-foreground">Significant environmental risks</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-risk-critical font-medium">75-100: Critical Risk</span>
                        <span className="text-muted-foreground">Severe hazard conditions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className={`text-6xl font-bold ${config.color} mb-2`}>
            {overallScore}
          </div>
          <div className={`text-lg font-semibold ${config.color} mb-1`}>
            {config.label}
          </div>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border w-full">
          <p className="text-xs text-muted-foreground">
            Location: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RiskScoreDisplay;
