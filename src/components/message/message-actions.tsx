import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useActiveChatStore } from "@/store/active-chat-store";
import { Check, Copy, Repeat } from "lucide-react";
import { useEffect, useState } from "react";

interface MessageActionsProps {
  isAssistant: boolean;
  isLast: boolean;
  isEditing: boolean;
  isHovering: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onRegenerate: () => void;
}

export const MessageActions = ({
  isLast,
  isEditing,
  isHovering,
  onCopy,
  onRegenerate,
}: MessageActionsProps) => {
  const isGenerating = useActiveChatStore((state) => state.isGenerating);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleCopy = () => {
    onCopy();
    setShowCheckmark(true);
  };

  useEffect(() => {
    if (showCheckmark) {
      const timer = setTimeout(() => {
        setShowCheckmark(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showCheckmark]);

  return (isLast && isGenerating) || isEditing ? null : (
    <div className="text-muted-foreground flex items-center space-x-2">
      {(isHovering || isLast) && (
        <TooltipWrapper
          delayDuration={1000}
          side="bottom"
          display={<div>Copy</div>}
          trigger={
            showCheckmark ? (
              <Check className="size-4" strokeWidth={1.5} />
            ) : (
              <Copy
                className="cursor-pointer hover:opacity-50 size-4"
                strokeWidth={1.5}
                onClick={handleCopy}
              />
            )
          }
        />
      )}

      {isLast && (
        <TooltipWrapper
          delayDuration={1000}
          side="bottom"
          display={<div>Regenerate</div>}
          trigger={
            <Repeat
              className="size-4 cursor-pointer hover:opacity-50"
              strokeWidth={1.5}
              onClick={onRegenerate}
            />
          }
        />
      )}
    </div>
  );
};
