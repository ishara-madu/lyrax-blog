import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const optionalDate = z.preprocess(
  val =>
    val === "" || val === null || val === undefined
      ? undefined
      : typeof val === "string"
        ? new Date(val)
        : val,
  z.date().optional()
);

const optionalString = z.preprocess(
  val => (val === "" || val === null || val === undefined ? undefined : val),
  z.string().optional()
);

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.coerce.date(),
      modDatetime: optionalDate.nullable(),
      title: z.string(),
      featured: z.boolean().optional().default(false),
      trending: z.boolean().optional().default(false),
      category: z.string().default("General"),
      coverImage: z.preprocess(
        val =>
          val === "" || val === null || val === undefined ? undefined : val,
        image().or(z.string()).optional()
      ),
      readingTime: optionalString,
      draft: z.boolean().optional().default(false),
      tags: z.array(z.string()).default(["others"]),
      ogImage: z.preprocess(
        val =>
          val === "" || val === null || val === undefined ? undefined : val,
        image().or(z.string()).optional()
      ),
      description: z.string(),
      canonicalURL: optionalString,
      hideEditPost: z.boolean().optional(),
      timezone: optionalString,
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: optionalString,
    ogImage: optionalString,
    canonicalURL: optionalString,
  }),
});

export const collections = { posts, pages };
