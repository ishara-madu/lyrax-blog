import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import { rehypeImageOptimizer } from "./src/utils/transformers/rehypeImageOptimizer";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  image: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        // 1. Archives පිටුව සඳහා දැනට පවතින නීතිය (config අගය අනුව)
        const showArchives = config.features?.showArchives !== false || !page.endsWith("/archives/");

        // 2. ටැග් සහ කැටගරි පිටු සම්පූර්ණයෙන්ම හඳුනා ගැනීම
        const isTagOrCategory = page.includes('/tags/') || page.includes('/categories/');

        // 3. ඇඩ්මින් (Admin) පිටු හඳුනා ගැනීම
        const isAdminPage = page.includes('/admin/') || page.startsWith('admin/') || page.endsWith('/admin');

        // Archives පෙන්විය යුතු නම්, එය ටැග්/කැටගරි හෝ ඇඩ්මින් පිටුවක් නොවේ නම් පමණක් සයිට්මැප් එකට ගන්න
        return showArchives && !isTagOrCategory && !isAdminPage;
      }
    }),

  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeImageOptimizer],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [400, 700],
      styles: ["normal"],
      formats: ["woff"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
