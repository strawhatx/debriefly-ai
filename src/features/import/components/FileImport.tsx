import { useState, useCallback } from "react";
import { BrokerInfo } from "./BrokerInfo";
import { AccountSelect } from "./AccountSelect";
import { FileUploader } from "./FileUploader";
import { Button } from "@/components/ui/button";
import { useFileImport } from "../hooks/use-file-import";
import useBrokerStore from "@/store/broker";
import { Upload } from "lucide-react";
import { useEventBus } from "@/store/event";

export const FileImport = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { selected: broker, update: setBroker } = useBrokerStore();
  const { isUploading, handleImport } = useFileImport(selectedAccount);
  const publish = useEventBus((state) => state.publish);

  const handleStartImport = useCallback(async () => {
    if (!selectedFile) return;

    try {
      const success = await handleImport(selectedFile);
      if (success) {
        setSelectedFile(null);
        setSelectedAccount("");
        setBroker(null); // Reset broker after import
        
        publish("review_trades_refresh", {}); // send the refresh event
      }
    } catch (error) {
      console.error("Import failed:", error);
    }
  }, [selectedFile, handleImport]);

  return (
    <div className="space-y-4">
      <BrokerInfo onBrokerSelect={setBroker} selectedBrokerId={broker?.id} />

      <div className="space-y-4">
        {broker?.id && (
          <AccountSelect
            brokerId={broker.id}
            selectedAccount={selectedAccount}
            onAccountSelected={setSelectedAccount}
          />
        )}

        {broker?.id && selectedAccount && (
          <FileUploader onFileSelect={setSelectedFile} />
        )}

        <Button
          onClick={handleStartImport}
          disabled={!broker?.id || !selectedAccount || isUploading || !selectedFile}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Start Import"}
        </Button>
      </div>

    </div>
  );
};
