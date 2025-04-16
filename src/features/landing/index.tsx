
import { HeroSection } from "./components/HeroSection";
import { Solutions } from "./components/Solutions";
import { PricingSection } from "./components/PricingSection";
import { HowItWorks } from "./components/HowItWorks";
import { JournalingFeature } from "./components/JournalingFeature";
import { CtaSection } from "./components/CTASection";

const Landing = () => {

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <JournalingFeature />
      <Solutions />
      <HowItWorks />
      <PricingSection />
      <CtaSection />

    </div>
  );
};

export default Landing;
