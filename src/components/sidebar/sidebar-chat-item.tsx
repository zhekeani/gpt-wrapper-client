"use client";

import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { GptWrapperContext } from "@/context/context";
import { cn } from "@/lib/utils";
import { LLM } from "@/types/llms";
import { Tables } from "@/types/supabase.types";
import { BotMessageSquare, Edit, Sparkles, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useRef } from "react";
import DeleteChatDialog from "./dialogs/delete-chat-dialog";
import UpdateChatDialog from "./dialogs/update-chat-dialog";

interface SidebarChatItemProps {
  chat: Tables<"chats">;
}

const SidebarChatItem = ({ chat }: SidebarChatItemProps) => {
  const { selectedChat, availableOpenRouterModels } =
    useContext(GptWrapperContext);

  const router = useRouter();
  const params = useParams();
  const isActive = params.chatid === chat.id || selectedChat?.id === chat.id;

  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    return router.push(`/chat/${chat.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      itemRef.current?.click();
    }
  };

  const MODEL_DATA = availableOpenRouterModels.find(
    (llm) => llm.modelId === chat.model
  ) as LLM;

  // const assistantImage = assistantImages.find(
  //   image => image.assistantId === chat.assistant_id
  // )?.base64

  const assistantImage = null;

  return (
    <div
      ref={itemRef}
      className={cn(
        "hover:bg-accent focus:bg-accent flex w-full group/item cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none",
        isActive && "bg-accent"
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      {chat.assistant_id ? (
        assistantImage ? (
          <Image
            style={{ width: "30px", height: "30px" }}
            className="rounded"
            src={assistantImage}
            alt="Assistant image"
            width={30}
            height={30}
          />
        ) : (
          <BotMessageSquare
            className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
            size={30}
          />
        )
      ) : (
        <TooltipWrapper
          delayDuration={200}
          side="top"
          display={<div>{MODEL_DATA?.modelName}</div>}
          trigger={
            <Sparkles className="size-5 cursor-pointer" strokeWidth={2} />
          }
        />
      )}

      <div className="ml-3 flex-1 truncate text-sm font-medium">
        {chat.name}
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={`ml-2 flex space-x-2 ${!isActive && "w-11 opacity-0 group-hover/item:opacity-100"}`}
      >
        <UpdateChatDialog chat={chat}>
          <Edit className="hover:opacity-50  size-4" strokeWidth={1.5} />
        </UpdateChatDialog>

        <DeleteChatDialog chat={chat}>
          <Trash2 className="hover:opacity-50 size-4" strokeWidth={1.5} />
        </DeleteChatDialog>
      </div>
    </div>
  );
};

export default SidebarChatItem;
