import { create } from "zustand";

interface SidebarState {
  showSidebar: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  showSidebar: true,
  toggleSidebar: () => set((prev) => ({ showSidebar: !prev.showSidebar })),
}));
