import {
  isCloudinaryUrl,
  getOptimizedImageUrl,
  getCloudinarySrcSet,
} from "../imageOptimizer";

interface ElementNode {
  type: string;
  tagName?: string;
  properties?: Record<string, any>;
  children?: ElementNode[];
}

/**
 * Rehype plugin to automatically optimize images in Markdown/MDX content.
 * Adds loading="lazy", decoding="async", and transforms Cloudinary URLs to modern formats (AVIF/WebP, auto quality, responsive srcset).
 */
export function rehypeImageOptimizer() {
  return (tree: ElementNode) => {
    function visit(node: ElementNode) {
      if (!node || typeof node !== "object") return;

      if (node.type === "element" && node.tagName === "img" && node.properties) {
        const src = node.properties.src;
        if (typeof src === "string" && src.trim().length > 0) {
          // Set smart lazy loading & async decoding
          if (!node.properties.loading) {
            node.properties.loading = "lazy";
          }
          if (!node.properties.decoding) {
            node.properties.decoding = "async";
          }

          // For Cloudinary images, inject auto-format, auto-quality, and responsive srcset
          if (isCloudinaryUrl(src)) {
            node.properties.src = getOptimizedImageUrl(src, {
              width: 1200,
              quality: "auto",
              format: "auto",
              crop: "limit",
            });

            const srcset = getCloudinarySrcSet(src, [480, 768, 1024, 1200]);
            if (srcset) {
              node.properties.srcset = srcset;
              node.properties.sizes = "(max-width: 768px) 100vw, 768px";
            }
          }
        }
      }

      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          visit(child);
        }
      }
    }

    visit(tree);
  };
}
