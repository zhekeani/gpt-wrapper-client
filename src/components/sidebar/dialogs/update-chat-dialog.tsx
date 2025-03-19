import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateChatOnClient } from "@/lib/db/chats";
import { useItemsStore } from "@/store/items-store";
import { Tables } from "@/types/supabase.types";
import React, { ReactNode, useRef, useState } from "react";

interface UpdateChatProps {
  chat: Tables<"chats">;
  children: ReactNode;
}

const UpdateChatDialog = ({ chat, children }: UpdateChatProps) => {
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [name, setName] = useState(chat.name);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const setChats = useItemsStore((state) => state.setChats);

  const handleUpdateChat = async () => {
    const updatedChat = await updateChatOnClient(chat.id, {
      name,
    });
    setChats((prevState) =>
      prevState.map((c) => (c.id === chat.id ? updatedChat : c))
    );

    setShowChatDialog(false);
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
          <DialogTitle>Edit Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <Label>Name</Label>

          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowChatDialog(false)}>
            Cancel
          </Button>

          <Button ref={buttonRef} onClick={handleUpdateChat}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateChatDialog;
