
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProfileSection } from "./components/ProfileSection";
import { TradingAccountTable } from "./components/TradingAccountTable";
import { ImportHistoryTable } from "./components/ImportHistoryTable";
import { AccountDialog } from "./components/AccountDialog";
import { useAccountForm } from "./hooks/use-account-form";
import { useUserData } from "./hooks/use-user-data";
import { useImportHistorySection } from "./hooks/use-import-history-section";

export default function Settings() {
  const { tradingAccounts, loading: userDataLoading } = useUserData();
  const { openDialog } = useAccountForm();
  const { importHistory, loading: importLoading } = useImportHistorySection();

  if (userDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileSection />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Trading Accounts</CardTitle>
          <Button onClick={() => openDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </CardHeader>
        <CardContent>
          <TradingAccountTable onEdit={openDialog} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
        </CardHeader>
        <CardContent>
          {importLoading ? (
            <div>Loading import history...</div>
          ) : (
            <ImportHistoryTable importHistory={importHistory} />
          )}
        </CardContent>
      </Card>

      <AccountDialog />
    </div>
  );
}
