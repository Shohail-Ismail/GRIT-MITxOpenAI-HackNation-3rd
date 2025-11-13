import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface FormulaDisplayProps {
  formula: string;
  inline?: boolean;
}

export const FormulaDisplay = ({ formula, inline = false }: FormulaDisplayProps) => {
  try {
    return inline ? <InlineMath math={formula} /> : <BlockMath math={formula} />;
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return <span className="text-destructive text-sm">Formula rendering error</span>;
  }
};

interface CalculationPointProps {
  title: string;
  description: string;
  formula?: string;
  variables?: { symbol: string; description: string; }[];
}

export const CalculationPoint = ({ title, description, formula, variables }: CalculationPointProps) => {
  return (
    <div className="space-y-2 py-3">
      <h5 className="font-medium text-foreground">{title}</h5>
      <p className="text-sm text-muted-foreground">{description}</p>
      
      {formula && (
        <div className="bg-muted/30 rounded-lg p-3 my-2">
          <div className="text-sm font-mono overflow-x-auto">
            <FormulaDisplay formula={formula} />
          </div>
        </div>
      )}
      
      {variables && variables.length > 0 && (
        <div className="space-y-1 pl-4 border-l-2 border-border">
          {variables.map((v, idx) => (
            <div key={idx} className="text-sm">
              <span className="font-mono text-primary"><FormulaDisplay formula={v.symbol} inline /></span>
              <span className="text-muted-foreground"> = {v.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
