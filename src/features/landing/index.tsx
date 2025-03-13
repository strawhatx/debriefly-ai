
import { HeroSection } from "./components/HeroSection";
import { SolutionBentoGrid } from "./components/SolutionBentoGrid";
import { PricingSection } from "./components/PricingSection";
import { HowItWorks } from "./components/HowItWorks";
import { JournalingFeature } from "./components/JournalingFeature";
import { CtaSection } from "./components/CTASection";

const Landing = () => {

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

export default Landing;
