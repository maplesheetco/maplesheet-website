import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { B, CONFIG, PRODUCTS, RESOURCES } from "./data.js";
import { GlobalStyles, Nav, Footer, RedWord, MapleLeaf } from "./ui.jsx";
import Trackers from "./pages/Trackers.jsx";
import FreeTools from "./pages/FreeTools.jsx";
import Resources from "./pages/Resources.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

function Home() {
  const featured = PRODUCTS.filter((p) => p.badge);
  const latest = RESOURCES[0];
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
        <h1 style={{ fontSize: "clamp(38px, 7vw, 66px)", fontWeight: 800, lineHeight: 1.04, margin: "0 0 6px", letterSpacing: "-0.03em", color: B.white }}>
          Stop Guessing.
        </h1>
        <h1 style={{ fontSize: "clamp(38px, 7vw, 66px)", fontWeight: 800, lineHeight: 1.04, margin: "0 0 24px", letterSpacing: "-0.03em", color: B.red }}>
          Start Tracking.
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
        <div style={{ marginTop: 24, fontSize: 13.5, color: B.yellow, fontWeight: 600 }}>
          🏷 Launch offer: {CONFIG.promoText}
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

      {/* Featured products */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 8px" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em", color: B.white, textAlign: "center" }}>
          Featured <RedWord>trackers</RedWord>
        </h2>
        <p style={{ color: B.grayLight, fontSize: 14.5, textAlign: "center", margin: "0 0 26px" }}>
          The flagship, and the newest addition. <Link to="/trackers" style={{ color: B.red, fontWeight: 600 }}>See all 13 →</Link>
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
                  <a href={p.url} target="_blank" rel="noreferrer" className="ml-btn" style={{
                    flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff",
                    background: B.red, padding: "10px 8px", borderRadius: 8, textDecoration: "none",
                  }}>Buy on Etsy</a>
                  {p.directUrl ? (
                    <a href={p.directUrl} target="_blank" rel="noreferrer" className="ml-btn" style={{
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

      {/* Calculator hook */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{
          background: `linear-gradient(135deg, ${B.black2}, ${B.black3})`,
          border: `1px solid ${B.line}`, borderRadius: 20, padding: "clamp(28px, 5vw, 44px)",
          display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap",
        }}>
          <div style={{ flex: "1 1 340px" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", color: B.red, fontWeight: 700, marginBottom: 10 }}>FREE TOOL — NO SIGN-UP</div>
            <h2 style={{ fontSize: "clamp(23px, 4vw, 32px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em", color: B.white }}>
              What could <RedWord>$50/month</RedWord> become?
            </h2>
            <p style={{ color: B.grayLight, fontSize: 15, lineHeight: 1.65, margin: "0 0 22px" }}>
              Growth projections, goal planning, scenario comparisons, and TFSA vs RRSP vs Margin
              after-tax outcomes — free, interactive, no sign-up.
            </p>
            <Link to="/tools" className="ml-btn" style={{
              display: "inline-block", background: B.white, color: B.black, textDecoration: "none",
              fontWeight: 700, fontSize: 15, padding: "13px 25px", borderRadius: 10,
            }}>Open the free calculator →</Link>
          </div>
          <div style={{ flex: "0 1 300px", margin: "0 auto" }}>
            <div style={{ background: B.black, border: `1px solid ${B.line}`, borderRadius: 16, padding: "26px 22px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: B.grayLight }}>$50/month · 30 years · 10%</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: B.white, margin: "6px 0", letterSpacing: "-0.02em" }}>$113,024</div>
              <div style={{ fontSize: 13, color: B.grayLight }}>You put in <strong style={{ color: B.white }}>$18,000</strong></div>
              <div style={{ fontSize: 13, color: B.red, fontWeight: 700 }}>The market added $95,024</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest resource + story teaser */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 40px", display: "flex", gap: 18, flexWrap: "wrap" }}>
        <Link to="/resources" className="ml-card" style={{
          flex: "1 1 300px", background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16,
          padding: "24px 22px", textDecoration: "none",
        }}>
          <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: B.red, fontWeight: 700, marginBottom: 10 }}>LATEST FROM RESOURCES</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: B.white, marginBottom: 8 }}>{latest.title}</div>
          <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.6 }}>{latest.summary}</div>
          <div style={{ fontSize: 13.5, color: B.red, fontWeight: 600, marginTop: 12 }}>Read more →</div>
        </Link>
        <Link to="/about" className="ml-card" style={{
          flex: "1 1 300px", background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16,
          padding: "24px 22px", textDecoration: "none",
        }}>
          <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: B.red, fontWeight: 700, marginBottom: 10 }}>THE STORY</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: B.white, marginBottom: 8 }}>
            "Too complicated. Too American. So I built my own."
          </div>
          <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.6 }}>
            How one Canadian investor's frustration became 13 trackers — and why every buyer gets personal support.
          </div>
          <div style={{ fontSize: 13.5, color: B.red, fontWeight: 600, marginTop: 12 }}>Meet MapleSheet →</div>
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
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trackers" element={<Trackers />} />
          <Route path="/tools" element={<FreeTools />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
