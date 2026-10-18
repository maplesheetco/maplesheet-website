// ─── Page titles, descriptions & sitemap — one source of truth ──
// Used in three places, so a page's title/description can never drift
// between them:
//   1. In the browser, by each page's usePageMeta() call.
//   2. At build time, by scripts/prerender-meta.mjs, which writes a copy of
//      index.html per page with that page's own title/description/preview
//      image baked in — so link previews (Facebook, Reddit, iMessage…) and
//      search engines that don't run JavaScript see the right page.
//   3. By api/sitemap.js, which builds sitemap.xml fresh on request.
// Plain JS (no JSX) on purpose: Node imports this file directly.
import { PRODUCTS, RESOURCES } from "./data.js";
import { CATALOG, cardImage } from "./trackerPages.js";

export const SITE_URL = "https://www.maplesheet.ca";
export const DEFAULT_OG_IMAGE = "/og.png";

// Fixed pages. Keys are the URL path.
export const STATIC_META = {
  "/": {
    title: "MapleSheet Co. — Canadian TFSA, RRSP & RESP Trackers",
    description: "Google Sheets trackers built for the Canadian system — TFSA, RRSP, RESP, FHSA & Margin. Live prices, one-time purchase, no subscription.",
  },
  "/trackers": {
    title: "TFSA, RRSP, RESP, FHSA & Margin Trackers | MapleSheet Co.",
    description: `${PRODUCTS.length} Google Sheets trackers for TFSA, RRSP, RESP, FHSA & Margin accounts. One-time purchase, live prices, no subscription.`,
  },
  "/tools": {
    title: "Free Canadian Investment Calculators | MapleSheet Co.",
    description: "Free tools to play with TFSA, RRSP, RESP, ACB, and compound growth numbers before you buy — plus a free Goal Tracker spreadsheet — built for the Canadian investing system.",
  },
  "/resources": {
    title: "Canadian Investing Guides — TFSA, RRSP, RESP & FHSA | MapleSheet Co.",
    description: "Plain-English guides to TFSA vs. RRSP, RESP & CESG grants, and the FHSA — written for Canadian investors who want to stop guessing and start tracking.",
  },
  "/about": {
    title: "About MapleSheet Co. — Built by a Canadian, for Canadians",
    description: "Why MapleSheet Co. exists: investment trackers built for the CRA system from the ground up, not adapted from American spreadsheets. Meet the founder.",
  },
  "/contact": {
    title: "Contact MapleSheet Co.",
    description: "Questions about a tracker, a bug, or a bulk order? Reach MapleSheet Co. directly — real answers from a real person, no support ticket queue.",
  },
  "/disclaimer": {
    title: "Disclaimer — MapleSheet Co.",
    description: "MapleSheet Co.'s trackers and guides are educational tools, not financial, tax, or legal advice. Read the full disclaimer before relying on any figure for a real decision.",
  },
  "/privacy": {
    title: "Privacy Policy — MapleSheet Co.",
    description: "What information MapleSheet Co. collects when you buy a tracker or contact us, how it's used, who it's shared with, and your rights under Canadian privacy law.",
  },
};

export const NOT_FOUND_META = {
  title: "Page not found | MapleSheet Co.",
  description: "This page doesn't exist. Browse MapleSheet Co.'s Canadian investment trackers or free guides instead.",
};

// Google shows roughly 155-160 characters. Cut longer text at the last whole
// word and add "…", instead of chopping mid-word ("cross-reference by ha").
export function metaDescription(text, max = 158) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—–-]+$/, "") + "…";
}

export function trackerMeta(product) {
  return {
    title: `${product.name} | MapleSheet Co.`,
    description: metaDescription(product.longDescription || product.desc),
    image: cardImage(product) || DEFAULT_OG_IMAGE,
  };
}

export function articleMeta(article) {
  return {
    title: `${article.title} | MapleSheet Co.`,
    description: metaDescription(article.summary),
    image: article.image || DEFAULT_OG_IMAGE,
  };
}

// Same "is it published yet?" rule the Resources page and Article page use:
// an article goes live automatically once its date arrives.
export function isLiveArticle(r, today = new Date()) {
  return r.type === "article" && r.slug && r.live !== false && new Date(r.date) <= today;
}

export const trackerPages = () => CATALOG.filter((p) => p.slug);
// Every article with a page, including ones scheduled for a future date —
// the build writes their page ahead of time so it's already there the day
// the article goes live (until then the page itself shows "Guide not found").
export const allArticles = () => RESOURCES.filter((r) => r.type === "article" && r.slug && r.live !== false);
export const liveArticles = (today = new Date()) => RESOURCES.filter((r) => isLiveArticle(r, today));

// sitemap.xml contents. Built per request by api/sitemap.js, so a scheduled
// article shows up in the sitemap the day it goes live — no redeploy needed.
export function buildSitemapXml(today = new Date()) {
  const staticPages = [
    { loc: "/", changefreq: "weekly", priority: "1.0" },
    { loc: "/trackers", changefreq: "weekly", priority: "0.9" },
    { loc: "/tools", changefreq: "monthly", priority: "0.8" },
    { loc: "/resources", changefreq: "weekly", priority: "0.8" },
    { loc: "/about", changefreq: "monthly", priority: "0.6" },
    { loc: "/contact", changefreq: "yearly", priority: "0.5" },
    { loc: "/disclaimer", changefreq: "yearly", priority: "0.3" },
    { loc: "/privacy", changefreq: "yearly", priority: "0.3" },
  ];
  // Every tracker with a slug (in data.js or src/trackerPages.js) has its
  // own /trackers/:slug page.
  const productPages = trackerPages().map((p) => ({
    loc: `/trackers/${p.slug}`,
    changefreq: "monthly",
    priority: p.tag === "Flagship" ? "0.75" : "0.7",
  }));
  const articlePages = liveArticles(today).map((r) => ({
    loc: `/resources/${r.slug}`,
    lastmod: r.date,
    changefreq: "monthly",
    priority: r.slug === "tfsa-vs-rrsp-vs-fhsa-vs-resp" ? "0.8" : "0.75",
  }));

  const entries = [...staticPages, ...productPages, ...articlePages].map((p) => [
    "  <url>",
    `    <loc>${SITE_URL}${p.loc}</loc>`,
    ...(p.lastmod ? [`    <lastmod>${p.lastmod}</lastmod>`] : []),
    `    <changefreq>${p.changefreq}</changefreq>`,
    `    <priority>${p.priority}</priority>`,
    "  </url>",
  ].join("\n"));

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}
