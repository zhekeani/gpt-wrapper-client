import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteChatOnClient } from "@/lib/db/chats";
import { useItemsStore } from "@/store/items-store";
import { Tables } from "@/types/supabase.types";
import React, { ReactNode, useRef, useState } from "react";

interface DeleteChatProps {
  chat: Tables<"chats">;
  children: ReactNode;
}

const DeleteChatDialog = ({ chat, children }: DeleteChatProps) => {
  const [showChatDialog, setShowChatDialog] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const setChats = useItemsStore((state) => state.setChats);
  const { handleNewChat } = useChatHandler();

  const handleDeleteChat = async () => {
    await deleteChatOnClient(chat.id);
    setChats((prevState) => prevState.filter((c) => c.id !== chat.id));

    setShowChatDialog(false);
    handleNewChat();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      buttonRef.current?.click();
    }
  };

  return (
    <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Delete {chat.name}</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this chat?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowChatDialog(false)}>
            Cancel
          </Button>

          <Button
            ref={buttonRef}
            variant="destructive"
            onClick={handleDeleteChat}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChatDialog;
