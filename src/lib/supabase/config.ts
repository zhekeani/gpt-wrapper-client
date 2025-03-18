export const getSupabaseConfig = (env: "server" | "client" = "server") => {
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
    .filter(
      ([key, value]) =>
        !value && !(env === "client" && key === "serviceRoleKey")
    )
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.log(missingVars);
    throw new Error(
      `❌ Missing required Supabase environment variables: ${missingVars.join(
        ", "
      )}`
    );
  }

  return requiredEnvVars as {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
};
