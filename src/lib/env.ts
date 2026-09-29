import { z } from "zod";

/**
 * Server-only environment variables validated at build/runtime.
 * Import this module only from server code (API routes, server components).
 */

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("https://tarot.resonantatlas.com"),

  // OpenRouter
  OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required").optional(),
  OPENROUTER_MODELS: z
    .string()
    .min(1)
    .optional()
    .transform((s) => s ? s.split(",").map((m) => m.trim()) : ["google/gemini-2.5-flash:free"]),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Lemon Squeezy
  LEMONSQUEEZY_API_KEY: z.string().min(1).optional(),
  LEMONSQUEEZY_STORE_ID: z.string().min(1).optional(),
  LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(1).optional(),
  LEMONSQUEEZY_VARIANT_PACK_5: z.string().min(1).optional(),
  LEMONSQUEEZY_VARIANT_PACK_12: z.string().min(1).optional(),
  LEMONSQUEEZY_VARIANT_PACK_30: z.string().min(1).optional(),

  // Umami
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
  NEXT_PUBLIC_UMAMI_SRC: z.string().url().optional(),

  // Cron
  CRON_SECRET: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validated server environment. Throws at import time if required vars are
 * missing — fail fast in dev, fail at build in CI.
 *
 * During build, some server-only keys may not be present (e.g. in CI without
 * secrets). We parse lazily via a getter so the build itself doesn't crash;
 * the first server-side import at runtime will still throw if vars are missing.
 */
let _serverEnv: ServerEnv | undefined;

export function serverEnv(): ServerEnv {
  if (!_serverEnv) {
    const result = serverEnvSchema.safeParse(process.env);
    if (!result.success) {
      const formatted = result.error.flatten().fieldErrors;
      console.error("❌ Invalid server environment variables:", formatted);
      throw new Error(
        `Missing or invalid environment variables: ${Object.keys(formatted).join(", ")}`,
      );
    }
    _serverEnv = result.data;
  }
  return _serverEnv;
}

/**
 * Client-safe public environment variables.
 * These are inlined at build time by Next.js (NEXT_PUBLIC_ prefix).
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("https://tarot.resonantatlas.com"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
  NEXT_PUBLIC_UMAMI_SRC: z.string().url().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

let _clientEnv: ClientEnv | undefined;

export function clientEnv(): ClientEnv {
  if (!_clientEnv) {
    _clientEnv = clientEnvSchema.parse({
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_UMAMI_WEBSITE_ID:
        process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
      NEXT_PUBLIC_UMAMI_SRC: process.env.NEXT_PUBLIC_UMAMI_SRC,
    });
  }
  return _clientEnv;
}
