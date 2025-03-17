import { Database } from "@/types/supabase.types";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "./config";

export const getSupabaseReqResClient = ({
  request,
}: {
  request: NextRequest;
}) => {
  const response = {
    value: NextResponse.next({ request: request }),
  };

  const { url, anonKey } = getSupabaseConfig();

  if (url && anonKey) {
    const supabase = createServerClient<Database>(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response.value = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.value.cookies.set(name, value, options);
          });
        },
      },
    });

    return { supabase, response };
  }
};
