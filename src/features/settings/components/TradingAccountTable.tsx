import { Button } from "@/components/ui/button";
import { Check, Pencil, Plus, X } from "lucide-react";
import { EmptyTradingAccounts } from "./EmptyTradingAccounts";
import { TradingAccount } from "@/types/trading";
import { useTradingAccounts } from "../hooks/use-trading-accounts";
import { MARKETS, EditingAccount } from "@/types/trading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { memo, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface TradingAccountTableProps {
    tradingAccounts: TradingAccount[];
}

interface TradingAccountRowProps {
    account: TradingAccount;
    onEdit: (account: TradingAccount) => void;
    onDelete: (id: string) => void;
}

interface TradingAccountFormProps {
    editingAccount: EditingAccount;
    onUpdate: (account: EditingAccount) => void;
    onSave: () => void;
    onCancel: () => void;
}

// Memoized form component to prevent unnecessary re-renders
const TradingAccountForm = memo(({ editingAccount, onUpdate, onSave, onCancel }: TradingAccountFormProps) => {
    const { data: brokers = [], isLoading: isLoadingBrokers } = useQuery({
        queryKey: ["availableBrokers"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("brokers")
                .select("*");
            if (error) throw error;
            return data;
        },
    });

    const handleInputChange = useCallback((field: keyof EditingAccount, value: string | number) => {
        onUpdate({ ...editingAccount, [field]: value });
    }, [editingAccount, onUpdate]);

    if (isLoadingBrokers) {
        return <tr><td colSpan={5} className="text-center py-4">Loading brokers...</td></tr>;
    }

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-700/50">
            <td className="px-6 py-4">
                <Input
                    value={editingAccount.account_name || ''}
                    onChange={(e) => handleInputChange('account_name', e.target.value)}
                    placeholder="Enter account name"
                    aria-label="Account name"
                />
            </td>
            <td className="px-6 py-4">
                <Select
                    value={editingAccount.broker_id}
                    onValueChange={(value) => handleInputChange('broker_id', value)}
                >
                    <SelectTrigger aria-label="Select broker">
                        <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent>
                        {brokers?.map((broker) => (
                            <SelectItem key={broker.id} value={broker.id}>{broker.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>
            <td className="px-6 py-4">
                <Select
                    value={editingAccount.market}
                    onValueChange={(value) => handleInputChange('market', value as typeof MARKETS[number])}
                >
                    <SelectTrigger aria-label="Select market">
                        <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                        {MARKETS.map((market) => (
                            <SelectItem key={market} value={market}>
                                {market}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>
            <td className="px-6 py-4">
                <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingAccount.account_balance || ''}
                    onChange={(e) => handleInputChange('account_balance', parseFloat(e.target.value))}
                    placeholder="Enter balance"
                    aria-label="Account balance"
                />
            </td>
            <td className="text-right space-x-2 px-6 py-4">
                <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={onSave}
                    aria-label="Save account"
                >
                    <Check className="h-4 w-4" />
                </Button>
                <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={onCancel}
                    aria-label="Cancel editing"
                >
                    <X className="h-4 w-4" />
                </Button>
            </td>
        </tr>
    );
});

TradingAccountForm.displayName = 'TradingAccountForm';

// Memoized row component to prevent unnecessary re-renders
const TradingAccountRow = memo(({ account, onEdit, onDelete }: TradingAccountRowProps) => {
    const handleEdit = useCallback(() => onEdit(account), [account, onEdit]);
    const handleDelete = useCallback(() => onDelete(account.id), [account.id, onDelete]);

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-700/50">
            <td className="px-6 py-4">{account.account_name}</td>
            <td className="px-6 py-4">{account.broker?.name || 'N/A'}</td>
            <td className="px-6 py-4">{account.market}</td>
            <td className="px-6 py-4">
                ${account.account_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td className="text-right space-x-2 px-6 py-4">
                <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={handleEdit}
                    aria-label="Edit account"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={handleDelete}
                    aria-label="Delete account"
                >
                    <X className="h-4 w-4" />
                </Button>
            </td>
        </tr>
    );
});

TradingAccountRow.displayName = 'TradingAccountRow';

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-red-500">Something went wrong:</h2>
        <p className="text-sm text-gray-400">{error.message}</p>
        <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
    </div>
);

export const TradingAccountTable = ({ tradingAccounts }: TradingAccountTableProps) => {
    const {
        editingAccount,
        setEditingAccount,
        handleStartEdit,
        handleStartCreate,
        handleCancelEdit,
        handleSave,
        handleDelete,
    } = useTradingAccounts(tradingAccounts);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <section className="bg-gray-800 mt-4 rounded-xl border border-gray-700">
                <div className="overflow-x-auto">
                    <div className="p-6 flex justify-between items-center">
                        <h5 className="text-lg font-bold">Trading Accounts</h5>
                        <Button 
                            onClick={handleStartCreate} 
                            className="flex items-center gap-2"
                            aria-label="Add new trading account"
                        >
                            <Plus className="w-4 h-4" />
                            Add Account
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full" role="grid">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th scope="col" className="px-6 py-3 text-left">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left">Broker</th>
                                    <th scope="col" className="px-6 py-3 text-left">Market</th>
                                    <th scope="col" className="px-6 py-3 text-left">Balance</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editingAccount?.isNew && (
                                    <TradingAccountForm
                                        editingAccount={editingAccount}
                                        onUpdate={setEditingAccount}
                                        onSave={handleSave}
                                        onCancel={handleCancelEdit}
                                    />
                                )}

                                {tradingAccounts.map((account) => (
                                    <ErrorBoundary key={account.id} FallbackComponent={ErrorFallback}>
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
                                    </ErrorBoundary>
                                ))}
                                
                                {tradingAccounts.length === 0 && !editingAccount?.isNew && (
                                    <EmptyTradingAccounts />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </ErrorBoundary>
    );
};
