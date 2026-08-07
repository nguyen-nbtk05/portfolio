import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_VERSION = "v1";

function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function safelyEqual(left: Buffer, right: Buffer) {
  return left.length === right.length && timingSafeEqual(left, right);
}

export function passwordMatches(candidate: string, expected: string) {
  return safelyEqual(sha256(candidate), sha256(expected));
}

export function createVaultToken(secret: string) {
  const signature = createHmac("sha256", secret)
    .update(TOKEN_VERSION, "utf8")
    .digest("base64url");

  return `${TOKEN_VERSION}.${signature}`;
}

export function verifyVaultToken(token: string, secret: string) {
  const expected = createVaultToken(secret);
  return safelyEqual(Buffer.from(token, "utf8"), Buffer.from(expected, "utf8"));
}
