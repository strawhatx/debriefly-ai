
import { HeroSection } from "@/components/landing/HeroSection";
import { SolutionBentoGrid } from "@/components/landing/SolutionBentoGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { JournalingFeature } from "@/components/landing/JournalingFeature";
import { CtaSection } from "@/components/landing/CTASection";

const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <JournalingFeature />
      <SolutionBentoGrid />
      <HowItWorks />
      <PricingSection />
      <CtaSection />

    </div>
  );
};

export default Index;
