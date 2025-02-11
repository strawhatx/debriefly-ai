
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
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left animate-fade-down lg:w-1/2">
            <div className="space-y-4 max-w-[800px]">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Debriefly AI
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
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
          <div className="lg:w-1/2 animate-fade-up">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-lg blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                alt="Trading platform interface"
                className="relative rounded-lg shadow-2xl border border-border/50 w-full max-w-[600px] mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
