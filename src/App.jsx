import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { B, PRODUCTS, getBundleSavings } from "./data.js";
import { GlobalStyles, Nav, Footer, RedWord, MapleLeaf, DashboardMock, Slideshow, ProductGallery, GrowthChart, usePageMeta, LiveChatTracker, Reveal, PromoBanner } from "./ui.jsx";
import { trackBuyClicked } from "./analytics.js";
import Trackers from "./pages/Trackers.jsx";
import TrackerDetail from "./pages/TrackerDetail.jsx";
import Resources from "./pages/Resources.jsx";
import Article from "./pages/Article.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import Privacy from "./pages/Privacy.jsx";
import NotFound from "./pages/NotFound.jsx";
import { STATIC_META, liveArticles } from "./seo.js";
import { CATALOG } from "./trackerPages.js";
// FreeTools pulls in the recharts-powered calculator (~100KB+ gzipped) — lazy-load
// it so that weight only downloads for people who actually visit /tools, not on
// every page of the site.
const FreeTools = lazy(() => import("./pages/FreeTools.jsx"));
// Checkout pulls in @stripe/stripe-js + @stripe/react-stripe-js — lazy-load
// for the same reason, only visitors actually buying something load it.
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const CheckoutReturn = lazy(() => import("./pages/CheckoutReturn.jsx"));

const GALLERY_SLIDES = [
  { src: "/screenshots/ultimate.jpg", alt: "Canadian Ultimate Tracker dashboard screenshot", title: "Canadian Ultimate Tracker — All 5 Accounts", tag: "5-column metrics, 4 live charts, YTD summary" },
  { src: "/screenshots/resp.jpg", alt: "RESP Tracker dashboard screenshot", title: "RESP Tracker", tag: "CESG grants, holdings allocation, live prices" },
  { src: "/screenshots/tfsa-margin.jpg", alt: "TFSA plus Margin Linked dashboard screenshot", title: "TFSA + Margin Linked", tag: "Combined net worth, collateral power, tax dashboard" },
  { src: "/screenshots/fhsa.jpg", alt: "FHSA Tracker dashboard screenshot", title: "FHSA Tracker", tag: "Down payment progress, tax-free dividends" },
  { src: "/screenshots/multi-brokerage.jpg", alt: "TFSA Multi-Brokerage dashboard screenshot", title: "TFSA Multi-Brokerage", tag: "Up to 8 institutions, contribution room, top holdings" },
  { src: "/screenshots/combined-rrsp.jpg", alt: "RRSP plus Spousal RRSP dashboard screenshot", title: "RRSP + Spousal RRSP", tag: "Combined net worth, attribution status" },
  { src: "/screenshots/margin.jpg", alt: "Margin Account Tracker dashboard screenshot", title: "Margin Account Tracker", tag: "ACB, break-even yield, interest deduction tracking" },
];

const DEMO_VIEWS = [
  {
    tab: "Core", label: "TFSA + RRSP", slug: "tfsa-rrsp",
    blurb: "Your two main accounts, with contribution room for both.", total: "43,890", ytd: "+11.2%",
    accounts: [
      { label: "TFSA", value: "16,568", change: "+12.4%" },
      { label: "RRSP", value: "27,322", change: "+9.1%" },
    ],
  },
  {
    tab: "Family", label: "TFSA + RRSP + RESP", slug: "tfsa-rrsp-resp",
    blurb: "Adds your kids' RESP, with CESG grants tracked per child.", total: "48,106", ytd: "+12.8%",
    accounts: [
      { label: "TFSA", value: "16,568", change: "+12.4%" },
      { label: "RRSP", value: "27,322", change: "+9.1%" },
      { label: "RESP", value: "4,216", change: "+18.7%" },
    ],
  },
  {
    tab: "Ultimate", label: "All 5 accounts", slug: "ultimate-all-5-accounts",
    blurb: "TFSA, RRSP, RESP, FHSA and Margin in one net worth.", total: "59,097", ytd: "+15.6%",
    accounts: [
      { label: "TFSA", value: "16,568", change: "+12.4%" },
      { label: "RRSP", value: "27,322", change: "+9.1%" },
      { label: "RESP", value: "4,216", change: "+18.7%" },
      { label: "FHSA", value: "8,221", change: "+6.0%" },
      { label: "Margin", value: "2,770", change: "+22.3%" },
    ],
  },
];

const ICON_PROPS = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: B.red, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const OFFER_SLIDES = [
  {
    graphic: <GrowthChart />,
    title: "See the trend, not just the balance",
    body: "Every tracker includes a live-updating chart, so you can watch your portfolio's trajectory over time, not just today's snapshot.",
  },
  {
    icon: <svg {...ICON_PROPS}><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
    title: "Every account, one dashboard",
    body: "TFSA, RRSP, RESP, FHSA, and Margin — tracked side by side, not spread across five different apps or spreadsheets.",
  },
  {
    icon: <svg {...ICON_PROPS}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>,
    title: "Live prices, zero manual entry",
    body: "GOOGLEFINANCE pulls real market data straight into your sheet — your balances stay current every time you open it.",
  },
  {
    icon: <MapleLeaf size={26} />,
    title: "Built for the Canadian system",
    body: "Contribution room, CESG grants, ACB, and capital gains — calculated the way the CRA actually defines them, not a generic US template.",
  },
  {
    icon: <svg {...ICON_PROPS}><path d="M20.6 13.4 12 22l-9-9L11.6 2H20a1 1 0 0 1 1 1v10.4z" /><circle cx="15.5" cy="7.5" r="1.4" fill={B.red} stroke="none" /></svg>,
    title: "One-time purchase, yours forever",
    body: "No subscription, no renewal. Buy once, use it every year you invest — download and start tracking in minutes.",
  },
];

// Counts a number up from 0 the moment its element scrolls into view — used
// on the "$524,963 vs $243,994" comparison cards. No animation library: a
// single requestAnimationFrame loop per card. Renders the final value as
// real text from the first paint (so there's never a blank/zero flash, and
// prefers-reduced-motion users simply see the static number — the loop
// below just never starts for them).
function useCountUp(end, { duration = 1400, prefix = "$" } = {}) {
  const ref = useRef(null);
  const fmt = (n) => prefix + Math.round(n).toLocaleString("en-CA");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || !window.IntersectionObserver) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(end * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [end, duration, prefix]);
  return { ref, initial: fmt(end) };
}

// Pins the hero for one extra viewport-height of scroll and scrubs the
// headline/CTA out while the screenshot gallery rises into place — the
// "hero hands off to the product" move every Apple product page opens with.
// Loaded lazily (dynamic import) so GSAP's ~30KB only ever downloads for
// visitors who land on "/", exactly like FreeTools' recharts import below —
// and only wired up at all on wide-enough screens: scroll-pinning a hero on
// a small phone just makes someone scroll further to reach the rest of the
// page for no visual payoff, so under 900px this is skipped entirely and the
// hero behaves like a normal static section.
function useHeroPin({ sectionRef, textRef, galleryRef }) {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let ctx;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 900px)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=90%",
              scrub: 0.6,
              pin: true,
              pinSpacing: true,
            },
          });
          tl.to(textRef.current, { opacity: 0, y: -46, ease: "none" }, 0)
            .fromTo(
              galleryRef.current,
              { y: 70, scale: 0.92, opacity: 0.6 },
              { y: 0, scale: 1, opacity: 1, ease: "none" },
              0.1
            );
          // Cleanup for this media-query match only — matchMedia re-runs its
          // callback (and expects this return) whenever the viewport crosses
          // the 900px line, e.g. a tablet rotated or a window resized.
          return () => tl.scrollTrigger?.kill();
        });
      }, sectionRef);
    })();
    return () => { cancelled = true; ctx?.revert(); };
  }, [sectionRef, textRef, galleryRef]);
}

const PROVINCES = [
  "British Columbia", "Alberta", "Saskatchewan", "Manitoba", "Ontario", "Quebec",
  "New Brunswick", "Nova Scotia", "Prince Edward Island", "Newfoundland and Labrador",
  "Yukon", "Northwest Territories", "Nunavut",
];

function Home() {
  usePageMeta(STATIC_META["/"]);
  // Flagship first: it gets its own full-width row above the grid.
  const featured = PRODUCTS.filter((p) => p.badge)
    .sort((a, b) => (b.badge === "FLAGSHIP") - (a.badge === "FLAGSHIP"));
  // Newest published articles first (RESOURCES isn't stored by date).
  const latest = liveArticles().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const [demoTab, setDemoTab] = useState(0);
  const demo = DEMO_VIEWS[demoTab];
  const demoProduct = CATALOG.find((p) => p.slug === demo.slug);

  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroGalleryRef = useRef(null);
  useHeroPin({ sectionRef: heroRef, textRef: heroTextRef, galleryRef: heroGalleryRef });

  const count25 = useCountUp(524963);
  const count35 = useCountUp(243994);

  return (
    <div className="ml-fade">
      {/* Hero — pinned on desktop via useHeroPin() above; the inline
          "overflow: clip" keeps the scaled-down gallery from ever peeking
          past the hero's own edges mid-scrub. */}
      <header ref={heroRef} style={{ padding: "60px 24px 56px", textAlign: "center", overflow: "clip" }}>
        {/* The header itself spans the full width so the full-bleed gallery
            below isn't clipped at the sides on wide screens; only the text
            is held to the usual 1100px column. */}
        <div ref={heroTextRef} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22,
            border: `1px solid ${B.line}`, borderRadius: 999, padding: "7px 16px",
            fontSize: 13, color: B.grayLight, background: B.black2,
          }}>
            <MapleLeaf size={13} /> Built in Canada, for Canadian investors · {PRODUCTS.length} trackers
          </div>
          <h1 style={{ fontSize: "clamp(38px, 7vw, 66px)", fontWeight: 800, lineHeight: 1.04, margin: "0 0 24px", letterSpacing: "-0.03em", color: B.white }}>
            <span style={{ display: "block", marginBottom: 6 }}>Stop Guessing.</span>
            <span style={{ display: "block", color: B.redLink }}>Start Tracking.</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2.4vw, 18px)", color: B.grayLight, maxWidth: 620, margin: "0 auto 30px", lineHeight: 1.65 }}>
            Google Sheets investment trackers that actually understand the Canadian system —
            TFSA contribution room, RRSP limits, CESG grants, ACB, capital gains, and CRA rules.
            Live prices included. No subscription, ever.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/trackers" className="ml-btn" style={{
              background: B.red, color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 15,
              padding: "15px 30px", borderRadius: 10, boxShadow: "0 6px 20px rgba(204,0,0,0.35)",
            }}>Browse the trackers</Link>
            <Link to="/tools" className="ml-btn" style={{
              background: "transparent", color: B.white, textDecoration: "none", fontWeight: 600, fontSize: 15,
              padding: "15px 30px", borderRadius: 10, border: `1.5px solid ${B.line}`,
            }}>Try the free calculator</Link>
          </div>
          <PromoBanner as="div" prefix="Launch offer: " style={{ marginTop: 24, marginBottom: 40 }} />
        </div>
        <div ref={heroGalleryRef}>
          <ProductGallery slides={GALLERY_SLIDES} />
        </div>
      </header>

      {/* Trust strip */}
      <Reveal as="div" style={{ borderTop: `1px solid ${B.line}`, borderBottom: `1px solid ${B.line}`, background: B.black2 }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "18px 24px",
          display: "flex", gap: "12px 36px", justifyContent: "center", flexWrap: "wrap",
          fontSize: 13.5, color: B.grayLight,
        }}>
          <span>✓ Live prices via GOOGLEFINANCE</span>
          <span>✓ Automatic ACB &amp; capital gains</span>
          <span>✓ CRA rules built in</span>
          <span>✓ CAD + USD in one sheet</span>
          <span>✓ Works in every province &amp; territory</span>
          <span>✓ One-time purchase — yours forever</span>
        </div>
      </Reveal>

      {/* Why 10 years matters */}
      <Reveal as="section" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em", color: B.white, textAlign: "center" }}>
          Why <RedWord>10 years</RedWord> matters more than you think
        </h2>
        <p style={{ color: B.grayLight, fontSize: 14.5, textAlign: "center", margin: "0 0 30px" }}>
          Same $200/month. Same 7% average return. The only difference is when you started.
        </p>
        {/* Wide 2-card layout with bigger numbers on desktop (.ml-tenyr in
            ui.jsx); phones keep the original compact stacked cards. */}
        <div className="ml-tenyr">
          {[
            ["START AT 25", count25, B.white, "$96,000", "100%", B.red],
            null,
            ["START AT 35", count35, B.grayLight, "$72,000", "46%", B.gray],
          ].map((c, i) => c === null ? (
            <div key="vs" style={{ fontSize: 14, color: B.gray, fontWeight: 700, textAlign: "center" }}>vs</div>
          ) : (
            <div key={c[0]} className="ml-tenyr-card" style={{ background: B.black2, border: `1px solid ${i === 0 ? B.red : B.line}`, borderRadius: 16, textAlign: "center" }}>
              <div className="ml-tenyr-kicker" style={{ letterSpacing: "0.1em", color: B.grayLight, fontWeight: 700, marginBottom: 8 }}>{c[0]}</div>
              <div ref={c[1].ref} className="ml-tenyr-num" style={{ fontWeight: 800, color: c[2], letterSpacing: "-0.02em" }}>{c[1].initial}</div>
              <div className="ml-tenyr-sub" style={{ color: B.grayLight, marginTop: 4 }}>by age 65</div>
              <div className="ml-desktop-only" style={{ marginTop: 18 }}>
                <div style={{ height: 8, borderRadius: 999, background: B.black3, overflow: "hidden" }}>
                  <div style={{ width: c[4], height: "100%", background: c[5], borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 14, color: B.grayLight, marginTop: 12 }}>You put in <strong style={{ color: B.white }}>{c[3]}</strong></div>
              </div>
            </div>
          ))}
        </div>
        <div className="ml-tenyr-gap" style={{ textAlign: "center", color: B.yellow, fontWeight: 700, marginBottom: 10 }}>
          10 years earlier ≈ $280,968 more — same effort, same monthly amount.
        </div>
        <p style={{ textAlign: "center", fontSize: 12.5, color: B.gray, maxWidth: 520, margin: "0 auto 26px", lineHeight: 1.6 }}>
          Illustrative example only — 7% is a long-term average assumption, not a guaranteed return. Real results vary.
        </p>
        <div style={{ textAlign: "center" }}>
          <Link to="/tools" className="ml-btn" style={{
            display: "inline-block", background: "transparent", color: B.white, textDecoration: "none",
            fontWeight: 600, fontSize: 15, padding: "13px 25px", borderRadius: 10, border: `1.5px solid ${B.line}`,
          }}>Run your own numbers — free calculator</Link>
        </div>
      </Reveal>

      {/* Every province — the account rules are federal, so the trackers
          work anywhere in Canada. Also tells Google (and readers searching
          "TFSA tracker Ontario" etc.) the site serves the whole country. */}
      <Reveal as="section" style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 24px 48px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(22px, 3.6vw, 30px)", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em", color: B.white }}>
          Built for investors <RedWord>across Canada</RedWord>
        </h2>
        <p style={{ color: B.grayLight, fontSize: 14.5, maxWidth: 640, margin: "0 auto 20px", lineHeight: 1.6 }}>
          TFSA, RRSP, RESP and FHSA rules are set federally by the CRA, so every tracker works wherever you live.
          Trackers with a Tax Dashboard include the rates for all 13 provinces and territories.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 860, marginInline: "auto" }}>
          {PROVINCES.map((name) => (
            <li key={name} style={{
              fontSize: 13, color: B.grayLight, background: B.black2,
              border: `1px solid ${B.line}`, borderRadius: 999, padding: "6px 13px",
            }}>{name}</li>
          ))}
        </ul>
      </Reveal>

      {/* Featured products */}
      <Reveal as="section" style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 24px 8px" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em", color: B.white, textAlign: "center" }}>
          Featured <RedWord>trackers</RedWord>
        </h2>
        <p style={{ color: B.grayLight, fontSize: 14.5, textAlign: "center", margin: "0 0 26px" }}>
          The flagship, and the newest additions. <Link to="/trackers" style={{ color: B.redLink, fontWeight: 600 }}>See all {PRODUCTS.length} →</Link>
          <br />
          Not sure which one? <Link to="/trackers#picker" style={{ color: B.redLink, fontWeight: 600 }}>Find your tracker in 2 questions →</Link>
        </p>
        <div className="ml-feat-grid">
          {featured.map((p) => {
            const flagship = p.badge === "FLAGSHIP";
            return (
              <div key={p.name} className={flagship ? "ml-card ml-feat-flag" : "ml-card"} style={{
                display: "flex", flexDirection: "column", gap: 10,
                background: flagship ? `linear-gradient(150deg, #2A0A0A, ${B.black2})` : B.black2,
                border: `1.5px solid ${flagship ? B.red : B.line}`,
                borderRadius: 16, padding: "24px 22px", position: "relative",
              }}>
                <span style={{
                  position: "absolute", top: 15, right: 15,
                  background: flagship ? B.red : B.yellow, color: flagship ? "#fff" : B.black,
                  fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em",
                  padding: "4px 10px", borderRadius: 999,
                }}>{p.badge}</span>
                <span style={{ fontSize: flagship ? 21 : 17, fontWeight: 700, color: B.white, lineHeight: 1.3, paddingRight: 70 }}>{p.name}</span>
                <span style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.55, flex: 1 }}>{p.desc}</span>
                {flagship && p.pitch && (
                  <span style={{ fontSize: 15, color: B.white, lineHeight: 1.6, maxWidth: 760 }}>{p.pitch}</span>
                )}
                {flagship && p.highlights && (
                  <ul className="ml-flag-highlights">
                    {p.highlights.map((h) => <li key={h}><span style={{ color: "#34C77B", fontWeight: 800 }}>✓</span> {h}</li>)}
                  </ul>
                )}
                <span style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "4px 12px" }}>
                  <span style={{ fontSize: flagship ? 24 : 20, fontWeight: 800, color: B.white }}>CA${p.price.toFixed(2)}</span>
                  {flagship && getBundleSavings(p) && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#34C77B" }}>
                      Save CA${getBundleSavings(p).amount.toFixed(2)} ({getBundleSavings(p).percent}%) vs. buying separately
                    </span>
                  )}
                </span>
                <div style={{ display: "flex", gap: 8, ...(flagship ? { maxWidth: 340 } : {}) }}>
                  {p.url && !p.stripeBuyButton && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="ml-btn" onClick={() => trackBuyClicked({
                      productName: p.name, productTag: p.tag, priceCad: p.price,
                      checkoutDestination: "etsy", sourceSection: "home_featured",
                    })} style={{
                      flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff",
                      background: B.red, padding: "10px 8px", borderRadius: 8, textDecoration: "none",
                    }}>Buy on Etsy</a>
                  )}
                  {p.stripeBuyButton ? (
                    <div
                      style={{ flex: 1 }}
                      onClickCapture={() => trackBuyClicked({
                        productName: p.name, productTag: p.tag, priceCad: p.price,
                        checkoutDestination: "stripe", sourceSection: "home_featured",
                      })}
                    >
                      <stripe-buy-button
                        buy-button-id={p.stripeBuyButton.buyButtonId}
                        publishable-key={p.stripeBuyButton.publishableKey}
                      ></stripe-buy-button>
                    </div>
                  ) : p.directUrl ? (
                    <a href={p.directUrl} target="_blank" rel="noreferrer" className="ml-btn" onClick={() => trackBuyClicked({
                      productName: p.name, productTag: p.tag, priceCad: p.price,
                      checkoutDestination: "direct", sourceSection: "home_featured",
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
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* What you get */}
      <Reveal as="section" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 8px" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, margin: "0 0 26px", letterSpacing: "-0.02em", color: B.white, textAlign: "center" }}>
          Why Canadian investors <RedWord>switch to MapleSheet</RedWord>
        </h2>
        {/* Desktop: every reason at once. Phones keep the swipeable slideshow. */}
        <div className="ml-why-grid ml-desktop-only">
          {/* The chart slide gets the tall left-hand card; the other four
              fill a 2 × 2 block beside it. */}
          {OFFER_SLIDES.map((s) => (
            <div key={s.title} className={s.graphic ? "ml-why-feature" : undefined} style={{
              background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, padding: "24px 22px",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              {s.graphic ? (
                <div style={{ flex: 1, minHeight: 160, display: "flex", alignItems: "center" }}>{s.graphic}</div>
              ) : (
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: B.black3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{s.icon}</div>
              )}
              <div style={{ fontSize: 16.5, fontWeight: 700, color: B.white, lineHeight: 1.3 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.6 }}>{s.body}</div>
            </div>
          ))}
        </div>
        <div className="ml-mobile-only" style={{ maxWidth: 700, margin: "0 auto" }}>
          <Slideshow slides={OFFER_SLIDES} />
        </div>
      </Reveal>

      {/* See it in action: plan picker on the left, live mock on the right
          (stacks on tablets and phones, where the picker becomes 3 tabs). */}
      <Reveal as="section" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 8px" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em", color: B.white, textAlign: "center" }}>
          See it <RedWord>in action</RedWord>
        </h2>
        <p style={{ color: B.grayLight, fontSize: 14.5, textAlign: "center", margin: "0 0 28px" }}>
          Same dashboard, scaled to however many accounts you're tracking.
        </p>
        <div className="ml-demo">
          <div>
            <div className="ml-demo-opts" role="tablist" aria-label="Tracker size">
              {DEMO_VIEWS.map((v, i) => {
                const on = i === demoTab;
                const p = CATALOG.find((x) => x.slug === v.slug);
                return (
                  <button key={v.tab} role="tab" aria-selected={on} onClick={() => setDemoTab(i)} className="ml-btn" style={{
                    textAlign: "left", cursor: "pointer", fontFamily: "inherit", borderRadius: 14, padding: "14px 16px",
                    background: on ? "#2A0A0A" : B.black2, border: `1.5px solid ${on ? B.red : B.line}`,
                  }}>
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: B.white }}>{v.tab}</span>
                      {p && <span style={{ fontSize: 13, fontWeight: 700, color: on ? B.white : B.grayLight }}>CA${p.price.toFixed(2)}</span>}
                    </span>
                    <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: on ? B.redLink : B.gray, marginTop: 3 }}>{v.label}</span>
                    <span className="ml-demo-opt-sub" style={{ fontSize: 13, color: B.grayLight, lineHeight: 1.5, marginTop: 6 }}>{v.blurb}</span>
                  </button>
                );
              })}
            </div>
            {demoProduct && (
              <Link to={`/trackers/${demoProduct.slug}`} className="ml-btn" style={{
                display: "inline-block", marginTop: 16, background: B.red, color: "#fff", textDecoration: "none",
                fontWeight: 700, fontSize: 14, padding: "12px 22px", borderRadius: 10,
              }}>See the {demo.tab} tracker →</Link>
            )}
            <div style={{ fontSize: 12.5, color: B.gray, marginTop: 12 }}>Sample numbers. Your sheet fills in from your own Transaction Log.</div>
          </div>
          <DashboardMock total={demo.total} ytd={demo.ytd} totalLabel={demo.label} accounts={demo.accounts} allocation />
        </div>
      </Reveal>

      <Reveal as="section" className="ml-home-bottom" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 40px" }}>
        <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, padding: "24px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: B.redLink, fontWeight: 700 }}>LATEST FROM RESOURCES</div>
            <Link to="/resources" style={{ fontSize: 13, color: B.redLink, fontWeight: 600, textDecoration: "none" }}>All guides →</Link>
          </div>
          {latest.map((r, i) => (
            <Link key={r.slug} to={`/resources/${r.slug}`} className="ml-res-row" style={{
              display: "block", textDecoration: "none", padding: "14px 0",
              borderTop: i ? `1px solid ${B.line}` : "none",
            }}>
              <div style={{ fontSize: 12, color: B.gray, marginBottom: 4 }}>📝 {r.date}</div>
              <div style={{ fontSize: i ? 15 : 17, fontWeight: 700, color: B.white, lineHeight: 1.35 }}>{r.title}</div>
              {i === 0 && <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.6, marginTop: 6 }}>{r.summary.replace(/\*/g, "")}</div>}
            </Link>
          ))}
        </div>
        <Link to="/about" className="ml-card" style={{
          display: "flex", flexDirection: "column", textDecoration: "none", borderRadius: 16, padding: "26px 24px",
          border: `1px solid ${B.line}`, background: `linear-gradient(150deg, #2A0A0A, ${B.black2} 70%)`,
        }}>
          <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: B.redLink, fontWeight: 700, marginBottom: 14 }}>THE STORY</div>
          <div style={{ fontSize: 54, lineHeight: 0.6, color: B.red, fontFamily: "Georgia, serif", marginBottom: 6 }} aria-hidden="true">“</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: B.white, lineHeight: 1.3, marginBottom: 12, letterSpacing: "-0.01em" }}>
            Too complicated. Too American. So I built my own.
          </div>
          <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.6 }}>
            How one Canadian investor's frustration became {PRODUCTS.length} trackers, and why every buyer gets personal support.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: 20 }}>
            <img src="/logo.png" alt="" width="40" height="40" style={{ width: 40, height: 40, borderRadius: 10 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: B.white }}>Lino, Founder</div>
              <div style={{ fontSize: 12.5, color: B.grayLight }}>🍁 Made in BC, for all of Canada</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 13.5, color: B.redLink, fontWeight: 600 }}>Meet MapleSheet →</span>
          </div>
        </Link>
      </Reveal>
    </div>
  );
}

// The whole site minus the router, so the build can also render it with a
// StaticRouter (src/entry-server.jsx) and bake each page's real text into
// its HTML file — see scripts/prerender-meta.mjs.
export function Site() {
  return (
    <div style={{ minHeight: "100vh", background: B.black, color: B.white, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <GlobalStyles />
      {/* Mounted once at the app root (not per-page) so the Tawk.to
          chat-started handler is only ever wired up a single time. Must be
          rendered here, inside <BrowserRouter>, not called directly in
          App() — it uses useLocation() internally, which needs Router
          context. Renders nothing. */}
      <LiveChatTracker />
      <Nav />
      {/* A real <main> landmark — without it, screen reader users have no
          "skip to main content" shortcut, and it's a semantic-HTML signal
          search engines use to identify the primary content of the page
          versus chrome like the nav and footer. */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trackers" element={<Trackers />} />
          <Route path="/trackers/:slug" element={<TrackerDetail />} />
          <Route path="/tools" element={
            <Suspense fallback={<div style={{ padding: "80px 24px", textAlign: "center", color: B.grayLight }}>Loading calculator…</div>}>
              <FreeTools />
            </Suspense>
          } />
          <Route path="/checkout/return" element={
            <Suspense fallback={<div style={{ padding: "80px 24px", textAlign: "center", color: B.grayLight }}>Loading…</div>}>
              <CheckoutReturn />
            </Suspense>
          } />
          <Route path="/checkout/:sku" element={
            <Suspense fallback={<div style={{ padding: "80px 24px", textAlign: "center", color: B.grayLight }}>Loading checkout…</div>}>
              <Checkout />
            </Suspense>
          } />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<Article />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Site />
    </BrowserRouter>
  );
}
