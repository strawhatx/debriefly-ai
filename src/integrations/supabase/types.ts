export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billing_history: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          status: string | null
          stripe_invoice_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_invoice_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_invoice_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      broker_connection_fields: {
        Row: {
          broker_id: string
          created_at: string
          description: string | null
          display_name: string
          field_name: string
          field_type: Database["public"]["Enums"]["broker_field_type"]
          id: string
          required: boolean
          updated_at: string
        }
        Insert: {
          broker_id: string
          created_at?: string
          description?: string | null
          display_name: string
          field_name: string
          field_type: Database["public"]["Enums"]["broker_field_type"]
          id?: string
          required?: boolean
          updated_at?: string
        }
        Update: {
          broker_id?: string
          created_at?: string
          description?: string | null
          display_name?: string
          field_name?: string
          field_type?: Database["public"]["Enums"]["broker_field_type"]
          id?: string
          required?: boolean
          updated_at?: string
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
          asset_types: string[]
          broker_sync_enabled: boolean
          created_at: string
          description: string | null
          file_upload_enabled: boolean
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          asset_types?: string[]
          broker_sync_enabled?: boolean
          created_at?: string
          description?: string | null
          file_upload_enabled?: boolean
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          asset_types?: string[]
          broker_sync_enabled?: boolean
          created_at?: string
          description?: string | null
          file_upload_enabled?: boolean
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      currency_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      futures_multipliers: {
        Row: {
          created_at: string
          id: string
          multiplier: number
          name: string | null
          symbol: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          multiplier: number
          name?: string | null
          symbol: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          multiplier?: number
          name?: string | null
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      imports: {
        Row: {
          created_at: string
          error_message: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          import_type: string
          original_filename: string | null
          status: Database["public"]["Enums"]["import_status"]
          trading_account_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          import_type: string
          original_filename?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          trading_account_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          import_type?: string
          original_filename?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          trading_account_id?: string
          updated_at?: string
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
      insights: {
        Row: {
          content: Json
          created_at: string
          id: string
          position_id: string | null
          session_date: string | null
          type: Database["public"]["Enums"]["insight_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          position_id?: string | null
          session_date?: string | null
          type: Database["public"]["Enums"]["insight_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          position_id?: string | null
          session_date?: string | null
          type?: Database["public"]["Enums"]["insight_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string | null
          exp_month: number | null
          exp_year: number | null
          id: string
          is_default: boolean | null
          last_4: number | null
          stripe_payment_method_id: string
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_4?: number | null
          stripe_payment_method_id: string
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_4?: number | null
          stripe_payment_method_id?: string
          user_id?: string | null
        }
        Relationships: []
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
          multiplier: number | null
          pnl: number | null
          position_type: string | null
          quantity: number | null
          status: string | null
          stop_price: number | null
          symbol: string | null
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
          multiplier?: number | null
          pnl?: number | null
          position_type?: string | null
          quantity?: number | null
          status?: string | null
          stop_price?: number | null
          symbol?: string | null
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
          multiplier?: number | null
          pnl?: number | null
          position_type?: string | null
          quantity?: number | null
          status?: string | null
          stop_price?: number | null
          symbol?: string | null
          trading_account_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_entry_trade_id_fkey"
            columns: ["entry_trade_id"]
            isOneToOne: false
            referencedRelation: "trade_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_exit_trade_id_fkey"
            columns: ["close_trade_id"]
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
          created_at: string
          full_name: string | null
          id: string
          stripe_customer_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          id: number
          monthly_price: number
          name: string
          stripe_price_id: string
        }
        Insert: {
          id?: number
          monthly_price: number
          name: string
          stripe_price_id: string
        }
        Update: {
          id?: number
          monthly_price?: number
          name?: string
          stripe_price_id?: string
        }
        Relationships: []
      }
      trade_history: {
        Row: {
          closing_date: string | null
          created_at: string
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
          updated_at: string
          user_id: string
        }
        Insert: {
          closing_date?: string | null
          created_at?: string
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
          updated_at?: string
          user_id: string
        }
        Update: {
          closing_date?: string | null
          created_at?: string
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
          updated_at?: string
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
            foreignKeyName: "trade_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_trading_account_id_fkey"
            columns: ["trading_account_id"]
            isOneToOne: false
            referencedRelation: "trading_accounts"
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
          created_at: string
          id: string
          profit_calculation_method: Database["public"]["Enums"]["profit_calc_method"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_balance?: number
          account_name: string
          broker_connected?: boolean | null
          broker_credentials?: Json | null
          broker_id: string
          created_at?: string
          id?: string
          profit_calculation_method?: Database["public"]["Enums"]["profit_calc_method"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_balance?: number
          account_name?: string
          broker_connected?: boolean | null
          broker_credentials?: Json | null
          broker_id?: string
          created_at?: string
          id?: string
          profit_calculation_method?: Database["public"]["Enums"]["profit_calc_method"]
          updated_at?: string
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
            foreignKeyName: "trading_accounts_user_id_fkey1"
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
      [_ in never]: never
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
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
