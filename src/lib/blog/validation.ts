import { BLOG_STATUSES, type BlogPostMeta, type BlogStatus } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidPublishedDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export function isBlogStatus(value: unknown): value is BlogStatus {
  return (
    typeof value === "string" &&
    BLOG_STATUSES.includes(value as BlogStatus)
  );
}

function validateLocalizedText(
  value: unknown,
  field: "title" | "excerpt",
  requireCompleteTranslations: boolean,
): string[] {
  if (!isRecord(value)) {
    return [`${field} must be an object with en and vi strings`];
  }

  const errors: string[] = [];
  for (const locale of ["en", "vi"] as const) {
    if (typeof value[locale] !== "string") {
      errors.push(`${field}.${locale} must be a string`);
      continue;
    }

    if (requireCompleteTranslations && !isNonEmptyString(value[locale])) {
      errors.push(`${field}.${locale} must not be empty for a visible post`);
    }
  }

  if (field === "title" && !isNonEmptyString(value.en)) {
    errors.push(`${field}.en must not be empty`);
  }

  return [...new Set(errors)];
}

export function validateBlogPostMeta(value: unknown): string[] {
  if (!isRecord(value)) {
    return ["metadata must be a JSON object"];
  }

  const status = value.status;
  const requireCompleteTranslations =
    status === "published" || status === "comingSoon";
  const errors = [
    ...validateLocalizedText(
      value.title,
      "title",
      requireCompleteTranslations,
    ),
    ...validateLocalizedText(
      value.excerpt,
      "excerpt",
      requireCompleteTranslations,
    ),
  ];

  for (const derivedField of ["id", "slug", "link", "href", "readTime"] as const) {
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
      .filter((tag): tag is string => typeof tag === "string")
      .map((tag) => tag.trim().toLocaleLowerCase());
    if (new Set(normalizedTags).size !== normalizedTags.length) {
      errors.push("tags must not contain duplicates");
    }
  }

  if (typeof value.featured !== "boolean") {
    errors.push("featured must be a boolean");
  }

  if (!isBlogStatus(status)) {
    errors.push(`status must be one of: ${BLOG_STATUSES.join(", ")}`);
  }

  return errors;
}

export function parseBlogPostMeta(
  value: unknown,
  source = "blog metadata",
): BlogPostMeta {
  const errors = validateBlogPostMeta(value);
  if (errors.length > 0) {
    throw new Error(`${source} is invalid:\n- ${errors.join("\n- ")}`);
  }

  return value as unknown as BlogPostMeta;
}
