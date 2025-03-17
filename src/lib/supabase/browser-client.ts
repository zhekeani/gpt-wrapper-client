import { Database } from "@/types/supabase.types";
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

export const getSupabaseBrowserClient = () => {
  const { url, anonKey } = getSupabaseConfig();

  if (url && anonKey) {
    return createBrowserClient<Database>(url, anonKey);
  }
};
