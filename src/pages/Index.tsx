
import { useToast } from "@/components/ui/use-toast";
import { HeroSection } from "@/components/landing/HeroSection";
import { SolutionBentoGrid } from "@/components/landing/SolutionBentoGrid";
import PricingSection from "@/components/landing/PricingSection";
import {HowItWorks} from "@/components/landing/HowItWorks";
import { JournalingFeature } from "@/components/landing/JournalingFeature";

const Index = () => {
  const { toast } = useToast();

  const handleGetStarted = () => {
    toast({
      title: "Welcome to Debriefly",
      description: "Let's start analyzing your trades with AI.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <JournalingFeature/>
      <SolutionBentoGrid />
      <HowItWorks />
      <PricingSection />

    </div>
  );
};

export default Index;
