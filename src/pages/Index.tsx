
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChartLine, ChartBar, DollarSign, User, ArrowRight, Github } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import { useToast } from "@/components/ui/use-toast";
import { HeroSection } from "@/components/landing/HeroSection";
import FeatureCard from "@/components/landing/FeatureCard";
import ChallengesSection from "@/components/landing/ChallengesSection";
import DetailedFeatures from "@/components/landing/DetailedFeatures";
import TradeReplaySection from "@/components/landing/TradeReplaySection";

const Index = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setIsLoginVisible(true);
    toast({
      title: "Welcome to Debriefly",
      description: "Let's start analyzing your trades with AI.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <div className="container mx-auto px-4">
        {!isLoginVisible ? (
          <div className="space-y-32 pb-32 animate-fade-up">
            {/* Core Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
              <FeatureCard
                icon={<ChartLine className="w-6 h-6" />}
                title="AI Trade Analysis"
                description="Get personalized feedback on your trading decisions"
              />
              <FeatureCard
                icon={<ChartBar className="w-6 h-6" />}
                title="Performance Tracking"
                description="Track your progress with detailed analytics"
              />
              <FeatureCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Multi-Account Support"
                description="Manage up to 10 trading accounts in one place"
              />
              <FeatureCard
                icon={<User className="w-6 h-6" />}
                title="Trade Journal"
                description="Log and review your trades with ease"
              />
            </div>

            <ChallengesSection />
            <DetailedFeatures />
            <TradeReplaySection />

            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Transform Your Trading?</h2>
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="px-8 py-6 text-lg transition-all hover:scale-105"
              >
                Get Started Now <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[400px] mx-auto mt-8 animate-fade-up">
            <LoginForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
