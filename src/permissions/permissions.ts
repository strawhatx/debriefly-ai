
import type { 
  User, 
  Broker, 
  BrokerConnectionField, 
  TradingAccount, 
  Position, 
  EmotionalTag, 
  FuturesMultiplier, 
  Import, 
  Insight, 
  JournalEntry 
} from "./data-types"

type PermissionAction = "view" | "create" | "update" | "delete"

type Permission<T> = {
  [K in PermissionAction]?: boolean | ((user: User, data: T) => boolean)
}

export interface Permissions {
  broker: { action: PermissionAction; dataType: Broker }
  broker_connection_field: { action: PermissionAction; dataType: BrokerConnectionField }
  trading_account: { action: PermissionAction; dataType: TradingAccount }
  position: { action: PermissionAction; dataType: Position }
  emotional_tag: { action: PermissionAction; dataType: EmotionalTag }
  futures_multiplier: { action: PermissionAction; dataType: FuturesMultiplier }
  import: { action: PermissionAction; dataType: Import }
  insight: { action: PermissionAction; dataType: Insight }
  journal_entry: { action: PermissionAction; dataType: JournalEntry }
}

export interface Limits {
  trading_account?: number
  storage?: number
}

export interface ResourcePermissions {
  broker?: Permission<Broker>
  broker_connection_field?: Permission<BrokerConnectionField>
  trading_account?: Permission<TradingAccount>
  position?: Permission<Position>
  emotional_tag?: Permission<EmotionalTag>
  futures_multiplier?: Permission<FuturesMultiplier>
  import?: Permission<Import>
  insight?: Permission<Insight>
  journal_entry?: Permission<JournalEntry>
  limits?: Limits
}

export interface RolesWithPermissions {
  [roleName: string]: ResourcePermissions
}
