
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WinLossInsights from "@/components/dashboard/WinLossInsights";
import { Loader2 } from "lucide-react";

const Insights = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");

  const { data: insights, isLoading } = useQuery({
    queryKey: ["insights", selectedPeriod],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("insights")
        .select(`
          *,
          positions (
            symbol,
            quantity,
            fill_price,
            pnl,
            entry_date,
            closing_date
          )
        `)
        .eq("user_id", user.id)
        .eq("type", "debrief")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold">Trading Insights</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Behavior Patterns</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <WinLossInsights />
          
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Trading Sessions</h2>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : insights && insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight) => (
                  <Card key={insight.id} className="p-4 hover:bg-accent transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          Session on {new Date(insight.session_date).toLocaleDateString()}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {JSON.parse(insight.content).summary}
                        </p>
                      </div>
                      {insight.positions && (
                        <div className="text-right">
                          <p className={`font-semibold ${insight.positions.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {insight.positions.pnl >= 0 ? '+' : ''}{insight.positions.pnl.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {insight.positions.symbol}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No insights available yet. Complete some trades to generate insights.
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Behavioral Patterns</h2>
            <p className="text-muted-foreground">
              AI-powered analysis of your trading patterns will appear here as you complete more trades.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Trading Suggestions</h2>
            <p className="text-muted-foreground">
              Personalized suggestions based on your trading history will appear here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Insights;
