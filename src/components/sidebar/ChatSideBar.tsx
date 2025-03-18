import { Search, SquarePen } from "lucide-react";
import { ComponentProps } from "react";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "../ui/sidebar";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ChatSideBarProps extends ComponentProps<typeof Sidebar> {}

const ChatSideBar = ({ ...props }: ChatSideBarProps) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row w-full items-center justify-between h-14  px-2">
        <SidebarTrigger />

        <div className="flex items-center gap-2">
          <Button className="size-8" variant={"ghost"} size={"icon"}>
            <Search strokeWidth={2} className="!size-5" />
          </Button>

          <Button className="size-8" variant={"ghost"} size={"icon"}>
            <SquarePen strokeWidth={2} className="!size-5" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent></SidebarContent>
    </Sidebar>
  );
};

export default ChatSideBar;
