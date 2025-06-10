import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TradingAccount } from "@/types/trading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AccountDialog } from "./AccountDialog";
import { useAccountForm } from "../hooks/use-account-form";

export const TradingAccountTable = () => {
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const {
    form,
    brokers,
    isLoading,
    editingAccount,
    isDialogOpen,
    setEditingAccount,
    onSubmit,
    openDialog,
  } = useAccountForm();

  const handleOpenDialog = (account?: TradingAccount) => {
    if (account) {
      // For editing an existing account
      setEditingAccount({
        ...account,
        isNew: false,
      });
    } else {
      // For creating a new account
      setEditingAccount({
        account_name: "",
        broker_id: "",
        market: null,
        account_balance: 0,
        isNew: true,
      });
    }
    openDialog(account);
  };

  const handleCloseDialog = () => {
    setEditingAccount(null);
  };

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    handleCloseDialog();
  };

  const { data: accounts, isLoading: isLoadingAccounts, error } = useQuery<TradingAccount[]>({
    queryKey: ["tradingAccounts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TradingAccount[];
    },
  });

  const deleteAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from("trading_accounts")
        .delete()
        .eq("id", accountId);

      if (error) throw error;

      toast.success("Trading account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tradingAccounts"] });
      setDeleteAccountId(null);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  const getBrokerName = (brokerId: string) => {
    const broker = brokers?.find(b => b.id === brokerId);
    return broker?.name || "Unknown Broker";
  };

  if (isLoadingAccounts) {
    return <div>Loading accounts...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Failed to load accounts. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Trading Accounts</h2>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {(!accounts || accounts.length === 0) ? (
        <div className="text-center py-8 text-muted-foreground">
          No trading accounts found. Create your first account to get started.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Broker</TableHead>
                <TableHead>Market</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    {account.account_name}
                  </TableCell>
                  <TableCell>{getBrokerName(account.broker_id)}</TableCell>
                  <TableCell>{account.market || "Not specified"}</TableCell>
                  <TableCell>${account.account_balance.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        account.broker_connected
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {account.broker_connected ? "Connected" : "Not Connected"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteAccountId(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={deleteAccountId !== null}
        onOpenChange={() => setDeleteAccountId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              trading account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAccountId && deleteAccount(deleteAccountId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AccountDialog
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingAccount={editingAccount}
        form={form}
        brokers={brokers}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </>
  );
};
