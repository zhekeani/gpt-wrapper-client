import { ReactNode, useContext } from "react";
import { GptWrapperContext } from "../../context/context";
import ChatSideBar from "../sidebar/ChatSideBar";
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
