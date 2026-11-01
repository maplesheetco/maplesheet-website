// Google Merchant Center product feed (RSS 2.0 + the g: namespace).
// Served at https://www.maplesheet.ca/merchant-feed.xml by
// api/merchant-feed.js (vercel.json rewrites the .xml path there).
//
// Lino: you never edit this file. It reads every tracker straight from
// src/data.js (name, price, SKU, pictures), so a new tracker or a price
// change shows up in Google on Merchant Center's next daily fetch.
//
// Field rules: https://support.google.com/merchants/answer/7052112
import { SITE_URL, trackerPages } from "./seo.js";
import { cardImage } from "./trackerPages.js";

const BRAND = "MapleSheet Co.";

// Google rejects raw &, <, > in XML text, and Etsy-style emoji/arrows are
// fine but stray control characters are not.
function esc(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const abs = (path) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`);

// Title: Google allows 150 characters. Adding what it is and who it's for
// ("Google Sheets", "Canada") matches what people actually type.
function feedTitle(p) {
  return `${p.name} | Google Sheets Template for Canadian Investors`.slice(0, 150);
}

// Description: plain text, up to 5000 characters. The page's own overview
// and feature list, nothing invented.
function feedDescription(p) {
  const parts = [p.longDescription || p.desc];
  if (p.features?.length) parts.push(`What's included: ${p.features.join("; ")}.`);
  parts.push("Instant digital download: a Google Sheets template you copy to your own Google Drive. Works in any web browser. No subscription.");
  return parts.join(" ").replace(/\s+/g, " ").trim().slice(0, 5000);
}

function productType(p) {
  const kind = p.tag === "Combo" || p.tag === "Flagship" ? "Combo Trackers" : `${p.tag} Trackers`;
  return `Google Sheets Templates > Investment Trackers > ${kind}`;
}

export function feedItems() {
  return trackerPages()
    .filter((p) => p.sku && p.slug && typeof p.price === "number")
    .map((p) => {
      const main = cardImage(p) || "/og.png";
      const extra = (p.gallery || [])
        .map((g) => g.src)
        .filter((src) => src && src !== main);
      return {
        id: p.sku,
        title: feedTitle(p),
        description: feedDescription(p),
        link: `${SITE_URL}/trackers/${p.slug}`,
        image: abs(main),
        // Google takes up to 10 extra pictures.
        additionalImages: [...new Set(extra)].slice(0, 10).map(abs),
        price: `${p.price.toFixed(2)} CAD`,
        productType: productType(p),
      };
    });
}

export function buildMerchantFeedXml() {
  const items = feedItems().map((it) => [
    "    <item>",
    `      <g:id>${esc(it.id)}</g:id>`,
    `      <g:title>${esc(it.title)}</g:title>`,
    `      <g:description>${esc(it.description)}</g:description>`,
    `      <g:link>${esc(it.link)}</g:link>`,
    `      <g:image_link>${esc(it.image)}</g:image_link>`,
    ...it.additionalImages.map((src) => `      <g:additional_image_link>${esc(src)}</g:additional_image_link>`),
    "      <g:availability>in_stock</g:availability>",
    `      <g:price>${esc(it.price)}</g:price>`,
    `      <g:brand>${esc(BRAND)}</g:brand>`,
    "      <g:condition>new</g:condition>",
    // A template made by MapleSheet has no barcode (GTIN) or manufacturer
    // part number, so tell Google not to expect one.
    "      <g:identifier_exists>no</g:identifier_exists>",
    `      <g:product_type>${esc(it.productType)}</g:product_type>`,
    // Instant download: free "shipping" to anywhere in Canada.
    "      <g:shipping>",
    "        <g:country>CA</g:country>",
    "        <g:price>0.00 CAD</g:price>",
    "      </g:shipping>",
    "    </item>",
  ].join("\n"));

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(BRAND)} Google Sheets Trackers</title>
    <link>${SITE_URL}</link>
    <description>Google Sheets investment trackers for Canadian TFSA, RRSP, FHSA, RESP and margin accounts.</description>
${items.join("\n")}
  </channel>
</rss>
`;
}
