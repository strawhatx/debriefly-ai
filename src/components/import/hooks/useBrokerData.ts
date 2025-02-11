
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TradingAccount, BrokerField } from "../types";

export const useBrokerData = (selectedBroker: string) => {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const { data: tradingAccounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["tradingAccounts", selectedBroker],
    queryFn: async () => {
      if (!selectedBroker) return [];
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
        .eq("broker_id", selectedBroker);
      if (error) throw error;
      return data as TradingAccount[];
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
      if (error) throw error;
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
