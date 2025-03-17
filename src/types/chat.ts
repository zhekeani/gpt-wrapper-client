import { Tables } from "@/types/supabase.types";
import { ChatMessage } from "./chat-message";
import { LLMID } from "./llms";

export interface ChatSettings {
  model: LLMID;
  prompt: string;
  temperature: number;
  contextLength: number;
  includeProfileContext: boolean;
  includeWorkspaceInstructions: boolean;
  embeddingsProvider: "openai" | "local";
}

export interface ChatPayload {
  chatSettings: ChatSettings;
  workspaceInstructions: string;
  chatMessages: ChatMessage[];
  // assistant: Tables<"assistants"> | null
  // messageFileItems: Tables<"file_items">[]
  // chatFileItems: Tables<"file_items">[]
}

export interface ChatAPIPayload {
  chatSettings: ChatSettings;
  messages: Tables<"messages">[];
}
