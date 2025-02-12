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
            referencedRelation: "available_brokers"
            referencedColumns: ["id"]
          },
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
          asset_type_config: Json | null
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
          asset_type_config?: Json | null
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
          asset_type_config?: Json | null
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
          status: string
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
          status?: string
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
          status?: string
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
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      service_role_key: {
        Row: {
          decrypted_secret: string | null
        }
        Insert: {
          decrypted_secret?: string | null
        }
        Update: {
          decrypted_secret?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          active: boolean
          created_at: string
          id: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"] | null
          closing_time: string | null
          created_at: string
          entry_date: string
          entry_price: number
          exit_date: string | null
          exit_price: number | null
          external_id: string | null
          fees: number | null
          id: string
          import_id: string | null
          leverage: number | null
          multiplier: number | null
          notes: string | null
          order_type: string | null
          pnl: number | null
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
          asset_type?: Database["public"]["Enums"]["asset_type"] | null
          closing_time?: string | null
          created_at?: string
          entry_date: string
          entry_price: number
          exit_date?: string | null
          exit_price?: number | null
          external_id?: string | null
          fees?: number | null
          id?: string
          import_id?: string | null
          leverage?: number | null
          multiplier?: number | null
          notes?: string | null
          order_type?: string | null
          pnl?: number | null
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
          asset_type?: Database["public"]["Enums"]["asset_type"] | null
          closing_time?: string | null
          created_at?: string
          entry_date?: string
          entry_price?: number
          exit_date?: string | null
          exit_price?: number | null
          external_id?: string | null
          fees?: number | null
          id?: string
          import_id?: string | null
          leverage?: number | null
          multiplier?: number | null
          notes?: string | null
          order_type?: string | null
          pnl?: number | null
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
            foreignKeyName: "trades_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "imports"
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
            referencedRelation: "available_brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trading_accounts_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      available_brokers: {
        Row: {
          asset_types: string[] | null
          created_at: string | null
          description: string | null
          id: string | null
          name: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_matching_trades: {
        Args: {
          p_account_id: string
          p_symbol: string
          p_quantity: number
          p_calc_method: Database["public"]["Enums"]["profit_calc_method"]
        }
        Returns: {
          id: string
          quantity: number
          entry_price: number
          entry_date: string
        }[]
      }
    }
    Enums: {
      asset_type: "stock" | "option" | "future" | "forex" | "crypto"
      broker_field_type: "text" | "password" | "api_key"
      profit_calc_method: "FIFO" | "LIFO"
      subscription_tier: "free" | "premium"
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
