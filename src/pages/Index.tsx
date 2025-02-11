
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChartBar, 
  ChartLine, 
  DollarSign, 
  User, 
  History, 
  Brain, 
  BarChart3, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
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
      {/* Hero Section */}
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
                  onClick={handleGetStarted}
                  className="mt-8 px-8 py-6 text-lg transition-all hover:scale-105"
                >
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

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

            {/* Common Trading Issues Section */}
            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-destructive/10 rounded-3xl" />
              <Card className="relative p-8 border-2 border-destructive/20 bg-card/50 backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-8 text-center">Common Trading Challenges We Solve</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Emotional Trading",
                      description: "AI helps you identify and overcome emotional biases in your trading decisions"
                    },
                    {
                      title: "Inconsistent Performance",
                      description: "Track and analyze patterns to maintain consistent trading strategies"
                    },
                    {
                      title: "Poor Risk Management",
                      description: "Get real-time feedback on position sizing and risk-reward ratios"
                    }
                  ].map((issue) => (
                    <div key={issue.title} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <h3 className="font-semibold text-lg">{issue.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{issue.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Detailed Feature Sections */}
            <section className="space-y-24">
              {/* AI Analysis Feature */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="p-3 w-fit rounded-lg bg-primary/10">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">AI-Powered Trade Analysis</h2>
                  <div className="space-y-4">
                    <FeaturePoint
                      title="Pattern Recognition"
                      description="AI identifies recurring patterns in your trading behavior"
                    />
                    <FeaturePoint
                      title="Personalized Feedback"
                      description="Get actionable insights tailored to your trading style"
                    />
                    <FeaturePoint
                      title="Risk Assessment"
                      description="Advanced analysis of your risk management strategies"
                    />
                  </div>
                </div>
                <div className="rounded-xl bg-primary/5 h-[300px] flex items-center justify-center border-2 border-primary/20">
                  <p className="text-muted-foreground">AI Analysis Dashboard Preview</p>
                </div>
              </div>

              {/* Performance Tracking Feature */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="rounded-xl bg-primary/5 h-[300px] flex items-center justify-center border-2 border-primary/20 order-2 md:order-1">
                  <p className="text-muted-foreground">Performance Metrics Preview</p>
                </div>
                <div className="space-y-6 order-1 md:order-2">
                  <div className="p-3 w-fit rounded-lg bg-primary/10">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Advanced Performance Tracking</h2>
                  <div className="space-y-4">
                    <FeaturePoint
                      title="Comprehensive Metrics"
                      description="Track win rate, profit factor, and more key indicators"
                    />
                    <FeaturePoint
                      title="Visual Analytics"
                      description="Beautiful charts and graphs for easy performance review"
                    />
                    <FeaturePoint
                      title="Progress Tracking"
                      description="Monitor your improvement over time with detailed statistics"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Trade Replay/Backtester Preview Section */}
            <div className="relative w-full rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 animate-pulse"></div>
              <Card className="relative p-8 border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <History className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Trade Replay & Backtesting</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Visualize and replay your trades in real-time. Test your strategies
                      with our advanced backtesting engine powered by TradingView
                      integration.
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/5 h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      Trade visualization preview
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Transform Your Trading?</h2>
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="px-8 py-6 text-lg transition-all hover:scale-105"
              >
                Get Started Now
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

const FeaturePoint = ({ title, description }: { title: string; description: string }) => (
  <div className="flex gap-3">
    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;
