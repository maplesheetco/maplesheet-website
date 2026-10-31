import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { B, ACCOUNT_GUIDES, RETURN_POLICY, SHIPPING_DETAILS, ELIGIBLE_REGION, FAQS, getBundleSavings } from "../data.js";
import { PageHead, usePageMeta, useJsonLd, DashboardMock, FaqAccordion, Reveal, PromoBanner, Picture } from "../ui.jsx";
import { trackerMeta } from "../seo.js";
import { CATALOG, cardImage } from "../trackerPages.js";
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
        <Picture
          eager src={current.src} alt={`${name} — ${current.label}`}
          style={{
            width: "100%", borderRadius: 12, display: "block",
            border: `1px solid ${B.line}`, aspectRatio: "4 / 3", objectFit: "contain", background: B.black3,
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
      <div style={{ textAlign: "center", color: B.grayLight, fontSize: 12.5, marginTop: 8 }}>
        {current.label}
      </div>
      {/* Thumbnail strip: every screenshot at a glance, scrolls sideways when
          a tracker has more than fit. */}
      {images.length > 1 && (
        <div className="ml-thumbs" style={{ display: "flex", gap: 10, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
          {images.map((img, idx) => (
            <button
              key={idx} onClick={() => setI(idx)} aria-label={`Show screenshot ${idx + 1}: ${img.label}`}
              aria-current={idx === i}
              style={{
                flex: "0 0 calc((100% - 30px) / 4)", minWidth: 90, padding: 0, cursor: "pointer",
                borderRadius: 8, overflow: "hidden", background: B.black3,
                border: `2px solid ${idx === i ? B.red : B.line}`, opacity: idx === i ? 1 : 0.75,
              }}
            >
              <Picture thumb src={img.src} alt="" style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", objectPosition: "top", display: "block" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// Short "what you get" list for the buy box, from the product's own
// `included` list: the sheet first, the PDFs and menu next (the template-link
// PDF is left out, it's just the copy link), then personal support.
function getChecklist(included) {
  const items = included
    .map((x) => x.label)
    .filter((l) => l !== "Template Link PDF")
    .map((l) => (l === "The Google Sheets template" ? "Google Sheets template, yours forever" : l))
    .slice(0, 4);
  return [...items, "Personal email support from Lino"];
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
        maxWidth: 1200, margin: "0 auto", padding: "10px 24px",
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
// to carry a full description, feature list, and Product schema. Products
// with a `slug` (in data.js, or added in src/trackerPages.js) get a page.
export default function TrackerDetail() {
  const { slug } = useParams();
  const product = CATALOG.find((p) => p.slug === slug);

  usePageMeta(product ? trackerMeta(product) : {
    title: "Tracker not found | MapleSheet Co.",
    description: "This tracker couldn't be found.",
    noindex: true,
  });

  useJsonLd(product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription || product.desc,
    category: product.tag,
    image: `${SITE_URL}${cardImage(product) || "/og.png"}`,
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
      shippingDetails: SHIPPING_DETAILS,
      eligibleRegion: ELIGIBLE_REGION,
      url: `${SITE_URL}/trackers/${product.slug}`,
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

  // Desktop: screenshots on the left, a buy box on the right that stays in
  // view while scrolling, then the details below in two columns. Phones get
  // the same pieces stacked in that order (see .ml-pdp in ui.jsx).
  return (
    <div className="ml-fade" style={{ paddingBottom: hasBuyPath ? 70 : 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 0" }}>
        <Link to="/trackers" style={{ color: B.gray, fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
          ← All trackers
        </Link>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 24px 0" }}>
        <div className="ml-pdp">
          <div style={{ minWidth: 0 }}>
            {product.gallery ? (
              <ProductGallery images={product.gallery} name={product.name} />
            ) : product.screenshot ? (
              <Picture
                eager src={product.screenshot} alt={`${product.name} dashboard screenshot`}
                style={{
                  width: "100%", borderRadius: 12, marginBottom: 22, display: "block",
                  border: `1px solid ${B.line}`, aspectRatio: "4 / 3", objectFit: "contain", background: B.black3,
                }}
              />
            ) : product.demo ? (
              <div style={{ maxWidth: 460, margin: "0 auto 24px" }}>
                <DashboardMock total={product.demo.total} ytd={product.demo.ytd} accounts={product.demo.accounts} />
              </div>
            ) : null}
          </div>

          <aside className="ml-pdp-buy" style={{
            background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18, padding: "clamp(22px, 3vw, 28px)",
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: "0.14em", color: B.redLink, fontWeight: 700, marginBottom: 8 }}>{product.tag.toUpperCase()}</div>
              <h1 style={{ fontSize: "clamp(26px, 3.2vw, 34px)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em", color: B.white, lineHeight: 1.15 }}>{product.name}</h1>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "4px 12px" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: B.white }}>CA${product.price.toFixed(2)}</div>
              <div style={{ fontSize: 13, color: B.grayLight }}>One-time purchase — no subscription, ever</div>
            </div>

            {savings && (
              <div style={{
                alignSelf: "flex-start", background: "rgba(52,199,123,0.12)", border: "1px solid rgba(52,199,123,0.4)",
                color: "#34C77B", fontSize: 13, fontWeight: 700, padding: "6px 12px", borderRadius: 999,
              }}>
                Save CA${savings.amount.toFixed(2)} ({savings.percent}%) vs. buying these trackers separately
              </div>
            )}

            {product.bestFor && (
              <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.6 }}>
                <span style={{ color: B.white, fontWeight: 700 }}>Best for:</span> {product.bestFor}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              {product.url && !product.stripeBuyButton && (
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


            <PromoBanner as="div" style={{ margin: 0, fontSize: 15 }} />

            {product.included && (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
                {getChecklist(product.included).map((t) => (
                  <li key={t} style={{ display: "flex", gap: 10, fontSize: 14.5, color: B.white }}>
                    <span style={{ color: "#34C77B", fontWeight: 800 }} aria-hidden="true">✓</span>{t}
                  </li>
                ))}
              </ul>
            )}

            {/* How delivery works — answers "what happens after I pay?" right next to the button. */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, textAlign: "center" }}>
              {[
                ["1. Buy", "Secure Stripe checkout"],
                ["2. Get your links", "Sheet + PDFs right after payment"],
                ["3. Make a copy", "One click in Google Sheets"],
              ].map(([t, d]) => (
                <div key={t} style={{ background: B.black3, borderRadius: 10, padding: "10px 6px" }}>
                  <div style={{ color: B.white, fontWeight: 700, fontSize: 12.5 }}>{t}</div>
                  <div style={{ color: B.grayLight, fontSize: 11.5, lineHeight: 1.45, marginTop: 2 }}>{d}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12.5, color: B.grayLight, lineHeight: 1.6, borderTop: `1px solid ${B.line}`, paddingTop: 12 }}>
              Personal support from Lino on every purchase. Digital downloads are final sale, but if something isn't working,{" "}
              <Link to="/contact" style={{ color: B.redLink, fontWeight: 600 }}>contact us</Link> and we'll fix it.
            </div>
          </aside>
        </div>

        <div className="ml-pdp-body" style={{ marginTop: 28 }}>
          <Reveal style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18, padding: "clamp(22px, 4vw, 32px)" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.12em", color: B.redLink, fontWeight: 700, marginBottom: 12 }}>ABOUT THIS TRACKER</div>
            <p style={{ color: B.white, fontSize: 16, lineHeight: 1.7, margin: "0 0 18px" }}>{product.longDescription || product.desc}</p>
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

          <div style={{ display: "flex", flexDirection: "column" }}>
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
              <div style={{ fontSize: 12, letterSpacing: "0.12em", color: B.redLink, fontWeight: 700, marginBottom: 14 }}>
                COMMON QUESTIONS
              </div>
              <FaqAccordion faqs={FAQS} />
            </Reveal>
          </div>
        </div>

        <div style={{ height: 30 }} />
      </div>

      <StickyBuyBar product={product} />
    </div>
  );
}
