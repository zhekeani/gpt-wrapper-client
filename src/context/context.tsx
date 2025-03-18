import { ChatSettings } from "@/types/chat";
import { ChatMessage } from "@/types/chat-message";
import { OpenRouterLLM } from "@/types/llms";
import { Tables } from "@/types/supabase.types";
import { createContext, Dispatch, SetStateAction } from "react";

interface GptWrapperContext {
  // PROFILE STORE
  profile: Tables<"profiles"> | null;
  setProfile: Dispatch<SetStateAction<Tables<"profiles"> | null>>;

  // ITEMS STORE
  chats: Tables<"chats">[];
  setChats: Dispatch<SetStateAction<Tables<"chats">[]>>;
  presets: Tables<"presets">[];
  setPresets: Dispatch<SetStateAction<Tables<"presets">[]>>;

  // MODELS STORE
  availableOpenRouterModels: OpenRouterLLM[];
  setAvailableOpenRouterModels: Dispatch<SetStateAction<OpenRouterLLM[]>>;

  // PRESET STORE
  selectedPreset: Tables<"presets"> | null;
  setSelectedPreset: Dispatch<SetStateAction<Tables<"presets"> | null>>;

  // PASSIVE CHAT STORE
  userInput: string;
  setUserInput: Dispatch<SetStateAction<string>>;
  chatMessages: ChatMessage[];
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  chatSettings: ChatSettings | null;
  setChatSettings: Dispatch<SetStateAction<ChatSettings>>;
  selectedChat: Tables<"chats"> | null;
  setSelectedChat: Dispatch<SetStateAction<Tables<"chats"> | null>>;

  // ACTIVE CHAT STORE
  abortController: AbortController | null;
  setAbortController: Dispatch<SetStateAction<AbortController | null>>;
  firstTokenReceived: boolean;
  setFirstTokenReceived: Dispatch<SetStateAction<boolean>>;
  isGenerating: boolean;
  setIsGenerating: Dispatch<SetStateAction<boolean>>;

  // CHAT INPUT COMMAND STORE
  slashCommand: string;
  setSlashCommand: Dispatch<SetStateAction<string>>;
  hashtagCommand: string;
  setHashtagCommand: Dispatch<SetStateAction<string>>;
  atCommand: string;
  setAtCommand: Dispatch<SetStateAction<string>>;

  // RETRIEVAL STORE
  useRetrieval: boolean;
  setUseRetrieval: Dispatch<SetStateAction<boolean>>;
  sourceCount: number;
  setSourceCount: Dispatch<SetStateAction<number>>;

  // SIDEBAR
  showSidebar: boolean;
  toggleSidebar: () => void;
}

export const GptWrapperContext = createContext<GptWrapperContext>({
  // PROFILE STORE
  profile: null,
  setProfile: () => {},

  // ITEMS STORE

  chats: [],
  setChats: () => {},

  presets: [],
  setPresets: () => {},

  // MODELS STORE
  availableOpenRouterModels: [],
  setAvailableOpenRouterModels: () => {},

  // PRESET STORE
  selectedPreset: null,
  setSelectedPreset: () => {},

  // PASSIVE CHAT STORE
  userInput: "",
  setUserInput: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  chatMessages: [],
  setChatMessages: () => {},
  chatSettings: null,
  setChatSettings: () => {},

  // ACTIVE CHAT STORE
  isGenerating: false,
  setIsGenerating: () => {},
  firstTokenReceived: false,
  setFirstTokenReceived: () => {},
  abortController: null,
  setAbortController: () => {},

  // CHAT INPUT COMMAND STORE
  slashCommand: "",
  setSlashCommand: () => {},
  hashtagCommand: "",
  setHashtagCommand: () => {},
  atCommand: "",
  setAtCommand: () => {},

  // RETRIEVAL STORE
  useRetrieval: false,
  setUseRetrieval: () => {},
  sourceCount: 4,
  setSourceCount: () => {},

  // SIDEBAR
  showSidebar: false,
  toggleSidebar: () => {},
});
