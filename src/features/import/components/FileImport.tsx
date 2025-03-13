
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Broker } from "@/types/broker";
import { BrokerInfo } from "./BrokerInfo";
import { AccountSelect } from "./AccountSelect";
import { FileUploader } from "./FileUploader";
import { ImportButton } from "./ImportButton";
import { useFileImport } from "@/hooks/use-file-import"
import useBrokerStore from "@/store/broker";

interface FileImportProps {
  availableBrokers?: Broker[];
}

export const FileImport = ({ availableBrokers = [] }: FileImportProps) => {
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const setBroker = useBrokerStore((state) => state.update);

  const { isUploading, handleImport } = useFileImport(selectedAccount);

  const fetchAccounts = async () => {
    if (!selectedBrokerId) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("trading_accounts").select("*").eq("broker_id", selectedBrokerId).eq("user_id", user.id);

    if (error) throw error;
    setAccounts(data);
  }

  const handleStartImport = async () => {
    const success = await handleImport(selectedFile);
    if (success) {
      setSelectedFile(null);
      setSelectedAccount("");
    }
  };

  const handleBrokerSelect = (brokerId: string) => {
    setSelectedBrokerId(brokerId);

    var result = availableBrokers?.find(b => b.id === brokerId)

    setBroker(result)
  };

  useEffect(() => {

    fetchAccounts();
  }, [selectedBrokerId])

  return (
    <div className="space-y-6">
      <BrokerInfo
        availableBrokers={availableBrokers}
        onBrokerSelect={handleBrokerSelect}
        selectedBrokerId={selectedBrokerId}
      />

      {selectedBrokerId && (
        <div className="space-y-6">
          <AccountSelect
            accounts={accounts}
             refreshAccounts={fetchAccounts}
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
