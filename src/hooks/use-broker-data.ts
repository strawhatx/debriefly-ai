
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TradingAccount, BrokerField } from "../types/types";
import { useToast } from "@/components/ui/use-toast";

export const useBrokerData = (initialBrokerId: string = "") => {
  const { toast } = useToast();
  const [selectedBroker, setSelectedBroker] = useState<string>(initialBrokerId);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const { data: tradingAccounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["tradingAccounts", selectedBroker],
    queryFn: async () => {
      if (!selectedBroker) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your trading accounts",
          variant: "destructive",
        });
        return [];
      }

      const { data, error } = await supabase
        .from("trading_accounts")
        .select(`
          id,
          account_name,
          broker:brokers (
            id,
            name,
            description
          )
        `)
        .eq("broker_id", selectedBroker)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching trading accounts:", error);
        toast({
          title: "Error",
          description: "Failed to fetch trading accounts",
          variant: "destructive",
        });
        return [];
      }

      const transformedAccounts: TradingAccount[] = (data || []).map(account => ({
        id: account.id,
        account_name: account.account_name,
        broker: account.broker.length > 0
          ? account.broker[0] // Extract the first broker from the array
          : { id: "", name: "Unknown", description: "" } // Default fallback
      }));

      return transformedAccounts;
    },
    enabled: !!selectedBroker,
  });

  const { data: brokerFields, isLoading: isLoadingFields } = useQuery({
    queryKey: ["brokerFields", selectedBroker],
    queryFn: async () => {
      if (!selectedBroker) return [];
      const { data, error } = await supabase
        .from("broker_connection_fields")
        .select("*")
        .eq("broker_id", selectedBroker);

      if (error) {
        console.error("Error fetching broker fields:", error);
        toast({
          title: "Error",
          description: "Failed to fetch broker connection fields",
          variant: "destructive",
        });
        return [];
      }

      return data as BrokerField[];
    },
    enabled: !!selectedBroker,
  });

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return {
    selectedBroker,
    setSelectedBroker,
    selectedAccount,
    setSelectedAccount,
    formValues,
    setFormValues,
    tradingAccounts,
    isLoadingAccounts,
    brokerFields,
    isLoadingFields,
    handleFieldChange
  };
};
