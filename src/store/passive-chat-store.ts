import { ChatSettings } from "@/types/chat";
import { ChatMessage } from "@/types/chat-message";
import { LLMID } from "@/types/llms";
import { SetState } from "@/types/store";
import { Tables } from "@/types/supabase.types";
import { create } from "zustand";

interface PassiveChatState {
  userInput: string;
  setUserInput: (input: SetState<string>) => void;
  chatMessages: ChatMessage[];
  setChatMessages: (messages: SetState<ChatMessage[]>) => void;
  chatSettings: ChatSettings;
  setChatSettings: (settings: SetState<ChatSettings>) => void;
  selectedChat: Tables<"chats"> | null;
  setSelectedChat: (chat: SetState<Tables<"chats"> | null>) => void;
}

export const usePassiveChatStore = create<PassiveChatState>((set) => ({
  userInput: "",
  setUserInput: (input) =>
    set((prev) => ({
      userInput: typeof input === "function" ? input(prev.userInput) : input,
    })),
  chatMessages: [],
  setChatMessages: (messages) =>
    set((prev) => ({
      chatMessages:
        typeof messages === "function" ? messages(prev.chatMessages) : messages,
    })),
  chatSettings: {
    model: "mistralai/mixtral-8x22b-instruct" as LLMID,
    prompt: "You are a helpful AI assistant.",
    temperature: 0.5,
    contextLength: 4000,
    includeProfileContext: true,
  },
  setChatSettings: (settings) =>
    set((prev) => ({
      chatSettings:
        typeof settings === "function" ? settings(prev.chatSettings) : settings,
    })),
  selectedChat: null,
  setSelectedChat: (chat) =>
    set((prev) => ({
      selectedChat: typeof chat === "function" ? chat(prev.selectedChat) : chat,
    })),
}));
