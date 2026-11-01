// Vercel serverless function — serves
// https://www.maplesheet.ca/merchant-feed.xml, the product feed Google
// Merchant Center fetches once a day (vercel.json rewrites the .xml path
// here). Built per request from src/data.js, so it's always current. The
// field mapping lives in src/merchantFeed.js.
import { buildMerchantFeedXml } from "../src/merchantFeed.js";

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(buildMerchantFeedXml());
}
