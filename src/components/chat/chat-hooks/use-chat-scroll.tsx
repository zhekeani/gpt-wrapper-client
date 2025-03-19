import { useActiveChatStore } from "@/store/active-chat-store";
import { usePassiveChatStore } from "@/store/passive-chat-store";
import {
  type UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const useChatScroll = () => {
  const isGenerating = useActiveChatStore((state) => state.isGenerating);
  const chatMessages = usePassiveChatStore((state) => state.chatMessages);

  const messagesStartRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);

  const [isAtTop, setIsAtTop] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [userScrolled, setUserScrolled] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "instant") => {
    isAutoScrolling.current = true;

    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior });
      }

      isAutoScrolling.current = false;
    }, 100);
  }, []);

  useEffect(() => {
    setUserScrolled(false);

    if (!isGenerating && userScrolled) {
      setUserScrolled(false);
    }
  }, [isGenerating, userScrolled]);

  useEffect(() => {
    if (isGenerating && !userScrolled) {
      scrollToBottom();
    }
  }, [chatMessages, isGenerating, scrollToBottom, userScrolled]);

  const handleScroll: UIEventHandler<HTMLDivElement> = useCallback((e) => {
    const target = e.target as HTMLDivElement;
    const bottom =
      Math.round(target.scrollHeight) - Math.round(target.scrollTop) ===
      Math.round(target.clientHeight);
    setIsAtBottom(bottom);

    const top = target.scrollTop === 0;
    setIsAtTop(top);

    if (!bottom && !isAutoScrolling.current) {
      setUserScrolled(true);
    } else {
      setUserScrolled(false);
    }

    const isOverflow = target.scrollHeight > target.clientHeight;
    setIsOverflowing(isOverflow);
  }, []);

  const scrollToTop = useCallback(() => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  return {
    messagesStartRef,
    messagesEndRef,
    isAtTop,
    isAtBottom,
    userScrolled,
    isOverflowing,
    handleScroll,
    scrollToTop,
    scrollToBottom,
    setIsAtBottom,
  };
};
