import "server-only";

import { cache } from "react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/blog/mdx-components";

const compileMdx = cache(async (source: string, sourcePath: string) => {
  return evaluate(
    { value: source, path: sourcePath },
    {
      ...runtime,
      remarkPlugins: [remarkGfm],
    },
  );
});

export async function MdxRenderer({
  source,
  sourcePath,
}: {
  source: string;
  sourcePath: string;
}) {
  const { default: MdxContent } = await compileMdx(source, sourcePath);
  return <MdxContent components={mdxComponents} />;
}
