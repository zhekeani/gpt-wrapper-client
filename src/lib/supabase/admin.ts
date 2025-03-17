import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";
import { Database } from "@/types/supabase.types";

export const getSupabaseAdminClient = () => {
  const { url, serviceRoleKey } = getSupabaseConfig();

  if (serviceRoleKey && url) {
    return createClient<Database>(url, serviceRoleKey);
  }
};
