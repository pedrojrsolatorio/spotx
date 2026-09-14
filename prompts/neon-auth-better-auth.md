# Implementation Prompt: Migrate Neon Auth from Stack Auth to Better Auth

## Goal
Replace the legacy Stack Auth (`@stackframe/stack`) integration for Neon Auth with the official first-party **Better Auth** based SDK: `@neondatabase/auth` + `@neondatabase/auth-ui`. Auth methods: **Google OAuth** + **email/password**.

## Background (verified)
- Neon Auth has moved to Better Auth. Official SDK `@neondatabase/auth` (0.5.0-beta) is "a wrapper around Better Auth"; `@neondatabase/auth-ui` (0.3.0-beta) is built on `better-auth-ui`.
- Official Next.js integration: `@neondatabase/auth/next`, targets Next.js 15+ (this repo is Next 16.3.3), uses `proxy.ts` (Next 16 replaces `middleware.ts`), `/api/auth/[...path]`, `createNeonAuth()`, `auth.getSession()` in RSC, `authClient.useSession()` in client.
- Tested `neon.ts` already has `auth: true`; `@neon/config` + Neon project `sweet-paper-62993203` set up.

## Current State
- `lib/stack.ts` — StackServerApp + `authConfigured` guard (throws-free).
- `app/handler/[...stack]/route.ts` — StackHandler.
- `app/layout.tsx` — conditional `StackProvider`/`StackTheme`.
- `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`, `components/auth-unavailable.tsx`.
- Deps: `@stackframe/stack`, `server-only`. Env: `NEXT_PUBLIC_STACK_*`, `STACK_SECRET_SERVER_KEY`.

## Decisions / Assumptions
- Use the Neon-hosted Better Auth path exactly as the official `NEXT-JS.md` guide documents, adapted to Next 16 (`proxy.ts` at repo root).
- Email/password (not email OTP): configure the UI provider for password + Google social per the user's request.
- Session/data caching with cookie secret as the guide prescribes.
- Keep everything auth-optional: with empty env, the app must still render without crashing (mirrors current graceful behavior, using server `auth` guard where needed).

## Files to Create
1. `lib/auth/server.ts` — `createNeonAuth({ baseUrl: process.env.NEON_AUTH_BASE_URL!, cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! } })`.
2. `app/api/auth/[...path]/route.ts` — `export const { GET, POST } = auth.handler()`.
3. `proxy.ts` — `export default auth.middleware({ loginUrl: "/auth/sign-in" })` with a matcher ignoring static assets.
4. `lib/auth/client.ts` — client-only `createAuthClient()` from `@neondatabase/auth/next`.
5. `app/providers.tsx` — client component wrapping children in `NeonAuthUIProvider` (`social={{ providers: ["google"] }}`, password mode, `redirectTo`).
6. `app/auth/[path]/page.tsx` — render `AuthView` for all `authViewPaths`.
7. `app/account/[path]/page.tsx` — render `AccountView` for all `accountViewPaths` (kept minimal).

## Files to Modify
- `app/layout.tsx` — drop StackProvider/StackTheme; wrap with `<Providers>`. Keep Poppins/Inter fonts + metadata.
- `app/globals.css` — add `@import "@neondatabase/auth-ui/tailwind";` after `@import "tailwindcss";`.
- `.env` / `.env.example` — replace `NEXT_PUBLIC_STACK_PROJECT_ID`, `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`, `STACK_SECRET_SERVER_KEY` with `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET`.
- `package.json` — swap `@stackframe/stack`, `server-only` for `@neondatabase/auth`, `@neondatabase/auth-ui`.

## Files to Delete
- `lib/stack.ts`, `app/handler/[...stack]/` (whole dir), `app/(auth)/` (whole dir), `components/auth-unavailable.tsx`.

## Security Requirements
- `NEON_AUTH_COOKIE_SECRET` and `NEON_AUTH_BASE_URL` kept out of the browser bundle wherever possible (server reads them in `lib/auth/server.ts`).
- `NEON_AUTH_COOKIE_SECRET` random 32+ chars; never committed (`.env` ignored).
- `.env.example` committed as canonical list (already un-ignored in `.gitignore`).
- No client-side token storage beyond Better Auth's cookie/session handling.
- Keep all routes public by default; apply `auth.middleware()` protections per-route as the proxy config dictates.

## Acceptance Criteria
1. Home page and catalog render with or without env configured (no crash on missing `NEON_AUTH_*`).
2. `/auth/sign-in` and `/auth/sign-up` render the Neon auth UI with Google + password options once env is set.
3. `/api/auth/[...path]` responds (OPTIONS/GET/POST) and powers OAuth callback & sign-out.
4. `auth.getSession()` works in a server component; `authClient.useSession()` works client-side.
5. Type check + lint pass; remove all Stack Auth references.
6. Proxy protects configured routes and redirects to `/auth/sign-in` when unauthenticated.

## Checks to Run
- `npx tsc --noEmit` filtered to app files (reference dir `agent/skills/...` errors are pre-existing and ignored).
- `npm run lint`.
- Optional: `next build` (user may decline).

## Manual Test Steps
1. Fill `NEON_AUTH_BASE_URL` + `NEON_AUTH_COOKIE_SECRET` in `.env` (Neon Console → Authentication).
2. In Neon Console enable Google (OAuth client) + email/password.
3. `npm run dev` → `/auth/sign-in`, sign in with Google and with email/password; verify session cookie and `getSession()`.
4. Visit a proxy-protected route while signed out → redirected to `/auth/sign-in`.