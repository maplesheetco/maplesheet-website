import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { B, CONFIG, PRODUCTS, RESOURCES } from "./data.js";
import { GlobalStyles, Nav, Footer, RedWord, MapleLeaf, DashboardMock, Slideshow, ProductGallery, GrowthChart, usePageMeta, LiveChatTracker } from "./ui.jsx";
import { trackBuyClicked } from "./analytics.js";
import Trackers from "./pages/Trackers.jsx";
import TrackerDetail from "./pages/TrackerDetail.jsx";
import Resources from "./pages/Resources.jsx";
import Article from "./pages/Article.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
// FreeTools pulls in the recharts-powered calculator (~100KB+ gzipped) — lazy-load
// it so that weight only downloads for people who actually visit /tools, not on
// every page of the site.
const FreeTools = lazy(() => import("./pages/FreeTools.jsx"));

const GALLERY_SLIDES = [
  { src: "/screenshots/ultimate.jpg", alt: "Ultimate Tracker dashboard screenshot", title: "Ultimate Tracker — All 5 Accounts", tag: "5-column metrics, 4 live charts, YTD summary" },
  { src: "/screenshots/resp.jpg", alt: "RESP Tracker dashboard screenshot", title: "RESP Tracker", tag: "CESG grants, holdings allocation, live prices" },
  { src: "/screenshots/tfsa-margin.jpg", alt: "TFSA plus Margin Linked dashboard screenshot", title: "TFSA + Margin Linked", tag: "Combined net worth, collateral power, tax dashboard" },
  { src: "/screenshots/fhsa.jpg", alt: "FHSA Tracker dashboard screenshot", title: "FHSA Tracker", tag: "Down payment progress, tax-free dividends" },
  { src: "/screenshots/multi-brokerage.jpg", alt: "TFSA Multi-Brokerage dashboard screenshot", title: "TFSA Multi-Brokerage", tag: "Up to 8 institutions, contribution room, top holdings" },
  { src: "/screenshots/combined-rrsp.jpg", alt: "RRSP plus Spousal RRSP dashboard screenshot", title: "RRSP + Spousal RRSP", tag: "Combined net worth, attribution status" },
  { src: "/screenshots/margin.jpg", alt: "Margin Account Tracker dashboard screenshot", title: "Margin Account Tracker", tag: "ACB, break-even yield, interest deduction tracking" },
];

const DEMO_VIEWS = [
  {
    tab: "Core", label: "TFSA + RRSP", total: "43,890", ytd: "+11.2%",
    accounts: [
      { label: "TFSA", value: "16,568", change: "+12.4%" },
      { label: "RRSP", value: "27,322", change: "+9.1%" },
    ],
  },
  {
    tab: "Family", label: "TFSA + RRSP + RESP", total: "48,106", ytd: "+12.8%",
    accounts: [
      { label: "TFSA", value: "16,568", change: "+12.4%" },
      { label: "RRSP", value: "27,322", change: "+9.1%" },
      { label: "RESP", value: "4,216", change: "+18.7%" },
    ],
  },
  {
    tab: "Ultimate", label: "All 5 accounts", total: "59,097", ytd: "+15.6%",
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

function Home() {
  usePageMeta({
    title: "MapleSheet Co. — Canadian TFSA, RRSP & RESP Trackers",
    description: "Google Sheets trackers built for the Canadian system — TFSA, RRSP, RESP, FHSA & Margin. Live prices, one-time purchase, no subscription.",
  });
  const featured = PRODUCTS.filter((p) => p.badge);
  const latest = RESOURCES[0];
  const [demoTab, setDemoTab] = useState(0);
  const demo = DEMO_VIEWS[demoTab];
  return (
    <div className="ml-fade">
      {/* Hero */}
      <header style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 56px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22,
          border: `1px solid ${B.line}`, borderRadius: 999, padding: "7px 16px",
          fontSize: 13, color: B.grayLight, background: B.black2,
        }}>
          <MapleLeaf size={13} /> Built in Canada, for Canadian investors · 13 trackers
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
        <div style={{ marginTop: 24, marginBottom: 40, fontSize: 13.5, color: B.yellow, fontWeight: 600 }}>
          🏷 Launch offer: {CONFIG.promoText}
        </div>
        <div>
          <ProductGallery slides={GALLERY_SLIDES} />
        </div>
      </header>

      {/* Trust strip */}
      <div style={{ borderTop: `1px solid ${B.line}`, borderBottom: `1px solid ${B.line}`, background: B.black2 }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "18px 24px",
          display: "flex", gap: "12px 36px", justifyContent: "center", flexWrap: "wrap",
          fontSize: 13.5, color: B.grayLight,
        }}>
          <span>✓ Live prices via GOOGLEFINANCE</span>
          <span>✓ Automatic ACB &amp; capital gains</span>
          <span>✓ CRA rules built in</span>
          <span>✓ CAD + USD in one sheet</span>
          <span>✓ One-time purchase — yours forever</span>
        </div>
      </div>

      {/* Why 10 years matters */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em", color: B.white, textAlign: "center" }}>
          Why <RedWord>10 years</RedWord> matters more than you think
        </h2>
        <p style={{ color: B.grayLight, fontSize: 14.5, textAlign: "center", margin: "0 0 30px" }}>
          Same $200/month. Same 7% average return. The only difference is when you started.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, padding: "26px 34px", textAlign: "center", minWidth: 220 }}>
            <div style={{ fontSize: 11.5, letterSpacing: "0.1em", color: B.grayLight, fontWeight: 700, marginBottom: 8 }}>START AT 25</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: B.white, letterSpacing: "-0.02em" }}>$524,963</div>
            <div style={{ fontSize: 12.5, color: B.grayLight, marginTop: 4 }}>by age 65</div>
          </div>
          <div style={{ fontSize: 14, color: B.gray, fontWeight: 700 }}>vs</div>
          <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, padding: "26px 34px", textAlign: "center", minWidth: 220 }}>
            <div style={{ fontSize: 11.5, letterSpacing: "0.1em", color: B.grayLight, fontWeight: 700, marginBottom: 8 }}>START AT 35</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: B.grayLight, letterSpacing: "-0.02em" }}>$243,994</div>
            <div style={{ fontSize: 12.5, color: B.grayLight, marginTop: 4 }}>by age 65</div>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 14, color: B.yellow, fontWeight: 700, marginBottom: 10 }}>
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
      </section>

      {/* Featured products */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 24px 8px" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em", color: B.white, textAlign: "center" }}>
          Featured <RedWord>trackers</RedWord>
        </h2>
        <p style={{ color: B.grayLight, fontSize: 14.5, textAlign: "center", margin: "0 0 26px" }}>
          The flagship, and the newest addition. <Link to="/trackers" style={{ color: B.redLink, fontWeight: 600 }}>See all 13 →</Link>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16, maxWidth: 720, margin: "0 auto" }}>
          {featured.map((p) => {
            const flagship = p.badge === "FLAGSHIP";
            return (
              <div key={p.name} className="ml-card" style={{
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
                <span style={{ fontSize: 17, fontWeight: 700, color: B.white, lineHeight: 1.3, paddingRight: 70 }}>{p.name}</span>
                <span style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.55, flex: 1 }}>{p.desc}</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: B.white }}>CA${p.price.toFixed(2)}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={p.url} target="_blank" rel="noreferrer" className="ml-btn" onClick={() => trackBuyClicked({
                    productName: p.name, productTag: p.tag, priceCad: p.price,
                    checkoutDestination: "etsy", sourceSection: "home_featured",
                  })} style={{
                    flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff",
                    background: B.red, padding: "10px 8px", borderRadius: 8, textDecoration: "none",
                  }}>Buy on Etsy</a>
                  {p.directUrl ? (
                    <a href={p.directUrl} target="_blank" rel="noreferrer" className="ml-btn" onClick={() => trackBuyClicked({
                      productName: p.name, productTag: p.tag, priceCad: p.price,
                      checkoutDestination: "direct", sourceSection: "home_featured",
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
      </section>

      {/* What you get */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "56px 24px 8px" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, margin: "0 0 26px", letterSpacing: "-0.02em", color: B.white, textAlign: "center" }}>
          Why Canadian investors <RedWord>switch to MapleSheet</RedWord>
        </h2>
        <Slideshow slides={OFFER_SLIDES} />
      </section>

      {/* See it in action */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 8px" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em", color: B.white, textAlign: "center" }}>
          See it <RedWord>in action</RedWord>
        </h2>
        <p style={{ color: B.grayLight, fontSize: 14.5, textAlign: "center", margin: "0 0 26px" }}>
          Same dashboard, scaled to however many accounts you're tracking.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 22, flexWrap: "wrap" }}>
          {DEMO_VIEWS.map((v, i) => (
            <button key={v.tab} onClick={() => setDemoTab(i)} className="ml-btn" style={{
              background: i === demoTab ? B.red : "transparent", color: i === demoTab ? "#fff" : B.grayLight,
              border: `1.5px solid ${i === demoTab ? B.red : B.line}`, borderRadius: 999,
              padding: "9px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer",
            }}>{v.tab}</button>
          ))}
        </div>
        <div style={{ maxWidth: 460, margin: "0 auto" }}>
          <DashboardMock total={demo.total} ytd={demo.ytd} totalLabel={demo.label} accounts={demo.accounts} minContentHeight={350} />
        </div>
      </section>


      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 40px", display: "flex", gap: 18, flexWrap: "wrap" }}>
        <Link to="/resources" className="ml-card" style={{
          flex: "1 1 300px", background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16,
          padding: "24px 22px", textDecoration: "none",
        }}>
          <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: B.redLink, fontWeight: 700, marginBottom: 10 }}>LATEST FROM RESOURCES</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: B.white, marginBottom: 8 }}>{latest.title}</div>
          <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.6 }}>{latest.summary}</div>
          <div style={{ fontSize: 13.5, color: B.redLink, fontWeight: 600, marginTop: 12 }}>Read more →</div>
        </Link>
        <Link to="/about" className="ml-card" style={{
          flex: "1 1 300px", background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16,
          padding: "24px 22px", textDecoration: "none",
        }}>
          <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: B.redLink, fontWeight: 700, marginBottom: 10 }}>THE STORY</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: B.white, marginBottom: 8 }}>
            "Too complicated. Too American. So I built my own."
          </div>
          <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.6 }}>
            How one Canadian investor's frustration became 13 trackers — and why every buyer gets personal support.
          </div>
          <div style={{ fontSize: 13.5, color: B.redLink, fontWeight: 600, marginTop: 12 }}>Meet MapleSheet →</div>
        </Link>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:slug" element={<Article />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
