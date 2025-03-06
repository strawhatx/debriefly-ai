
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

export interface BrokerSyncProps {
  availableBrokers?: Broker[];
}

export interface TradingAccount {
  id: string;
  account_name: string;
  broker?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface BrokerField {
  id: string;
  broker_id: string;
  field_name: string;
  field_type: 'TEXT' | 'PASSWORD' | 'APIKEY';
  required: boolean;
  display_name: string;
  description: string | null;
}
