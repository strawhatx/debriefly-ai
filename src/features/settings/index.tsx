import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProfileSection } from "./components/ProfileSection";
import { TradingAccountTable } from "./components/TradingAccountTable";
import { ImportHistoryTable } from "./components/ImportHistoryTable";
import { AccountDialog } from "./components/AccountDialog";
import { Subscriptions } from "./components/Subscriptions";
import { useAccountForm } from "./hooks/use-account-form";
import { useUserData } from "./hooks/use-user-data";
import { useProfile } from "@/hooks/use-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { loading: userDataLoading } = useUserData();
  const { openDialog } = useAccountForm();
  const { profile } = useProfile();

  if (userDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscription</TabsTrigger>
          <TabsTrigger value="accounts">Trading Accounts</TabsTrigger>
          <TabsTrigger value="imports">Import History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <Subscriptions userId={profile?.id || ""} email={profile?.email || ""} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Trading Accounts</CardTitle>
              <AccountDialog />
            </CardHeader>
            <CardContent>
              <TradingAccountTable onEdit={openDialog} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportHistoryTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
