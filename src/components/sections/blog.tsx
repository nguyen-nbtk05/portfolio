import { Section } from "../ui/section";
import { BlogShowcase } from "@/components/blog/blog-showcase";
import { getAllPosts } from "@/lib/blog/get-posts";

export async function BlogSection() {
  const posts = await getAllPosts();

  return (
    <Section
      id="blog"
      backgroundVariant="blog"
      className="min-h-[100svh] py-8 sm:py-10 lg:py-12"
      data-cursor="default"
    >
      <BlogShowcase posts={posts} />
    </Section>
  );
}
