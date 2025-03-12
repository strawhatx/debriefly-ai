export type Broker = {
    id: string;
    name: string;
    description?: string;
    asset_types: string[];
    created_at?: string;
    updated_at?: string;
    file_upload_enabled: boolean;
    broker_sync_enabled: boolean;
}

export type BrokerConnectionField = {
    id: string;
    broker_id: string;
    field_name: string;
    field_type: BrokerFieldType;
    required: boolean;
    display_name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export type TradingAccount = {
    id: string;
    user_id: string;
    account_name: string;
    broker_id: string;
    broker_credentials: string;
    broker_connected: boolean;
    market: Market;
    account_balance: number;
    created_at: string;
    updated_at: string;
}

export type Position = {
    id: string;
    user_id: string;
    trading_account_id: string;
    symbol: string;
    asset_type: string;
    entry_date: string;
    closing_date: string | null;
    fill_price: number;
    stop_price: number;
    quantity: number;
    position_type: string;
    pnl: number | null;
    fees: number;
    leverage: number;
    status: string;
    entry_trade_id: string;
    close_trade_id: string;
    created_at: string;
    updated_at: string;
}

export type EmotionalTag = {
    id: string;
    position_id: string;
    tags: Tag[];
}

export type FuturesMultiplier = {
    symbol: string;
    tick_size: number;
    tick_value: number;
    point_value: number;
}

export type Import = {
    user_id: string;
    trading_account_id: string;
    import_type: ImportType
}

export type Insight = {
    user_id: string;
    position_id: string;
    import_type: ImportType
    type: string;
    content: string;
    created_at: string;
    updated_at: string;
    session_date: string;
}

export type JournalEntry = {
    user_id: string;
    position_id: string;
    entry_text: string;
    strategy: Strategy;
    created_at: string;
    updated_at: string;
    session_date: string;
}

export type Subscription = {
    user_id: string;
    stripe_subscription_id: string;
    stripe_price_id: string;
    status: SubscriptionStatus;
    current_period_end: string;
    created_at: string;
}

export type User = { id: string, roles: Role[] }


//HELPER TYPES

export type Market = 'STOCKS' | 'OPTIONS' | 'CRYPTO' | 'FOREX' | 'FUTURES';

export type BrokerFieldType = 'TEXT' | 'PASSWORD' | 'APIKEY';

export type Strategy = 'BREAKOUT' | 'PULLBACK' | 'REVERSALS' | 'TREND FOLLOWING' |
    'RANGE TRADING' | 'SCALPING' | 'MOMENTUM' | 'SWING TRADING' | 'ORDER BLOCK' | 'FVG'

export type Tag = 'CALM' | 'CONFIDENT' | 'DISCIPLINED' | 'PATIENT' | 'HESITANT' | 'ANXIOUS' | 'FEARFUL' | 'DOUBTFUL' |
    'FOMO' | 'GREEDY' | 'EXCITED' | 'OVERCONFIDENT' | 'REVENGE' | 'ANGRY' | 'FRUSTRATED' | 'IMPULSIVE';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'PAST DUE';

export type Role = 'admin' | 'professional' | 'trader' | 'viewer'

export type ImportType = 'csv';