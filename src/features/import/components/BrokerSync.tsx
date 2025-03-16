import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { AccountSelect } from "./AccountSelect";
import { BrokerConnectionFields } from "./BrokerConnectionFields";
import { BrokerInfo } from "./BrokerInfo";
import { useBrokerFields } from "../hooks/use-broker-fields";
import { useBrokerForm } from "../hooks/use-broker-form";
import { useBrokerConnection } from "../hooks/use-broker-connection";

export interface Broker {
  id: string;
  name: string;
  description?: string;
  asset_types: string[];
  created_at?: string;
  updated_at?: string;
  file_upload_enabled: boolean;
  broker_sync_enabled: boolean;
}

export const BrokerSync = () => {
  const { toast } = useToast();

  // State management
  const [selectedBroker, setSelectedBroker] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  // Fetch broker-specific fields
  const { brokerFields, isLoadingFields: isLoading } = useBrokerFields(selectedBroker);

  // Handle form state for broker fields
  const { formValues, handleFieldChange, resetForm } = useBrokerForm();

  // Handle broker connection logic
  const { connectBroker, isProcessing } = useBrokerConnection({
    selectedAccount,
    brokerFields,
    formValues,
    resetForm,
    toast,
    onSuccess: () => {
      setSelectedBroker("");
      setSelectedAccount("");
    },
  });

  return (
    <div className="space-y-6">
      {/* Broker Selection */}
      <BrokerInfo onBrokerSelect={setSelectedBroker} selectedBrokerId={selectedBroker} syncMode={true} />

      {/* Account Selection (only show when broker is selected) */}
      {selectedBroker && (
        <AccountSelect
          brokerId={selectedBroker}
          selectedAccount={selectedAccount}
          onAccountSelected={setSelectedAccount}
        />
      )}

      {/* Broker Fields Form (only show when broker and account are selected) */}
      {brokerFields.length > 0 && selectedAccount && (
        <BrokerConnectionFields brokerFields={brokerFields} formValues={formValues} onFieldChange={handleFieldChange} />
      )}

      {/* Connect & Import Button */}
      <Button
        onClick={connectBroker}
        className="w-full"
        disabled={!selectedBroker || !selectedAccount || !brokerFields.length || isProcessing}
      >
        {isProcessing ? "Connecting..." : "Connect & Import"}
      </Button>
    </div>
  );
};
