import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

export const authConfigured = Boolean(
  baseUrl && cookieSecret && cookieSecret.length >= 32,
);

export const auth = authConfigured
  ? createNeonAuth({
      baseUrl: baseUrl!,
      cookies: {
        secret: cookieSecret!,
      },
    })
  : null;