
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  isLoginVisible: boolean;
}

const HeroSection = ({ onGetStarted, isLoginVisible }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 pb-32">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:16px_16px] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-center animate-fade-down">
          <div className="space-y-4 max-w-[800px]">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Debriefly AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px] mx-auto">
              Transform your trading with AI-powered insights and personalized feedback
            </p>
            {!isLoginVisible && (
              <Button
                size="lg"
                onClick={onGetStarted}
                className="mt-8 px-8 py-6 text-lg transition-all hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
