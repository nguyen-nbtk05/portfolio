import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

const defaultBlogContentDirectory = path.resolve(
  scriptDirectory,
  "..",
  "src",
  "content",
  "blog",
);

export const BLOG_CONTENT_DIRECTORY = process.env.BLOG_CONTENT_DIRECTORY
  ? path.resolve(process.env.BLOG_CONTENT_DIRECTORY)
  : defaultBlogContentDirectory;

export const BLOG_STATUSES = ["published", "draft", "comingSoon"];
export const BLOG_ACCESS_LEVELS = ["public", "vault"];
export const BLOG_LANGUAGES = ["en", "vi"];
export const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidBlogSlug(value) {
  return typeof value === "string" && BLOG_SLUG_PATTERN.test(value);
}

export function slugifyBlogTitle(title) {
  return title
    .normalize("NFKD")
    .replace(/[đĐ]/g, (character) => (character === "đ" ? "d" : "D"))
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function hasSubstantiveBlogBody(source) {
  if (typeof source !== "string") return false;

  const withoutSkeleton = source
    .replace(/^\s*#{1,6}\s+.*$/gm, " ")
    .replace(/Write the article here\./gi, " ")
    .replace(/Viết nội dung bài viết tại đây\./gi, " ")
    .replace(/\.\.\./g, " ")
    .replace(/[`*_>#~|\-]/g, " ");

  return /[\p{L}\p{N}]/u.test(withoutSkeleton);
}

export function isValidPublishedDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateLocalizedText(value, field, languages, requireCompleteTranslations) {
  if (!isRecord(value)) {
    return [`${field} must be an object keyed by a declared language`];
  }

  const errors = [];
  for (const locale of languages) {
    if (typeof value[locale] !== "string") {
      errors.push(`${field}.${locale} must be a string`);
    } else if (requireCompleteTranslations && !isNonEmptyString(value[locale])) {
      errors.push(`${field}.${locale} must not be empty for a visible post`);
    }
  }

  for (const locale of BLOG_LANGUAGES) {
    if (locale in value && !languages.includes(locale)) {
      errors.push(`${field}.${locale} is present but ${locale} is not declared in languages`);
    }
  }

  const primaryLanguage = languages[0];
  if (field === "title" && primaryLanguage && !isNonEmptyString(value[primaryLanguage])) {
    errors.push(`${field}.${primaryLanguage} must not be empty`);
  }

  return [...new Set(errors)];
}

export function validateBlogMeta(value) {
  if (!isRecord(value)) {
    return ["metadata must be a JSON object"];
  }

  const requireCompleteTranslations =
    value.status === "published" || value.status === "comingSoon";
  const languages = Array.isArray(value.languages)
    ? value.languages.filter((locale) => BLOG_LANGUAGES.includes(locale))
    : [];
  const errors = [];

  if (!Array.isArray(value.languages) || value.languages.length === 0) {
    errors.push("languages must be a non-empty array containing en and/or vi");
  } else {
    if (!value.languages.every((locale) => BLOG_LANGUAGES.includes(locale))) {
      errors.push(`languages must contain only: ${BLOG_LANGUAGES.join(", ")}`);
    }
    if (new Set(value.languages).size !== value.languages.length) {
      errors.push("languages must not contain duplicates");
    }
  }

  errors.push(
    ...validateLocalizedText(
      value.title,
      "title",
      languages,
      requireCompleteTranslations,
    ),
    ...validateLocalizedText(
      value.excerpt,
      "excerpt",
      languages,
      requireCompleteTranslations,
    ),
  );

  for (const derivedField of ["id", "slug", "link", "href", "readTime"]) {
    if (derivedField in value) {
      errors.push(`${derivedField} is derived and must not be stored in meta.json`);
    }
  }

  if (!isValidPublishedDate(value.publishedAt)) {
    errors.push("publishedAt must be a valid YYYY-MM-DD calendar date");
  }

  if (!Array.isArray(value.tags)) {
    errors.push("tags must be an array of non-empty strings");
  } else {
    if (!value.tags.every(isNonEmptyString)) {
      errors.push("tags must contain only non-empty strings");
    }

    const normalizedTags = value.tags
      .filter((tag) => typeof tag === "string")
      .map((tag) => tag.trim().toLocaleLowerCase());
    if (new Set(normalizedTags).size !== normalizedTags.length) {
      errors.push("tags must not contain duplicates");
    }
  }

  if (typeof value.featured !== "boolean") {
    errors.push("featured must be a boolean");
  }

  if (!BLOG_STATUSES.includes(value.status)) {
    errors.push(`status must be one of: ${BLOG_STATUSES.join(", ")}`);
  }

  if (!BLOG_ACCESS_LEVELS.includes(value.access)) {
    errors.push(`access must be one of: ${BLOG_ACCESS_LEVELS.join(", ")}`);
  }

  return errors;
}
