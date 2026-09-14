import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth, authConfigured } from "@/lib/auth/server";

const protect = authConfigured
  ? auth!.middleware({ loginUrl: "/auth/sign-in" })
  : null;

export async function proxy(request: NextRequest) {
  if (!protect) return NextResponse.next();
  return protect(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};