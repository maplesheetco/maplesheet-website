// Vercel serverless function — serves https://www.maplesheet.ca/sitemap.xml
// (vercel.json rewrites /sitemap.xml here).
//
// Why a function instead of a file: sitemap.xml used to be generated once
// per build, so an article scheduled for a future date went live on the site
// on its date but didn't reach the sitemap Google reads until the next time
// something was merged. Built per request, it's always current. The list of
// pages lives in src/seo.js.
import { buildSitemapXml } from "../src/seo.js";

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  // Cache at Vercel's edge for an hour so crawlers hitting it repeatedly
  // don't each run the function.
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(buildSitemapXml(new Date()));
}
