import ChatSideBar from "@/components/sidebar/chat-sidebar";
import { useSidebarStore } from "@/store/sidebar-store";
import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "./sidebar";

const Dashboard = ({ children }: { children: ReactNode }) => {
  const { showSidebar, toggleSidebar } = useSidebarStore();

  return (
    <SidebarProvider open={showSidebar} onOpenChange={toggleSidebar}>
      <ChatSideBar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
