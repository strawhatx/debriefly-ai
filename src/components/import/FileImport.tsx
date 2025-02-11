
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

// Define broker types based on the enum in the database
const brokerTypes = [
  "Coinbase",
  "Webull",
  "Robinhood",
  "Tradovate",
  "Charles Schwab",
  "Oanda",
  "Forex.com",
  "TradeStation",
] as const;

export const FileImport = () => {
  const { toast } = useToast();
  const [selectedBroker, setSelectedBroker] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: tradingAccounts } = useQuery({
    queryKey: ["tradingAccounts", selectedBroker],
    queryFn: async () => {
      if (!selectedBroker) return [];
      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("broker", selectedBroker);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedBroker,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.type.includes('spreadsheetml')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedBroker || !selectedAccount || !selectedFile) {
      toast({
        title: "Missing information",
        description: "Please select a broker, account, and upload a file",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("imports")
        .insert({
          user_id: user.id,
          trading_account_id: selectedAccount,
          import_type: selectedFile.type.includes('spreadsheetml') ? 'excel' : 'csv',
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Import started",
        description: "Your file is being processed",
      });

      // Reset form
      setSelectedFile(null);
      setSelectedAccount("");
      setSelectedBroker("");
    } catch (error: any) {
      console.error('Error starting import:', error);
      toast({
        title: "Error",
        description: "Failed to start import",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="broker">Broker</Label>
        <Select value={selectedBroker} onValueChange={setSelectedBroker}>
          <SelectTrigger>
            <SelectValue placeholder="Select a broker" />
          </SelectTrigger>
          <SelectContent>
            {brokerTypes.map((broker) => (
              <SelectItem key={broker} value={broker}>
                {broker}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="account">Trading Account</Label>
        <Select 
          value={selectedAccount} 
          onValueChange={setSelectedAccount}
          disabled={!selectedBroker}
        >
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

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          disabled={!selectedAccount}
        />
        <p className="text-sm text-muted-foreground">
          Supported formats: CSV, Excel
        </p>
      </div>

      <Button onClick={handleImport} className="w-full">
        Start Import
      </Button>
    </div>
  );
};
