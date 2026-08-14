import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const sortedPosts = getSortedPosts(posts);
  const siteUrl = (site ?? new URL(config.site.url)).href.replace(/\/+$/, "");

  const lines = [
    `# ${config.site.title}`,
    "",
    `> ${config.site.description}`,
    "",
    `Welcome to ${config.site.title}. This index provides a machine-readable summary of our publication for AI search engines, answer engines (AEO/GEO), and research assistants.`,
    "",
    "## Core Topics & Categories",
    `- [AI](${siteUrl}/categories/ai): Next-gen artificial intelligence, autonomous agents, and multimodal reasoning models.`,
    `- [Tech](${siteUrl}/categories/tech): Breakthrough consumer electronics, futuristic hardware, and tech innovation.`,
    `- [Entertainment](${siteUrl}/categories/entertainment): Box office phenomena, viral streaming moments, and digital culture.`,
    `- [Gaming](${siteUrl}/categories/gaming): Major video game launches, esports, and industry developments.`,
    `- [Finance](${siteUrl}/categories/finance): Fintech shifts, crypto trends, and global macroeconomic insights.`,
    `- [Viral](${siteUrl}/categories/viral): Viral social trends, memes, and breaking internet discussions.`,
    "",
    "## Published Stories & Analyses",
    ...sortedPosts.map(post => {
      const url = `${siteUrl}${getPostUrl(post.id, post.filePath, config.site.lang)}`;
      return `- [${post.data.title}](${url}): ${post.data.description}`;
    }),
    "",
    "## Core Pages & Information",
    `- [About LyraX](${siteUrl}/about/): Mission, editorial standards, and founder background.`,
    `- [Frequently Asked Questions (FAQ)](${siteUrl}/faq/): Common questions, submission guidelines, and verification process.`,
    `- [Privacy Policy](${siteUrl}/privacy/): Data protection, cookie practices, and user rights.`,
    "",
    "## Feeds & Discovery",
    `- RSS Feed: ${siteUrl}/rss.xml`,
    `- Sitemap Index: ${siteUrl}/sitemap-index.xml`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
