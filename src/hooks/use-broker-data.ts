import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TradingAccount, BrokerField } from "../types/broker";
import { useToast } from "@/components/ui/use-toast";

const fetchTradingAccounts = async (selectedBroker: string, toast: any) => {
  if (!selectedBroker) return [];

  try {
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
        broker:brokers (id, name, description)
      `)
      .eq("broker_id", selectedBroker)
      .eq("user_id", user.id);

    if (error) throw error;

    return data?.map(account => ({
      id: account.id,
      account_name: account.account_name,
      broker: account.broker?.[0] || { id: "", name: "Unknown", description: "" }
    })) as TradingAccount[];
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch trading accounts",
      variant: "destructive",
    });
    return [];
  }
};

const fetchBrokerFields = async (selectedBroker: string, toast: any) => {
  if (!selectedBroker) return [];

  try {
    const { data, error } = await supabase
      .from("broker_connection_fields")
      .select("*")
      .eq("broker_id", selectedBroker);

    if (error) throw error;
    return data as BrokerField[];
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch broker connection fields",
      variant: "destructive",
    });
    return [];
  }
};

export const useBrokerData = (initialBrokerId: string = "") => {
  const { toast } = useToast();
  const [selectedBroker, setSelectedBroker] = useState<string>(initialBrokerId);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const { data: tradingAccounts = [], isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["tradingAccounts", selectedBroker],
    queryFn: () => fetchTradingAccounts(selectedBroker, toast),
    enabled: !!selectedBroker
  });

  const { data: brokerFields = [], isLoading: isLoadingFields } = useQuery({
    queryKey: ["brokerFields", selectedBroker],
    queryFn: () => fetchBrokerFields(selectedBroker, toast),
    enabled: !!selectedBroker
  });

  const handleFieldChange = (fieldName: string, value: string) => setFormValues(prev => ({ ...prev, [fieldName]: value }));


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
