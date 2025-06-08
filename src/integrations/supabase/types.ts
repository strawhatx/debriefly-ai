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
      broker_connection_fields: {
        Row: {
          broker_id: string
          created_at: string | null
          description: string | null
          display_name: string
          field_name: string
          field_type: Database["public"]["Enums"]["broker_field_type"]
          id: string
          required: boolean | null
          updated_at: string | null
        }
        Insert: {
          broker_id: string
          created_at?: string | null
          description?: string | null
          display_name: string
          field_name: string
          field_type: Database["public"]["Enums"]["broker_field_type"]
          id?: string
          required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          broker_id?: string
          created_at?: string | null
          description?: string | null
          display_name?: string
          field_name?: string
          field_type?: Database["public"]["Enums"]["broker_field_type"]
          id?: string
          required?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_connection_fields_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
      }
      brokers: {
        Row: {
          asset_types: string[] | null
          broker_sync_enabled: boolean | null
          created_at: string | null
          description: string | null
          file_upload_enabled: boolean | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          asset_types?: string[] | null
          broker_sync_enabled?: boolean | null
          created_at?: string | null
          description?: string | null
          file_upload_enabled?: boolean | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          asset_types?: string[] | null
          broker_sync_enabled?: boolean | null
          created_at?: string | null
          description?: string | null
          file_upload_enabled?: boolean | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      forex_rates: {
        Row: {
          base_currency: string | null
          id: string
          quote_currency: string | null
          rate: number | null
          rate_date: string | null
        }
        Insert: {
          base_currency?: string | null
          id?: string
          quote_currency?: string | null
          rate?: number | null
          rate_date?: string | null
        }
        Update: {
          base_currency?: string | null
          id?: string
          quote_currency?: string | null
          rate?: number | null
          rate_date?: string | null
        }
        Relationships: []
      }
      futures_multipliers: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          point_value: number
          symbol: string
          tick_size: number | null
          tick_value: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          point_value: number
          symbol: string
          tick_size?: number | null
          tick_value?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          point_value?: number
          symbol?: string
          tick_size?: number | null
          tick_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      imports: {
        Row: {
          created_at: string | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          import_type: string
          original_filename: string | null
          status: Database["public"]["Enums"]["import_status"]
          trading_account_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          import_type: string
          original_filename?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          trading_account_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          import_type?: string
          original_filename?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          trading_account_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "imports_trading_account_id_fkey"
            columns: ["trading_account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"] | null
          close_trade_id: string
          closing_date: string | null
          created_at: string | null
          entry_date: string
          entry_trade_id: string
          fees: number | null
          fill_price: number | null
          id: string
          leverage: number | null
          pnl: number | null
          position_type: string | null
          quantity: number | null
          reward: number | null
          risk: number | null
          score: number | null
          state: Database["public"]["Enums"]["trade_status"] | null
          status: string | null
          stop_price: number | null
          strategy: string | null
          symbol: string | null
          tags: Json | null
          trading_account_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          asset_type?: Database["public"]["Enums"]["asset_type"] | null
          close_trade_id: string
          closing_date?: string | null
          created_at?: string | null
          entry_date: string
          entry_trade_id: string
          fees?: number | null
          fill_price?: number | null
          id?: string
          leverage?: number | null
          pnl?: number | null
          position_type?: string | null
          quantity?: number | null
          reward?: number | null
          risk?: number | null
          score?: number | null
          state?: Database["public"]["Enums"]["trade_status"] | null
          status?: string | null
          stop_price?: number | null
          strategy?: string | null
          symbol?: string | null
          tags?: Json | null
          trading_account_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"] | null
          close_trade_id?: string
          closing_date?: string | null
          created_at?: string | null
          entry_date?: string
          entry_trade_id?: string
          fees?: number | null
          fill_price?: number | null
          id?: string
          leverage?: number | null
          pnl?: number | null
          position_type?: string | null
          quantity?: number | null
          reward?: number | null
          risk?: number | null
          score?: number | null
          state?: Database["public"]["Enums"]["trade_status"] | null
          status?: string | null
          stop_price?: number | null
          strategy?: string | null
          symbol?: string | null
          tags?: Json | null
          trading_account_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_close_trade_id_fkey"
            columns: ["close_trade_id"]
            isOneToOne: false
            referencedRelation: "trade_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_entry_trade_id_fkey"
            columns: ["entry_trade_id"]
            isOneToOne: false
            referencedRelation: "trade_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_trading_account_id_fkey"
            columns: ["trading_account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          stripe_customer_id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          status: string
          stripe_price_id: string
          stripe_subscription_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status: string
          stripe_price_id: string
          stripe_subscription_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: string
          stripe_price_id?: string
          stripe_subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_analysis: {
        Row: {
          analysis: Json
          created_at: string | null
          id: string
          model: string | null
          session_date: string | null
          trading_account_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analysis: Json
          created_at?: string | null
          id?: string
          model?: string | null
          session_date?: string | null
          trading_account_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analysis?: Json
          created_at?: string | null
          id?: string
          model?: string | null
          session_date?: string | null
          trading_account_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_analysis_trading_account_id_fkey"
            columns: ["trading_account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_history: {
        Row: {
          closing_date: string | null
          created_at: string | null
          entry_date: string
          external_id: string | null
          fees: number | null
          fill_price: number
          id: string
          import_id: string | null
          leverage: number | null
          order_type: string | null
          quantity: number
          side: string
          status: string | null
          stop_price: number | null
          symbol: string
          trading_account_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          closing_date?: string | null
          created_at?: string | null
          entry_date: string
          external_id?: string | null
          fees?: number | null
          fill_price: number
          id?: string
          import_id?: string | null
          leverage?: number | null
          order_type?: string | null
          quantity: number
          side: string
          status?: string | null
          stop_price?: number | null
          symbol: string
          trading_account_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          closing_date?: string | null
          created_at?: string | null
          entry_date?: string
          external_id?: string | null
          fees?: number | null
          fill_price?: number
          id?: string
          import_id?: string | null
          leverage?: number | null
          order_type?: string | null
          quantity?: number
          side?: string
          status?: string | null
          stop_price?: number | null
          symbol?: string
          trading_account_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_history_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_history_trading_account_id_fkey"
            columns: ["trading_account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_accounts: {
        Row: {
          account_balance: number
          account_name: string
          broker_connected: boolean | null
          broker_credentials: Json | null
          broker_id: string
          created_at: string | null
          id: string
          market: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_balance?: number
          account_name: string
          broker_connected?: boolean | null
          broker_credentials?: Json | null
          broker_id: string
          created_at?: string | null
          id?: string
          market?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_balance?: number
          account_name?: string
          broker_connected?: boolean | null
          broker_credentials?: Json | null
          broker_id?: string
          created_at?: string | null
          id?: string
          market?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_accounts_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trading_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_position_history: {
        Args: { pos_id: string }
        Returns: {
          account_name: string
          symbol: string
          order_type: string
          side: string
          fill_price: number
          stop_price: number
          quantity: number
          entry_date: string
          closing_date: string
          fees: number
          status: string
          order_id: string
          leverage: number
        }[]
      }
      get_unanalyzed_positions: {
        Args: { user_id_param: string; trading_account_id_param: string }
        Returns: {
          trade_day: string
          trades: Json
        }[]
      }
    }
    Enums: {
      asset_type: "STOCK" | "OPTION" | "FUTURES" | "FOREX" | "CRYPTO"
      broker_field_type: "TEXT" | "PASSWORD" | "APIKEY"
      import_status:
        | "PENDING"
        | "UPLOADED"
        | "PROCESSING"
        | "COMPLETED"
        | "FAILED"
      insight_type: "debrief" | "pattern" | "suggestion"
      profit_calc_method: "FIFO" | "LIFO"
      subscription_tier: "FREE" | "PREMIUM"
      trade_status: "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED"
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_type: ["STOCK", "OPTION", "FUTURES", "FOREX", "CRYPTO"],
      broker_field_type: ["TEXT", "PASSWORD", "APIKEY"],
      import_status: [
        "PENDING",
        "UPLOADED",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
      ],
      insight_type: ["debrief", "pattern", "suggestion"],
      profit_calc_method: ["FIFO", "LIFO"],
      subscription_tier: ["FREE", "PREMIUM"],
      trade_status: ["DRAFT", "OPEN", "CLOSED", "CANCELLED"],
    },
  },
} as const
