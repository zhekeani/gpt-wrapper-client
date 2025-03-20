import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { cn } from "@/lib/utils";
import { useItemsStore } from "@/store/items-store";
import { Tables } from "@/types/supabase.types";
import { MessagesSquare, SquarePen } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { dateCategories, getSortedChats } from "../sidebar-helpers";

interface ChatSearchDialogProps {
  children: ReactNode;
  triggerAsChild?: boolean;
}

const ChatSearchDialog = ({
  children,
  triggerAsChild = true,
}: ChatSearchDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const chats = useItemsStore((state) => state.chats);

  const filteredChats: Tables<"chats">[] = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipWrapper
        asChild
        delayDuration={200}
        side="bottom"
        display={<div>Search chats</div>}
        trigger={
          <DialogTrigger asChild={triggerAsChild}>{children}</DialogTrigger>
        }
      />

      <DialogContent
        className="py-2 px-0 gap-3"
        closeClassName="top-5"
        aria-describedby={undefined}
      >
        <DialogTitle className="mr-11 ml-4 ">
          <Input
            placeholder="Search chats..."
            className="!bg-transparent border-0 focus-visible:ring-0 placeholder:text-sm placeholder:font-normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </DialogTitle>

        <div className="w-full h-[1px] bg-accent" />

        <div className="space-y-4 px-2 overflow-y-scroll scrollbar-thin ">
          <Button variant={"ghost"} className="w-full justify-start">
            <Link href={"/chat"} className="flex items-center gap-4 w-full">
              <SquarePen strokeWidth={2} />
              <p className="font-light text-sm">New chat</p>
            </Link>
          </Button>

          <div>
            {chats.length === 0 && (
              <div className=" text-center text-muted-foreground pt-4 pb-6 text-sm italic">
                No chats.
              </div>
            )}
            {chats.length > 0 && (
              <div>
                {dateCategories.map((dateCategory) => {
                  const sortedChats = getSortedChats(
                    filteredChats,
                    dateCategory
                  );

                  return (
                    sortedChats.length > 0 && (
                      <div key={dateCategory} className="pb-2">
                        <div className="ml-5  mb-3 text-xs font-semibold text-muted-foreground">
                          {dateCategory}
                        </div>

                        <div className={cn("flex grow flex-col gap-1")}>
                          {sortedChats.map((chat) => (
                            <Button
                              key={chat.id}
                              variant={"ghost"}
                              className="w-full justify-start"
                            >
                              <Link
                                href={`/chat/${chat.id}`}
                                className="flex w-full items-center gap-4"
                              >
                                <MessagesSquare strokeWidth={2} />
                                <p className="text-sm font-light">
                                  {chat.name}
                                </p>
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSearchDialog;
