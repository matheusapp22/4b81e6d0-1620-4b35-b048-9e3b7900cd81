export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          client_email: string | null
          client_id: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          end_time: string
          id: string
          notes: string | null
          payment_amount: number | null
          payment_status: string | null
          service_id: string
          start_time: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          client_email?: string | null
          client_id?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          service_id: string
          start_time: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          service_id?: string
          start_time?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_working: boolean | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_working?: boolean | null
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_working?: boolean | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_sends: {
        Row: {
          campaign_id: string
          clicked_at: string | null
          client_id: string
          converted_at: string | null
          id: string
          opened_at: string | null
          sent_at: string | null
        }
        Insert: {
          campaign_id: string
          clicked_at?: string | null
          client_id: string
          converted_at?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
        }
        Update: {
          campaign_id?: string
          clicked_at?: string | null
          client_id?: string
          converted_at?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sends_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          discount_amount: number | null
          discount_percentage: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          message_template: string | null
          name: string
          start_date: string | null
          target_segment: Json | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          message_template?: string | null
          name: string
          start_date?: string | null
          target_segment?: Json | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          message_template?: string | null
          name?: string
          start_date?: string | null
          target_segment?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      cash_flow: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      client_subscriptions: {
        Row: {
          benefits: Json | null
          client_id: string
          created_at: string
          end_date: string | null
          id: string
          plan_type: string
          price: number | null
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          client_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          plan_type: string
          price?: number | null
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          client_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          plan_type?: string
          price?: number | null
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount: number
          appointment_id: string
          created_at: string
          employee_id: string
          id: string
          paid_at: string | null
          status: string | null
        }
        Insert: {
          amount: number
          appointment_id: string
          created_at?: string
          employee_id: string
          id?: string
          paid_at?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string
          created_at?: string
          employee_id?: string
          id?: string
          paid_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          avatar_url: string | null
          commission_rate: number | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          position: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          commission_rate?: number | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          commission_rate?: number | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          client_id: string
          created_at: string
          id: string
          last_activity: string | null
          points_balance: number | null
          points_earned: number | null
          points_spent: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          last_activity?: string | null
          points_balance?: number | null
          points_earned?: number | null
          points_spent?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          last_activity?: string | null
          points_balance?: number | null
          points_earned?: number | null
          points_spent?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          appointment_id: string | null
          client_id: string
          created_at: string
          description: string | null
          id: string
          points: number
          type: string
        }
        Insert: {
          appointment_id?: string | null
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          points: number
          type: string
        }
        Update: {
          appointment_id?: string | null
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          appointment_id: string | null
          created_at: string
          id: string
          message: string
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          message: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          message?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          current_stock: number | null
          description: string | null
          id: string
          is_active: boolean | null
          min_stock: number | null
          name: string
          sku: string | null
          unit_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_stock?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          min_stock?: number | null
          name: string
          sku?: string | null
          unit_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          current_stock?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          min_stock?: number | null
          name?: string
          sku?: string | null
          unit_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accent_color: string | null
          avatar_url: string | null
          background_color: string | null
          background_gradient_end: string | null
          background_gradient_start: string | null
          banner_url: string | null
          border_radius: string | null
          business_name: string | null
          button_background_color: string | null
          button_text_color: string | null
          card_background_color: string | null
          card_border_color: string | null
          created_at: string
          description: string | null
          email: string
          first_name: string | null
          font_color: string | null
          font_family: string | null
          font_size: string | null
          id: string
          instagram_link: string | null
          language: string | null
          last_name: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          section_header_color: string | null
          shadow_intensity: string | null
          text_primary_color: string | null
          text_secondary_color: string | null
          timezone: string | null
          updated_at: string
          use_gradient_background: boolean | null
          user_id: string
          website_link: string | null
          whatsapp_link: string | null
        }
        Insert: {
          accent_color?: string | null
          avatar_url?: string | null
          background_color?: string | null
          background_gradient_end?: string | null
          background_gradient_start?: string | null
          banner_url?: string | null
          border_radius?: string | null
          business_name?: string | null
          button_background_color?: string | null
          button_text_color?: string | null
          card_background_color?: string | null
          card_border_color?: string | null
          created_at?: string
          description?: string | null
          email: string
          first_name?: string | null
          font_color?: string | null
          font_family?: string | null
          font_size?: string | null
          id?: string
          instagram_link?: string | null
          language?: string | null
          last_name?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          section_header_color?: string | null
          shadow_intensity?: string | null
          text_primary_color?: string | null
          text_secondary_color?: string | null
          timezone?: string | null
          updated_at?: string
          use_gradient_background?: boolean | null
          user_id: string
          website_link?: string | null
          whatsapp_link?: string | null
        }
        Update: {
          accent_color?: string | null
          avatar_url?: string | null
          background_color?: string | null
          background_gradient_end?: string | null
          background_gradient_start?: string | null
          banner_url?: string | null
          border_radius?: string | null
          business_name?: string | null
          button_background_color?: string | null
          button_text_color?: string | null
          card_background_color?: string | null
          card_border_color?: string | null
          created_at?: string
          description?: string | null
          email?: string
          first_name?: string | null
          font_color?: string | null
          font_family?: string | null
          font_size?: string | null
          id?: string
          instagram_link?: string | null
          language?: string | null
          last_name?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          section_header_color?: string | null
          shadow_intensity?: string | null
          text_primary_color?: string | null
          text_secondary_color?: string | null
          timezone?: string | null
          updated_at?: string
          use_gradient_background?: boolean | null
          user_id?: string
          website_link?: string | null
          whatsapp_link?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string
          current_uses: number | null
          description: string | null
          discount_type: string | null
          discount_value: number | null
          end_date: string
          id: string
          is_active: boolean | null
          is_flash: boolean | null
          max_uses: number | null
          min_amount: number | null
          start_date: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          end_date: string
          id?: string
          is_active?: boolean | null
          is_flash?: boolean | null
          max_uses?: number | null
          min_amount?: number | null
          start_date: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          is_flash?: boolean | null
          max_uses?: number | null
          min_amount?: number | null
          start_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string | null
          referred_id: string | null
          referrer_id: string
          reward_points: number | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string | null
          referred_id?: string | null
          referrer_id: string
          reward_points?: number | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string | null
          referred_id?: string | null
          referrer_id?: string
          reward_points?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      satisfaction_surveys: {
        Row: {
          appointment_id: string
          client_id: string
          feedback: string | null
          id: string
          nps_score: number | null
          rating: number | null
          submitted_at: string | null
        }
        Insert: {
          appointment_id: string
          client_id: string
          feedback?: string | null
          id?: string
          nps_score?: number | null
          rating?: number | null
          submitted_at?: string | null
        }
        Update: {
          appointment_id?: string
          client_id?: string
          feedback?: string | null
          id?: string
          nps_score?: number | null
          rating?: number | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "satisfaction_surveys_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "satisfaction_surveys_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      service_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity_used: number | null
          service_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity_used?: number | null
          service_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity_used?: number | null
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_products_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          duration: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          product_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      time_off: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_recurring: boolean | null
          reason: string | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_recurring?: boolean | null
          reason?: string | null
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_recurring?: boolean | null
          reason?: string | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          accent_color: string | null
          avatar_url: string | null
          background_color: string | null
          background_gradient_end: string | null
          background_gradient_start: string | null
          banner_url: string | null
          border_radius: string | null
          business_name: string | null
          button_background_color: string | null
          button_text_color: string | null
          card_background_color: string | null
          card_border_color: string | null
          description: string | null
          font_color: string | null
          font_family: string | null
          font_size: string | null
          instagram_link: string | null
          language: string | null
          primary_color: string | null
          secondary_color: string | null
          section_header_color: string | null
          shadow_intensity: string | null
          text_primary_color: string | null
          text_secondary_color: string | null
          timezone: string | null
          use_gradient_background: boolean | null
          user_id: string | null
          website_link: string | null
          whatsapp_link: string | null
        }
        Insert: {
          accent_color?: string | null
          avatar_url?: string | null
          background_color?: string | null
          background_gradient_end?: string | null
          background_gradient_start?: string | null
          banner_url?: string | null
          border_radius?: string | null
          business_name?: string | null
          button_background_color?: string | null
          button_text_color?: string | null
          card_background_color?: string | null
          card_border_color?: string | null
          description?: string | null
          font_color?: string | null
          font_family?: string | null
          font_size?: string | null
          instagram_link?: string | null
          language?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          section_header_color?: string | null
          shadow_intensity?: string | null
          text_primary_color?: string | null
          text_secondary_color?: string | null
          timezone?: string | null
          use_gradient_background?: boolean | null
          user_id?: string | null
          website_link?: string | null
          whatsapp_link?: string | null
        }
        Update: {
          accent_color?: string | null
          avatar_url?: string | null
          background_color?: string | null
          background_gradient_end?: string | null
          background_gradient_start?: string | null
          banner_url?: string | null
          border_radius?: string | null
          business_name?: string | null
          button_background_color?: string | null
          button_text_color?: string | null
          card_background_color?: string | null
          card_border_color?: string | null
          description?: string | null
          font_color?: string | null
          font_family?: string | null
          font_size?: string | null
          instagram_link?: string | null
          language?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          section_header_color?: string | null
          shadow_intensity?: string | null
          text_primary_color?: string | null
          text_secondary_color?: string | null
          timezone?: string | null
          use_gradient_background?: boolean | null
          user_id?: string | null
          website_link?: string | null
          whatsapp_link?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
