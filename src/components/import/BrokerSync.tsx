
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AccountSelect } from "./AccountSelect";
import { BrokerConnectionFields } from "./BrokerConnectionFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BrokerInfo } from "./BrokerInfo";
import { useBrokerData } from "./hooks/useBrokerData";
import { BrokerSyncProps } from "./types";

export const BrokerSync = ({ availableBrokers }: BrokerSyncProps) => {
  const { toast } = useToast();
  const [selectedBroker, setSelectedBroker] = useState<string>("");
  
  const {
    selectedAccount,
    setSelectedAccount,
    formValues,
    setFormValues,
    tradingAccounts,
    isLoadingAccounts,
    brokerFields,
    isLoadingFields,
    handleFieldChange
  } = useBrokerData(selectedBroker);

  const selectedBrokerData = availableBrokers?.find(b => b.id === selectedBroker);

  const handleConnect = async () => {
    if (!selectedAccount || !brokerFields) {
      toast({
        title: "Missing information",
        description: "Please select a broker and account, and fill all required fields",
        variant: "destructive",
      });
      return;
    }

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

      {selectedBrokerData && <BrokerInfo broker={selectedBrokerData} />}

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
