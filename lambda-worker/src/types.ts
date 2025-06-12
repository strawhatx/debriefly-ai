export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface AnalysisResult {
  insights: {
    what_went_well: string[];
    areas_for_improvement: string[];
    strategy_recommendations: Array<{
      title: string;
      description: string;
      predicted_win_rate_increase: string;
    }>;
    behavior_insights: Array<{
      title: string;
      description: string;
      recommendation: string;
    }>;
  } | string;
  model: string;
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export interface Database {
  public: {
    Tables: {
      analysis_jobs: {
        Row: {
          id: string
          user_id: string
          trading_account_id: string
          session_date: string
          trades: Json[]
          status: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string
          created_at: string
          started_at?: string
          completed_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          trading_account_id: string
          session_date: string
          trades: Json[]
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string
          created_at?: string
          started_at?: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trading_account_id?: string
          session_date?: string
          trades?: Json[]
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string
          created_at?: string
          started_at?: string
          completed_at?: string
        }
      }
      trade_analysis: {
        Row: {
          id: string
          user_id: string
          trading_account_id: string
          session_date: string
          analysis: Json
          model: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trading_account_id: string
          session_date: string
          analysis: Json
          model: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trading_account_id?: string
          session_date?: string
          analysis?: Json
          model?: string
          created_at?: string
        }
      }
    }
  }
} 