# Sortes by Resonant Atlas: agent rules

Read this file at the start of every session. Phase prompts live in PHASES.md. Do one phase per session.

## Product
Tarot web app and installable PWA. Full name "Sortes by Resonant Atlas", PWA short_name "Sortes", tagline "Cast the lots. Read your story." Lives at https://tarot.resonantatlas.com (subdomain only). Mobile-first (test at 360px), works on desktop.

## Hard rules
1. Never touch or reference the site on the root domain resonantatlas.com. Only the `tarot` subdomain.
2. The forbidden term (the owner's professional portfolio name, spelled d-r-v-e-l-u) must never appear in code, config, docs, package metadata, git author/committer, or the Vercel project name. `npm run verify` greps for it (excluding CLAUDE.md, PHASES.md, scripts/verify.ts).
3. Never invent model IDs, hotline numbers, API fields, URLs, prices, or library APIs. Read the docs or query the live API. If you can't verify something, write `UNVERIFIED` and ask.
4. Secrets live only in `.env.local` (gitignored). `.env.example` has names only. Never log secrets, full prompts, or intake data.
5. The server decides money. Credit amounts come from a server-side map of Lemon Squeezy variant to credits. Never trust client-sent amounts.
6. Don't ask about anything listed under Decisions. Ask only when blocked or when a choice isn't listed.

## Decisions (final unless the owner edits this file)
- Stack: Next.js App Router, TypeScript, Tailwind, framer-motion, html-to-image. Deploy on Vercel. Pin versions.
- DB and auth: Supabase (Postgres + Auth). Anonymous sign-in for guests, email magic link for accounts.
- Payments: Lemon Squeezy, credit packs only in v1: 5 for $3.99, 12 for $7.99 (MOST POPULAR), 30 for $14.99. Put it behind a `lib/payments` wrapper so the provider can be swapped.
- Credit cost per reading: Quick Insight 1, Past/Present/Future 2, Celtic Cross 3. Show the per-credit price on every pack.
- Free forever: Daily Card (no intake).
- First personalized reading is free: a 3-card Past/Present/Future with intake and AI, once per anonymous user, limited by IP hash and a global daily AI cap.
- AI: OpenRouter, model list from env, static card meanings as instant fallback. Deduct a credit only when the AI reading succeeds.
- Analytics: Umami (cloud free tier or self-hosted). Events: pageview, reading_started, reading_completed, purchase_completed.
- Push notifications: not in v1.
- Card faces: the 1909 Pamela Colman Smith Rider-Waite scans from Wikimedia Commons (public domain), not modern reprints.
- All other art (logo, card back, icons, OG image, hero): hand-written SVG in code, exported by script. No AI raster generators.

## Architecture notes
- Guest flow: anonymous session, checkout carries `user_id` as custom data, webhook credits that user and attaches the checkout email. A magic link later upgrades the account. This gives instant reveal after payment with no account step.
- Webhook (`/api/webhooks/lemonsqueezy`): verify the HMAC signature on the raw body per the Lemon Squeezy docs, be idempotent by order id (unique constraint), handle paid and refunded events, store email, pack, amount, date.
- Spend credits through one Postgres function with a row lock so concurrent requests can't go negative.
- AI prompt builder is an allowlist. Sent: first names, category fields, relationship status, story, exact question, cards (name, upright/reversed, position). Never sent: surnames, birthdays, emails. Unit-test this. The UI tells users not to type full names in the story, and the Privacy Policy says data is minimized rather than promising the story text is clean.
- Intake rows carry `expires_at` (30 days). A daily Vercel cron (protected by `CRON_SECRET`) deletes them. Generated reading text is kept and cached by reading id, so history never re-calls the API.
- Safety: guardrails in the system prompt, plus a server-side crisis-phrase check (English and Tagalog) before any model call. On a hit, return a supportive static message with no reading and no charge. Crisis resources come only from `content/crisis-resources.md`, which the owner supplies. Never invent phone numbers.
- Health and finance disclaimers are appended by code, not by the model, so they can't be dropped. Health: reflection only, never diagnose, cannot replace a licensed professional.
- Language: English by default, match Tagalog/Taglish if the story is written that way.
- Offline: the service worker precaches the app shell, cards.json, and all 78 images. History, Daily Card, and static meanings work offline. AI readings need a network.
- Privacy on OpenRouter: request no data collection (check the provider routing docs for the exact parameter). If that leaves no eligible free model, report it and ask the owner. Never silently allow logging or training.

## Working rules (save tokens)
- Start each session with only CLAUDE.md and that phase's prompt.
- Read only the files you need. Never print cards.json, images, lockfiles, or long logs (use head, tail, grep, counts).
- Verify with scripts (`npm run verify`), not by eye. Never open card images to check them.
- Commit small: `feat(scope): ...` after each working feature, after verify passes.
- No new dependency without a one-line reason. Don't refactor untouched code.
- Max 2 retries on any failing tool or external call, then stop and report.
- End every phase with a report of at most 5 lines: what's done, verify result, UNVERIFIED items, decisions needed. Then stop.

## Definition of done (every phase)
`npm run verify` passes (typecheck, lint, build, forbidden-term and secrets greps, phase checks) and the work is committed.
