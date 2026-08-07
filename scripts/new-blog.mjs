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
  const title = process.argv.slice(2).join(" ").trim();
  if (!title) {
    throw new Error('Usage: npm run blog:new -- "Article title"');
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
    title: {
      en: title,
      vi: "",
    },
    excerpt: {
      en: "",
      vi: "",
    },
    publishedAt: formatLocalDate(),
    tags: [],
    featured: false,
    status: "draft",
  };

  const createdFiles = [
    path.join(articleDirectory, "meta.json"),
    path.join(articleDirectory, "en.mdx"),
    path.join(articleDirectory, "vi.mdx"),
  ];

  await Promise.all([
    writeFile(createdFiles[0], `${JSON.stringify(metadata, null, 2)}\n`, "utf8"),
    writeFile(createdFiles[1], ENGLISH_TEMPLATE, "utf8"),
    writeFile(createdFiles[2], VIETNAMESE_TEMPLATE, "utf8"),
  ]);

  console.log(`Created draft blog article "${slug}":`);
  for (const file of createdFiles) {
    console.log(`- ${path.relative(process.cwd(), file)}`);
  }

  console.log("\nNext steps:");
  console.log("1. Complete both translations and metadata.");
  console.log('2. Change status from "draft" to "published" when ready.');
  console.log("3. Run npm run blog:check.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
