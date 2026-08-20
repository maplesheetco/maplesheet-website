// Regenerates public/sitemap.xml from the actual data in src/data.js, run
// automatically before every build (see "prebuild" in package.json — npm
// runs it for you, Vercel included, whenever "npm run build" runs).
//
// Why this exists: sitemap.xml used to be a hand-maintained file. Every time
// a new /resources article or /trackers/:slug product page was added, it had
// to be added here too — and it was easy to add a *future-dated draft* article
// before it actually went live, which told Google to crawl a URL that
// returned "Guide not found" until the date arrived. This script makes that
// class of mistake impossible: it only ever includes what RESOURCES/PRODUCTS
// say is actually live right now, checked fresh on every build.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { RESOURCES, PRODUCTS } from "../src/data.js";

const SITE_URL = "https://www.maplesheet.ca";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "public", "sitemap.xml");

const today = new Date();

// Static pages that always exist, regardless of data.js content.
const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/trackers", changefreq: "weekly", priority: "0.9" },
  { loc: "/tools", changefreq: "monthly", priority: "0.8" },
  { loc: "/resources", changefreq: "weekly", priority: "0.8" },
  { loc: "/about", changefreq: "monthly", priority: "0.6" },
  { loc: "/contact", changefreq: "yearly", priority: "0.5" },
];

// Combo/Flagship trackers each have their own /trackers/:slug page. Single-
// account trackers (TFSA Tracker, RRSP Tracker, etc.) are catalog-only by
// design and don't get an entry — see src/pages/Trackers.jsx.
const productPages = PRODUCTS.filter((p) => p.slug).map((p) => ({
  loc: `/trackers/${p.slug}`,
  changefreq: "monthly",
  priority: p.tag === "Flagship" ? "0.75" : "0.7",
}));

// Only articles that are actually live today (same rule Resources.jsx and
// Article.jsx use to decide what to render) get a sitemap entry. A future-
// dated draft in the queue simply won't appear here until its date arrives —
// no manual sitemap edit needed when you queue a new article.
const articlePages = RESOURCES
  .filter((r) => r.type === "article" && r.slug && r.live !== false && new Date(r.date) <= today)
  .map((r) => ({
    loc: `/resources/${r.slug}`,
    lastmod: r.date,
    changefreq: "monthly",
    priority: r.slug === "tfsa-vs-rrsp-vs-fhsa-vs-resp" ? "0.8" : "0.75",
  }));

const allPages = [...staticPages, ...productPages, ...articlePages];

const urlEntries = allPages
  .map((p) => {
    const lines = [
      "  <url>",
      `    <loc>${SITE_URL}${p.loc}</loc>`,
    ];
    if (p.lastmod) lines.push(`    <lastmod>${p.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${p.changefreq}</changefreq>`);
    lines.push(`    <priority>${p.priority}</priority>`);
    lines.push("  </url>");
    return lines.join("\n");
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

writeFileSync(OUT_PATH, xml, "utf8");
console.log(`sitemap.xml regenerated: ${allPages.length} URLs (${staticPages.length} static, ${productPages.length} tracker, ${articlePages.length} article).`);
