import Loading from "@/app/[locale]/loading";
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler";
import { useChatScroll } from "@/components/chat/chat-hooks/use-chat-scroll";
import HeaderProfileButton from "@/components/profile/header-profile-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getChatByIdOnClient } from "@/lib/db/chats";
import { getMessagesByChatIdOnClient } from "@/lib/db/messages";
import { cn } from "@/lib/utils";
import { useActiveChatStore } from "@/store/active-chat-store";
import { usePassiveChatStore } from "@/store/passive-chat-store";
import { useSidebarStore } from "@/store/sidebar-store";
import { LLMID } from "@/types/llms";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatInfo from "./chat-info";
import ChatInput from "./chat-input";
import { ChatMessages } from "./chat-messages";
import ChatNewChatBtn from "./chat-new-chat";
import ChatScrollBtn from "./chat-scroll-button";

const ChatContainer = () => {
  const isInitialLoad = useRef<boolean>(true);
  const params = useParams() as { chatId: string | null };
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(
    !!params.chatId || !!searchParams.get("chatId")
  );

  const setChatMessages = usePassiveChatStore((state) => state.setChatMessages);
  const setSelectedChat = usePassiveChatStore((state) => state.setSelectedChat);
  const setChatSettings = usePassiveChatStore((state) => state.setChatSettings);
  const isGenerating = useActiveChatStore((state) => state.isGenerating);
  const showSidebar = useSidebarStore((state) => state.showSidebar);
  const selectedChat = usePassiveChatStore((state) => state.selectedChat);

  const { handleFocusChatInput } = useChatHandler();

  const {
    messagesStartRef,
    messagesEndRef,
    handleScroll,
    scrollToBottom,
    setIsAtBottom,
    isAtTop,
    isAtBottom,
    isOverflowing,
    scrollToTop,
  } = useChatScroll();

  const fetchMessages = useCallback(
    async (chatId: string) => {
      const fetchedMessages = await getMessagesByChatIdOnClient(chatId);
      console.log(fetchedMessages);
      setChatMessages(fetchedMessages.map((message) => ({ message })));
    },
    [setChatMessages]
  );

  const fetchChat = useCallback(
    async (chatId: string) => {
      const chat = await getChatByIdOnClient(chatId);
      if (!chat) return;

      setSelectedChat(chat);
      setChatSettings({
        model: chat.model as LLMID,
        prompt: chat.prompt,
        temperature: chat.temperature,
        contextLength: chat.context_length,
        includeProfileContext: chat.include_profile_context,
      });
    },
    [setChatSettings, setSelectedChat]
  );

  useEffect(() => {
    const fetchData = async (chatId: string | null) => {
      if (chatId) {
        await Promise.all([fetchMessages(chatId), fetchChat(chatId)]);

        scrollToBottom();
        setIsAtBottom(true);

        handleFocusChatInput();
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    if (isInitialLoad.current) {
      const chatId = params.chatId || searchParams.get("chatId") || null;
      fetchData(chatId);
      isInitialLoad.current = false;
    }
  }, [
    fetchChat,
    fetchMessages,
    handleFocusChatInput,
    params.chatId,
    scrollToBottom,
    searchParams,
    setIsAtBottom,
  ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative size-full flex flex-col items-center ">
      <header className="flex sticky top-0 bg-background h-14 w-full shrink-0 items-center  px-4 border-b-[1px] border-b-accent">
        <div className="flex items-center gap-1">
          <SidebarTrigger className={cn("block", showSidebar && "md:hidden")} />
          <div className={cn(showSidebar ? "hidden" : "hidden sm:block")}>
            <ChatNewChatBtn />
          </div>
        </div>

        <div className=" flex w-full items-center justify-center  font-bold">
          <div className="max-w-[200px] truncate sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]">
            {selectedChat?.name || "Chat"}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <ChatInfo />
          <div className="hidden sm:block">
            <HeaderProfileButton />
          </div>
          <div className="sm:hidden">
            <ChatNewChatBtn />
          </div>
        </div>
      </header>

      <div
        className="flex size-full flex-col overflow-auto border-b-[1px] border-b-accent bg-background"
        onScroll={handleScroll}
      >
        <div ref={messagesStartRef} />

        <ChatMessages />

        <div ref={messagesEndRef} />
      </div>

      <div className="relative w-full items-end px-2 pb-3 pt-0 sm:max-w-[600px] sm:pb-8 sm:pt-5 md:max-w-[700px] lg:max-w-[700px] xl:max-w-[800px]">
        <ChatInput />
        {!isGenerating && !showSidebar && (
          <div className="hidden absolute bottom-40 -right-16 md:flex justify-center">
            <ChatScrollBtn
              isAtTop={isAtTop}
              isAtBottom={isAtBottom}
              isOverflowing={isOverflowing}
              scrollToTop={scrollToTop}
              scrollToBottom={() => scrollToBottom("smooth")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
