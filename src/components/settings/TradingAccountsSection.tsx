
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { TradingAccountForm } from "./TradingAccountForm";
import { TradingAccountRow } from "./TradingAccountRow";
import { TradingAccountsHeader } from "./TradingAccountsHeader";
import { EmptyTradingAccounts } from "./EmptyTradingAccounts";
import { TradingAccount } from "@/types/trading";
import { useTradingAccounts } from "@/hooks/useTradingAccounts";

interface TradingAccountsSectionProps {
  tradingAccounts: TradingAccount[];
  setTradingAccounts: (accounts: TradingAccount[]) => void;
}

export const TradingAccountsSection = ({ 
  tradingAccounts, 
  setTradingAccounts 
}: TradingAccountsSectionProps) => {
  const {
    editingAccount,
    setEditingAccount,
    handleStartEdit,
    handleStartCreate,
    handleCancelEdit,
    handleSave,
    handleDelete,
  } = useTradingAccounts(tradingAccounts, setTradingAccounts);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Trading Accounts</h3>
          <Button onClick={handleStartCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Account
          </Button>
        </div>

        <Table>
          <TradingAccountsHeader />
          <TableBody>
            {editingAccount?.isNew && (
              <TableRow>
                <TradingAccountForm
                  editingAccount={editingAccount}
                  onUpdate={setEditingAccount}
                  onSave={handleSave}
                  onCancel={handleCancelEdit}
                />
              </TableRow>
            )}
            {tradingAccounts.map((account) => (
              <TableRow key={account.id}>
                {editingAccount?.id === account.id ? (
                  <TradingAccountForm
                    editingAccount={editingAccount}
                    onUpdate={setEditingAccount}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <TradingAccountRow
                    account={account}
                    onEdit={handleStartEdit}
                    onDelete={handleDelete}
                  />
                )}
              </TableRow>
            ))}
            {tradingAccounts.length === 0 && !editingAccount?.isNew && (
              <EmptyTradingAccounts />
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
