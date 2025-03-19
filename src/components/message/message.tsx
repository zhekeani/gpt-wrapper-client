import { useChatHandler } from "@/app/[locale]/chat/chat-hooks/use-chat-handler";
import { Button } from "@/components/ui/button";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { GptWrapperContext } from "@/context/context";
import { cn } from "@/lib/utils";
import { LLM } from "@/types/llms";
import { Tables } from "@/types/supabase.types";
import { LoaderCircle, Pencil, Smile, Sparkles } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { MessageActions } from "./message-actions";
import { MessageMarkdown } from "./message-markdown";

interface MessageProps {
  message: Tables<"messages">;
  isEditing: boolean;
  isLast: boolean;
  onStartEdit: (message: Tables<"messages">) => void;
  onCancelEdit: () => void;
  onSubmitEdit: (value: string, sequenceNumber: number) => void;
}

const Message = ({
  message,
  isEditing,
  isLast,
  onCancelEdit,
  onStartEdit,
  onSubmitEdit,
}: MessageProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.content);

  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const {
    profile,
    setIsGenerating,
    availableOpenRouterModels,
    chatMessages,
    firstTokenReceived,
    isGenerating,
  } = useContext(GptWrapperContext);

  const { handleSendMessage } = useChatHandler();

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.content);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = message.content;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleSendEdit = () => {
    onSubmitEdit(editedMessage, message.sequence_number);
    onCancelEdit();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEditing && event.key === "Enter" && event.metaKey) {
      handleSendEdit();
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    await handleSendMessage(
      editedMessage || chatMessages[chatMessages.length - 2].message.content,
      chatMessages,
      true
    );
  };

  const handleStartEdit = () => {
    onStartEdit(message);
  };

  useEffect(() => {
    setEditedMessage(message.content);

    if (isEditing && editInputRef.current) {
      const input = editInputRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, [isEditing]);

  const MODEL_DATA = availableOpenRouterModels.find(
    (llm) => llm.modelId === message.model
  ) as LLM;

  return (
    <div
      className={cn(
        "flex w-full justify-center",
        message.role === "user" ? "" : "bg-secondary"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={handleKeyDown}
    >
      <div className="relative flex w-full flex-col p-6 sm:max-w-[550px] sm:px-0 md:max-w-[650px] lg:max-w-[650px] xl:max-w-[700px]">
        <div className="absolute right-5 top-7 sm:right-0">
          <MessageActions
            onCopy={handleCopy}
            onEdit={handleStartEdit}
            isAssistant={message.role === "assistant"}
            isLast={isLast}
            isEditing={isEditing}
            isHovering={isHovering}
            onRegenerate={handleRegenerate}
          />
        </div>
        <div className="space-y-3">
          {message.role === "system" ? (
            <div className="flex items-center space-x-4">
              <Pencil className="border-primary bg-primary text-secondary rounded border-DEFAULT p-1 size-6" />

              <div className="text-lg font-semibold">Prompt</div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {message.role === "assistant" ? (
                <TooltipWrapper
                  display={<div>{MODEL_DATA?.modelName}</div>}
                  trigger={<Sparkles className="size-6" />}
                />
              ) : profile?.image_url ? (
                <Image
                  className={`size-[32px] rounded`}
                  src={profile?.image_url}
                  height={28}
                  width={28}
                  alt="user image"
                />
              ) : (
                <Smile className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1 size-6" />
              )}

              <div className="font-semibold">
                {message.role === "assistant"
                  ? MODEL_DATA?.modelName
                  : (profile?.display_name ?? profile?.username)}
              </div>
            </div>
          )}
          {!firstTokenReceived &&
          isGenerating &&
          isLast &&
          message.role === "assistant" ? (
            <LoaderCircle
              className="animate-spin !aspect-square size-5"
              strokeWidth={2}
            />
          ) : isEditing ? (
            <TextareaAutosize
              textareaRef={editInputRef}
              className="text-md"
              value={editedMessage}
              onValueChange={setEditedMessage}
              maxRows={20}
            />
          ) : (
            <MessageMarkdown content={message.content} />
          )}
        </div>

        {isEditing && (
          <div className="mt-4 flex justify-center space-x-2">
            <Button size="sm" onClick={handleSendEdit}>
              Save & Send
            </Button>

            <Button size="sm" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
