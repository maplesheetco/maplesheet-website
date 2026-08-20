import React, { useState } from "react";
import { Link } from "react-router-dom";
import { B, CONFIG, PRODUCTS, ACCOUNT_GUIDES, RETURN_POLICY } from "../data.js";
import { PageHead, RedWord, usePageMeta, useJsonLd } from "../ui.jsx";
import { trackBuyClicked } from "../analytics.js";

const SITE_URL = "https://www.maplesheet.ca";
const FILTERS = ["All", "TFSA", "RRSP", "RESP", "FHSA", "Margin", "Combo", "Flagship"];

export default function Trackers() {
  usePageMeta({
    title: "TFSA, RRSP, RESP, FHSA & Margin Trackers | MapleSheet Co.",
    description: "13 Google Sheets trackers for TFSA, RRSP, RESP, FHSA & Margin accounts. One-time purchase, live prices, no subscription.",
  });
  // Product schema for all 13 trackers — this page is where they're all
  // listed, so each tracker gets its own Product entry in one @graph block.
  // Combo/Flagship products additionally carry a `url` pointing at their own
  // /trackers/:slug page now that one exists, alongside `offers.url` (the
  // actual Etsy/Payhip purchase link) — Product.url is "the page describing
  // this", offers.url is "where you can buy it," and they're not the same.
  // `image` is required for Google's Merchant listing rich result (it was
  // flagged as a critical "missing field" error before this) — real product
  // screenshots are used where we have them, falling back to the site's
  // general share image (og.png) for the few trackers without one yet.
  useJsonLd({
    "@context": "https://schema.org",
    "@graph": PRODUCTS.map((p) => ({
      "@type": "Product",
      name: p.name,
      description: p.desc,
      category: p.tag,
      image: `${SITE_URL}${p.screenshot || "/og.png"}`,
      ...(p.sku ? { sku: p.sku } : {}),
      ...(p.slug ? { url: `${SITE_URL}/trackers/${p.slug}` } : {}),
      brand: { "@type": "Brand", name: "MapleSheet Co." },
      offers: {
        "@type": "Offer",
        price: p.price.toFixed(2),
        priceCurrency: "CAD",
        availability: "https://schema.org/InStock",
        // Always true for a digital template — there's no "used" or
        // "refurbished" state for an instant download.
        itemCondition: "https://schema.org/NewCondition",
        hasMerchantReturnPolicy: RETURN_POLICY,
        url: p.directUrl || p.url,
      },
    })),
  }, "trackers-product-schema");
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.tag === filter);
  return (
    <div className="ml-fade">
      <PageHead kicker="THE LINEUP" title={<>13 trackers. <RedWord>Every Canadian account.</RedWord></>}
        sub="Start with one account, or track everything at once. All prices in CAD. One-time purchase — no subscription, ever." />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "26px 24px 0" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="ml-btn" style={{
              padding: "8px 16px", fontSize: 13, fontWeight: 600, borderRadius: 999, cursor: "pointer",
              border: `1.5px solid ${filter === f ? B.red : B.line}`,
              background: filter === f ? B.red : "transparent",
              color: filter === f ? "#fff" : B.grayLight, fontFamily: "inherit",
            }}>{f}</button>
          ))}
        </div>
        <div className="ml-fade" key={filter} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))", gap: 16 }}>
          {shown.map((p) => {
            const flagship = p.badge === "FLAGSHIP";
            const guide = ACCOUNT_GUIDES[p.tag];
            return (
              <div key={p.name} className="ml-card" style={{
                display: "flex", flexDirection: "column", gap: 10,
                background: flagship ? `linear-gradient(150deg, #2A0A0A, ${B.black2})` : B.black2,
                border: `1.5px solid ${flagship ? B.red : B.line}`,
                borderRadius: 16, padding: "22px 20px", position: "relative",
              }}>
                {p.badge && (
                  <span style={{
                    position: "absolute", top: 14, right: 14,
                    background: flagship ? B.red : B.yellow, color: flagship ? "#fff" : B.black,
                    fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em",
                    padding: "4px 10px", borderRadius: 999,
                  }}>{p.badge}</span>
                )}
                <span style={{ fontSize: 11, letterSpacing: "0.1em", color: B.gray, fontWeight: 700, textTransform: "uppercase" }}>{p.tag}</span>
                {p.slug ? (
                  <Link to={`/trackers/${p.slug}`} style={{
                    fontSize: 17, fontWeight: 700, color: B.white, lineHeight: 1.3,
                    paddingRight: p.badge ? 66 : 0, textDecoration: "none",
                  }}>{p.name}</Link>
                ) : (
                  <span style={{ fontSize: 17, fontWeight: 700, color: B.white, lineHeight: 1.3, paddingRight: p.badge ? 66 : 0 }}>{p.name}</span>
                )}
                <span style={{ fontSize: 13, color: B.grayLight, lineHeight: 1.55, flex: 1 }}>{p.desc}</span>
                <div style={{ fontSize: 19, fontWeight: 800, color: B.white, marginTop: 4 }}>CA${p.price.toFixed(2)}</div>
                {guide && (
                  <Link to={`/resources/${guide.slug}`} style={{
                    fontSize: 12, color: B.grayLight, textDecoration: "none", display: "inline-block",
                  }}>
                    📖 {guide.label} →
                  </Link>
                )}
                {p.slug && (
                  <Link to={`/trackers/${p.slug}`} style={{
                    fontSize: 12, color: B.grayLight, textDecoration: "none", display: "inline-block",
                  }}>
                    View full details →
                  </Link>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={p.url} target="_blank" rel="noreferrer" className="ml-btn" onClick={() => trackBuyClicked({
                    productName: p.name, productTag: p.tag, priceCad: p.price,
                    checkoutDestination: "etsy", sourceSection: "trackers_catalog",
                  })} style={{
                    flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff",
                    background: B.red, padding: "10px 8px", borderRadius: 8, textDecoration: "none",
                  }}>Buy on Etsy</a>
                  {p.directUrl ? (
                    <a href={p.directUrl} target="_blank" rel="noreferrer" className="ml-btn" onClick={() => trackBuyClicked({
                      productName: p.name, productTag: p.tag, priceCad: p.price,
                      checkoutDestination: "direct", sourceSection: "trackers_catalog",
                    })} style={{
                      flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: B.white,
                      background: "transparent", border: `1.5px solid ${B.white}`,
                      padding: "10px 8px", borderRadius: 8, textDecoration: "none",
                    }}>Buy Direct</a>
                  ) : (
                    <span title="Direct checkout coming soon" style={{
                      flex: 1, textAlign: "center", fontSize: 13, fontWeight: 600, color: B.gray,
                      border: `1.5px solid ${B.line}`, padding: "10px 8px", borderRadius: 8, cursor: "default",
                    }}>Direct — soon</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ textAlign: "center", color: B.yellow, fontSize: 13.5, fontWeight: 600, marginTop: 24 }}>
          🏷 {CONFIG.promoText}
        </p>
      </div>
    </div>
  );
}
