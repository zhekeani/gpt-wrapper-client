"use client";

import ChatContainer from "@/components/chat/chat-container";
import ChatInput from "@/components/chat/chat-input";
import ChatSettings from "@/components/chat/chat-settings";
import HeaderProfileButton from "@/components/profile/header-profile-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePassiveChatStore } from "@/store/passive-chat-store";
import { useSidebarStore } from "@/store/sidebar-store";

const ChatPage = () => {
  const showSidebar = useSidebarStore((state) => state.showSidebar);
  const chatMessages = usePassiveChatStore((state) => state.chatMessages);

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="size-full flex flex-col relative items-center ">
          <header className="flex sticky top-0 bg-background h-14 w-full shrink-0 items-center justify-between px-4 border-b-[1px] border-b-accent">
            <div className="flex items-center">
              <SidebarTrigger
                className={cn("block", showSidebar && "md:hidden")}
              />
              <ChatSettings />
            </div>

            <div className="flex items-center gap-2">
              <HeaderProfileButton />
            </div>
          </header>

          <div className="flex grow size-full items-center justify-center border-b-[1px] border-b-accent" />

          <div className="relative w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:max-w-[600px] sm:pb-8 sm:pt-5 md:max-w-[700px] lg:max-w-[700px] xl:max-w-[800px]">
            <ChatInput />
          </div>
        </div>
      ) : (
        <ChatContainer />
      )}
    </>
  );
};

export default ChatPage;
