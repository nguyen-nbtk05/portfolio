import assert from "node:assert/strict";
import test from "node:test";
import { isVisiblePostForAccess } from "../src/lib/blog/access.ts";
import {
  createVaultToken,
  passwordMatches,
  verifyVaultToken,
} from "../src/lib/blog/vault-token.ts";
import type { BlogPostMeta } from "../src/lib/blog/types.ts";

const baseMeta: BlogPostMeta = {
  title: { en: "Title", vi: "Tiêu đề" },
  excerpt: { en: "Excerpt", vi: "Tóm tắt" },
  publishedAt: "2026-08-07",
  tags: ["Private"],
  featured: false,
  status: "published",
  access: "public",
};

test("password comparison accepts only the configured password", () => {
  assert.equal(passwordMatches("correct horse", "correct horse"), true);
  assert.equal(passwordMatches("wrong", "correct horse"), false);
});

test("vault token rejects tampering and a different signing secret", () => {
  const token = createVaultToken("a-session-secret-that-is-long-enough");

  assert.equal(
    verifyVaultToken(token, "a-session-secret-that-is-long-enough"),
    true,
  );
  assert.equal(
    verifyVaultToken(`${token}x`, "a-session-secret-that-is-long-enough"),
    false,
  );
  assert.equal(
    verifyVaultToken(token, "a-different-session-secret-long-enough"),
    false,
  );
});

test("public and vault posts remain separate and drafts stay hidden", () => {
  const vaultMeta: BlogPostMeta = { ...baseMeta, access: "vault" };
  const draftVaultMeta: BlogPostMeta = { ...vaultMeta, status: "draft" };

  assert.equal(isVisiblePostForAccess(baseMeta, "public"), true);
  assert.equal(isVisiblePostForAccess(baseMeta, "vault"), false);
  assert.equal(isVisiblePostForAccess(vaultMeta, "vault"), true);
  assert.equal(isVisiblePostForAccess(vaultMeta, "public"), false);
  assert.equal(isVisiblePostForAccess(draftVaultMeta, "vault"), false);
});
