"use client";

import Dashboard from "@/components/ui/dashboard";
import { GptWrapperContext } from "@/context/context";
import { getChatsByUserIdOnClient } from "@/lib/db/chats";
import { getPresetsByUserIdOnClient } from "@/lib/db/presets";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { LLMID } from "@/types/llms";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import Loading from "../loading";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const {
    setSelectedChat,
    setChatMessages,
    setUserInput,
    setIsGenerating,
    setFirstTokenReceived,
    setChatSettings,
    setChats,
    setPresets,
  } = useContext(GptWrapperContext);

  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef<boolean>(true);

  useEffect(() => {
    (async () => {
      if (isInitialLoad.current) {
        const supabase = getSupabaseBrowserClient();
        const session = (await supabase.auth.getSession()).data.session;

        if (!session) {
          return router.push("/login");
        }

        isInitialLoad.current = false;
      }
    })();
  }, [
    router,
    searchParams,
    setChatMessages,
    setChatSettings,
    setFirstTokenReceived,
    setIsGenerating,
    setSelectedChat,
    setUserInput,
  ]);

  useEffect(() => {
    (async () => await fetchChatsData())();

    setUserInput("");
    setChatMessages([]);
    setSelectedChat(null);

    setIsGenerating(false);
    setFirstTokenReceived(false);

    // DEFAULT CHAT SETTING
    setChatSettings({
      model: (searchParams.get("model") ||
        "mistralai/mixtral-8x22b-instruct") as LLMID,
      prompt: "You are a friendly, helpful AI assistant.",
      temperature: 0.5,
      contextLength: 4096,
      includeProfileContext: true,
    });
  }, []);

  const fetchChatsData = async () => {
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      return router.push("/login");
    }

    const chats = await getChatsByUserIdOnClient(user.id);
    setChats(chats);
    const presets = await getPresetsByUserIdOnClient(user.id);
    setPresets(presets);

    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return <Dashboard>{children}</Dashboard>;
};

export default ChatLayout;
