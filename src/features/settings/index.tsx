import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { User, CreditCard, ChartBar, Upload, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ProfileSection } from "./components/ProfileSection";
import { NotificationSection } from "./components/NotificationSection";
import { SubscriptionSection } from "./components/SubscriptionSection";
import { TradingAccountsSection } from "./components/TradingAccountsSection";
import { ImportHistorySection } from "./components/ImportHistorySection";
import { useProfileSection } from "./hooks/use-profile-section";

const TAB_CONFIG = [
  { value: 'profile', icon: User, label: 'Profile' },
  { value: 'security', icon: Bell, label: 'Notifications' },
  { value: 'subscription', icon: CreditCard, label: 'Subscription' },
  { value: 'trading-accounts', icon: ChartBar, label: 'Trading Accounts' },
  { value: 'import-history', icon: Upload, label: 'Import History' },
] as const;

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [tradingAccounts, setTradingAccounts] = useState<any[]>([]);

  const { profile } = useProfileSection();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        setEmail(user.email);

        const { data: tradingAccountsData, error } = await supabase
          .from('trading_accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setTradingAccounts(tradingAccountsData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          {TAB_CONFIG.map(({ value, icon: Icon, label }) => (
            <TabsTrigger 
              key={value}
              value={value} 
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="security">
          <NotificationSection />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionSection email={email} userId={profile.id} />
        </TabsContent>

        <TabsContent value="trading-accounts">
          <TradingAccountsSection tradingAccounts={tradingAccounts} />
        </TabsContent>

        <TabsContent value="import-history">
          <ImportHistorySection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
