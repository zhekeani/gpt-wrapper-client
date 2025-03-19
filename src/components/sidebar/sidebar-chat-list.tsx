import { cn } from "@/lib/utils";
import { useItemsStore } from "@/store/items-store";
import { Tables } from "@/types/supabase.types";
import { useEffect, useRef, useState } from "react";
import SidebarChatItem from "./sidebar-chat-item";

const SidebarChatList = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const chats = useItemsStore((state) => state.chats);

  const getSortedData = (
    chats: Tables<"chats">[],
    dateCategory: "Today" | "Yesterday" | "Previous Week" | "Older"
  ) => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(
      new Date().setDate(todayStart.getDate() - 1)
    );
    const oneWeekAgoStart = new Date(
      new Date().setDate(todayStart.getDate() - 7)
    );

    return chats
      .filter((chat) => {
        const chatItem = new Date(chat.updated_at || chat.created_at);
        switch (dateCategory) {
          case "Today":
            return chatItem >= todayStart;
          case "Yesterday":
            return chatItem >= yesterdayStart && chatItem < todayStart;
          case "Previous Week":
            return chatItem >= oneWeekAgoStart && chatItem < yesterdayStart;
          case "Older":
            return chatItem < oneWeekAgoStart;
          default:
            return true;
        }
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at || b.created_at).getTime() -
          new Date(a.updated_at || a.created_at).getTime()
      );
  };

  useEffect(() => {
    if (divRef.current) {
      setIsOverflowing(
        divRef.current.scrollHeight > divRef.current.clientHeight
      );
    }
  }, [chats]);

  return (
    <div ref={divRef} className="mt-2 flex flex-col overflow-auto">
      {chats.length === 0 && (
        <div className="flex grow flex-col items-center justify-center">
          <div className=" text-centertext-muted-foreground p-8 text-lg italic">
            No chats.
          </div>
        </div>
      )}

      <div
        className={cn(
          "h-full space-y-2 pt-2",
          isOverflowing ? "w-[calc(100%-8px)] mr-2" : "w-full"
        )}
      >
        {["Today", "Yesterday", "Previous Week", "Older"].map(
          (dateCategory) => {
            const sortedChats = getSortedData(
              chats,
              dateCategory as "Today" | "Yesterday" | "Previous Week" | "Older"
            );

            return (
              sortedChats.length > 0 && (
                <div key={dateCategory} className="pb-2">
                  <div className="text-muted-foreground mb-1 text-xs font-semibold">
                    {dateCategory}
                  </div>

                  <div className={cn("flex grow flex-col")}>
                    {sortedChats.map((chat) => (
                      <SidebarChatItem key={chat.id} chat={chat} />
                    ))}
                  </div>
                </div>
              )
            );
          }
        )}
      </div>
    </div>
  );
};

export default SidebarChatList;
