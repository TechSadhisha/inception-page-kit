export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      billing_history: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          invoice_url: string | null
          payment_date: string | null
          status: string
          stripe_payment_intent_id: string | null
          subscription_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          invoice_url?: string | null
          payment_date?: string | null
          status: string
          stripe_payment_intent_id?: string | null
          subscription_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          invoice_url?: string | null
          payment_date?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_settings: {
        Row: {
          access_token: string | null
          ad_account_id: string | null
          created_at: string
          id: string
          meta_app_id: string | null
          meta_app_secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          ad_account_id?: string | null
          created_at?: string
          id?: string
          meta_app_id?: string | null
          meta_app_secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          ad_account_id?: string | null
          created_at?: string
          id?: string
          meta_app_id?: string | null
          meta_app_secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      emails: {
        Row: {
          body_html: string | null
          body_text: string | null
          created_at: string
          gmail_message_id: string
          id: string
          is_read: boolean | null
          labels: string[] | null
          received_date: string | null
          recipient: string | null
          sender: string | null
          subject: string | null
          thread_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          gmail_message_id: string
          id?: string
          is_read?: boolean | null
          labels?: string[] | null
          received_date?: string | null
          recipient?: string | null
          sender?: string | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          gmail_message_id?: string
          id?: string
          is_read?: boolean | null
          labels?: string[] | null
          received_date?: string | null
          recipient?: string | null
          sender?: string | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      facebook_integrations: {
        Row: {
          access_token: string
          ad_account_id: string | null
          ad_account_name: string | null
          business_id: string | null
          created_at: string | null
          facebook_user_id: string
          is_active: boolean | null
          page_access_token: string | null
          permissions: string[] | null
          refresh_token: string | null
          selected_page_id: string | null
          selected_page_name: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          ad_account_id?: string | null
          ad_account_name?: string | null
          business_id?: string | null
          created_at?: string | null
          facebook_user_id: string
          is_active?: boolean | null
          page_access_token?: string | null
          permissions?: string[] | null
          refresh_token?: string | null
          selected_page_id?: string | null
          selected_page_name?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          ad_account_id?: string | null
          ad_account_name?: string | null
          business_id?: string | null
          created_at?: string | null
          facebook_user_id?: string
          is_active?: boolean | null
          page_access_token?: string | null
          permissions?: string[] | null
          refresh_token?: string | null
          selected_page_id?: string | null
          selected_page_name?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gmail_accounts: {
        Row: {
          access_token: string | null
          client_id: string | null
          client_secret: string | null
          created_at: string
          email: string
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          email: string
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          email?: string
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gmail_sync_status: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean | null
          last_sync_at: string | null
          sync_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          last_sync_at?: string | null
          sync_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          last_sync_at?: string | null
          sync_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integration_configs: {
        Row: {
          company_id: string | null
          config: Json
          created_at: string
          id: string
          integration_type: string
          is_active: boolean
          name: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          config?: Json
          created_at?: string
          id?: string
          integration_type: string
          is_active?: boolean
          name: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          config?: Json
          created_at?: string
          id?: string
          integration_type?: string
          is_active?: boolean
          name?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_configs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_videos: {
        Row: {
          category: string | null
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          category?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_videos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          company_id: string | null
          config: Json
          conversion_rate: number | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          source_type: string
          total_leads: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          config?: Json
          conversion_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          source_type: string
          total_leads?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          config?: Json
          conversion_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          source_type?: string
          total_leads?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_sources_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          project_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          project_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meta_campaigns: {
        Row: {
          ad_account_id: string
          campaign_id: string
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_account_id: string
          campaign_id: string
          created_at?: string
          id?: string
          name: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_account_id?: string
          campaign_id?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meta_leads: {
        Row: {
          ad_id: string
          ad_name: string
          campaign_id: string
          campaign_name: string
          campaign_status: string
          created_at: string
          created_time: string
          email: string | null
          id: string
          lead_form_id: string
          lead_id: string
          name: string | null
          phone: string | null
          raw_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_id: string
          ad_name: string
          campaign_id: string
          campaign_name: string
          campaign_status: string
          created_at?: string
          created_time: string
          email?: string | null
          id?: string
          lead_form_id: string
          lead_id: string
          name?: string | null
          phone?: string | null
          raw_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_id?: string
          ad_name?: string
          campaign_id?: string
          campaign_name?: string
          campaign_status?: string
          created_at?: string
          created_time?: string
          email?: string | null
          id?: string
          lead_form_id?: string
          lead_id?: string
          name?: string | null
          phone?: string | null
          raw_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      portal_integrations: {
        Row: {
          config: Json
          created_at: string
          id: string
          integration_id: string
          is_active: boolean
          portal_name: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          integration_id: string
          is_active?: boolean
          portal_name: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          integration_id?: string
          is_active?: boolean
          portal_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_keys: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          issued_at: string
          issued_by: string
          plan_id: string
          product_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean
          issued_at?: string
          issued_by: string
          plan_id: string
          product_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          issued_at?: string
          issued_by?: string
          plan_id?: string
          product_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: string | null
          company_role: Database["public"]["Enums"]["company_role"] | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          youtube_api_key: string | null
        }
        Insert: {
          company_id?: string | null
          company_role?: Database["public"]["Enums"]["company_role"] | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          youtube_api_key?: string | null
        }
        Update: {
          company_id?: string | null
          company_role?: Database["public"]["Enums"]["company_role"] | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          youtube_api_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sheets: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          sheet_id: string
          sheet_name: string
          sheet_url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          sheet_id: string
          sheet_name: string
          sheet_url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          sheet_id?: string
          sheet_name?: string
          sheet_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_sheets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_sheets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_listings: {
        Row: {
          address: string | null
          amenities: Json | null
          area_sqft: number | null
          availability_status: string
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          company_id: string | null
          created_at: string
          description: string | null
          external_id: string | null
          id: string
          images: Json | null
          last_synced_at: string | null
          listing_type: string
          location_lat: number | null
          location_lng: number | null
          price: number | null
          property_type: string
          source_portal: string | null
          state: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          area_sqft?: number | null
          availability_status?: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          images?: Json | null
          last_synced_at?: string | null
          listing_type?: string
          location_lat?: number | null
          location_lng?: number | null
          price?: number | null
          property_type?: string
          source_portal?: string | null
          state?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          area_sqft?: number | null
          availability_status?: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          images?: Json | null
          last_synced_at?: string | null
          listing_type?: string
          location_lat?: number | null
          location_lng?: number | null
          price?: number | null
          property_type?: string
          source_portal?: string | null
          state?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_listings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      prospects: {
        Row: {
          assigned_to: string | null
          company_id: string | null
          conversion_date: string | null
          created_at: string | null
          date_added: string | null
          email: string | null
          first_contact_date: string | null
          follow_ups: Json | null
          id: string
          interest_rating: number | null
          last_contacted_at: string | null
          lead_score: number | null
          name: string
          notes: string | null
          phone: string | null
          project_id: string
          source: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_id?: string | null
          conversion_date?: string | null
          created_at?: string | null
          date_added?: string | null
          email?: string | null
          first_contact_date?: string | null
          follow_ups?: Json | null
          id?: string
          interest_rating?: number | null
          last_contacted_at?: string | null
          lead_score?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          project_id: string
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_id?: string | null
          conversion_date?: string | null
          created_at?: string | null
          date_added?: string | null
          email?: string | null
          first_contact_date?: string | null
          follow_ups?: Json | null
          id?: string
          interest_rating?: number | null
          last_contacted_at?: string | null
          lead_score?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          project_id?: string
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          content: Json | null
          created_at: string | null
          generated_by: string
          id: string
          project_id: string
          title: string
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          generated_by: string
          id?: string
          project_id: string
          title: string
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          generated_by?: string
          id?: string
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      scripts: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          notes: string | null
          project_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          project_id: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          project_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scripts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      site_media: {
        Row: {
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          id: string
          location_lat: number | null
          location_lng: number | null
          media_type: string
          project_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          media_type: string
          project_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          media_type?: string
          project_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          max_projects: number | null
          max_prospects: number | null
          max_team_members: number | null
          name: string
          price_monthly: number
          price_yearly: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          max_projects?: number | null
          max_prospects?: number | null
          max_team_members?: number | null
          name: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          max_projects?: number | null
          max_prospects?: number | null
          max_team_members?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          is_trial: boolean
          payment_method_id: string | null
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_days: number
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_trial?: boolean
          payment_method_id?: string | null
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_days?: number
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_trial?: boolean
          payment_method_id?: string | null
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_days?: number
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      transcripts: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          id: string
          prospect_id: string
          transcript_text: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          id?: string
          prospect_id: string
          transcript_text?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          id?: string
          prospect_id?: string
          transcript_text?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcripts_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcripts_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      upgrade_requests: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          processed_at: string | null
          processed_by: string | null
          requested_plan_id: string
          requirements: string | null
          status: string
          updated_at: string
          user_email: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_plan_id: string
          requirements?: string | null
          status?: string
          updated_at?: string
          user_email: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_plan_id?: string
          requirements?: string | null
          status?: string
          updated_at?: string
          user_email?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          used: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          used?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          used?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          created_at: string
          delivered_at: string | null
          id: string
          message: string
          phone_number: string
          prospect_id: string
          sent_at: string | null
          sent_by: string
          status: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          message: string
          phone_number: string
          prospect_id: string
          sent_at?: string | null
          sent_by: string
          status?: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          message?: string
          phone_number?: string
          prospect_id?: string
          sent_at?: string | null
          sent_by?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_sent_by_fkey"
            columns: ["sent_by"]
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
      calculate_days_in_followup: {
        Args: { date_added_param: string; follow_ups_param: Json }
        Returns: number
      }
      get_user_company_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["company_role"]
      }
      get_user_product_key_plan: {
        Args: { _user_id: string }
        Returns: {
          plan_name: string
          expires_at: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_project_access: {
        Args: { project_uuid: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      has_valid_product_key: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_company_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "staff"
      company_role: "company_admin" | "employee"
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
    Enums: {
      app_role: ["admin", "manager", "staff"],
      company_role: ["company_admin", "employee"],
    },
  },
} as const
