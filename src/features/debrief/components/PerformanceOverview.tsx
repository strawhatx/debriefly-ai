import { Card } from "@/components/ui/card";
import { usePerformanceOverview } from "../hooks/use-performance-overview";
import type { StatCard } from "../hooks/use-performance-overview"; // Add this type to the hook file

interface StatCardProps extends StatCard {
  className?: string;
}

interface Position {
  risk: number;
  reward: number;
  outcome: 'WIN' | 'LOSS';
}

const StatCardComponent = ({ title, value, icon: Icon, trend, trendUp, className }: StatCardProps) => (
  <Card className={`p-6 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`rounded-full p-2 ${trendUp ? 'bg-green-100/10' : 'bg-red-100/10'}`}>
        <Icon className={`size-4 ${trendUp ? 'text-green-600' : 'text-red-600'}`} />
      </div>
    </div>
    <div className="mt-2">
      <span className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trend}
      </span>
      <span className="text-sm text-muted-foreground"> vs last month</span>
    </div>
  </Card>
);

const LoadingSkeleton = () => (
  <>
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-6 animate-pulse">
        <div className="h-20 bg-muted/20 rounded-md" />
      </Card>
    ))}
  </>
);

export const PerformanceOverview = ({ positions }: { positions: Position[] | null }) => {
  const { statsCards, isLoading, error } = usePerformanceOverview(positions);

  if (error) {
    return (
      <Card className="p-6 border-red-600/20 bg-red-100/10">
        <p className="text-red-600">Error loading performance data: {error.message}</p>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statsCards.map((card) => (
        <StatCardComponent
          key={card.title}
          {...card}
        />
      ))}
    </div>
  );
};
