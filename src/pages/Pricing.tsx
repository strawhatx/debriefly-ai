
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const navigate = useNavigate();

  const features = {
    free: [
      "1 Trading Account",
      "1GB Secure Storage",
      "Unlimited Backtesting",
      "Personalized Feedback",
      "Beta Access",
    ],
    premium: [
      "Up to 10 Trading Accounts",
      "5GB Secure Storage",
      "Unlimited Backtesting",
      "Personalized Feedback",
      "Trade Replay",
      "Priority Support",
    ],
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-lg">
          Choose the plan that best fits your trading needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Tier */}
        <Card className="p-8 flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Free Beta</h3>
            <p className="text-3xl font-bold mb-4">$0</p>
            <p className="text-muted-foreground">Perfect for getting started</p>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            {features.free.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button onClick={() => navigate("/login")} className="w-full">
            Get Started
          </Button>
        </Card>

        {/* Premium Tier */}
        <Card className="p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl">
            Popular
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <p className="text-3xl font-bold mb-4">$15</p>
            <p className="text-muted-foreground">Billed monthly</p>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            {features.premium.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button onClick={() => navigate("/login")} variant="default" className="w-full">
            Get Premium
          </Button>
        </Card>
      </div>
    </div>
  </div>
  );
};

export default PricingPage;
