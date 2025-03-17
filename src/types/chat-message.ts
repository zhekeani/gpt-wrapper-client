import { Tables } from "@/types/supabase.types";

export interface ChatMessage {
  message: Tables<"messages">;
  // fileItems: string[]
}
