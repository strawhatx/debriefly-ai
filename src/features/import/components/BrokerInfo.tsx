import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export const BrokerInfo = ({onBrokerSelect, selectedBrokerId, syncMode = false}: BrokerInfoProps) => {
  const { brokers} = useBrokerStore();

  const filteredBrokers = brokers.filter(broker => syncMode ? broker.broker_sync_enabled : broker.file_upload_enabled);

  return (
    <div className="space-y-2">
      <Label>Broker</Label>
      <Select value={selectedBrokerId} onValueChange={onBrokerSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a broker" />
        </SelectTrigger>
        <SelectContent>
          {filteredBrokers.map((broker) => (
            <SelectItem key={broker.id} value={broker.id}>
              {broker.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
