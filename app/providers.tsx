"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useEffect, useRef, type ReactNode } from "react";

import { authClient } from "@/lib/auth/client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: sessionData, isPending } = authClient.useSession();
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    if (isPending) return;

    const user = sessionData?.user;
    const userId = user?.id ?? null;
    const priorUserId = previousUserId.current;
    const posthogConfigured = Boolean(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
        process.env.NEXT_PUBLIC_POSTHOG_HOST,
    );

    if (user && userId && posthogConfigured) {
      if (priorUserId && priorUserId !== userId) {
        posthog.reset();
      }

      posthog.identify(userId, {
        email: user.email,
        name: user.name,
      });

      if (!priorUserId) {
        posthog.capture("user_logged_in", {
          authentication_state: "authenticated",
        });
      }
    } else if (priorUserId && posthogConfigured) {
      posthog.capture("user_logged_out");
      posthog.reset();
    }

    previousUserId.current = userId;
  }, [isPending, sessionData?.user]);

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      defaultTheme="light"
      social={{ providers: ["google"] }}
      redirectTo="/"
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
    >
      {children}
    </NeonAuthUIProvider>
  );
}