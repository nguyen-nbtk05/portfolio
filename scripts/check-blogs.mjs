import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import {
  BLOG_CONTENT_DIRECTORY,
  hasSubstantiveBlogBody,
  isValidBlogSlug,
  validateBlogMeta,
} from "./blog-shared.mjs";

function isErrorCode(error, code) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

async function readOptionalFile(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isErrorCode(error, "ENOENT")) {
      return null;
    }

    throw error;
  }
}

async function validateArticle(slug) {
  const articleDirectory = path.join(BLOG_CONTENT_DIRECTORY, slug);
  const errors = [];
  const metadataPath = path.join(articleDirectory, "meta.json");
  const metadataSource = await readOptionalFile(metadataPath);

  let metadata = null;
  if (metadataSource === null) {
    errors.push("meta.json is missing");
  } else {
    try {
      metadata = JSON.parse(metadataSource);
    } catch {
      errors.push("meta.json contains malformed JSON");
    }
  }

  if (metadata !== null) {
    errors.push(...validateBlogMeta(metadata));
  }

  const englishPath = path.join(articleDirectory, "en.mdx");
  const vietnamesePath = path.join(articleDirectory, "vi.mdx");
  const [english, vietnamese] = await Promise.all([
    readOptionalFile(englishPath),
    readOptionalFile(vietnamesePath),
  ]);

  if (english === null) {
    errors.push("en.mdx is missing");
  }

  if (metadata?.status === "published") {
    if (english === null || !hasSubstantiveBlogBody(english)) {
      errors.push("published post requires substantive en.mdx content (the generated skeleton is not publishable)");
    }

    if (vietnamese === null || !hasSubstantiveBlogBody(vietnamese)) {
      errors.push("published post requires substantive vi.mdx content (the generated skeleton is not publishable)");
    }
  }

  return errors.map((error) => `${slug}: ${error}`);
}

async function main() {
  let entries;
  try {
    entries = await readdir(BLOG_CONTENT_DIRECTORY, { withFileTypes: true });
  } catch (error) {
    if (isErrorCode(error, "ENOENT")) {
      throw new Error(
        `Blog content directory does not exist: ${BLOG_CONTENT_DIRECTORY}`,
      );
    }

    throw error;
  }

  const directories = entries.filter((entry) => entry.isDirectory());
  const errors = [];
  const normalizedSlugs = new Set();

  for (const directory of directories) {
    const { name: slug } = directory;
    if (!isValidBlogSlug(slug)) {
      errors.push(`${slug}: directory name is not a valid blog slug`);
      continue;
    }

    const normalizedSlug = slug.toLocaleLowerCase();
    if (normalizedSlugs.has(normalizedSlug)) {
      errors.push(`${slug}: duplicate blog slug`);
      continue;
    }
    normalizedSlugs.add(normalizedSlug);

    errors.push(...(await validateArticle(slug)));
  }

  if (errors.length > 0) {
    console.error(`Blog validation failed with ${errors.length} error(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Blog validation passed (${directories.length} article director${
      directories.length === 1 ? "y" : "ies"
    }).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
