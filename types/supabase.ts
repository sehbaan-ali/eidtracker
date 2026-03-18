// This file is auto-generated. Update it if your Supabase schema changes.

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
      orders: {
        Row: {
          id: string
          order_number: number
          customer_name: string
          phone_number: string
          full_mutton_savan: number
          half_mutton_savan: number
          full_chicken_savan: number
          half_chicken_savan: number
          extra_chicken: number
          extra_wattalpam: number
          custom_extras: Json
          extra_notes: string | null
          total_amount: number
          payment_status: string
          amount_paid: number
          amount_remaining: number
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          order_number: number
          customer_name: string
          phone_number: string
          full_mutton_savan?: number
          half_mutton_savan?: number
          full_chicken_savan?: number
          half_chicken_savan?: number
          extra_chicken?: number
          extra_wattalpam?: number
          custom_extras?: Json
          extra_notes?: string | null
          total_amount: number
          payment_status: string
          amount_paid?: number
          amount_remaining?: number
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          order_number?: number
          customer_name?: string
          phone_number?: string
          full_mutton_savan?: number
          half_mutton_savan?: number
          full_chicken_savan?: number
          half_chicken_savan?: number
          extra_chicken?: number
          extra_wattalpam?: number
          custom_extras?: Json
          extra_notes?: string | null
          total_amount?: number
          payment_status?: string
          amount_paid?: number
          amount_remaining?: number
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      settings: {
        Row: {
          id: string
          pricing: Json
          current_year: number
          user_id: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          pricing?: Json
          current_year?: number
          user_id?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          pricing?: Json
          current_year?: number
          user_id?: string | null
          updated_at?: string
        }
      }
    }
  }
}
