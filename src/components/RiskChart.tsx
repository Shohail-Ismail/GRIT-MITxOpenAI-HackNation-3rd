import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Droplets, Flame, Wind, Sun, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RiskFactor {
  title: string;
  explanation: string;
  calculationMethod: string;
  transparencyNote: string;
}

interface RiskChartProps {
  factors: {
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

const RiskChart = ({ factors, riskExplanations }: RiskChartProps) => {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  
  const data = [
    { name: "Flood", value: factors.flood, color: "hsl(var(--chart-1))", key: "flood" },
    { name: "Wildfire", value: factors.wildfire, color: "hsl(var(--chart-2))", key: "wildfire" },
    { name: "Storm", value: factors.storm, color: "hsl(var(--chart-3))", key: "storm" },
    { name: "Drought", value: factors.drought, color: "hsl(var(--chart-4))", key: "drought" },
  ];

  const getRiskIcon = (riskKey: string) => {
    switch (riskKey) {
      case 'flood': return Droplets;
      case 'wildfire': return Flame;
      case 'storm': return Wind;
      case 'drought': return Sun;
      default: return Info;
    }
  };

  const handleBarClick = (data: any) => {
    if (riskExplanations) {
      setSelectedRisk(data.key);
    }
  };

  return (
    <>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground">Risk Comparison</h3>
        <p className="text-sm text-muted-foreground mb-4">Click on any bar to see detailed calculation methodology</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {data.map((entry) => (
            <button
              key={entry.key}
              onClick={() => handleBarClick(entry)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
              style={{ borderColor: entry.color }}
            >
              {(() => {
                const Icon = getRiskIcon(entry.key);
                return <Icon className="h-6 w-6" style={{ color: entry.color }} />;
              })()}
              <span className="text-sm font-medium text-card-foreground">{entry.name}</span>
              <span className="text-2xl font-bold" style={{ color: entry.color }}>{entry.value}</span>
              <span className="text-xs text-muted-foreground">
                {entry.value === 0 ? 'No Risk' : entry.value < 25 ? 'Low' : entry.value < 50 ? 'Medium' : entry.value < 75 ? 'High' : 'Critical'}
              </span>
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
              onClick={handleBarClick}
              cursor={riskExplanations ? "pointer" : "default"}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {riskExplanations && selectedRisk && (
        <>
          <Dialog open={selectedRisk === 'flood'} onOpenChange={(open) => !open && setSelectedRisk(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  {riskExplanations.flood.title}
                </DialogTitle>
                <DialogDescription className="text-base pt-2">
                  Score: <span className="font-bold text-foreground text-xl">{factors.flood}</span> — 
                  <span className="font-semibold">
                    {factors.flood === 0 ? 'No Risk Detected' : factors.flood < 25 ? 'Low Risk' : factors.flood < 50 ? 'Medium Risk' : factors.flood < 75 ? 'High Risk' : 'Critical Risk'}
                  </span>
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

          <Dialog open={selectedRisk === 'wildfire'} onOpenChange={(open) => !open && setSelectedRisk(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" />
                  {riskExplanations.wildfire.title}
                </DialogTitle>
                <DialogDescription className="text-base pt-2">
                  Score: <span className="font-bold text-foreground text-xl">{factors.wildfire}</span> — 
                  <span className="font-semibold">
                    {factors.wildfire === 0 ? 'No Risk Detected' : factors.wildfire < 25 ? 'Low Risk' : factors.wildfire < 50 ? 'Medium Risk' : factors.wildfire < 75 ? 'High Risk' : 'Critical Risk'}
                  </span>
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

          <Dialog open={selectedRisk === 'storm'} onOpenChange={(open) => !open && setSelectedRisk(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-primary" />
                  {riskExplanations.storm.title}
                </DialogTitle>
                <DialogDescription className="text-base pt-2">
                  Score: <span className="font-bold text-foreground text-xl">{factors.storm}</span> — 
                  <span className="font-semibold">
                    {factors.storm === 0 ? 'No Risk Detected' : factors.storm < 25 ? 'Low Risk' : factors.storm < 50 ? 'Medium Risk' : factors.storm < 75 ? 'High Risk' : 'Critical Risk'}
                  </span>
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

          <Dialog open={selectedRisk === 'drought'} onOpenChange={(open) => !open && setSelectedRisk(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-primary" />
                  {riskExplanations.drought.title}
                </DialogTitle>
                <DialogDescription className="text-base pt-2">
                  Score: <span className="font-bold text-foreground text-xl">{factors.drought}</span> — 
                  <span className="font-semibold">
                    {factors.drought === 0 ? 'No Risk Detected' : factors.drought < 25 ? 'Low Risk' : factors.drought < 50 ? 'Medium Risk' : factors.drought < 75 ? 'High Risk' : 'Critical Risk'}
                  </span>
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
        </>
      )}
    </>
  );
};

export default RiskChart;
