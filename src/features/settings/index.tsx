
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  CreditCard,
  ChartBar,
  Upload,
  Bell,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ProfileSection } from "./components/ProfileSection";
import { NotificationSection } from "./components/NotificationSection";
import { SubscriptionSection } from "./components/SubscriptionSection";
import { TradingAccountsSection } from "./components/TradingAccountsSection";
import { ImportHistorySection } from "./components/ImportHistorySection";
import { SignOutButton } from "./components/SignOutButton";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tradingAccounts, setTradingAccounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        //set email
        setEmail(user.email);

        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles').select('*').eq('id', user.id).maybeSingle();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch trading accounts
        const { data: tradingAccountsData } = await supabase.from('trading_accounts')
          .select('*').eq('user_id', user.id).order('created_at', { ascending: false });

        if (tradingAccountsData) {
          setTradingAccounts(tradingAccountsData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-8">Settings</h2>
        <SignOutButton />
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="trading-accounts" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            Trading Accounts
          </TabsTrigger>
          <TabsTrigger value="import-history" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection profile={profile} setProfile={setProfile} />
        </TabsContent>

        <TabsContent value="security">
          <NotificationSection />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionSection email={email} userId={profile.id} />
        </TabsContent>

        <TabsContent value="trading-accounts">
          <TradingAccountsSection
            tradingAccounts={tradingAccounts}
            setTradingAccounts={setTradingAccounts}
          />
        </TabsContent>

        <TabsContent value="import-history">
          <ImportHistorySection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
