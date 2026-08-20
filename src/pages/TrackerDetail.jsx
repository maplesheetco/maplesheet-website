import React from "react";
import { useParams, Link } from "react-router-dom";
import { B, CONFIG, PRODUCTS, ACCOUNT_GUIDES } from "../data.js";
import { PageHead, usePageMeta, useJsonLd, DashboardMock } from "../ui.jsx";
import { trackBuyClicked } from "../analytics.js";

const SITE_URL = "https://www.maplesheet.ca";

// Individual landing page for the combo/flagship trackers (TFSA + RRSP,
// Ultimate Tracker, etc.) — these products only ever appeared as catalog
// cards on /trackers before, with no page of their own to rank for their
// specific keyword ("TFSA multi-brokerage tracker Canada" and similar) or
// to carry a full description, feature list, and Product schema. Only
// products with a `slug` in data.js get a page here; single-account
// trackers (TFSA Tracker, RRSP Tracker, etc.) are catalog-only by design.
export default function TrackerDetail() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);

  usePageMeta({
    title: product ? `${product.name} | MapleSheet Co.` : "Tracker not found | MapleSheet Co.",
    description: product ? (product.longDescription || product.desc).slice(0, 155) : "This tracker couldn't be found.",
  });

  useJsonLd(product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription || product.desc,
    category: product.tag,
    url: `${SITE_URL}/trackers/${product.slug}`,
    brand: { "@type": "Brand", name: "MapleSheet Co." },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "CAD",
      availability: "https://schema.org/InStock",
      url: product.directUrl || product.url,
    },
  } : null, "tracker-detail-schema");

  if (!product) {
    return (
      <div className="ml-fade">
        <PageHead kicker="TRACKERS" title="Tracker not found" />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "10px 24px 60px", textAlign: "center" }}>
          <Link to="/trackers" style={{ color: B.red, fontWeight: 600 }}>← Back to all trackers</Link>
        </div>
      </div>
    );
  }

  // De-duped list of guides for every account this product covers, plus the
  // cross-account comparison guide — this is what makes a combo product's
  // page more than just a repeated product blurb: real supporting content.
  const guides = (product.accounts || [])
    .map((tag) => ACCOUNT_GUIDES[tag])
    .filter(Boolean)
    .filter((g, i, arr) => arr.findIndex((x) => x.slug === g.slug) === i);

  return (
    <div className="ml-fade">
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 24px 0" }}>
        <Link to="/trackers" style={{ color: B.gray, fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
          ← All trackers
        </Link>
      </div>
      <PageHead
        kicker={product.tag.toUpperCase()}
        title={product.name}
        sub={product.longDescription || product.desc}
      />
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "10px 24px 0" }}>
        <div style={{
          background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18,
          padding: "clamp(22px, 4vw, 32px)", marginBottom: 18,
        }}>
          {product.screenshot ? (
            <img
              src={product.screenshot} alt={`${product.name} dashboard screenshot`}
              style={{
                width: "100%", borderRadius: 12, marginBottom: 22, display: "block",
                border: `1px solid ${B.line}`, aspectRatio: "2 / 1", objectFit: "contain", background: B.black3,
              }}
            />
          ) : product.demo ? (
            <div style={{ maxWidth: 460, margin: "0 auto 24px" }}>
              <DashboardMock total={product.demo.total} ytd={product.demo.ytd} accounts={product.demo.accounts} />
            </div>
          ) : null}

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: B.white }}>CA${product.price.toFixed(2)}</div>
            <div style={{ fontSize: 13, color: B.grayLight }}>One-time purchase — no subscription, ever</div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: product.features ? 26 : 0 }}>
            <a
              href={product.url} target="_blank" rel="noreferrer" className="ml-btn"
              onClick={() => trackBuyClicked({
                productName: product.name, productTag: product.tag, priceCad: product.price,
                checkoutDestination: "etsy", sourceSection: "tracker_detail",
              })}
              style={{
                flex: 1, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#fff",
                background: B.red, padding: "14px 10px", borderRadius: 10, textDecoration: "none",
              }}
            >Buy on Etsy</a>
            {product.directUrl ? (
              <a
                href={product.directUrl} target="_blank" rel="noreferrer" className="ml-btn"
                onClick={() => trackBuyClicked({
                  productName: product.name, productTag: product.tag, priceCad: product.price,
                  checkoutDestination: "direct", sourceSection: "tracker_detail",
                })}
                style={{
                  flex: 1, textAlign: "center", fontSize: 14, fontWeight: 700, color: B.white,
                  background: "transparent", border: `1.5px solid ${B.white}`,
                  padding: "14px 10px", borderRadius: 10, textDecoration: "none",
                }}
              >Buy Direct</a>
            ) : (
              <span title="Direct checkout coming soon" style={{
                flex: 1, textAlign: "center", fontSize: 14, fontWeight: 600, color: B.gray,
                border: `1.5px solid ${B.line}`, padding: "14px 10px", borderRadius: 10, cursor: "default",
              }}>Direct — soon</span>
            )}
          </div>

          {product.features && (
            <>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", color: B.red, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>
                What's included
              </div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {product.features.map((f, i) => (
                  <li key={i} style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, marginBottom: 6 }}>{f}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {guides.length > 0 && (
          <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18, padding: "clamp(20px, 4vw, 28px)", marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: B.white, marginBottom: 12 }}>
              Learn the rules for each account
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {guides.map((g) => (
                <Link key={g.slug} to={`/resources/${g.slug}`} style={{ color: B.red, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                  📖 {g.label} →
                </Link>
              ))}
              <Link to="/resources/tfsa-vs-rrsp-vs-fhsa-vs-resp" style={{ color: B.red, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                📖 Which account should come first? →
              </Link>
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", color: B.yellow, fontSize: 13.5, fontWeight: 600, marginTop: 6, marginBottom: 30 }}>
          🏷 {CONFIG.promoText}
        </p>
      </div>
    </div>
  );
}
