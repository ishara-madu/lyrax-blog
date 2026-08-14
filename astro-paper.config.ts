import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://lyrax.live/",
    title: "LyraX",
    description:
      "LyraX — Real-time trending news, viral stories, tech breakthroughs, and pop culture insights.",
    author: "Ishara M.",
    authorFull: "Ishara Madushanka",
    profile: "https://ishara-madu.github.io/",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "UTC",
    dir: "ltr",
    googleVerification: "", // Add Google Search Console verification meta tag token here when ready
  },
  posts: {
    perPage: 6,
    perIndex: 6,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "x",        url: "https://x.com/LyraXLive" },
    { name: "facebook", url: "https://facebook.com/LyraXLive" },
    { name: "telegram", url: "https://t.me/LyraXLive" },
    { name: "mail",     url: "mailto:contact@lyrax.live" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=Trending%20on%20LyraX&body=" },
  ],
});