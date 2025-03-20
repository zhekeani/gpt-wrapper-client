import { Tables } from "@/types/supabase.types";

export type DateCategory = "Today" | "Yesterday" | "Previous Week" | "Older";

export const dateCategories: DateCategory[] = [
  "Today",
  "Yesterday",
  "Previous Week",
  "Older",
];

export const getSortedChats = (
  chats: Tables<"chats">[],
  dateCategory: DateCategory
) => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(new Date().setDate(todayStart.getDate() - 1));
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
