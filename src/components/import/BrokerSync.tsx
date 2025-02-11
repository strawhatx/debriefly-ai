
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

type BrokerField = {
  id: string;
  broker: string;
  field_name: string;
  field_type: 'text' | 'password' | 'api_key';
  required: boolean;
  display_name: string;
  description: string | null;
};

export const BrokerSync = () => {
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const { data: tradingAccounts } = useQuery({
    queryKey: ["tradingAccounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: selectedAccountData } = useQuery({
    queryKey: ["tradingAccount", selectedAccount],
    queryFn: async () => {
      if (!selectedAccount) return null;
      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("id", selectedAccount)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedAccount,
  });

  const { data: brokerFields } = useQuery({
    queryKey: ["brokerFields", selectedAccountData?.broker],
    queryFn: async () => {
      if (!selectedAccountData?.broker) return [];
      const { data, error } = await supabase
        .from("broker_connection_fields")
        .select("*")
        .eq("broker", selectedAccountData.broker);
      if (error) throw error;
      return data as BrokerField[];
    },
    enabled: !!selectedAccountData?.broker,
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
      <div className="space-y-2">
        <Label htmlFor="account">Trading Account</Label>
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger>
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            {tradingAccounts?.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.account_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {brokerFields && brokerFields.length > 0 && (
        <div className="space-y-4">
          {brokerFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.field_name}>
                {field.display_name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={field.field_name}
                type={field.field_type === 'password' ? 'password' : 'text'}
                value={formValues[field.field_name] || ''}
                onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
                placeholder={field.description || ''}
              />
            </div>
          ))}
        </div>
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
