export const HOME_SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "projects",
  "blog",
  "contact",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

const HOME_SECTION_ID_SET = new Set<string>(HOME_SECTION_IDS);

export function getHomeSectionIdFromHash(hash: string): HomeSectionId | null {
  if (!hash) return null;

  let fragment = hash.startsWith("#") ? hash.slice(1) : hash;

  try {
    fragment = decodeURIComponent(fragment);
  } catch {
    // Keep the literal fragment when it contains malformed escape sequences.
  }

  // A URL such as #blog#blog is invalid for section navigation. Preserve the
  // first valid section so old malformed URLs recover instead of getting stuck.
  const sectionId = fragment.split("#", 1)[0]?.trim();

  return sectionId && HOME_SECTION_ID_SET.has(sectionId)
    ? (sectionId as HomeSectionId)
    : null;
}

export function getCanonicalSectionHash(sectionId: HomeSectionId) {
  return `#${sectionId}`;
}

function getCurrentRelativeUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getSectionRelativeUrl(sectionId: HomeSectionId) {
  return `${window.location.pathname}${window.location.search}${getCanonicalSectionHash(sectionId)}`;
}

export function pushHomeSectionHash(sectionId: HomeSectionId) {
  const nextUrl = getSectionRelativeUrl(sectionId);

  if (getCurrentRelativeUrl() === nextUrl) return;

  window.history.pushState(window.history.state, "", nextUrl);
}

export function canonicalizeHomeSectionHash(sectionId: HomeSectionId) {
  const canonicalHash = getCanonicalSectionHash(sectionId);

  if (window.location.hash === canonicalHash) return;

  window.history.replaceState(
    window.history.state,
    "",
    getSectionRelativeUrl(sectionId),
  );
}
