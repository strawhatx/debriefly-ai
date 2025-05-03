import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, ChartBar, Upload } from "lucide-react";
import { ProfileSection } from "./components/ProfileSection";
import { Subscriptions } from "./components/Subscriptions";
import { ImportHistoryTable } from "./components/ImportHistoryTable";
import { TradingAccountTable } from "./components/TradingAccountTable";
import { TradingAccountList } from "./components/TradingAccountList";
import { ImportHistoryList } from "./components/ImportHistoryList";
import { useUserData } from "./hooks/use-user-data"; // New custom hook

const TAB_CONFIG = [
  { value: "profile", icon: User, label: "Profile", content: () => <ProfileSection /> },
  {
    value: "subscription",
    icon: CreditCard,
    label: "Subscription",
    content: ({ email, profileId }: { email: string | null; profileId: string | undefined }) => (
      <Subscriptions email={email} userId={profileId} />
    ),
  },
  {
    value: "trading-accounts",
    icon: ChartBar,
    label: "Trading Accounts",
    content: ({
      tradingAccounts,
      refresh,
    }: {
      tradingAccounts: any[];
      refresh: () => void;
    }) => (
      <>
        {/* Desktop-only Component */}
        <div className="hidden lg:block">
          <TradingAccountTable tradingAccounts={tradingAccounts} />
        </div>
        {/* Mobile-only Component */}
        <div className="block lg:hidden">
          <TradingAccountList accounts={tradingAccounts} refresh={refresh} />
        </div>
      </>
    ),
  },
  {
    value: "import-history",
    icon: Upload,
    label: "Import History",
    content: () => (
      <>
        {/* Desktop-only Component */}
        <div className="hidden lg:block">
          <ImportHistoryTable />
        </div>
        {/* Mobile-only Component */}
        <div className="block lg:hidden">
          <ImportHistoryList />
        </div>
      </>
    ),
  },
] as const;

export const Settings = () => {
  const { loading, email, tradingAccounts, profile, fetchUserData } = useUserData();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid h-full grid-cols-1 lg:grid-cols-4">
          {TAB_CONFIG.map(({ value, icon: Icon, label }) => (
            <TabsTrigger key={value} value={value} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_CONFIG.map(({ value, content }) => (
          <TabsContent key={value} value={value}>
            {typeof content === "function"
              ? content({
                  email,
                  profileId: profile?.id,
                  tradingAccounts,
                  refresh: fetchUserData,
                })
              : content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
