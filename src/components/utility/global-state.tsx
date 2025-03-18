"use client";

import { GptWrapperContext } from "@/context/context";
import { fetchOpenRouterModels } from "@/lib/models/fetch-models";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { ChatSettings } from "@/types/chat";
import { ChatMessage } from "@/types/chat-message";
import { OpenRouterLLM } from "@/types/llms";
import { Tables } from "@/types/supabase.types";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { getProfileByUserIdOnClient } from "../../lib/db/profile";

interface GlobalStateProps {
  children: ReactNode;
}

export const GlobalState = ({ children }: GlobalStateProps) => {
  const router = useRouter();

  // PROFILE STORE
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);

  // ITEMS STORE
  const [chats, setChats] = useState<Tables<"chats">[]>([]);
  const [presets, setPresets] = useState<Tables<"presets">[]>([]);

  // MODELS STORE
  const [availableOpenRouterModels, setAvailableOpenRouterModels] = useState<
    OpenRouterLLM[]
  >([]);

  // PRESET STORE
  const [selectedPreset, setSelectedPreset] =
    useState<Tables<"presets"> | null>(null);

  // PASSIVE CHAT STORE
  const [userInput, setUserInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "gpt-4-turbo-preview",
    prompt: "You are a helpful AI assistant.",
    temperature: 0.5,
    contextLength: 4000,
    includeProfileContext: true,
  });
  const [selectedChat, setSelectedChat] = useState<Tables<"chats"> | null>(
    null
  );

  // ACTIVE CHAT STORE
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [firstTokenReceived, setFirstTokenReceived] = useState<boolean>(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  // CHAT INPUT COMMAND STORE
  const [slashCommand, setSlashCommand] = useState("");
  const [hashtagCommand, setHashtagCommand] = useState("");
  const [atCommand, setAtCommand] = useState("");

  // RETRIEVAL STORE
  const [useRetrieval, setUseRetrieval] = useState<boolean>(true);
  const [sourceCount, setSourceCount] = useState<number>(4);

  // SIDEBAR
  const [showSidebar, setShowSidebar] = useState<boolean>(
    // localStorage.getItem("showSidebar") === "true"
    true
  );

  const handleToggleSidebar = () => {
    setShowSidebar((prevState) => !prevState);
    localStorage.setItem("showSidebar", String(!showSidebar));
  };

  useEffect(() => {
    (async () => {
      const profile = await fetchStartingData();

      if (profile && profile["openrouter_api_key"]) {
        const openRouterModels = await fetchOpenRouterModels();
        if (!openRouterModels) return;
        setAvailableOpenRouterModels(openRouterModels);
      }
    })();
  }, []);

  const fetchStartingData = async () => {
    const supabase = getSupabaseBrowserClient();
    const session = (await supabase.auth.getSession()).data.session;

    if (session) {
      const user = session.user;

      const profile = await getProfileByUserIdOnClient(user.id);
      setProfile(profile);

      if (user.confirmed_at && !profile.has_onboarded) {
        return router.push("/setup");
      }

      return profile;
    }
  };

  return (
    <GptWrapperContext.Provider
      value={{
        // PROFILE STORE
        profile,
        setProfile,

        // ITEMS STORE
        chats,
        setChats,
        presets,
        setPresets,

        // MODELS STORE
        availableOpenRouterModels,
        setAvailableOpenRouterModels,

        // PRESET STORE
        selectedPreset,
        setSelectedPreset,

        // PASSIVE CHAT STORE
        userInput,
        setUserInput,
        chatMessages,
        setChatMessages,
        chatSettings,
        setChatSettings,
        selectedChat,
        setSelectedChat,

        // ACTIVE CHAT STORE
        isGenerating,
        setIsGenerating,
        firstTokenReceived,
        setFirstTokenReceived,
        abortController,
        setAbortController,

        // CHAT INPUT COMMAND STORE
        slashCommand,
        setSlashCommand,
        hashtagCommand,
        setHashtagCommand,
        atCommand,
        setAtCommand,

        // RETRIEVAL STORE
        useRetrieval,
        setUseRetrieval,
        sourceCount,
        setSourceCount,

        // SIDEBAR
        showSidebar,
        toggleSidebar: handleToggleSidebar,
      }}
    >
      {children}
    </GptWrapperContext.Provider>
  );
};
