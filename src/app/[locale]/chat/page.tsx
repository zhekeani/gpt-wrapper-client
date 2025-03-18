"use client";

import { useContext } from "react";
import ChatSettings from "../../../components/chat/chat-settings";
import { SidebarTrigger } from "../../../components/ui/sidebar";
import { GptWrapperContext } from "../../../context/context";

const ChatPage = () => {
  const { showSidebar } = useContext(GptWrapperContext);

  return (
    <div className="size-full">
      <header className="flex sticky top-0 bg-background h-14 w-full shrink-0 items-center justify-between px-4 border-b-[1px] border-b-accent">
        <div>{!showSidebar && <SidebarTrigger />}</div>

        <ChatSettings />
      </header>
    </div>
  );
};

export default ChatPage;
