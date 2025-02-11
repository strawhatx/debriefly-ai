import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ImportDialog } from "@/components/settings/ImportDialog";
import { BrokerInfo } from "./BrokerInfo";
import { supabase } from "@/integrations/supabase/client";
import { Broker } from "./types";

interface FileImportProps {
  availableBrokers?: Broker[];
}

export const FileImport = ({ availableBrokers }: FileImportProps) => {
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
  const selectedBroker = availableBrokers?.find(b => b.id === selectedBrokerId);

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

  return (
    <div className="space-y-6">
      <BrokerInfo 
        broker={selectedBroker}
        availableBrokers={availableBrokers}
        onBrokerSelect={setSelectedBrokerId}
        selectedBrokerId={selectedBrokerId}
      />

      {selectedBrokerId && (
        <ImportDialog 
          tradingAccounts={tradingAccounts || []} 
          onImportComplete={() => {
            // Refresh trading accounts if needed
          }} 
        />
      )}
    </div>
  );
};
