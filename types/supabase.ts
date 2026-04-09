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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_name: string
          earned_at: string
          icon_url: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_name: string
          earned_at?: string
          icon_url?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_name?: string
          earned_at?: string
          icon_url?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          published_at: string | null
          title: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          published_at?: string | null
          title: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          published_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blogs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["challenge_difficulty"]
          id: string
          points_awarded: number
          status: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["challenge_difficulty"]
          id?: string
          points_awarded: number
          status?: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["challenge_difficulty"]
          id?: string
          points_awarded?: number
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
        }
        Relationships: []
      }
      demo_admin_allowlist: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          capacity: number
          category: string | null
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          registered_count: number
          start_time: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Insert: {
          banner_url?: string | null
          capacity?: number
          category?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          registered_count?: number
          start_time: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Update: {
          banner_url?: string | null
          capacity?: number
          category?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          registered_count?: number
          start_time?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          album_id: string
          created_at: string
          id: string
          image_url: string
        }
        Insert: {
          album_id: string
          created_at?: string
          id?: string
          image_url: string
        }
        Update: {
          album_id?: string
          created_at?: string
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string
          github_url: string | null
          id: string
          linkedin_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          streak_count: number
          tech_stack: string[] | null
          total_score: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          streak_count?: number
          tech_stack?: string[] | null
          total_score?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          streak_count?: number
          tech_stack?: string[] | null
          total_score?: number
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          featured: boolean
          id: string
          likes_count: number
          live_url: string | null
          repo_url: string | null
          status: Database["public"]["Enums"]["project_status"]
          tech_stack: string[]
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          likes_count?: number
          live_url?: string | null
          repo_url?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          tech_stack?: string[]
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          likes_count?: number
          live_url?: string | null
          repo_url?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          tech_stack?: string[]
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          challenge_id: string
          created_at: string
          feedback: string | null
          github_url: string
          id: string
          live_url: string | null
          status: Database["public"]["Enums"]["submission_status"]
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          feedback?: string | null
          github_url: string
          id?: string
          live_url?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          feedback?: string | null
          github_url?: string
          id?: string
          live_url?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          batch: string | null
          created_at: string
          designation: string
          id: string
          is_alumni: boolean
          profile_id: string
          skills: string[]
        }
        Insert: {
          batch?: string | null
          created_at?: string
          designation: string
          id?: string
          is_alumni?: boolean
          profile_id: string
          skills?: string[]
        }
        Update: {
          batch?: string | null
          created_at?: string
          designation?: string
          id?: string
          is_alumni?: boolean
          profile_id?: string
          skills?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "team_members_profile_id_fkey"
            columns: ["profile_id"]
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
      elevate_to_admin: { Args: { target_user_id: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      request_demo_admin_access: { Args: never; Returns: boolean }
    }
    Enums: {
      challenge_difficulty: "EASY" | "MEDIUM" | "HARD"
      event_status: "DRAFT" | "PUBLISHED" | "COMPLETED"
      project_status: "IN_PROGRESS" | "BETA" | "LIVE"
      submission_status: "PENDING" | "APPROVED" | "REJECTED"
      user_role: "MEMBER" | "ADMIN"
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
      challenge_difficulty: ["EASY", "MEDIUM", "HARD"],
      event_status: ["DRAFT", "PUBLISHED", "COMPLETED"],
      project_status: ["IN_PROGRESS", "BETA", "LIVE"],
      submission_status: ["PENDING", "APPROVED", "REJECTED"],
      user_role: ["MEMBER", "ADMIN"],
    },
  },
} as const
