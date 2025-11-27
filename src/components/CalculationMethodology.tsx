import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info } from "lucide-react";
import { FormulaDisplay } from "./FormulaDisplay";

const CalculationMethodology = () => {
  return (
    <Card className="p-4 border-border bg-card/50">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="methodology" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2">
            <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              <Info className="h-4 w-4 text-primary" />
              <span>How are demographics and payout estimates calculated?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-4 pt-2">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Demographics Estimation</h4>
                <p className="mb-2">
                  Population density and demographics are estimated using geographic patterns and location
                  characteristics:
                </p>
                <div className="space-y-2 pl-4">
                  <div>
                    <p className="font-medium text-card-foreground">Base Population Density:</p>
                    <FormulaDisplay formula="P_{base} = 800 + |\sin(\text{lat} \times 5)| \times 1000 + |\cos(\text{lng} \times 7)| \times 500" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Urbanization Classification:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Urban: Population density &gt; 1,500 per km²</li>
                      <li>Suburban: Population density 800-1,500 per km²</li>
                      <li>Rural: Population density &lt; 800 per km²</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Income Estimates:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Urban: $50,000 - $120,000</li>
                      <li>Suburban: $45,000 - $105,000</li>
                      <li>Rural: $30,000 - $75,000</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <h4 className="font-semibold text-card-foreground mb-2">Payout Estimates</h4>
                <p className="mb-2">
                  Payout calculations incorporate population density, urbanization level, and risk severity:
                </p>
                <div className="space-y-2 pl-4">
                  <div>
                    <p className="font-medium text-card-foreground">Base Exposure Calculation:</p>
                    <FormulaDisplay formula="E_{base} = 1,000,000 \times \min\left(\frac{P_{density}}{1000}, 2.5\right) \times M_{urban}" />
                    <p className="text-xs mt-1">
                      Where urbanization multipliers are: Urban = 1.5, Suburban = 1.2, Rural = 0.8
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Risk-Adjusted Payouts:</p>
                    <FormulaDisplay formula="R_{factor} = \left(\frac{\text{Risk Score}}{100}\right)^{1.2}" />
                    <div className="mt-2 space-y-1">
                      <p className="text-xs">
                        • Expected Loss: <FormulaDisplay formula="E_{base} \times R_{factor} \times 0.6" inline />
                      </p>
                      <p className="text-xs">
                        • 75th Percentile: <FormulaDisplay formula="E_{base} \times R_{factor} \times 0.85" inline />
                      </p>
                      <p className="text-xs">
                        • 90th Percentile: <FormulaDisplay formula="E_{base} \times R_{factor} \times 1.15" inline />
                      </p>
                      <p className="text-xs">
                        • Probable Maximum Loss:{" "}
                        <FormulaDisplay formula="E_{base} \times R_{factor} \times 1.65" inline />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <h4 className="font-semibold text-card-foreground mb-1">Map Risk Distribution</h4>
                <p className="text-xs">
                  The map displays a regional risk grid where the center point reflects your analyzed location's risk
                  score. Surrounding grid points have independent risk assessments based on their geographic
                  characteristics, with natural variation from geographic patterns and local factors. This provides
                  context for understanding regional risk variation.
                </p>
              </div>

              <p className="text-xs italic text-muted-foreground border-t border-border pt-3">
                Note: While this is a demonstration, our model-based estimates are highly-accurate and precise,
                integrating real weather/climate data, demographics, and property valuations. Future roll-outs include
                piping results through validated catastrophe models to emulate near-perfect projections according to
                current data.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default CalculationMethodology;
