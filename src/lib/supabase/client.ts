import { createBrowserClient } from "@supabase/ssr";
import { clientEnv } from "../env";

export function createClient() {
  const env = clientEnv();
  // We use dummy URLs as fallback if not provided, just so the app doesn't crash during build/SSG
  // In production, these should be securely passed via Vercel env vars
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  
  return createBrowserClient(supabaseUrl, supabaseKey);
}
