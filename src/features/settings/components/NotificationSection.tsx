
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NotificationSection = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    dailySession: true, weeklyPerformance: true, betaUpdates: false, psychologyTips: true
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
        <div className="space-y-6">
          {[
            {
              id: 'dailySession',
              title: 'Daily Session Summary',
              description: 'Receive a daily email with your trading performance and behavioral insights'
            },
            {
              id: 'weeklyPerformance',
              title: 'Weekly Performance Report',
              description: 'Get detailed weekly analysis of your trading patterns and strategy effectiveness'
            },
            {
              id: 'betaUpdates',
              title: 'Beta Features & Updates',
              description: 'Be the first to know about new features and improvements'
            },
            {
              id: 'psychologyTips',
              title: 'Psychology Insights',
              description: 'Receive personalized trading psychology tips based on your behavior patterns'
            }
          ].map((item) => (
            <div key={item.id} className="flex items-start justify-between">
              <div>
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({
                  ...prev,
                  [item.id]: !prev[item.id as keyof typeof notifications]
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${notifications[item.id as keyof typeof notifications]
                    ? 'bg-emerald-600'
                    : 'bg-gray-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${notifications[item.id as keyof typeof notifications]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
