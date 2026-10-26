// Runs after every build (see "postbuild" in package.json). The site is
// built in the visitor's browser, so the one dist/index.html every URL gets
// carries the homepage's title, description and preview image. Google runs
// the JavaScript and sees the right page, but link previews (Facebook,
// Reddit, LinkedIn, iMessage, Slack) and most other search engines don't —
// sharing a guide showed the homepage's title and image.
//
// This writes a copy of index.html for every page, e.g.
// dist/resources/tfsa-withdrawals/index.html, with that page's own title,
// description, canonical URL and preview image swapped in. Visitors see no
// difference; the page still loads and runs exactly the same.
// It also writes dist/404.html, which Vercel serves for any URL that isn't a
// page — see vercel.json, which maps each kind of page to these files.
//
// Titles and descriptions come from src/seo.js, the same place the pages
// themselves read them from.
//
// It also puts each page's real content inside <div id="root"> (rendered by
// src/entry-server.jsx), plus that page's structured data (Product, FAQ,
// Article), so crawlers that don't run JavaScript see the whole page.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE_URL, DEFAULT_OG_IMAGE, STATIC_META, NOT_FOUND_META,
  trackerMeta, articleMeta, trackerPages, allArticles, liveArticles,
} from "../src/seo.js";
import { render as renderApp } from "../dist-ssr/entry-server.js";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const template = readFileSync(join(DIST, "index.html"), "utf8");

const escape = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Replaces one tag's attribute value; fails the build loudly if index.html
// ever changes shape so a tag can't be found (rather than silently shipping
// every page with homepage tags again).
function setAttr(html, tagPattern, value) {
  const re = new RegExp(`(${tagPattern}[^>]*?(?:content|href)=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`prerender-meta: couldn't find ${tagPattern} in dist/index.html`);
  return html.replace(re, `$1${escape(value)}$2`);
}

function render(path, { title, description, image = DEFAULT_OG_IMAGE, noindex = false }) {
  const url = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
  html = setAttr(html, '<meta name="description"', description);
  html = setAttr(html, '<meta property="og:title"', title);
  html = setAttr(html, '<meta property="og:description"', description);
  html = setAttr(html, '<meta property="og:image"', imageUrl);
  html = setAttr(html, '<meta property="og:url"', url);
  html = setAttr(html, '<link rel="canonical"', url);
  if (noindex) {
    html = html.replace(/<link rel="canonical"[^>]*>\s*/, "")
      .replace("</title>", '</title>\n    <meta name="robots" content="noindex" />');
  }
  return html;
}

// Keeps "</script>" inside a JSON value from closing the tag early.
const jsonForScript = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

async function withContent(path, html) {
  const { html: body, jsonLd } = await renderApp(path);
  const scripts = jsonLd.map(([id, data]) =>
    `    <script type="application/ld+json" data-jsonld-id="${escape(id)}">${jsonForScript(data)}</script>\n`).join("");
  if (!html.includes('<div id="root"></div>')) throw new Error("prerender-meta: couldn't find <div id=\"root\"></div> in dist/index.html");
  return html
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)
    .replace("</head>", () => `${scripts}  </head>`);
}

function write(path, html) {
  const dir = join(DIST, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf8");
}

const pages = [
  ...Object.entries(STATIC_META).map(([path, meta]) => [path, meta]),
  ...trackerPages().map((p) => [`/trackers/${p.slug}`, trackerMeta(p)]),
  ...allArticles().map((a) => [`/resources/${a.slug}`, articleMeta(a)]),
];
// Checkout pages keep the empty shell — they're per-visitor and not indexed.
const shell = template;
// An article scheduled for a later date would render as "Guide not found"
// today, and that text would stay in its file after the date arrives (until
// the next deploy), so those get the meta tags only; browsers fill them in.
const scheduled = new Set(allArticles().map((a) => `/resources/${a.slug}`));
for (const a of liveArticles()) scheduled.delete(`/resources/${a.slug}`);
for (const [path, meta] of pages) {
  const html = scheduled.has(path) ? render(path, meta) : await withContent(path, render(path, meta));
  if (path === "/") writeFileSync(join(DIST, "index.html"), html, "utf8");
  else write(path, html);
}
writeFileSync(join(DIST, "404.html"), await withContent("/404", render("/404", { ...NOT_FOUND_META, noindex: true })), "utf8");
write("checkout", shell);

console.log(`prerender-meta: wrote ${pages.length} pages + 404.html`);
