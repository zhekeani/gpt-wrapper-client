export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chats: {
        Row: {
          assistant_id: string | null
          context_length: number
          created_at: string
          embeddings_provider: string
          folder_id: string | null
          id: string
          include_profile_context: boolean
          include_workspace_instructions: boolean
          model: string
          name: string
          prompt: string
          sharing: string
          temperature: number
          updated_at: string | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          assistant_id?: string | null
          context_length: number
          created_at?: string
          embeddings_provider: string
          folder_id?: string | null
          id?: string
          include_profile_context: boolean
          include_workspace_instructions: boolean
          model: string
          name: string
          prompt: string
          sharing?: string
          temperature: number
          updated_at?: string | null
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          assistant_id?: string | null
          context_length?: number
          created_at?: string
          embeddings_provider?: string
          folder_id?: string | null
          id?: string
          include_profile_context?: boolean
          include_workspace_instructions?: boolean
          model?: string
          name?: string
          prompt?: string
          sharing?: string
          temperature?: number
          updated_at?: string | null
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          assistant_id: string | null
          chat_id: string
          content: string
          created_at: string
          id: string
          model: string
          role: string
          sequence_number: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assistant_id?: string | null
          chat_id: string
          content: string
          created_at?: string
          id?: string
          model: string
          role: string
          sequence_number: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assistant_id?: string | null
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          model?: string
          role?: string
          sequence_number?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      presets: {
        Row: {
          context_length: number
          created_at: string
          description: string
          embeddings_provider: string
          folder_id: string | null
          id: string
          include_profile_context: boolean
          include_workspace_instructions: boolean
          model: string
          name: string
          prompt: string
          sharing: string
          temperature: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_length: number
          created_at?: string
          description: string
          embeddings_provider: string
          folder_id?: string | null
          id?: string
          include_profile_context?: boolean
          include_workspace_instructions?: boolean
          model: string
          name: string
          prompt: string
          sharing?: string
          temperature: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_length?: number
          created_at?: string
          description?: string
          embeddings_provider?: string
          folder_id?: string | null
          id?: string
          include_profile_context?: boolean
          include_workspace_instructions?: boolean
          model?: string
          name?: string
          prompt?: string
          sharing?: string
          temperature?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          anthropic_api_key: string | null
          azure_openai_35_turbo_id: string | null
          azure_openai_45_turbo_id: string | null
          azure_openai_45_vision_id: string | null
          azure_openai_api_key: string | null
          azure_openai_embeddings_id: string | null
          azure_openai_endpoint: string | null
          bio: string
          created_at: string
          display_name: string
          google_gemini_api_key: string | null
          groq_api_key: string | null
          has_onboarded: boolean
          id: string
          image_path: string
          image_url: string
          mistral_api_key: string | null
          openai_api_key: string | null
          openai_organization_id: string | null
          openrouter_api_key: string | null
          perplexity_api_key: string | null
          profile_context: string
          updated_at: string | null
          use_azure_openai: boolean
          user_id: string
          username: string
        }
        Insert: {
          anthropic_api_key?: string | null
          azure_openai_35_turbo_id?: string | null
          azure_openai_45_turbo_id?: string | null
          azure_openai_45_vision_id?: string | null
          azure_openai_api_key?: string | null
          azure_openai_embeddings_id?: string | null
          azure_openai_endpoint?: string | null
          bio: string
          created_at?: string
          display_name: string
          google_gemini_api_key?: string | null
          groq_api_key?: string | null
          has_onboarded?: boolean
          id?: string
          image_path: string
          image_url: string
          mistral_api_key?: string | null
          openai_api_key?: string | null
          openai_organization_id?: string | null
          openrouter_api_key?: string | null
          perplexity_api_key?: string | null
          profile_context: string
          updated_at?: string | null
          use_azure_openai?: boolean
          user_id: string
          username: string
        }
        Update: {
          anthropic_api_key?: string | null
          azure_openai_35_turbo_id?: string | null
          azure_openai_45_turbo_id?: string | null
          azure_openai_45_vision_id?: string | null
          azure_openai_api_key?: string | null
          azure_openai_embeddings_id?: string | null
          azure_openai_endpoint?: string | null
          bio?: string
          created_at?: string
          display_name?: string
          google_gemini_api_key?: string | null
          groq_api_key?: string | null
          has_onboarded?: boolean
          id?: string
          image_path?: string
          image_url?: string
          mistral_api_key?: string | null
          openai_api_key?: string | null
          openai_organization_id?: string | null
          openrouter_api_key?: string | null
          perplexity_api_key?: string | null
          profile_context?: string
          updated_at?: string | null
          use_azure_openai?: boolean
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object_from_bucket: {
        Args: {
          bucket_name: string
          object_path: string
        }
        Returns: Record<string, unknown>
      }
    }
    Enums: {
      [_ in never]: never
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

