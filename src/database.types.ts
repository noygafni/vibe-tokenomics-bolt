export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string
          bio: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          bio?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          bio?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      ventures: {
        Row: {
          id: string
          name: string
          description: string | null
          banner_url: string | null
          venture_image: string | null
          category: string | null
          period_in_months: number
          total_tokens: number
          v_token_treasury: number
          a_token_treasury: number
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          banner_url?: string | null
          venture_image?: string | null
          category?: string | null
          period_in_months?: number
          total_tokens?: number
          v_token_treasury?: number
          a_token_treasury?: number
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          banner_url?: string | null
          venture_image?: string | null
          category?: string | null
          period_in_months?: number
          total_tokens?: number
          v_token_treasury?: number
          a_token_treasury?: number
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
    }
  }
}