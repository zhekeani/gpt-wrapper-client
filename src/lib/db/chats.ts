import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { TablesInsert, TablesUpdate } from "@/types/supabase.types";

const supabase = getSupabaseBrowserClient();

export const getChatByIdOnClient = async (chatId: string) => {
  const { data: chat } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .maybeSingle();

  return chat;
};

export const getChatsByUserIdOnClient = async (userId: string) => {
  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!chats) {
    throw new Error(error.message);
  }

  return chats;
};

export const createChatOnClient = async (chat: TablesInsert<"chats">) => {
  const { data: createdChat, error } = await supabase
    .from("chats")
    .insert([chat])
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return createdChat;
};

export const createChatsOnClient = async (chats: TablesInsert<"chats">[]) => {
  const { data: createdChats, error } = await supabase
    .from("chats")
    .insert(chats)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return createdChats;
};

export const updateChatOnClient = async (
  chatId: string,
  chat: TablesUpdate<"chats">
) => {
  const { data: updatedChat, error } = await supabase
    .from("chats")
    .update(chat)
    .eq("id", chatId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedChat;
};

export const deleteChatOnClient = async (chatId: string) => {
  const { error } = await supabase.from("chats").delete().eq("id", chatId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
