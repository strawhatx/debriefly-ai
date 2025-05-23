"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TradingAccount } from "@/types/trading";
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AccountDialog } from "./AccountDialog"

interface TradingAccountListProps {
    accounts: TradingAccount[];
    refresh?: () => void;
}

// Memoized account item component to prevent unnecessary re-renders
const AccountItem = React.memo(({ 
    account, 
    onEdit 
}: { 
    account: TradingAccount; 
    onEdit: (account: TradingAccount) => void;
}) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-700 last:border-0">
        <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-xs font-bold">{account.account_name.substring(0, 2)}</span>
            </div>
            <div>
                <div className="font-medium text-sm">{account.account_name}</div>
                <div className="flex gap-1 text-xs italic text-gray-400">
                    <span>{account.broker?.name}</span>
                    •
                    <span>{account.market}</span>
                    •
                    <span>
                        {new Date(account.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(account)}
            className="border-gray-600"
        >
            Edit
        </Button>
    </div>
));

AccountItem.displayName = "AccountItem";

// Empty state component
const EmptyState = React.memo(() => (
    <div className="text-center py-8 text-gray-400">
        No trading accounts found.
    </div>
));

EmptyState.displayName = "EmptyState";

export const TradingAccountList = React.memo(({ accounts, refresh }: TradingAccountListProps) => {
    const [selectedAccount, setSelectedAccount] = React.useState<TradingAccount | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isCreating, setIsCreating] = React.useState(false);

    // Memoize open dialog handler
    const handleOpenDialog = React.useCallback((account: TradingAccount) => {
        setSelectedAccount(account);
        setIsCreating(false);
        setIsDialogOpen(true);
    }, []);

    // Memoize create dialog handler
    const handleCreateDialog = React.useCallback(() => {
        setSelectedAccount(null);
        setIsCreating(true);
        setIsDialogOpen(true);
    }, []);

    // Memoize close dialog handler
    const handleCloseDialog = React.useCallback(() => {
        setIsDialogOpen(false);
        setSelectedAccount(null);
        setIsCreating(false);
    }, []);

    // Memoize save handler
    const handleSave = React.useCallback(() => {
        if (refresh) refresh();
        handleCloseDialog();
    }, [refresh, handleCloseDialog]);

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Accounts</CardTitle>
                    <Button
                        onClick={handleCreateDialog}
                        className="flex text-sm items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Account
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {accounts.length === 0 ? (
                    <EmptyState />
                ) : (
                    accounts.map((account) => (
                        <AccountItem
                            key={account.id}
                            account={account}
                            onEdit={handleOpenDialog}
                        />
                    ))
                )}
            </CardContent>

            <AccountDialog
                data={selectedAccount}
                onSave={handleSave}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                isCreating={isCreating}
            />
        </Card>
    );
});

TradingAccountList.displayName = "TradeList";

