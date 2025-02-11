
import { Broker } from "./types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BrokerInfoProps {
  broker?: Broker;
  availableBrokers?: Broker[];
  onBrokerSelect: (brokerId: string) => void;
  selectedBrokerId: string;
}

export const BrokerInfo = ({ 
  broker,
  availableBrokers,
  onBrokerSelect,
  selectedBrokerId
}: BrokerInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Broker</Label>
        <Select value={selectedBrokerId} onValueChange={onBrokerSelect}>
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

      {broker && (
        <div className="p-4 border rounded-md bg-muted">
          <h3 className="font-medium mb-1">Selected Broker</h3>
          <p className="text-sm text-muted-foreground">
            {broker.name}
            {broker.description && (
              <span className="block mt-1 text-xs">
                {broker.description}
              </span>
            )}
          </p>
          {broker.asset_types?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Supported assets: {broker.asset_types.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
