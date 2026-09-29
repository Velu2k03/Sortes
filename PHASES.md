# Sortes build: phase prompts

How to use: put CLAUDE.md in the repo root. Start a fresh session per phase and paste that phase's block. Don't move on until the "Done when" checks pass. Each phase ends with a 5-line report.

Owner inputs needed along the way: git name/email (Phase 1), contact email for the Wikimedia User-Agent (Phase 3), crisis resources list (Phase 7), OpenRouter, Supabase, Lemon Squeezy, and Umami keys (Phases 7 to 10), refund policy and support email (Phase 10).

---

## Phase 1: Setup and guardrails
Read CLAUDE.md. Then:
- Create the Next.js app (TypeScript, Tailwind, App Router, ESLint). Pin versions. `git init`.
- Set git identity. If the owner hasn't given a name and email, ask. It must not contain the forbidden term.
- `.gitignore`, `.env.example` (names only: NEXT_PUBLIC_SITE_URL, OPENROUTER_API_KEY, OPENROUTER_MODELS, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_WEBHOOK_SECRET, LEMONSQUEEZY_VARIANT_PACK_5, _12, _30, NEXT_PUBLIC_UMAMI_WEBSITE_ID, NEXT_PUBLIC_UMAMI_SRC, CRON_SECRET).
- `lib/env.ts` validating server env with zod.
- `scripts/verify.ts` and `npm run verify`: typecheck, lint, build, forbidden-term grep (exclude CLAUDE.md, PHASES.md, scripts/verify.ts, node_modules, .next, .git, lockfiles), git author check, secrets grep. Leave a hook for phase-specific checks.
- Base metadata: `metadataBase` = https://tarot.resonantatlas.com, canonical helper, default title and description.

Done when: `npm run verify` passes and the first commit exists.

---

## Phase 2: Competitor research (capped)
Read CLAUDE.md. Do not write app code. Then:
- Study Labyrinthos, Golden Thread Tarot, and Biddy Tarot with at most 12 page fetches total.
- Record only what you actually fetched. If a page is blocked, paywalled, or JS-only, write `UNVERIFIED` and move on.
- Map per site: landing, onboarding, reading flow step by step, where paywalls appear, how card meanings are shown, mobile patterns.
- Write RESEARCH.md: short findings per site, 5+ UX patterns worth copying, 3 mistakes to avoid. Every item cites a source URL or is marked UNVERIFIED. Never copy their text.

Done when: RESEARCH.md exists and every pattern has a source or an UNVERIFIED label.

---

## Phase 3: Card data and images
Read CLAUDE.md and RESEARCH.md. Then:
- `lib/cards/schema.ts` (zod): id, name, arcana, suit (null for Major), number, keywords {upright[], reversed[]}, meaning {upright, reversed}, image path.
- Naming: `major-00-fool.jpg` through `major-21-world.jpg`; minor as `wands-ace.jpg`, `wands-02.jpg` to `wands-10.jpg`, `wands-page.jpg`, `-knight`, `-queen`, `-king`, same for cups, swords, pentacles.
- Write original meanings (50 to 80 words each way, 4 to 6 keywords each way). Work in batches: Major (22), then one suit at a time (14). Validate and commit after each batch.
- `scripts/fetch-cards.ts`: use the Wikimedia Commons API with a proper User-Agent (ask the owner for a contact email), at least 1s between requests, resumable. Only the 1909 Smith scans. Check each file's license field is public domain. Save to `public/cards`, resize to at most 700px wide, JPEG quality about 82.
- Add card checks to verify: 78 entries, unique ids, 22 Major plus 14 per suit, every image exists, each between 5KB and 200KB, consistent dimensions.

Done when: verify passes with the card checks and all 78 images are present.

---

## Phase 4: Design system and brand assets
Read CLAUDE.md. Then:
- Search the web at most 3 times for current design patterns in mystical/spiritual apps. Write DESIGN.md: hex color tokens (deep navy/purple backgrounds, gold accents), type scale (Cormorant Garamond headings via next/font, clean sans body), spacing, radii, motion durations and easings, minimum tap target 44px. Cite sources briefly.
- Write STYLE.md once: "deep navy and gold, art nouveau mysticism, fine celestial linework", plus palette hexes, stroke widths, and recurring motifs. Every asset follows it.
- Hand-write SVGs for: logo (casting lots plus celestial motif), card back (ornate, gold on navy, 2:3 like the card faces), hero background, favicon mark.
- `scripts/build-assets.ts` (sharp) exports: icons 192 and 512 plus maskable versions (safe-zone padding), apple-touch 180, favicon set, OG image 1200x630, hero WebP. Use WebP with PNG fallback for icons.
- Check visually once: render a single contact sheet and look at that, not each asset.

Done when: assets are in `public/`, DESIGN.md and STYLE.md exist, and the script prints file sizes.

---

## Phase 5: Components, Home, Deck
Read CLAUDE.md, DESIGN.md, RESEARCH.md. Then:
- Components: Card (front/back, 3D flip with framer-motion, tap or swipe, respects reduced motion), StarField (canvas, few particles, pauses when hidden), Header (credit balance placeholder), Button, Sheet/Modal.
- Home: hero, "Draw a Card" CTA (goes to the Daily Card), short explanation of tarot.
- Deck: all 78 cards, filter by arcana and suit, card detail (bottom sheet on mobile, modal on desktop) with upright and reversed meaning.
- No horizontal scroll at 360px. Use `next/image` with sizes and lazy loading.

Done when: Playwright smoke tests at 360px and 1280px pass: no horizontal overflow, 78 cards render, filters give 22/14/14/14/14.

---

## Phase 6: Spreads, Daily Card, history, share
Read CLAUDE.md, DESIGN.md. Then:
- Spread config as data: Quick Insight (1), Past/Present/Future (3), Celtic Cross (10). Celtic Cross must fit 360px without horizontal scroll (stacked layout on mobile, cross layout on desktop).
- Shuffle animation, deal face down, tap to flip. Use `crypto.getRandomValues`. Reversal chance is a config constant (default 0.5).
- Daily Card: one draw per local date, stored in localStorage as {date, cardId, reversed}, static meaning, zero intake.
- History in localStorage with a versioned schema: list, detail, and an "Ask a follow-up" button (a placeholder until Phase 9).
- Share: html-to-image export of a dedicated share component with branding and tarot.resonantatlas.com. Cards and one short line only, never the user's story.

Done when: Playwright tests pass: every spread flips all cards, the daily card persists across reload and changes with a mocked date, a history entry saves, and share produces a PNG blob.

---

## Phase 7: Intake and AI readings
Read CLAUDE.md. Then:
- Config-driven intake: category (Love and Relationships, Career and Work, Finances and Money, Academics and Studies, Health and Wellness) leads to that category's fields, each ending with story and one exact question. Zod schemas shared by client and server. Flow: category, form, confirmation with Continue, processing (calming animation), reading.
  - Love: both people (first names, ages, birthdays, relationship status, nickname), current situation.
  - Career: current status, position, dream goal, challenge.
  - Finances: income source, goal, struggle, desired outcome.
  - Academics: school level, course, challenges.
  - Health: wellness concern, current situation, desired outcome.
- `lib/ai/buildPrompt.ts` as an allowlist with unit tests: fixtures containing surnames, birthdays, and emails must not appear in the output.
- `lib/ai/generate.ts`, server-side only via `/api/readings`: models from `OPENROUTER_MODELS`, 25s timeout, try the next model once, then the static reading built from card meanings and position text (instant). Cache the result by reading id.
- `scripts/pick-free-models.ts`: fetch OpenRouter's live model list, print the free ones with context length for the owner to choose. Apply the privacy setting from CLAUDE.md.
- Safety as in CLAUDE.md: crisis check before any model call, code-appended disclaimers, language matching. Ask the owner for `content/crisis-resources.md`.
- Tests use a mocked model and never call the real API.

Done when: unit tests pass, a crisis fixture makes no model call, a simulated model failure returns the static reading in under 1s. The owner runs one real reading with their key.

---

## Phase 8: Auth and database
Read CLAUDE.md. Then:
- Supabase migrations in `supabase/migrations`: profiles (user id, email, credits), transactions, readings, intakes (with `expires_at`), free-reading claims. RLS on everywhere. Users read only their own rows; the service role is used only on the server.
- Anonymous sign-in on first need, magic link to sign in or upgrade. On login, merge localStorage history into the database (dedupe by client id).
- Account page: credit balance and purchase history.
- `spend_credits` SQL function (atomic, row lock, never negative).
- `/api/cron/purge-intakes` protected by `CRON_SECRET`, scheduled daily in `vercel.json`.

Done when: scripts or SQL tests show concurrent spends can't go negative, user A can't read user B's rows, and the purge deletes only expired intakes.

---

## Phase 9: Payments and buying psychology
Read CLAUDE.md. Use Lemon Squeezy test mode only. Then:
- `lib/payments` wrapper. Create checkouts through the Lemon Squeezy API (read the current docs first) with the pack's variant, the checkout email, and `user_id` as custom data. Redirect to `/checkout/success`.
- Webhook per CLAUDE.md. Store every transaction.
- Success page polls the balance for up to 10s, then continues straight into the reading (instant reveal).
- Credit balance always in the header, top-up prompt at zero, pack cards with MOST POPULAR on the 12-pack and the per-reading price on each.
- Locked spreads show blurred card previews with "Unlock this reading". After the free reading: "Want to go deeper? Unlock the Celtic Cross" with one-tap buy.
- `scripts/simulate-webhook.ts` signs payloads with the test secret. Cases: valid (credits added), bad signature (rejected, no credits), duplicate (credited once), refund.

Done when: all four simulated cases pass. The owner completes one test-mode purchase using the test card from the Lemon Squeezy docs.

---

## Phase 10: Legal, analytics, PWA, QA, README
Read CLAUDE.md. Then:
- Privacy Policy and Terms of Service, marked as drafts pending review. Must state: readings are for reflection only and not guaranteed predictions; health readings never diagnose; intake stories are deleted after 30 days; only first names and minimized story content go to the AI provider (no promise the story text is free of other details). Also: 18+ only, Lemon Squeezy as merchant of record, retention, contact. Ask the owner for the refund policy and support email.
- Umami via `next/script` with the four events.
- PWA: manifest (name, short_name, description, theme and background colors, icons including maskable, start_url, scope, display standalone), meta tags, OG images, canonical URLs for tarot.resonantatlas.com. Service worker: versioned precache of shell, cards.json, and 78 images, old-cache cleanup, offline fallback page. Install banner (Android/desktop prompt, iOS instructions), dismissible and remembered.
- README: setup, env var table with where to get each key (link the official docs, UNVERIFIED if unsure), Supabase setup, Vercel deploy. Domain: in the Vercel project add tarot.resonantatlas.com (use the CLI only if already logged in, otherwise document it as a manual step), then at the DNS provider create a CNAME for `tarot` pointing to cname.vercel-dns.com. Do not modify the root or apex records.
- Final QA script or checklist: all 78 cards load, every spread works, the free first reading works, a test-mode purchase works, offline mode works, no overflow at 360px.

Done when: verify passes, the offline Playwright test passes, and the README is complete.
