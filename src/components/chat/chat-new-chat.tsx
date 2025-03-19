import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "../ui/button";

const ChatNewChatBtn = () => {
  const { handleNewChat } = useChatHandler();

  return (
    <TooltipWrapper
      asChild
      side="bottom"
      delayDuration={200}
      display={<div>Start a new chat</div>}
      trigger={
        <Button onClick={handleNewChat} variant={"ghost"} size={"icon"}>
          <MessageSquarePlus
            className=" hover:opacity-50 !size-5"
            strokeWidth={2}
          />
        </Button>
      }
    />
  );
};

export default ChatNewChatBtn;
