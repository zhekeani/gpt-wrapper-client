import { cn } from "@/lib/utils";
import { useItemsStore } from "@/store/items-store";
import { useEffect, useRef, useState } from "react";
import SidebarChatItem from "./sidebar-chat-item";
import { dateCategories, getSortedChats } from "./sidebar-helpers";

const SidebarChatList = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const chats = useItemsStore((state) => state.chats);

  useEffect(() => {
    if (divRef.current) {
      setIsOverflowing(
        divRef.current.scrollHeight > divRef.current.clientHeight
      );
    }
  }, [chats]);

  return (
    <div ref={divRef} className="mt-2 flex flex-col overflow-auto px-3">
      {chats.length === 0 && (
        <div className="flex grow flex-col items-center justify-center">
          <div className=" text-center text-muted-foreground p-8 text-base italic">
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
        {dateCategories.map((dateCategory) => {
          const sortedChats = getSortedChats(
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
        })}
      </div>
    </div>
  );
};

export default SidebarChatList;
