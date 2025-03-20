"use client";

import Dashboard from "@/components/ui/dashboard";
import { getChatsByUserIdOnClient } from "@/lib/db/chats";
import { getPresetsByUserIdOnClient } from "@/lib/db/presets";
import { getProfileByUserIdOnClient } from "@/lib/db/profile";
import { fetchOpenRouterModels } from "@/lib/models/fetch-models";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useActiveChatStore } from "@/store/active-chat-store";
import { useItemsStore } from "@/store/items-store";
import { useModelsStore } from "@/store/models-store";
import { usePassiveChatStore } from "@/store/passive-chat-store";
import { useProfileStore } from "@/store/user-profile-store";
import { LLMID } from "@/types/llms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Loading from "../loading";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const setProfile = useProfileStore((state) => state.setProfile);
  const setAvailableOpenRouterModels = useModelsStore(
    (state) => state.setAvailableOpenRouterModels
  );

  const setSelectedChat = usePassiveChatStore((state) => state.setSelectedChat);
  const setChatMessages = usePassiveChatStore((state) => state.setChatMessages);
  const setUserInput = usePassiveChatStore((state) => state.setUserInput);
  const setChatSettings = usePassiveChatStore((state) => state.setChatSettings);

  const setIsGenerating = useActiveChatStore((state) => state.setIsGenerating);
  const setFirstTokenReceived = useActiveChatStore(
    (state) => state.setFirstTokenReceived
  );

  const setChats = useItemsStore((state) => state.setChats);
  const setPresets = useItemsStore((state) => state.setPresets);

  const fetchProfileAndModels = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const profile = await getProfileByUserIdOnClient(user.id);
    setProfile(profile);

    if (profile?.openrouter_api_key) {
      const openRouterModels = await fetchOpenRouterModels();
      if (openRouterModels) {
        setAvailableOpenRouterModels(openRouterModels);
      }
    }
  }, [router, setAvailableOpenRouterModels, setProfile]);

  const fetchChatsData = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const [chats, presets] = await Promise.all([
      getChatsByUserIdOnClient(user.id),
      getPresetsByUserIdOnClient(user.id),
    ]);

    setChats(chats);
    setPresets(presets);
  }, [router, setChats, setPresets]);

  const resetChatState = useCallback(() => {
    setUserInput("");
    setChatMessages([]);
    setSelectedChat(null);
    setIsGenerating(false);
    setFirstTokenReceived(false);

    setChatSettings({
      model: (searchParams.get("model") ||
        "mistralai/mixtral-8x22b-instruct") as LLMID,
      prompt: "You are a friendly, helpful AI assistant.",
      temperature: 0.5,
      contextLength: 4096,
      includeProfileContext: true,
    });
  }, [
    searchParams,
    setChatMessages,
    setChatSettings,
    setFirstTokenReceived,
    setIsGenerating,
    setSelectedChat,
    setUserInput,
  ]);

  useEffect(() => {
    if (isInitialLoad.current) {
      setLoading(true);

      resetChatState();
      fetchProfileAndModels();
      fetchChatsData();

      isInitialLoad.current = false;
      setLoading(false);
    }
  }, [fetchChatsData, fetchProfileAndModels, resetChatState]);

  if (loading) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard>{children}</Dashboard>
    </QueryClientProvider>
  );
};

export default ChatLayout;
