import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { TablesInsert, TablesUpdate } from "@/types/supabase.types";

const supabase = getSupabaseBrowserClient();

export const getMessageByIdOnClient = async (messageId: string) => {
  const { data: message } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();

  if (!message) {
    throw new Error("Message not found");
  }

  return message;
};

export const getMessagesByChatIdOnClient = async (chatId: string) => {
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId);

  if (!messages) {
    throw new Error("Messages not found");
  }

  return messages;
};

export const createMessageOnClient = async (
  message: TablesInsert<"messages">
) => {
  const { data: createdMessage, error } = await supabase
    .from("messages")
    .insert([message])
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return createdMessage;
};

export const createMessagesOnClient = async (
  messages: TablesInsert<"messages">[]
) => {
  const { data: createdMessages, error } = await supabase
    .from("messages")
    .insert(messages)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return createdMessages;
};

export const updateMessageOnClient = async (
  messageId: string,
  message: TablesUpdate<"messages">
) => {
  const { data: updatedMessage, error } = await supabase
    .from("messages")
    .update(message)
    .eq("id", messageId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedMessage;
};

export const deleteMessageOnClient = async (messageId: string) => {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export async function deleteMessagesIncludingAndAfterOnClient(
  userId: string,
  chatId: string,
  sequenceNumber: number
) {
  const { error } = await supabase.rpc("delete_messages_including_and_after", {
    p_user_id: userId,
    p_chat_id: chatId,
    p_sequence_number: sequenceNumber,
  });

  if (error) {
    return {
      error: "Failed to delete messages.",
    };
  }

  return true;
}
