
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, LineChart } from "lucide-react";

const statsData = [
  {
    title: "Total Balance",
    value: "$24,563",
    icon: DollarSign,
    trend: "+5.2%",
    trendUp: true,
  },
  {
    title: "Profit Factor",
    value: "2.4",
    icon: LineChart,
    trend: "+0.3",
    trendUp: true,
  },
  {
    title: "Win Rate",
    value: "68%",
    icon: TrendingUp,
    trend: "+2.1%",
    trendUp: true,
  },
  {
    title: "Monthly P/L",
    value: "-$1,204",
    icon: TrendingDown,
    trend: "-2.3%",
    trendUp: false,
  },
];

const TradingAccountsOverview = () => {
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

export default TradingAccountsOverview;
