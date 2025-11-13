import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

interface InteractiveRiskCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  description: string;
  explanation: string;
  calculationMethod: string;
  transparencyNote: string;
}

const getRiskLevel = (score: number) => {
  if (score < 25) return { label: "Low", color: "text-risk-low" };
  if (score < 50) return { label: "Medium", color: "text-risk-medium" };
  if (score < 75) return { label: "High", color: "text-risk-high" };
  return { label: "Critical", color: "text-risk-critical" };
};

const getProgressColor = (score: number) => {
  if (score < 25) return "bg-risk-low";
  if (score < 50) return "bg-risk-medium";
  if (score < 75) return "bg-risk-high";
  return "bg-risk-critical";
};

const InteractiveRiskCard = ({ 
  title, 
  score, 
  icon: Icon, 
  description, 
  explanation,
  calculationMethod,
  transparencyNote 
}: InteractiveRiskCardProps) => {
  const risk = getRiskLevel(score);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group overflow-hidden border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/20">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-card-foreground">{score}</span>
              <span className={`text-sm font-semibold ${risk.color}`}>{risk.label} Risk</span>
            </div>
            <Progress 
              value={score} 
              className="h-2"
              indicatorClassName={getProgressColor(score)}
            />
          </div>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Score: <span className="font-bold text-foreground text-xl">{score}</span> — 
            <span className={`font-semibold ${risk.color}`}> {risk.label} Risk</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div>
            <h4 className="font-semibold mb-2">What This Measures</h4>
            <p className="text-sm text-muted-foreground">{explanation}</p>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Calculation Methodology</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{calculationMethod}</p>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Data Sources & Transparency
            </h4>
            <p className="text-sm text-muted-foreground">{transparencyNote}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveRiskCard;
