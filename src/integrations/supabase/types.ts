export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AssetType = 'STOCK' | 'OPTION' | 'FUTURES' | 'FOREX' | 'CRYPTO'
export type BrokerFieldType = 'TEXT' | 'PASSWORD' | 'APIKEY'
export type ImportStatus = 'PENDING' | 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type InsightType = 'debrief' | 'pattern' | 'suggestion'
export type ProfitCalcMethod = 'FIFO' | 'LIFO'
export type SubscriptionTier = 'FREE' | 'PREMIUM'
export type TradeStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brokers: {
        Row: {
          id: string
          name: string
          description: string | null
          asset_types: string[]
          broker_sync_enabled: boolean
          file_upload_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          asset_types?: string[]
          broker_sync_enabled?: boolean
          file_upload_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          asset_types?: string[]
          broker_sync_enabled?: boolean
          file_upload_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      broker_connection_fields: {
        Row: {
          id: string
          broker_id: string
          field_name: string
          display_name: string
          field_type: BrokerFieldType
          description: string | null
          required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          broker_id: string
          field_name: string
          display_name: string
          field_type: BrokerFieldType
          description?: string | null
          required?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          broker_id?: string
          field_name?: string
          display_name?: string
          field_type?: BrokerFieldType
          description?: string | null
          required?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trading_accounts: {
        Row: {
          id: string
          user_id: string
          broker_id: string
          account_name: string
          account_balance: number
          broker_connected: boolean
          broker_credentials: Json | null
          market: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          broker_id: string
          account_name: string
          account_balance?: number
          broker_connected?: boolean
          broker_credentials?: Json | null
          market?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          broker_id?: string
          account_name?: string
          account_balance?: number
          broker_connected?: boolean
          broker_credentials?: Json | null
          market?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      imports: {
        Row: {
          id: string
          user_id: string
          trading_account_id: string
          import_type: string
          status: ImportStatus
          file_path: string | null
          file_type: string | null
          file_size: number | null
          original_filename: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trading_account_id: string
          import_type: string
          status?: ImportStatus
          file_path?: string | null
          file_type?: string | null
          file_size?: number | null
          original_filename?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trading_account_id?: string
          import_type?: string
          status?: ImportStatus
          file_path?: string | null
          file_type?: string | null
          file_size?: number | null
          original_filename?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trade_history: {
        Row: {
          id: string
          user_id: string
          trading_account_id: string
          import_id: string | null
          symbol: string
          side: string
          quantity: number
          fill_price: number
          fees: number | null
          entry_date: string
          closing_date: string | null
          order_type: string | null
          status: string | null
          stop_price: number | null
          leverage: number | null
          external_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trading_account_id: string
          import_id?: string | null
          symbol: string
          side: string
          quantity: number
          fill_price: number
          fees?: number | null
          entry_date: string
          closing_date?: string | null
          order_type?: string | null
          status?: string | null
          stop_price?: number | null
          leverage?: number | null
          external_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trading_account_id?: string
          import_id?: string | null
          symbol?: string
          side?: string
          quantity?: number
          fill_price?: number
          fees?: number | null
          entry_date?: string
          closing_date?: string | null
          order_type?: string | null
          status?: string | null
          stop_price?: number | null
          leverage?: number | null
          external_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          user_id: string
          trading_account_id: string
          entry_trade_id: string
          close_trade_id: string
          symbol: string | null
          asset_type: AssetType | null
          position_type: string | null
          quantity: number | null
          fill_price: number | null
          stop_price: number | null
          fees: number | null
          pnl: number | null
          leverage: number | null
          tags: Json | null
          strategy: string | null
          risk: number | null
          reward: number | null
          score: number | null
          state: TradeStatus | null
          entry_date: string
          closing_date: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trading_account_id: string
          entry_trade_id: string
          close_trade_id: string
          symbol?: string | null
          asset_type?: AssetType | null
          position_type?: string | null
          quantity?: number | null
          fill_price?: number | null
          stop_price?: number | null
          fees?: number | null
          pnl?: number | null
          leverage?: number | null
          tags?: Json | null
          strategy?: string | null
          risk?: number | null
          reward?: number | null
          score?: number | null
          state?: TradeStatus | null
          entry_date: string
          closing_date?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trading_account_id?: string
          entry_trade_id?: string
          close_trade_id?: string
          symbol?: string | null
          asset_type?: AssetType | null
          position_type?: string | null
          quantity?: number | null
          fill_price?: number | null
          stop_price?: number | null
          fees?: number | null
          pnl?: number | null
          leverage?: number | null
          tags?: Json | null
          strategy?: string | null
          risk?: number | null
          reward?: number | null
          score?: number | null
          state?: TradeStatus | null
          entry_date?: string
          closing_date?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      insights: {
        Row: {
          id: string
          user_id: string
          trading_account_id: string | null
          model: string | null
          analysis: Json
          session_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trading_account_id?: string | null
          model?: string | null
          analysis: Json
          session_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trading_account_id?: string | null
          model?: string | null
          analysis?: Json
          session_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          stripe_price_id: string
          status: string
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          stripe_price_id: string
          status: string
          current_period_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          stripe_price_id?: string
          status?: string
          current_period_end?: string | null
          created_at?: string
        }
      }
      forex_rates: {
        Row: {
          id: string
          base_currency: string | null
          quote_currency: string | null
          rate_date: string | null
          rate: number | null
        }
        Insert: {
          id?: string
          base_currency?: string | null
          quote_currency?: string | null
          rate_date?: string | null
          rate?: number | null
        }
        Update: {
          id?: string
          base_currency?: string | null
          quote_currency?: string | null
          rate_date?: string | null
          rate?: number | null
        }
      }
      futures_multipliers: {
        Row: {
          id: string
          name: string | null
          symbol: string
          point_value: number
          tick_size: number | null
          tick_value: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          symbol: string
          point_value: number
          tick_size?: number | null
          tick_value?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          symbol?: string
          point_value?: number
          tick_size?: number | null
          tick_value?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
