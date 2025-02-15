
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Broker } from "./types";
import { BrokerInfo } from "./BrokerInfo";
import { AccountSelect } from "./AccountSelect";
import { FileUploader } from "./FileUploader";
import { ImportButton } from "./ImportButton";
import { useFileImport } from "./hooks/useFileImport";

interface FileImportProps {
  availableBrokers?: Broker[];
}

export const FileImport = ({ availableBrokers = [] }: FileImportProps) => {
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const selectedBroker = availableBrokers?.find(b => b.id === selectedBrokerId);
  const { isUploading, handleImport } = useFileImport(selectedAccount);

  const { data: tradingAccounts } = useQuery({
    queryKey: ["tradingAccounts", selectedBrokerId],
    queryFn: async () => {
      if (!selectedBrokerId) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("broker_id", selectedBrokerId)
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedBrokerId,
  });

  const handleStartImport = async () => {
    const success = await handleImport(selectedFile);
    if (success) {
      setSelectedFile(null);
      setSelectedAccount("");
    }
  };

  return (
    <div className="space-y-6">
      <BrokerInfo 
        broker={selectedBroker}
        availableBrokers={availableBrokers}
        onBrokerSelect={setSelectedBrokerId}
        selectedBrokerId={selectedBrokerId}
      />

      {selectedBrokerId && (
        <div className="space-y-6">
          <AccountSelect
            accounts={tradingAccounts}
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccount}
          />
          
          <FileUploader onFileSelect={setSelectedFile} />

          <ImportButton 
            onClick={handleStartImport}
            isUploading={isUploading}
          />
        </div>
      )}
    </div>
  );
};
