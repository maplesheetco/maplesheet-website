import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { B, CONFIG, PRODUCTS, ACCOUNT_GUIDES, RETURN_POLICY, FAQS, getBundleSavings } from "../data.js";
import { PageHead, usePageMeta, useJsonLd, DashboardMock, FaqAccordion, Reveal } from "../ui.jsx";
import { trackBuyClicked } from "../analytics.js";

// Real, uncropped tabs from the sheet itself, as a slideshow — used instead
// of a single stretched composite image when a product defines `gallery`
// (an array of {src, label}) in data.js. Falls back to nothing special;
// TrackerDetail just checks product.gallery before product.screenshot.
function ProductGallery({ images, name }) {
  const [i, setI] = useState(0);
  const go = (delta) => setI((cur) => (cur + delta + images.length) % images.length);
  const current = images[i];
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ position: "relative" }}>
        <img
          src={current.src} alt={`${name} — ${current.label}`}
          style={{
            width: "100%", borderRadius: 12, display: "block",
            border: `1px solid ${B.line}`, aspectRatio: "2 / 1", objectFit: "contain", background: B.black3,
          }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)} aria-label="Previous screenshot"
              style={{
                position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer",
                background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 16, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >‹</button>
            <button
              onClick={() => go(1)} aria-label="Next screenshot"
              style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer",
                background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 16, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >›</button>
          </>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10 }}>
        {images.map((img, idx) => (
          <button
            key={idx} onClick={() => setI(idx)} aria-label={`Show screenshot ${idx + 1}`}
            style={{
              width: idx === i ? 18 : 7, height: 7, borderRadius: 999, border: "none", cursor: "pointer",
              background: idx === i ? B.red : B.line, transition: "width 0.15s, background 0.15s", padding: 0,
            }}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", color: B.grayLight, fontSize: 12.5, marginTop: 6 }}>
        {current.label}
      </div>
    </div>
  );
}

// Persistent "don't miss it" CTA — fixed to the bottom of the viewport and
// hidden until 3 seconds after the visitor lands on the page (the "hook"),
// then slides up and stays visible while they read/scroll, so the buy
// button is never more than a glance away. Dismissible (×) per page view;
// re-appears on a fresh visit since state resets on mount. Renders nothing
// when the product has no purchase path at all.
function StickyBuyBar({ product }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!product.stripeBuyButton && !product.directUrl && !product.url) return null;

  return (
    <div
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40,
        background: B.black2, borderTop: `1px solid ${B.line}`,
        boxShadow: "0 -10px 28px rgba(0,0,0,0.4)",
        transform: visible && !dismissed ? "translateY(0)" : "translateY(110%)",
        opacity: visible && !dismissed ? 1 : 0,
        transition: "transform 0.5s cubic-bezier(.16,.8,.24,1), opacity 0.5s ease",
        pointerEvents: visible && !dismissed ? "auto" : "none",
      }}
    >
      <div style={{
        maxWidth: 780, margin: "0 auto", padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button
          onClick={() => setDismissed(true)} aria-label="Dismiss"
          style={{
            background: "none", border: "none", color: B.gray, fontSize: 20,
            cursor: "pointer", padding: "0 4px", lineHeight: 1, flexShrink: 0,
          }}
        >×</button>
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div style={{ color: B.white, fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {product.name}
          </div>
          <div style={{ color: B.grayLight, fontSize: 12.5 }}>CA${product.price.toFixed(2)} — one-time, no subscription</div>
        </div>
        <div style={{ flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
          {product.stripeBuyButton ? (
            <div onClickCapture={() => trackBuyClicked({
              productName: product.name, productTag: product.tag, priceCad: product.price,
              checkoutDestination: "stripe", sourceSection: "tracker_detail_sticky_bar",
            })}>
              <stripe-buy-button
                buy-button-id={product.stripeBuyButton.buyButtonId}
                publishable-key={product.stripeBuyButton.publishableKey}
              ></stripe-buy-button>
            </div>
          ) : (
            <a
              href={product.directUrl || product.url} target="_blank" rel="noreferrer"
              onClick={() => trackBuyClicked({
                productName: product.name, productTag: product.tag, priceCad: product.price,
                checkoutDestination: product.directUrl ? "direct" : "etsy", sourceSection: "tracker_detail_sticky_bar",
              })}
              style={{
                fontSize: 13, fontWeight: 700, color: "#fff", background: B.red,
                padding: "9px 18px", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap",
              }}
            >Buy now</a>
          )}
        </div>
      </div>
    </div>
  );
}

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
    image: `${SITE_URL}${product.screenshot || "/og.png"}`,
    ...(product.sku ? { sku: product.sku } : {}),
    url: `${SITE_URL}/trackers/${product.slug}`,
    brand: { "@type": "Brand", name: "MapleSheet Co." },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "CAD",
      availability: "https://schema.org/InStock",
      // Always true for a digital template — there's no "used" or
      // "refurbished" state for an instant download.
      itemCondition: "https://schema.org/NewCondition",
      hasMerchantReturnPolicy: RETURN_POLICY,
      url: product.directUrl || product.url,
    },
  } : null, "tracker-detail-schema");

  // Same FAQS content as the About page, restated here as FAQPage schema —
  // this is the page someone's actually deciding whether to buy on, so it's
  // also the one Google's most likely to reward with an FAQ rich result for
  // a purchase-intent search.
  useJsonLd(product ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  } : null, "tracker-detail-faq-schema");

  if (!product) {
    return (
      <div className="ml-fade">
        <PageHead kicker="TRACKERS" title="Tracker not found" />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "10px 24px 60px", textAlign: "center" }}>
          <Link to="/trackers" style={{ color: B.redLink, fontWeight: 600 }}>← Back to all trackers</Link>
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

  const savings = getBundleSavings(product);

  const hasBuyPath = !!(product.stripeBuyButton || product.directUrl || product.url);

  return (
    <div className="ml-fade" style={{ paddingBottom: hasBuyPath ? 70 : 0 }}>
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
        <Reveal style={{
          background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18,
          padding: "clamp(22px, 4vw, 32px)", marginBottom: 18,
        }}>
          {product.gallery ? (
            <ProductGallery images={product.gallery} name={product.name} />
          ) : product.screenshot ? (
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

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: savings ? 8 : 18 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: B.white }}>CA${product.price.toFixed(2)}</div>
            <div style={{ fontSize: 13, color: B.grayLight }}>One-time purchase — no subscription, ever</div>
          </div>

          {savings && (
            <div style={{
              display: "inline-block", background: "rgba(52,199,123,0.12)", border: "1px solid rgba(52,199,123,0.4)",
              color: "#34C77B", fontSize: 13, fontWeight: 700, padding: "6px 12px", borderRadius: 999, marginBottom: 18,
            }}>
              Save CA${savings.amount.toFixed(2)} ({savings.percent}%) vs. buying these trackers separately
            </div>
          )}

          {product.bestFor && (
            <div style={{ fontSize: 13.5, color: B.grayLight, marginBottom: 18, lineHeight: 1.6 }}>
              <span style={{ color: B.white, fontWeight: 700 }}>Best for:</span> {product.bestFor}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginBottom: (product.overview || product.features || product.included) ? 26 : 0 }}>
            {product.url && (
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
            )}
            {product.stripeBuyButton ? (
              <div
                style={{ flex: 1, display: "flex", justifyContent: "center" }}
                onClickCapture={() => trackBuyClicked({
                  productName: product.name, productTag: product.tag, priceCad: product.price,
                  checkoutDestination: "stripe", sourceSection: "tracker_detail",
                })}
              >
                <stripe-buy-button
                  buy-button-id={product.stripeBuyButton.buyButtonId}
                  publishable-key={product.stripeBuyButton.publishableKey}
                ></stripe-buy-button>
              </div>
            ) : product.directUrl ? (
              <a
                href={product.directUrl} target="_blank" rel="noreferrer" className="ml-btn"
                onClick={() => trackBuyClicked({
                  productName: product.name, productTag: product.tag, priceCad: product.price,
                  checkoutDestination: "direct", sourceSection: "tracker_detail",
                })}
                style={product.url ? {
                  flex: 1, textAlign: "center", fontSize: 14, fontWeight: 700, color: B.white,
                  background: "transparent", border: `1.5px solid ${B.white}`,
                  padding: "14px 10px", borderRadius: 10, textDecoration: "none",
                } : {
                  flex: 1, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#fff",
                  background: B.red, padding: "14px 10px", borderRadius: 10, textDecoration: "none",
                }}
              >{product.url ? "Buy Direct" : "Buy on Payhip"}</a>
            ) : product.url ? (
              <span title="Direct checkout coming soon" style={{
                flex: 1, textAlign: "center", fontSize: 14, fontWeight: 600, color: B.gray,
                border: `1.5px solid ${B.line}`, padding: "14px 10px", borderRadius: 10, cursor: "default",
              }}>Direct — soon</span>
            ) : null}
          </div>

          {product.overview && (
            <div style={{ marginBottom: 26 }}>
              {product.overview.map((para, i) => (
                <p key={i} style={{
                  color: B.grayLight, fontSize: 14.5, lineHeight: 1.75,
                  marginTop: i === 0 ? 0 : 14, marginBottom: 0,
                }}>{para}</p>
              ))}
              {product.whoFor && (
                <p style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, marginTop: 14, marginBottom: 0 }}>
                  <span style={{ color: B.white, fontWeight: 700 }}>Who it's for: </span>{product.whoFor}
                </p>
              )}
            </div>
          )}

          {product.features && (
            <div style={{ marginBottom: product.included ? 26 : 0 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", color: B.redLink, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>
                What's included in the tracker
              </div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {product.features.map((f, i) => (
                  <li key={i} style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, marginBottom: 6 }}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {product.included && (
            <div>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", color: B.redLink, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>
                What you get after you purchase
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {product.included.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 17, lineHeight: 1.5 }}>{item.icon}</span>
                    <div>
                      <div style={{ color: B.white, fontWeight: 700, fontSize: 14 }}>{item.label}</div>
                      <div style={{ color: B.grayLight, fontSize: 13.5, lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        {guides.length > 0 && (
          <Reveal delay={80} style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18, padding: "clamp(20px, 4vw, 28px)", marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: B.white, marginBottom: 12 }}>
              Learn the rules for each account
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {guides.map((g) => (
                <Link key={g.slug} to={`/resources/${g.slug}`} style={{ color: B.redLink, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                  📖 {g.label} →
                </Link>
              ))}
              <Link to="/resources/tfsa-vs-rrsp-vs-fhsa-vs-resp" style={{ color: B.redLink, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                📖 Which account should come first? →
              </Link>
              {product.extraGuide && (
                <Link to={`/resources/${product.extraGuide.slug}`} style={{ color: B.redLink, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                  📖 {product.extraGuide.label} →
                </Link>
              )}
            </div>
          </Reveal>
        )}

        <Reveal delay={160} style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18, padding: "clamp(20px, 4vw, 28px)", marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: B.white, marginBottom: 12 }}>
            Common questions
          </div>
          <FaqAccordion faqs={FAQS} />
        </Reveal>

        <p style={{ textAlign: "center", color: B.yellow, fontSize: 13.5, fontWeight: 600, marginTop: 6, marginBottom: 30 }}>
          🏷 {CONFIG.promoText}
        </p>
      </div>

      <StickyBuyBar product={product} />
    </div>
  );
}
