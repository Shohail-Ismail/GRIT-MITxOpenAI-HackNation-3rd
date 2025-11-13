import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <p>Built on transparent AI principles - every score is explainable</p>
          </div>
          <p className="font-medium">MITxOpenAI HackNation 2025 Prototype</p>
        </div>
        <p className="text-center text-sm text-muted-foreground/80 mt-4">
          Made with Love(able) by Shohail Ismail + Chinmay Sharma
        </p>
      </div>
    </footer>
  );
};

export default Footer;
