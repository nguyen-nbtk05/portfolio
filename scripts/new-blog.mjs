import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  BLOG_CONTENT_DIRECTORY,
  formatLocalDate,
  slugifyBlogTitle,
} from "./blog-shared.mjs";

const ENGLISH_TEMPLATE = `# Introduction

Write the article here.

## Overview

...
`;

const VIETNAMESE_TEMPLATE = `# Giới thiệu

Viết nội dung bài viết tại đây.

## Tổng quan

...
`;

function isErrorCode(error, code) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

async function main() {
  const args = process.argv.slice(2);
  const access = args.includes("--vault") ? "vault" : "public";
  const vietnameseOnly = args.includes("--vi-only");
  const flags = new Set(["--vault", "--vi-only"]);
  const title = args.filter((arg) => !flags.has(arg)).join(" ").trim();
  if (!title) {
    throw new Error('Usage: npm run blog:new -- [--vault] [--vi-only] "Article title"');
  }

  const slug = slugifyBlogTitle(title);
  if (!slug) {
    throw new Error("The title must contain at least one letter or number");
  }

  await mkdir(BLOG_CONTENT_DIRECTORY, { recursive: true });

  const articleDirectory = path.join(BLOG_CONTENT_DIRECTORY, slug);
  try {
    await mkdir(articleDirectory);
  } catch (error) {
    if (isErrorCode(error, "EEXIST")) {
      throw new Error(`A blog article with slug "${slug}" already exists`);
    }

    throw error;
  }

  const metadata = {
    languages: vietnameseOnly ? ["vi"] : ["en", "vi"],
    title: vietnameseOnly ? { vi: title } : { en: title, vi: "" },
    excerpt: vietnameseOnly ? { vi: "" } : { en: "", vi: "" },
    publishedAt: formatLocalDate(),
    tags: [],
    featured: false,
    status: "draft",
    access,
  };

  const metadataPath = path.join(articleDirectory, "meta.json");
  const bodyFiles = vietnameseOnly
    ? [[path.join(articleDirectory, "vi.mdx"), VIETNAMESE_TEMPLATE]]
    : [
        [path.join(articleDirectory, "en.mdx"), ENGLISH_TEMPLATE],
        [path.join(articleDirectory, "vi.mdx"), VIETNAMESE_TEMPLATE],
      ];
  const createdFiles = [metadataPath, ...bodyFiles.map(([file]) => file)];

  await Promise.all([
    writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8"),
    ...bodyFiles.map(([file, template]) => writeFile(file, template, "utf8")),
  ]);

  console.log(`Created draft blog article "${slug}":`);
  for (const file of createdFiles) {
    console.log(`- ${path.relative(process.cwd(), file)}`);
  }

  console.log("\nNext steps:");
  console.log(
    vietnameseOnly
      ? "1. Complete the Vietnamese article and metadata."
      : "1. Complete both translations and metadata.",
  );
  console.log('2. Change status from "draft" to "published" when ready.');
  console.log(`3. Access level: ${access}.`);
  console.log("4. Run npm run blog:check.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
