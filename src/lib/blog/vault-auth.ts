import "server-only";

import { cookies } from "next/headers";
import {
  createVaultToken,
  passwordMatches,
  verifyVaultToken,
} from "./vault-token";

export const BLOG_VAULT_COOKIE_NAME = "portfolio_blog_vault";

type VaultConfig = {
  password: string;
  sessionSecret: string;
};

function getVaultConfig(): VaultConfig | null {
  const password = process.env.BLOG_VAULT_PASSWORD;
  const sessionSecret = process.env.BLOG_VAULT_SESSION_SECRET;

  if (!password || !sessionSecret || sessionSecret.length < 32) return null;
  return { password, sessionSecret };
}

export function isVaultConfigured() {
  return getVaultConfig() !== null;
}

export function verifyVaultPassword(candidate: string) {
  const config = getVaultConfig();
  return config ? passwordMatches(candidate, config.password) : false;
}

export function createVaultSessionToken() {
  const config = getVaultConfig();
  return config ? createVaultToken(config.sessionSecret) : null;
}

export async function isVaultUnlocked() {
  const config = getVaultConfig();
  if (!config) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(BLOG_VAULT_COOKIE_NAME)?.value;
  return token ? verifyVaultToken(token, config.sessionSecret) : false;
}
