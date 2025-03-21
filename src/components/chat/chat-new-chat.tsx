import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import { useChatHandler } from "./chat-hooks/use-chat-handler";

const ChatNewChatBtn = () => {
  const { handleResetChat } = useChatHandler();

  return (
    <TooltipWrapper
      asChild
      side="bottom"
      delayDuration={200}
      display={<div>Start a new chat</div>}
      trigger={
        <Button onClick={handleResetChat} variant={"ghost"} size={"icon"}>
          <Link href={"/chat"}>
            <SquarePen className=" hover:opacity-50 !size-5" strokeWidth={2} />
          </Link>
        </Button>
      }
    />
  );
};

export default ChatNewChatBtn;
