import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseBrokerConnectionProps {
    selectedAccount: string;
    brokerFields: any[];
    formValues: Record<string, string>;
    resetForm: () => void;
    toast: any;
    onSuccess: () => void;
}

export const useBrokerConnection = ({ selectedAccount, brokerFields, formValues, resetForm, toast, onSuccess }:
     UseBrokerConnectionProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const connectBroker = async () => {
        if (!selectedAccount || !brokerFields.length) {
            toast({
                title: "Missing Information",
                description: "Please select a broker and account, and fill all required fields",
                variant: "destructive",
            });
            return;
        }

        const missingFields = brokerFields.filter(
            (field) => field.required && !formValues[field.field_name]
        );

        if (missingFields.length > 0) {
            toast({
                title: "Missing Required Fields",
                description: `Please fill in: ${missingFields.map((f) => f.display_name).join(", ")}`,
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);

        try {
            const { error } = await supabase
                .from("trading_accounts")
                .update({
                    broker_credentials: formValues,
                    broker_connected: true,
                })
                .eq("id", selectedAccount);

            if (error) throw error;

            toast({variant:"success", title: "Success", description: "Broker connection successful" });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            await supabase.from("imports").insert({
                user_id: user.id,
                trading_account_id: selectedAccount,
                import_type: "broker_sync",
                status: "PENDING",
            });

            resetForm();
            onSuccess();
        } catch (error: any) {
            console.error("Error connecting broker:", error);
            toast({
                title: "Error",
                description: "Failed to connect broker",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return { connectBroker, isProcessing };
};
