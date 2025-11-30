// Database types for Supabase
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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image: string | null
          parent_id: string | null
          product_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
          product_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
          product_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          logo: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          mrp_price: number
          discount: number
          category_id: string | null
          brand_id: string | null
          rating: number
          review_count: number
          stock: number
          in_stock: boolean
          status: string
          is_new: boolean
          is_hot_deal: boolean
          is_featured: boolean
          seller_id: string | null
          advertised: boolean
          advertised_until: string | null
          campaign_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          mrp_price: number
          category_id?: string | null
          brand_id?: string | null
          rating?: number
          review_count?: number
          stock?: number
          status?: string
          is_new?: boolean
          is_hot_deal?: boolean
          is_featured?: boolean
          seller_id?: string | null
          advertised?: boolean
          advertised_until?: string | null
          campaign_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          mrp_price?: number
          category_id?: string | null
          brand_id?: string | null
          rating?: number
          review_count?: number
          stock?: number
          status?: string
          is_new?: boolean
          is_hot_deal?: boolean
          is_featured?: boolean
          seller_id?: string | null
          advertised?: boolean
          advertised_until?: string | null
          campaign_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          width: number
          height: number
          is_primary: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt?: string | null
          width?: number
          height?: number
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt?: string | null
          width?: number
          height?: number
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
      }
      product_specifications: {
        Row: {
          id: string
          product_id: string
          name: string
          value: string
          category: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          value: string
          category?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          value?: string
          category?: string | null
          display_order?: number
          created_at?: string
        }
      }
      product_features: {
        Row: {
          id: string
          product_id: string
          feature: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          feature: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          feature?: string
          display_order?: number
          created_at?: string
        }
      }
      product_tags: {
        Row: {
          id: string
          product_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          tag?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar: string | null
          phone: string | null
          theme: string
          currency: string
          language: string
          email_notifications: boolean
          push_notifications: boolean
          sms_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar?: string | null
          phone?: string | null
          theme?: string
          currency?: string
          language?: string
          email_notifications?: boolean
          push_notifications?: boolean
          sms_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar?: string | null
          phone?: string | null
          theme?: string
          currency?: string
          language?: string
          email_notifications?: boolean
          push_notifications?: boolean
          sms_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          quantity: number
          selected_variant: string | null
          added_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          quantity?: number
          selected_variant?: string | null
          added_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string
          quantity?: number
          selected_variant?: string | null
          added_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          wishlist_id: string
          product_id: string
          added_at: string
        }
        Insert: {
          id?: string
          wishlist_id: string
          product_id: string
          added_at?: string
        }
        Update: {
          id?: string
          wishlist_id?: string
          product_id?: string
          added_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: string
          subtotal: number
          tax: number
          shipping: number
          total: number
          payment_method: string
          payment_status: string
          tracking_number: string | null
          shipping_address_id: string | null
          billing_address_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: string
          subtotal: number
          tax?: number
          shipping?: number
          total: number
          payment_method: string
          payment_status?: string
          tracking_number?: string | null
          shipping_address_id?: string | null
          billing_address_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: string
          subtotal?: number
          tax?: number
          shipping?: number
          total?: number
          payment_method?: string
          payment_status?: string
          tracking_number?: string | null
          shipping_address_id?: string | null
          billing_address_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          comment: string | null
          verified: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          comment?: string | null
          verified?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          verified?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
