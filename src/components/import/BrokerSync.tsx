
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AccountSelect } from "./AccountSelect";
import { BrokerConnectionFields } from "./BrokerConnectionFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Broker {
  id: string;
  name: string;
  description?: string;
  asset_types: string[];
}

interface BrokerSyncProps {
  availableBrokers?: Broker[];
}

export const BrokerSync = ({ availableBrokers }: BrokerSyncProps) => {
  const { toast } = useToast();
  const [selectedBroker, setSelectedBroker] = useState<string>("");
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
      return data;
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
      return data;
    },
    enabled: !!selectedBroker,
  });

  const selectedBrokerData = availableBrokers?.find(b => b.id === selectedBroker);

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
        description: "Please select a broker and account, and fill all required fields",
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
      setSelectedBroker("");
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
      <div className="space-y-2">
        <Label>Broker</Label>
        <Select value={selectedBroker} onValueChange={setSelectedBroker}>
          <SelectTrigger>
            <SelectValue placeholder="Select a broker" />
          </SelectTrigger>
          <SelectContent>
            {availableBrokers?.map((broker) => (
              <SelectItem key={broker.id} value={broker.id}>
                {broker.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedBrokerData && (
        <div className="p-4 border rounded-md bg-muted">
          <h3 className="font-medium mb-1">Selected Broker</h3>
          <p className="text-sm text-muted-foreground">
            {selectedBrokerData.name}
            {selectedBrokerData.description && (
              <span className="block mt-1 text-xs">
                {selectedBrokerData.description}
              </span>
            )}
          </p>
          {selectedBrokerData.asset_types?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Supported assets: {selectedBrokerData.asset_types.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {selectedBroker && (
        <AccountSelect
          accounts={tradingAccounts}
          selectedAccount={selectedAccount}
          onAccountChange={setSelectedAccount}
          isLoading={isLoadingAccounts}
        />
      )}

      {brokerFields && selectedAccount && (
        <BrokerConnectionFields
          brokerFields={brokerFields}
          formValues={formValues}
          onFieldChange={handleFieldChange}
        />
      )}

      <Button 
        onClick={handleConnect} 
        className="w-full"
        disabled={!selectedBroker || !selectedAccount || !brokerFields?.length}
      >
        Connect & Import
      </Button>
    </div>
  );
};
