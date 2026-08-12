import type { Metadata } from "next";
import { BlogArchive } from "@/components/blog/blog-archive";
import { SectionBackground } from "@/components/ui/section-background";
import { getAllPosts, getVaultPosts } from "@/lib/blog/get-posts";
import { isVaultConfigured, isVaultUnlocked } from "@/lib/blog/vault-auth";

export const metadata: Metadata = {
  title: "Blog | Portfolio",
  description: "Technical notes, experiments, and field observations about networking, automation, and security.",
  openGraph: {
    title: "Blog | Portfolio",
    description: "Technical notes, experiments, and field observations about networking, automation, and security.",
  },
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const [posts, vaultUnlocked] = await Promise.all([
    getAllPosts(),
    isVaultUnlocked(),
  ]);
  const vaultPosts = vaultUnlocked ? await getVaultPosts() : [];

  return (
    <section className="relative isolate min-h-screen overflow-hidden pb-20 pt-20">
      <SectionBackground variant="blog" />
      <div className="site-container relative z-10 mx-auto w-full px-[1cm]">
        <BlogArchive
          posts={posts}
          vaultPosts={vaultPosts}
          vaultUnlocked={vaultUnlocked}
          vaultConfigured={isVaultConfigured()}
        />
      </div>
    </section>
  );
}
