
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartBar, ChartLine, DollarSign, User } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import { useToast } from "@/components/ui/use-toast";

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
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 animate-fade-down">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Debriefly AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto">
              Transform your trading with AI-powered insights and personalized feedback
            </p>
          </div>

          {!isLoginVisible ? (
            <div className="space-y-8 w-full max-w-[800px] animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="px-8 py-6 text-lg transition-all hover:scale-105"
                >
                  Get Started
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[400px] animate-fade-up">
              <LoginForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-border/50">
    <div className="space-y-4">
      <div className="p-2 w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </Card>
);

export default Index;
