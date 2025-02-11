
import { Brain, BarChart3 } from "lucide-react";
import FeaturePoint from "./FeaturePoint";

const DetailedFeatures = () => (
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
);

export default DetailedFeatures;
