
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, LineChart, Calculator, Radical } from "lucide-react";

const statsData = [
  {
    title: "Total Trades",
    value: "12",
    icon: Calculator,
    trend: "+5.2%",
    trendUp: true,
  },
  {
    title: "Profit Factor",
    value: "2.4",
    icon: Radical,
    trend: "+0.3",
    trendUp: true,
  },
  {
    title: "Average R:R Ratio",
    value: "1:2.5",
    icon: TrendingUp,
    trend: "+1%",
    trendUp: true,
  },
];

export const DebriefOverview = () => {
  return (
    <>
      {statsData.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`rounded-full p-2 ${stat.trendUp ? 'bg-green-100' : 'bg-red-100'}`}>
              <stat.icon className={`w-4 h-4 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {stat.trend}
            </span>
            <span className="text-sm text-muted-foreground"> vs last month</span>
          </div>
        </Card>
      ))}
    </>
  );
};
