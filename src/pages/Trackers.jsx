import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { B, ACCOUNT_GUIDES, RETURN_POLICY, SHIPPING_DETAILS, ELIGIBLE_REGION, getBundleSavings } from "../data.js";
import { PageHead, RedWord, usePageMeta, useJsonLd, Reveal, PromoBanner, Picture } from "../ui.jsx";
import { CATALOG, cardImage } from "../trackerPages.js";
import { trackBuyClicked } from "../analytics.js";
import { STATIC_META } from "../seo.js";
import { TrackerPicker, CompareTable } from "../TrackerTools.jsx";

const SITE_URL = "https://www.maplesheet.ca";
const FILTERS = ["All", "TFSA", "RRSP", "RESP", "FHSA", "Margin", "Combo", "Flagship"];

export default function Trackers() {
  usePageMeta(STATIC_META["/trackers"]);
  // Product schema for all trackers — this page is where they're all
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
    "@graph": CATALOG.map((p) => ({
      "@type": "Product",
      name: p.name,
      description: p.desc,
      category: p.tag,
      image: `${SITE_URL}${cardImage(p) || "/og.png"}`,
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
        shippingDetails: SHIPPING_DETAILS,
        eligibleRegion: ELIGIBLE_REGION,
        ...(p.slug ? { url: `${SITE_URL}/trackers/${p.slug}` } : {}),
      },
    })),
  }, "trackers-product-schema");
  const [filter, setFilter] = useState("All");
  // Links like /trackers#picker (from the Home page) land on that section.
  // The site's own route-change handler scrolls to the top first, so this
  // waits a tick before scrolling down.
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 60);
    return () => clearTimeout(t);
  }, [hash]);
  // The two Ultimate trackers get their own highlighted row above the grid,
  // so "All" leaves them out of the grid (the Flagship filter still shows them).
  const flagships = CATALOG.filter((p) => p.badge === "FLAGSHIP").sort((a, b) => a.price - b.price);
  const shown = filter === "All" ? CATALOG.filter((p) => p.badge !== "FLAGSHIP") : CATALOG.filter((p) => p.tag === filter);
  return (
    <div className="ml-fade">
      <PageHead kicker="THE LINEUP" title={<>{CATALOG.length} trackers. <RedWord>Every Canadian account.</RedWord></>}
        sub="Start with one account, or track everything at once. All prices in CAD. One-time purchase — no subscription, ever." />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "26px 24px 0" }}>
        <TrackerPicker />
        <FlagshipRow products={flagships} />
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
          {shown.map((p, i) => {
            const flagship = p.badge === "FLAGSHIP";
            const guide = ACCOUNT_GUIDES[p.tag];
            const savings = getBundleSavings(p);
            const image = cardImage(p);
            const thumb = image && (
              <Picture thumb src={image} alt={`${p.name} dashboard screenshot`} style={{
                width: "100%", display: "block", borderRadius: 10, aspectRatio: "16 / 9",
                objectFit: "cover", objectPosition: "top", background: B.black3,
                border: `1px solid ${B.line}`, marginBottom: 4,
              }} />
            );
            return (
              <Reveal key={p.name} delay={Math.min(i * 50, 350)} className="ml-card" style={{
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
                {thumb && (p.slug ? <Link to={`/trackers/${p.slug}`} aria-hidden="true" tabIndex={-1}>{thumb}</Link> : thumb)}
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
                {p.bestFor && (
                  <span style={{ fontSize: 11.5, color: B.gray, lineHeight: 1.5 }}>
                    <span style={{ color: B.grayLight, fontWeight: 700 }}>Best for:</span> {p.bestFor}
                  </span>
                )}
                <div style={{ fontSize: 19, fontWeight: 800, color: B.white, marginTop: 4 }}>CA${p.price.toFixed(2)}</div>
                {savings && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#34C77B" }}>
                    Save CA${savings.amount.toFixed(2)} ({savings.percent}%) vs. separately
                  </span>
                )}
                {guide && (
                  <Link to={`/resources/${guide.slug}`} style={{
                    fontSize: 12, color: B.grayLight, textDecoration: "none", display: "inline-block",
                  }}>
                    📖 {guide.label} →
                  </Link>
                )}
                {p.slug && !p.stripeBuyButton && (
                  <Link to={`/trackers/${p.slug}`} style={{
                    fontSize: 12, color: B.grayLight, textDecoration: "none", display: "inline-block",
                  }}>
                    View full details →
                  </Link>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  {p.url && !p.stripeBuyButton && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="ml-btn" onClick={() => trackBuyClicked({
                      productName: p.name, productTag: p.tag, priceCad: p.price,
                      checkoutDestination: "etsy", sourceSection: "trackers_catalog",
                    })} style={{
                      flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff",
                      background: B.red, padding: "10px 8px", borderRadius: 8, textDecoration: "none",
                    }}>Buy on Etsy</a>
                  )}
                  {p.stripeBuyButton && p.slug ? (
                    // Catalog cards link to the product's own detail page rather
                    // than embedding the Stripe Buy Button directly — the widget
                    // is cramped at this card size, and the detail page already
                    // has its own (same checkout, same product). This button is
                    // the card's full-width CTA, not a secondary text link.
                    <Link
                      to={`/trackers/${p.slug}`}
                      onClick={() => trackBuyClicked({
                        productName: p.name, productTag: p.tag, priceCad: p.price,
                        checkoutDestination: "detail_page", sourceSection: "trackers_catalog",
                      })}
                      style={{
                        flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff",
                        background: B.red, padding: "10px 8px", borderRadius: 8, textDecoration: "none",
                      }}
                    >View full details →</Link>
                  ) : p.stripeBuyButton ? (
                    <div
                      style={{ flex: 1 }}
                      onClickCapture={() => trackBuyClicked({
                        productName: p.name, productTag: p.tag, priceCad: p.price,
                        checkoutDestination: "stripe", sourceSection: "trackers_catalog",
                      })}
                    >
                      <stripe-buy-button
                        buy-button-id={p.stripeBuyButton.buyButtonId}
                        publishable-key={p.stripeBuyButton.publishableKey}
                      ></stripe-buy-button>
                    </div>
                  ) : p.directUrl ? (
                    <a href={p.directUrl} target="_blank" rel="noreferrer" className="ml-btn"
                      onClick={() => trackBuyClicked({
                      productName: p.name, productTag: p.tag, priceCad: p.price,
                      checkoutDestination: "direct", sourceSection: "trackers_catalog",
                    })} style={p.url ? {
                      flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: B.white,
                      background: "transparent", border: `1.5px solid ${B.white}`,
                      padding: "10px 8px", borderRadius: 8, textDecoration: "none",
                    } : {
                      flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff",
                      background: B.red, padding: "10px 8px", borderRadius: 8, textDecoration: "none",
                    }}>{p.url ? "Buy Direct" : "Buy on Payhip"}</a>
                  ) : p.url ? (
                    <span title="Direct checkout coming soon" style={{
                      flex: 1, textAlign: "center", fontSize: 13, fontWeight: 600, color: B.gray,
                      border: `1.5px solid ${B.line}`, padding: "10px 8px", borderRadius: 8, cursor: "default",
                    }}>Direct — soon</span>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
        <CompareTable />
        <PromoBanner style={{ marginTop: 24 }} />
      </div>
    </div>
  );
}

// Full-width highlight for the two Ultimate trackers (one brokerage vs up
// to 8), side by side on desktop and stacked on phones.
function FlagshipRow({ products }) {
  if (!products.length) return null;
  return (
    <section aria-labelledby="flagships" style={{ margin: "0 0 34px" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.14em", color: B.redLink, fontWeight: 700, marginBottom: 6 }}>FLAGSHIP</div>
        <h2 id="flagships" style={{ fontSize: "clamp(22px, 3.4vw, 30px)", fontWeight: 800, margin: 0, color: B.white, letterSpacing: "-0.02em" }}>
          Every account, <RedWord>one sheet</RedWord>
        </h2>
        <p style={{ color: B.grayLight, fontSize: 14.5, margin: "8px auto 0", maxWidth: 620, lineHeight: 1.6 }}>
          The two Ultimate trackers cover all 6 accounts. Pick by where your money is: one brokerage, or up to 8.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 18 }}>
        {products.map((p) => {
          const savings = getBundleSavings(p);
          const image = cardImage(p);
          const multi = /-MB$/.test(p.sku || "");
          return (
            <Reveal key={p.slug} className="ml-card" style={{
              display: "flex", flexDirection: "column", gap: 12,
              background: `linear-gradient(150deg, #2A0A0A, ${B.black2})`,
              border: `2px solid ${B.red}`, borderRadius: 18, padding: "clamp(20px, 3vw, 26px)", position: "relative",
            }}>
              <span style={{
                position: "absolute", top: 16, right: 16, background: B.red, color: "#fff",
                fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em", padding: "4px 10px", borderRadius: 999,
              }}>FLAGSHIP</span>
              {image && (
                <Link to={`/trackers/${p.slug}`} aria-hidden="true" tabIndex={-1}>
                  <Picture thumb src={image} alt={`${p.name} dashboard screenshot`} style={{
                    width: "100%", display: "block", borderRadius: 10, aspectRatio: "16 / 9",
                    objectFit: "cover", objectPosition: "top left", background: B.black3, border: `1px solid ${B.line}`,
                  }} />
                </Link>
              )}
              <span style={{ fontSize: 11.5, letterSpacing: "0.1em", color: B.redLink, fontWeight: 700, textTransform: "uppercase" }}>
                {multi ? "Up to 8 brokerages" : "One brokerage"}
              </span>
              <Link to={`/trackers/${p.slug}`} style={{ fontSize: 21, fontWeight: 800, color: B.white, lineHeight: 1.25, textDecoration: "none" }}>
                {p.name}
              </Link>
              {p.pitch && <p style={{ margin: 0, fontSize: 14, color: B.grayLight, lineHeight: 1.6 }}>{p.pitch}</p>}
              {p.highlights && (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "6px 14px", flex: 1, alignContent: "start" }}>
                  {p.highlights.map((h) => (
                    <li key={h} style={{ display: "flex", gap: 8, fontSize: 13, color: B.white, lineHeight: 1.45 }}>
                      <span style={{ color: "#34C77B", fontWeight: 800 }} aria-hidden="true">✓</span>{h}
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "4px 12px", marginTop: 4 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: B.white }}>CA${p.price.toFixed(2)}</span>
                {savings && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#34C77B" }}>
                    Save CA${savings.amount.toFixed(2)} ({savings.percent}%) vs. separately
                  </span>
                )}
              </div>
              <Link
                to={`/trackers/${p.slug}`}
                onClick={() => trackBuyClicked({
                  productName: p.name, productTag: p.tag, priceCad: p.price,
                  checkoutDestination: "detail_page", sourceSection: "trackers_flagships",
                })}
                className="ml-btn"
                style={{
                  textAlign: "center", fontSize: 14, fontWeight: 700, color: "#fff",
                  background: B.red, padding: "12px 10px", borderRadius: 10, textDecoration: "none",
                }}
              >View full details →</Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
