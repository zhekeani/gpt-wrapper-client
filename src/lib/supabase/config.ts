export const getSupabaseConfig = () => {
  const isLocal = process.env.NEXT_PUBLIC_SUPABASE_ENV === "local";

  const requiredEnvVars = {
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

  const missingVars = Object.entries(requiredEnvVars)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `❌ Missing required Supabase environment variables: ${missingVars.join(
        ", "
      )}`
    );
  }

  return requiredEnvVars as {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
};
