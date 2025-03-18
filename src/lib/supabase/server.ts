import { Database } from "@/types/supabase.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

export const getSupabaseCookiesUtilClient = async () => {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseConfig("server");

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          console.error("Failed to set cookies", error);
        }
      },
    },
  });
};
