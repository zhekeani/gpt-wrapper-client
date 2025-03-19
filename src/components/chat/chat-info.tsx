import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { usePassiveChatStore } from "@/store/passive-chat-store";
import { Info } from "lucide-react";

const ChatInfo = () => {
  const selectedChat = usePassiveChatStore((state) => state.selectedChat);

  if (!selectedChat) return null;

  return (
    <TooltipWrapper
      side="bottom"
      delayDuration={200}
      display={
        <div className="my-1">
          <div className="text-base font-bold">Chat Info</div>

          <div className="mx-auto mt-1 max-w-xs space-y-1 sm:max-w-sm md:max-w-md lg:max-w-lg">
            <div>
              Model: <strong>{selectedChat.model}</strong>
            </div>
            <div>
              Prompt: <strong>{selectedChat.prompt}</strong>
            </div>

            <div>
              Temperature: <strong>{selectedChat.temperature}</strong>
            </div>
            <div>
              Context Length: <strong>{selectedChat.context_length}</strong>
            </div>

            <div>
              Profile Context:{" "}
              <strong>
                {selectedChat.include_profile_context ? "Enabled" : "Disabled"}
              </strong>
            </div>
          </div>
        </div>
      }
      trigger={
        <div className="">
          <Info
            className="cursor-default hover:opacity-50 size-5"
            strokeWidth={2}
          />
        </div>
      }
    />
  );
};

export default ChatInfo;
