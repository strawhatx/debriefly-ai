import { Label } from "@/components/ui/label";
import useBrokerStore from "@/store/broker";

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

interface BrokerInfoProps {
  onBrokerSelect: (brokerId: string) => void;
  selectedBrokerId: string;
  syncMode?: boolean;
}

export const BrokerInfo = ({ onBrokerSelect, selectedBrokerId, syncMode = false }: BrokerInfoProps) => {
  const { brokers } = useBrokerStore();

  const filteredBrokers = brokers.filter(broker =>
    syncMode ? broker.broker_sync_enabled : broker.file_upload_enabled
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="broker-select">Broker</Label>
      <select
        id="broker-select"
        className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        value={selectedBrokerId}
        onChange={(e) => onBrokerSelect(e.target.value)}
      >
        <option value="0">
          Select a broker
        </option>
        {filteredBrokers.map((broker) => (
          <option key={broker.id} value={broker.id}>
            {broker.name}
          </option>
        ))}
      </select>
    </div>
  );
};
