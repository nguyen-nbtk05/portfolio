export type BlogTableOfContentsItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

export function slugifyBlogHeading(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[\*_~]/g, "")
    .trim();
}

export function extractBlogTableOfContents(
  source: string,
): BlogTableOfContentsItem[] {
  const items: BlogTableOfContentsItem[] = [];
  let activeFence: "```" | "~~~" | null = null;

  for (const line of source.split(/\r?\n/)) {
    const fence = line.trimStart().slice(0, 3);

    if (fence === "```" || fence === "~~~") {
      activeFence = activeFence === fence ? null : activeFence ?? fence;
      continue;
    }

    if (activeFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const label = stripInlineMarkdown(match[2]);
    const id = slugifyBlogHeading(label);
    if (!id) continue;

    items.push({
      id,
      label,
      level: match[1].length as 2 | 3,
    });
  }

  return items;
}
