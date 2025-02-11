
import { Broker } from "./types";

interface BrokerInfoProps {
  broker: Broker;
}

export const BrokerInfo = ({ broker }: BrokerInfoProps) => {
  return (
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
  );
};
