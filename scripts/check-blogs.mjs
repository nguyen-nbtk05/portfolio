import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import {
  BLOG_CONTENT_DIRECTORY,
  BLOG_LANGUAGES,
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

  const bodies = Object.fromEntries(
    await Promise.all(
      BLOG_LANGUAGES.map(async (locale) => [
        locale,
        await readOptionalFile(path.join(articleDirectory, `${locale}.mdx`)),
      ]),
    ),
  );

  const declaredLanguages = Array.isArray(metadata?.languages)
    ? metadata.languages.filter((locale) => BLOG_LANGUAGES.includes(locale))
    : [];

  for (const locale of BLOG_LANGUAGES) {
    const isDeclared = declaredLanguages.includes(locale);
    const body = bodies[locale];

    if (isDeclared && body === null) {
      errors.push(`${locale}.mdx is missing`);
    }
    if (!isDeclared && body !== null) {
      errors.push(`${locale}.mdx exists but ${locale} is not declared in languages`);
    }
    if (isDeclared && metadata?.status === "published" && !hasSubstantiveBlogBody(body)) {
      errors.push(`published post requires substantive ${locale}.mdx content (the generated skeleton is not publishable)`);
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
