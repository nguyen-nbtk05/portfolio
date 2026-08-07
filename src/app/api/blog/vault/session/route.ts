import { NextResponse } from "next/server";
import {
  BLOG_VAULT_COOKIE_NAME,
  createVaultSessionToken,
  isVaultConfigured,
  verifyVaultPassword,
} from "@/lib/blog/vault-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

export async function POST(request: Request) {
  if (!isVaultConfigured()) {
    return NextResponse.json(
      { error: "vault_unavailable" },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  let password: unknown;
  try {
    ({ password } = (await request.json()) as { password?: unknown });
  } catch {
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 512 ||
    !verifyVaultPassword(password)
  ) {
    return NextResponse.json(
      { error: "invalid_password" },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  const token = createVaultSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "vault_unavailable" },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  const response = new NextResponse(null, {
    status: 204,
    headers: NO_STORE_HEADERS,
  });
  response.cookies.set(BLOG_VAULT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = new NextResponse(null, {
    status: 204,
    headers: NO_STORE_HEADERS,
  });
  response.cookies.set(BLOG_VAULT_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
