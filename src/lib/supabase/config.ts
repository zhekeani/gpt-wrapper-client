export const getSupabaseConfig = () => {
  const isLocal = process.env.NEXT_PUBLIC_SUPABASE_ENV === "local";

  return {
    url: isLocal
      ? process.env.NEXT_PUBLIC_SUPABASE_URL_LOCAL
      : process.env.NEXT_PUBLIC_SUPABASE_URL_REMOTE,
    anonKey: isLocal
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_LOCAL
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_REMOTE,
    serviceRoleKey: isLocal
      ? process.env.SUPABASE_SERVICE_ROLE_KEY_LOCAL
      : process.env.SUPABASE_SERVICE_ROLE_KEY_REMOTE,
  };
};
