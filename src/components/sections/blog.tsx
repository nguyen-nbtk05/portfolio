import { Section } from "../ui/section";
import { BlogShowcase } from "@/components/blog/blog-showcase";
import { getAllPosts } from "@/lib/blog/get-posts";

export async function BlogSection() {
  const posts = await getAllPosts();

  return (
    <Section
      id="blog"
      backgroundVariant="blog"
      className="min-h-0 pb-12 pt-12 sm:pb-16 sm:pt-16 lg:min-h-[100vh] lg:py-12"
      data-cursor="default"
    >
      <BlogShowcase posts={posts} />
    </Section>
  );
}
