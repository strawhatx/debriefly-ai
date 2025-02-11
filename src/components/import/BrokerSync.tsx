
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AccountSelect } from "./AccountSelect";
import { BrokerConnectionFields } from "./BrokerConnectionFields";

export const BrokerSync = () => {
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const { data: tradingAccounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["tradingAccounts"],
    queryFn: async () => {
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
        `);
      if (error) throw error;
      return data;
    },
  });

  const { data: selectedAccountData, isLoading: isLoadingSelectedAccount } = useQuery({
    queryKey: ["tradingAccount", selectedAccount],
    queryFn: async () => {
      if (!selectedAccount) return null;
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
        .eq("id", selectedAccount)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedAccount,
  });

  const { data: brokerFields, isLoading: isLoadingFields } = useQuery({
    queryKey: ["brokerFields", selectedAccountData?.broker?.id],
    queryFn: async () => {
      if (!selectedAccountData?.broker?.id) return [];
      const { data, error } = await supabase
        .from("broker_connection_fields")
        .select("*")
        .eq("broker_id", selectedAccountData.broker.id);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedAccountData?.broker?.id,
  });

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleConnect = async () => {
    if (!selectedAccount || !brokerFields) {
      toast({
        title: "Missing information",
        description: "Please select an account and fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if all required fields are filled
    const missingFields = brokerFields
      .filter(field => field.required && !formValues[field.field_name]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.map(f => f.display_name).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("trading_accounts")
        .update({
          broker_credentials: formValues,
          broker_connected: true
        })
        .eq("id", selectedAccount);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Broker connection successful",
      });

      // Create an import record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      await supabase
        .from("imports")
        .insert({
          user_id: user.id,
          trading_account_id: selectedAccount,
          import_type: 'broker_sync',
          status: 'pending'
        });

      // Reset form
      setFormValues({});
      setSelectedAccount("");
    } catch (error: any) {
      console.error('Error connecting broker:', error);
      toast({
        title: "Error",
        description: "Failed to connect broker",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <AccountSelect
        accounts={tradingAccounts}
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
        isLoading={isLoadingAccounts}
      />

      {selectedAccountData?.broker?.name && (
        <div className="p-4 border rounded-md bg-muted">
          <h3 className="font-medium mb-1">Selected Broker</h3>
          <p className="text-sm text-muted-foreground">
            {selectedAccountData.broker.name}
            {selectedAccountData.broker.description && (
              <span className="block mt-1 text-xs">
                {selectedAccountData.broker.description}
              </span>
            )}
          </p>
        </div>
      )}

      {brokerFields && (
        <BrokerConnectionFields
          brokerFields={brokerFields}
          formValues={formValues}
          onFieldChange={handleFieldChange}
        />
      )}

      <Button 
        onClick={handleConnect} 
        className="w-full"
        disabled={!selectedAccount || !brokerFields?.length}
      >
        Connect & Import
      </Button>
    </div>
  );
};
