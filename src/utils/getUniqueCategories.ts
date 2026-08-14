import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export type Category = {
  category: string;
  categoryName: string;
  count: number;
};

/**
 * Builds a de-duplicated, sorted category list from posts with post count.
 */
export function getUniqueCategories(posts: CollectionEntry<"posts">[]): Category[] {
  const filteredPosts = posts.filter(postFilter);
  const categoryMap = new Map<string, { categoryName: string; count: number }>();

  for (const post of filteredPosts) {
    const rawCategory = post.data.category || "General";
    const slug = slugifyStr(rawCategory);

    if (categoryMap.has(slug)) {
      categoryMap.get(slug)!.count += 1;
    } else {
      categoryMap.set(slug, {
        categoryName: rawCategory,
        count: 1,
      });
    }
  }

  return Array.from(categoryMap.entries())
    .map(([category, { categoryName, count }]) => ({
      category,
      categoryName,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}
