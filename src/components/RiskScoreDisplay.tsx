import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Info, Droplets, Flame, Wind, Sun } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RiskFactor {
  title: string;
  explanation: string;
  calculationMethod: string;
  transparencyNote: string;
}

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
  riskExplanations?: {
    flood: RiskFactor;
    wildfire: RiskFactor;
    storm: RiskFactor;
    drought: RiskFactor;
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

const RiskScoreDisplay = ({ overallScore, latitude, longitude, factors, riskExplanations }: RiskScoreDisplayProps) => {
  const config = getRiskConfig(overallScore);
  const Icon = config.icon;
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={`border-2 ${config.borderColor} ${config.bgColor} p-8 text-center transition-all duration-500 hover:shadow-lg cursor-pointer hover:-translate-y-1`}>
          <div className="flex flex-col items-center gap-4">
            <Icon className={`h-16 w-16 ${config.color} animate-pulse`} />
            
            <div className="w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-sm font-medium text-muted-foreground">Overall Risk Score</h2>
                <Info className="h-4 w-4 text-muted-foreground" />
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
          
          {factors && riskExplanations && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3 text-base">Component Breakdown</h4>
              <p className="text-xs text-muted-foreground mb-3">Click on each risk factor to see detailed calculation methodology</p>
              <div className="space-y-3">
                {/* Flood Risk Dialog */}
                <Dialog open={selectedRisk === 'flood'} onOpenChange={(open) => setSelectedRisk(open ? 'flood' : null)}>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Flood Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{factors.flood}</span>
                        <Info className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-primary" />
                        {riskExplanations.flood.title}
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        Score: <span className="font-bold text-foreground text-xl">{factors.flood}</span>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold mb-2">What This Measures</h4>
                        <p className="text-sm text-muted-foreground">{riskExplanations.flood.explanation}</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2">Calculation Methodology</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{riskExplanations.flood.calculationMethod}</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          Data Sources & Transparency
                        </h4>
                        <p className="text-sm text-muted-foreground">{riskExplanations.flood.transparencyNote}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                
                <Dialog open={selectedRisk === 'wildfire'} onOpenChange={(open) => setSelectedRisk(open ? 'wildfire' : null)}>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Wildfire Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{factors.wildfire}</span>
                        <Info className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-primary" />
                        {riskExplanations.wildfire.title}
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        Score: <span className="font-bold text-foreground text-xl">{factors.wildfire}</span>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold mb-2">What This Measures</h4>
                        <p className="text-sm text-muted-foreground">{riskExplanations.wildfire.explanation}</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2">Calculation Methodology</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{riskExplanations.wildfire.calculationMethod}</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          Data Sources & Transparency
                        </h4>
                        <p className="text-sm text-muted-foreground">{riskExplanations.wildfire.transparencyNote}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                
                <Dialog open={selectedRisk === 'storm'} onOpenChange={(open) => setSelectedRisk(open ? 'storm' : null)}>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Storm Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{factors.storm}</span>
                        <Info className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-primary" />
                        {riskExplanations.storm.title}
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        Score: <span className="font-bold text-foreground text-xl">{factors.storm}</span>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold mb-2">What This Measures</h4>
                        <p className="text-sm text-muted-foreground">{riskExplanations.storm.explanation}</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2">Calculation Methodology</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{riskExplanations.storm.calculationMethod}</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          Data Sources & Transparency
                        </h4>
                        <p className="text-sm text-muted-foreground">{riskExplanations.storm.transparencyNote}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                
                <Dialog open={selectedRisk === 'drought'} onOpenChange={(open) => setSelectedRisk(open ? 'drought' : null)}>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Drought Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{factors.drought}</span>
                        <Info className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-primary" />
                        {riskExplanations.drought.title}
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        Score: <span className="font-bold text-foreground text-xl">{factors.drought}</span>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold mb-2">What This Measures</h4>
                        <p className="text-sm text-muted-foreground">{riskExplanations.drought.explanation}</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2">Calculation Methodology</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{riskExplanations.drought.calculationMethod}</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          Data Sources & Transparency
                        </h4>
                        <p className="text-sm text-muted-foreground">{riskExplanations.drought.transparencyNote}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
          
          
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-3 text-base">Methodology</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                The Overall Risk Score is derived from a combination of predictive
                models, historical data, and real-time sensor information.
              </li>
              <li>
                Each risk factor (Flood, Wildfire, Storm, Drought) is assessed
                independently using advanced algorithms and datasets.
              </li>
              <li>
                The final score is normalized to a 0-100 scale, where higher
                values indicate greater risk.
              </li>
            </ul>
          </div>

          
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-3 text-base">Risk Level Interpretation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-semibold text-risk-low">Low Risk (0-25):</span> Minimal expected impact from
                environmental hazards.
              </li>
              <li>
                <span className="font-semibold text-risk-medium">Medium Risk (26-50):</span> Moderate potential for
                disruptions and damages.
              </li>
              <li>
                <span className="font-semibold text-risk-high">High Risk (51-75):</span> Significant likelihood of
                severe weather events and associated losses.
              </li>
              <li>
                <span className="font-semibold text-risk-critical">Critical Risk (76-100):</span> Extreme vulnerability
                to catastrophic events and long-term consequences.
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RiskScoreDisplay;
