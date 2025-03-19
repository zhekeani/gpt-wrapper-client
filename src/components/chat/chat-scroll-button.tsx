import { CircleArrowDown } from "lucide-react";

interface ChatScrollButtonProps {
  isAtTop: boolean;
  isAtBottom: boolean;
  isOverflowing: boolean;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

const ChatScrollBtn = ({
  isAtBottom,
  isOverflowing,
  scrollToBottom,
}: ChatScrollButtonProps) => {
  return (
    <>
      {!isAtBottom && isOverflowing && (
        <CircleArrowDown
          className="cursor-pointer opacity-50 hover:opacity-100 size-8"
          strokeWidth={1.5}
          onClick={scrollToBottom}
        />
      )}
    </>
  );
};

export default ChatScrollBtn;
