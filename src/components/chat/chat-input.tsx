import { useChatHandler } from "@/app/[locale]/chat/chat-hooks/use-chat-handler";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { GptWrapperContext } from "@/context/context";
import { cn } from "@/lib/utils";
import { CircleStop, Send } from "lucide-react";
import { KeyboardEvent, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

const ChatInput = () => {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { t } = useTranslation();

  const { userInput, chatMessages, isGenerating, setUserInput } =
    useContext(GptWrapperContext);

  const { chatInputRef, handleSendMessage, handleStopMessage } =
    useChatHandler();

  const handleKeyDown = (event: KeyboardEvent<Element>) => {
    if (!isTyping && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(userInput, chatMessages, false);
    }
  };

  console.log(chatMessages);

  return (
    <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
      {/* <div className="absolute bottom-[76px] left-0 max-h-[300px] w-full overflow-auto rounded-xl dark:border-none">
      <ChatCommandInput />
    </div> */}

      <TextareaAutosize
        textareaRef={chatInputRef}
        className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent pl-6 pr-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={t(
          // `Ask anything. Type "@" for assistants, "/" for prompts, "#" for files, and "!" for tools.`
          // `Ask anything. Type @  /  #  !`
          `Ask anything.`
        )}
        onValueChange={setUserInput}
        value={userInput}
        minRows={1}
        maxRows={18}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsTyping(true)}
        onCompositionEnd={() => setIsTyping(false)}
      />

      <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
        {isGenerating ? (
          <CircleStop
            className="hover:bg-background animate-pulse rounded bg-transparent p-1"
            onClick={handleStopMessage}
            size={30}
          />
        ) : (
          <Send
            className={cn(
              "bg-primary text-secondary rounded p-1",
              !userInput && "cursor-not-allowed opacity-50"
            )}
            onClick={() => {
              if (!userInput) return;

              handleSendMessage(userInput, chatMessages, false);
            }}
            size={30}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInput;
