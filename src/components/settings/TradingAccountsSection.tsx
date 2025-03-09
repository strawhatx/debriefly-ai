
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search, SortAsc } from "lucide-react";
import { TradingAccountForm } from "./TradingAccountForm";
import { TradingAccountRow } from "./TradingAccountRow";
import { EmptyTradingAccounts } from "./EmptyTradingAccounts";
import { TradingAccount } from "@/types/trading";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { Input } from "../ui/input";

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
    <section className="bg-gray-800 rounded-xl border border-gray-700" >
      <div className="overflow-x-auto">
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold">Trading Accounts</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search accounts..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <Button className="flex items-center gap-2 px-4 py-2 text-foreground bg-gray-700 hover:bg-gray-600 rounded-lg">
              <Filter className="w-4 h-4" />
              Filter
            </Button>

            <Button onClick={handleStartCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Account
            </Button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Broker</th>
              <th className="px-6 py-3 text-left">Profit Calc.</th>
              <th className="px-6 py-3 text-left">Balance</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {editingAccount?.isNew && (
              <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                <TradingAccountForm
                  editingAccount={editingAccount}
                  onUpdate={setEditingAccount}
                  onSave={handleSave}
                  onCancel={handleCancelEdit}
                />
              </tr>
            )}

            {tradingAccounts.map((account) => (
              <tr key={account.id} className="border-b border-gray-700 hover:bg-gray-700/50">
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
              </tr>
            ))}
            {tradingAccounts.length === 0 && !editingAccount?.isNew && (
              <EmptyTradingAccounts />
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
