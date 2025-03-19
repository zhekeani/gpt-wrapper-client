import ChatSideBar from "@/components/sidebar/chat-sidebar";
import { GptWrapperContext } from "@/context/context";
import { ReactNode, useContext } from "react";
import { SidebarInset, SidebarProvider } from "./sidebar";

const Dashboard = ({ children }: { children: ReactNode }) => {
  const { showSidebar, toggleSidebar } = useContext(GptWrapperContext);

  return (
    <SidebarProvider open={showSidebar} onOpenChange={toggleSidebar}>
      <ChatSideBar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
