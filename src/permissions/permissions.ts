import { Broker, BrokerConnectionField, EmotionalTag, FuturesMultiplier, Import, Insight, JournalEntry, Position, Role, TradingAccount, User } from "./data-types"

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean)

export type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>
    }>
  }>
}

export type Permissions = {
  broker: {
    dataType: Broker
    action: "view" | "create" | "update" | "delete" 
  }
  broker_connection_field: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: BrokerConnectionField
    action: "view" | "create" | "update" | "delete"
  }

  trading_account: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: TradingAccount
    action: "view" | "create" | "update" | "delete"
  }

  position: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: Position
    action: "view" | "create" | "update" | "delete"
  }

  emotional_tag: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: EmotionalTag
    action: "view" | "create" | "update" | "delete"
  }

  futures_multiplier: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: FuturesMultiplier
    action: "view" | "create" | "update" | "delete"
  }

  import: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: Import
    action: "view" | "create" | "update" | "delete"
  }

  insight: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: Insight
    action: "view" | "create" | "update" | "delete"
  }

  journal_entry: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: JournalEntry
    action: "view" | "create" | "update" | "delete"
  }
}