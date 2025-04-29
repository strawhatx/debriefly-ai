import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MARKETS, TradingAccount } from "@/types/trading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const accountSchema = z.object({
    account_name: z.string().min(1, "Account name is required"),
    broker_id: z.string().min(1, "Broker is required"),
    market: z.enum(MARKETS),
    account_balance: z.number().min(0, "Balance must be a positive number"),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountDialogProps {
    data: TradingAccount | null;
    onSave: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
}

// Memoized form fields to prevent unnecessary re-renders
const AccountFormFields = React.memo(({ 
    control,
    brokers 
}: { 
    control: any;
    brokers: any[] 
}) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="account_name">Account Name</Label>
            <Controller
                name="account_name"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        id="account_name"
                        placeholder="Enter account name"
                    />
                )}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="broker_id">Broker</Label>
            <Controller
                name="broker_id"
                control={control}
                render={({ field }) => (
                    <select
                        {...field}
                        id="broker_id"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="" disabled>Select broker</option>
                        {brokers.map((broker) => (
                            <option key={broker.id} value={broker.id}>
                                {broker.name}
                            </option>
                        ))}
                    </select>
                )}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="market">Market</Label>
            <Controller
                name="market"
                control={control}
                render={({ field }) => (
                    <select
                        {...field}
                        id="market"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="" disabled>Select market</option>
                        {MARKETS.map((market) => (
                            <option key={market} value={market}>
                                {market}
                            </option>
                        ))}
                    </select>
                )}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="account_balance">Balance</Label>
            <Controller
                name="account_balance"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                    <Input
                        {...field}
                        id="account_balance"
                        type="number"
                        step="0.01"
                        min="0"
                        value={value || ''}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        placeholder="Enter balance"
                    />
                )}
            />
        </div>
    </div>
));

AccountFormFields.displayName = "AccountFormFields";

export const AccountDialog = React.memo(({ 
    data, 
    onSave, 
    open, 
    onOpenChange, 
    isCreating 
}: AccountDialogProps) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { data: brokers = [], isLoading: isLoadingBrokers } = useQuery({
        queryKey: ["availableBrokers"],
        queryFn: async () => {
            const { data, error } = await supabase.from("brokers").select("*");
            if (error) throw error;
            return data;
        },
    });

    const form = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            account_name: data?.account_name || "",
            broker_id: data?.broker_id || "",
            market: data?.market || "STOCKS",
            account_balance: data?.account_balance || 0,
        },
    });

    // Reset form when dialog opens/closes or data changes
    React.useEffect(() => {
        if (open) {
            form.reset({
                account_name: data?.account_name || "",
                broker_id: data?.broker_id || "",
                market: data?.market || "STOCKS",
                account_balance: data?.account_balance || 0,
            });
        }
    }, [open, data, form]);

    const handleSubmit = async (formData: AccountFormData) => {
        try {
            setIsSubmitting(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const payload = {
                ...formData,
                user_id: user.id,
            };

            if (isCreating) {
                const { error } = await supabase
                    .from('trading_accounts')
                    .insert([payload]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('trading_accounts')
                    .update(payload)
                    .eq('id', data?.id);
                if (error) throw error;
            }

            toast({
                variant:"success",
                title: "Success",
                description: `Trading account ${isCreating ? 'created' : 'updated'} successfully.`,
            });

            onSave();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Error saving trading account:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to save trading account.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isCreating ? 'Create Trading Account' : 'Edit Trading Account'}
                    </DialogTitle>
                    <DialogDescription>
                        Add or update trade accounts for users.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                    <AccountFormFields
                        control={form.control}
                        brokers={brokers}
                    />
                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting || isLoadingBrokers}
                    >
                        {isSubmitting 
                            ? 'Saving...' 
                            : isCreating 
                                ? 'Create Account' 
                                : 'Save Changes'
                        }
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
});

AccountDialog.displayName = "AccountDialog"; 