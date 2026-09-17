# Route Protection + Custom Auth Pages

## Goal

Require login for `/courses`, `/course/[slug]`, `/lesson/[slug]`, `/search`, `/account`. Keep the homepage public as a welcome/landing page. Build custom SpotX-branded auth pages (login + signup) that complement the site design.

## Skills read

- AGENTS.md (loop, boundaries, checks, git rules, §17 branches)
- `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md` (rate limiting section — reference pattern)
- Sanity, PostHog, auth skills already in context

## Code inspected

- `proxy.ts` — existing middleware template (exports `proxy`, not `middleware`; matcher too broad; not wired)
- `app/auth/[path]/page.tsx` — current auth page (generic `AuthView` in minimal wrapper)
- `components/navigation.tsx` — nav with `SignedIn` bell only; `UserButton` renders unconditionally
- `app/globals.css` — `.auth-ui-scope` CSS variable overrides for auth UI theming
- `app/providers.tsx` — `NeonAuthUIProvider` with `redirectTo: "/"`, Google OAuth
- `lib/auth/server.ts` — `authConfigured` boolean gates auth; `auth.middleware()` available
- `lib/auth/client.ts` — `createAuthClient()` returns `useSession()` hook

## Decisions

- **Middleware:** Rename `proxy.ts` → `middleware.ts`, rename export `proxy` → `middleware`, narrow matcher to only content routes
- **Protected routes:** `/courses`, `/course/:path*`, `/lesson/:path*`, `/search`, `/account/:path*`
- **Public routes:** `/` (homepage), `/studio/*`, `/auth/*`, `/api/*`, static assets
- **Auth page design:** Two-column layout — left: SpotX branding (logo, tagline, decorative circle); right: AuthView with custom classNames
- **CSS:** Update `.auth-ui-scope` to use SpotX accent colors on form elements
- **Navigation:** Add `<SignedOut>` block with "Sign in" link; wrap `<UserButton>` in `<SignedIn>`
- **Redirect:** Middleware preserves original URL; `redirectTo: "/"` on provider sends users home after login; middleware re-checks and sends them back

## Files to touch

1. `proxy.ts` → delete (rename to `middleware.ts`)
2. `middleware.ts` — new file, renamed from proxy.ts with narrowed matcher
3. `app/auth/[path]/page.tsx` — rewrite with two-column SpotX branded layout
4. `app/globals.css` — update `.auth-ui-scope` for SpotX accent theming on form elements
5. `components/navigation.tsx` — add `SignedOut` import, sign-in link, wrap `UserButton` in `SignedIn`

## Implementation details

### middleware.ts

```ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth, authConfigured } from "@/lib/auth/server";

const protect = authConfigured
  ? auth!.middleware({ loginUrl: "/auth/sign-in" })
  : null;

export async function middleware(request: NextRequest) {
  if (!protect) return NextResponse.next();
  return protect(request);
}

export const config = {
  matcher: [
    "/courses/:path*",
    "/course/:path*",
    "/lesson/:path*",
    "/search",
    "/account/:path*",
  ],
};
```

The auth library's built-in skip list already excludes `/auth/sign-in`, `/auth/sign-up`, etc. If `authConfigured === false`, middleware passes everything through.

### app/auth/[path]/page.tsx

Two-column layout:
- **Left column (desktop):** SpotX logo, "Learn Smarter" tagline, decorative orange circle, "New courses and lessons added every week" footer text
- **Right column:** `<AuthView>` with custom `classNames` for inputs, buttons, labels
- **Mobile:** Single column — branding header on top, form below
- Keep `auth-ui-scope` class for CSS variable resets
- Pass `cardHeader` withSpotX logo + dynamic title ("Welcome back" for sign-in, "Get started" for sign-up)
- Pass `classNames` for form elements: inputs get `rounded-xl border-neutral-200`, primary button gets `bg-primary-500 hover:bg-primary-500/90`, etc.
- `socialLayout="vertical"` for full-width Google button

### globals.css `.auth-ui-scope`

Update the accent-related variables to use SpotX orange:
- `--neon-accent: #fc563c` (hover states → orange)
- `--neon-accent-foreground: #ffffff` (text on accent → white)
- Keep everything else as-is (primary stays #172a39, background stays white)

### components/navigation.tsx

- Import `SignedOut` from `@neondatabase/auth-ui`
- Wrap `<UserButton>` in `<SignedIn>`
- Add after `</SignedIn>`:
  ```tsx
  <SignedOut>
    <Link href="/auth/sign-in" className="...">
      Sign in
    </Link>
  </SignedOut>
  ```
- Style: `text-sm font-medium text-primary-500 hover:text-primary-accent transition-colors`

## Security considerations

- Middleware only runs on specified matcher routes — homepage, studio, auth, and API are never gated
- `authConfigured === false` → no protection (graceful degradation)
- Session cookie validation happens inside `auth.middleware()` — no custom session logic needed
- No tokens exposed to client; all auth state via httpOnly cookies

## Acceptance criteria

- `GET /` → 200 (homepage, public)
- `GET /courses` → 302 to `/auth/sign-in` (if not logged in)
- `GET /auth/sign-in` → 200 (auth page, public, SpotX branded)
- `GET /auth/sign-up` → 200 (auth page, public, SpotX branded)
- After sign-in → redirect to `/` or original URL
- `GET /courses` → 200 (now authenticated)
- `npx tsc --noEmit` clean
- `npx eslint middleware.ts app/auth/[path]/page.tsx components/navigation.tsx` clean

## Checks to run

- `npx tsc --noEmit`
- `npx eslint middleware.ts "app/auth/[path]/page.tsx" components/navigation.tsx`
- Dev server manual test: curl `/courses` without session → 302; curl `/auth/sign-in` → 200

## Manual test steps

1. `npm run dev` in web workspace
2. `curl -si http://localhost:3000/ | head -1` → `200`
3. `curl -si http://localhost:3000/courses | head -1` → `302` (redirect to sign-in)
4. `curl -si http://localhost:3000/auth/sign-in | head -1` → `200`
5. Visit `/auth/sign-in` in browser → SpotX branded two-column layout
6. Sign in with Google → redirects to `/`
7. Visit `/courses` → loads (authenticated)
