import type { Metadata } from "next";
import { BlogArchive } from "@/components/blog/blog-archive";
import { SectionBackground } from "@/components/ui/section-background";
import { getAllPosts } from "@/lib/blog/get-posts";

export const metadata: Metadata = {
  title: "Blog | Portfolio",
  description: "Technical notes, experiments, and field observations about networking, automation, and security.",
  openGraph: {
    title: "Blog | Portfolio",
    description: "Technical notes, experiments, and field observations about networking, automation, and security.",
  },
};

export const runtime = "nodejs";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="relative isolate min-h-screen overflow-hidden pb-20 pt-32 sm:pt-36">
      <SectionBackground variant="blog" />
      <div className="site-container relative z-10 mx-auto w-full px-[1cm]">
        <BlogArchive posts={posts} />
      </div>
    </section>
  );
}
