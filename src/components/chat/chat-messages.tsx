import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler";
import Message from "@/components/message/message";
import { usePassiveChatStore } from "@/store/passive-chat-store";
import { Tables } from "@/types/supabase.types";
import { useState } from "react";

export const ChatMessages = () => {
  const [editingMessage, setEditingMessage] = useState<Tables<"messages">>();
  const chatMessages = usePassiveChatStore((state) => state.chatMessages);

  const { handleSendEdit } = useChatHandler();

  console.log(chatMessages);

  return chatMessages
    .sort((a, b) => a.message.sequence_number - b.message.sequence_number)
    .map((chatMessage, index, array) => {
      return (
        <Message
          key={chatMessage.message.sequence_number}
          message={chatMessage.message}
          isEditing={editingMessage?.id === chatMessage.message.id}
          isLast={index === array.length - 1}
          onStartEdit={setEditingMessage}
          onCancelEdit={() => setEditingMessage(undefined)}
          onSubmitEdit={handleSendEdit}
        />
      );
    });
};
