# Implementation Prompt: Neon Auth (Google + Email/Password)

## Goal
Add authentication to SpotX using **Neon Auth** (Neon's hosted auth service, powered by Stack Auth), with **Google OAuth** and **email + password** as the sign-in methods.

## Current State (verified)
- Next.js 16.3.3 (App Router, Turbopack), React 19, Tailwind v4, Poppins/Inter fonts.
- Neon already wired: `neon.ts` (config, currently `auth: false`), `.neon` (project `sweet-paper-62993203`), `neon.ts`, `index.ts` (Drizzle client), `db/schema.ts`.
- Drizzle ORM + drizzle-kit installed; `drizzle.config.ts` points schema at `./src/db/schema.ts` (file actually lives at `./db/schema.ts` — mismatch, fix as a drive-by).
- Repo managed by AGENTS.md; design tokens in `app/globals.css`.

## Prerequisites — expected from the user (not code)
These must exist before signing in works:
1. Auth service **enabled** in the Neon Console (project → Authentication) — or flip `neon.ts` to `auth: true` and run `neon auth enable`.
2. Provider config in the Neon Console: **Email + Password** and **Google** enabled. Google requires an OAuth **Client ID + Secret** created in Google Cloud Console (Authorized redirect URI provided by Neon).
3. The three env values copied into `.env`:
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`
   Add placeholders to `.env.example`. `STACK_SECRET_SERVER_KEY` is server-only; the two `NEXT_PUBLIC_*` are client-safe.

## Skills & Docs
- No dedicated skill. Package docs: `@stackframe/stack` (Stack Auth) via npm readme + https://docs.stack-auth.com. Neon itself is already configured in this repo.

## Decisions / Assumptions
- Use the Neon-hosted Stack Auth path (SDK `@stackframe/stack`), not a self-hosted auth server and not a roll-your-own JWT.
- Google + email/password are provisioned in the Neon console, not in code. The SDK only renders the prebuilt `SignIn`/`SignUp` UI and session handling.
- Keep all routes public by default; protection is opt-in per route via `StackServerApp.getUser()`/`requireUser()`.

## Files to Create / Modify
1. `neon.ts` — set `auth: true` in config (so the Neon CLI/console treat auth as the default service). (Low risk; primary enabling happens in console.)
2. `npm install @stackframe/stack` (+ `server-only` already available transitively via Next; add if needed).
3. `lib/stack.ts` (new, server-only) — `export const stackServerApp = new StackServerApp({ tokenStore: "nextjs-cookie" })`.
4. `app/handler/[...stack]/route.ts` (new) — `export const GET/POST = StackHandler` to power auth pages, OAuth callbacks, and account settings.
5. `app/layout.tsx` — wrap children in `<StackProvider app={stackServerApp}><StackTheme>…` (must become a server component wrapping client-safe providers).
6. `app/(auth)/sign-in/page.tsx` and `app/(auth)/sign-up/page.tsx` (new) — render Stack's prebuilt `SignIn`/`SignUp` components.
7. `app/api/auth/[...]` — none needed; the `handler` route owns all auth endpoints.
8. `.env` / `.env.example` — add the three Neon/Stack variables (real values in `.env`, placeholders in `.env.example`).
9. Optional `middleware.ts` — `StackMiddleware` when a route must be protected (leave bare/absent for now unless a page needs it).
10. `drizzle.config.ts` — fix schema path `./src/db/schema.ts` → `./db/schema.ts` (drive-by correction).

## Security Requirements
- `STACK_SECRET_SERVER_KEY` never reaches the browser. It is read only via `process.env` in server code (`lib/stack.ts`, route handlers).
- `.env` stays git-ignored (verify `.gitignore`). Only `.env.example` is committed.
- No client-side token storage beyond Stack Auth's own cookie/session handling.
- Auth wiring must not expose the Neon read/write tokens or the DB URL to the client.

## Acceptance Criteria
1. `npm run dev` → `/sign-in` and `/sign-up` render Stack's auth UI with Google and email/password options (once providers are enabled in Neon).
2. Signing in with Google creates a session; `await stackServerApp.getUser()` returns the user.
3. Signing in with email/password works (password flow enabled in Neon).
4. `/handler/[...stack]` routes respond (GET/POST) and power OAuth callback + account settings.
5. Layout renders with StackProvider without breaking the existing SpotX design system.
6. Type check + lint pass; build succeeds.
7. `.env.example` is the canonical list of the three new variables.

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit` (scoped to our files)
- `npm run build`
- `npm run dev` then manually visit `/sign-in`, `/sign-up`, `/handler/account-settings`.

## Manual Test Steps
1. Start dev server; open `/sign-in`.
2. Choose "Continue with Google" → authorized redirect to Neon → back to app, session cookie set, `getUser()` returns profile.
3. Sign out, sign up with a throwaway email/password → verify account created in Neon Authentication dashboard.
4. Reload protected page (if any) and confirm session persists.

## Open Question for User
- Confirm the three Neon Console steps (enable Auth, enable Google + password, paste env keys) are done or will be done when the code is ready. Code ships regardless; sign-in only works after the console is configured.