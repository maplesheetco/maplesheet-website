import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { B, CONFIG } from "./data.js";

export const RedWord = ({ children }) => <span style={{ color: B.red }}>{children}</span>;

export const MapleLeaf = ({ size = 14, color = B.red, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style} aria-hidden="true">
    <path d="M12 2l1.8 3.6 3.2-1.2-.9 3.4 3.9.7-2.7 2.7 3.2 2.1-3.7 1 1.3 3.6-3.6-1.2-.6 3.9L12 18l-1.9 3.6-.6-3.9-3.6 1.2 1.3-3.6-3.7-1 3.2-2.1L4 9.5l3.9-.7-.9-3.4 3.2 1.2L12 2z"/>
  </svg>
);

export function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { background: ${B.black}; }
      .ml-btn { transition: transform .12s, background .15s, box-shadow .15s, border-color .15s; }
      .ml-btn:hover { transform: translateY(-1px); }
      .ml-btn:active { transform: translateY(0) scale(0.98); }
      .ml-card { transition: transform .18s, border-color .18s, box-shadow .18s; }
      .ml-card:hover { transform: translateY(-3px); border-color: ${B.red} !important; box-shadow: 0 12px 32px rgba(204,0,0,0.18); }
      .ml-fade { animation: mlFade .4s ease; }
      @keyframes mlFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      .ml-nav-link { color: ${B.grayLight}; text-decoration: none; font-size: 14px; font-weight: 500; padding: 6px 2px; }
      .ml-nav-link:hover { color: ${B.white}; }
      .ml-nav-link.active { color: ${B.white}; border-bottom: 2px solid ${B.red}; }
      .ml-input { width: 100%; background: ${B.black}; border: 1.5px solid ${B.line}; border-radius: 10px;
        color: ${B.white}; font-family: inherit; font-size: 14.5px; padding: 13px 15px; outline: none; }
      .ml-input:focus { border-color: ${B.red}; }
      @media (prefers-reduced-motion: reduce) { .ml-btn, .ml-card, .ml-fade { transition: none !important; animation: none !important; } }
    `}</style>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  React.useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);
  const links = [
    { to: "/", label: "Home" },
    { to: "/trackers", label: "Trackers" },
    { to: CONFIG.freeToolUrl, label: "Free Tools", external: true },
    { to: "/resources", label: "Resources" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];
  return (
    <nav style={{ borderBottom: `1px solid ${B.line}`, position: "sticky", top: 0, background: `${B.black}F2`, backdropFilter: "blur(8px)", zIndex: 50 }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1100, margin: "0 auto", padding: "14px 24px", gap: 12,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
          <img src="/logo.png" alt="MapleSheet Co." style={{ width: 42, height: 42, borderRadius: 9 }} />
          <span style={{ fontWeight: 700, fontSize: 17, color: B.white, letterSpacing: "-0.01em" }}>
            maple<RedWord>sheet</RedWord> <span style={{ color: B.gray, fontWeight: 500, fontSize: 13 }}>co.</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }} className="ml-desktop-nav">
          <div style={{ display: "flex", gap: 20, alignItems: "center" }} className="ml-links">
            {links.map((l) => l.external ? (
              <a key={l.to} href={l.to} target="_blank" rel="noreferrer" className="ml-nav-link">{l.label}</a>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => "ml-nav-link" + (isActive ? " active" : "")}>{l.label}</NavLink>
            ))}
          </div>
          <a href={CONFIG.shopUrl} target="_blank" rel="noreferrer" className="ml-btn" style={{
            background: B.red, color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 14,
            padding: "9px 17px", borderRadius: 8, whiteSpace: "nowrap",
          }}>Shop</a>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="ml-burger" style={{
            display: "none", background: "none", border: `1px solid ${B.line}`, borderRadius: 8,
            color: B.white, fontSize: 18, padding: "6px 12px", cursor: "pointer",
          }}>☰</button>
        </div>
      </div>
      {open && (
        <div className="ml-fade" style={{ borderTop: `1px solid ${B.line}`, padding: "10px 24px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map((l) => l.external ? (
            <a key={l.to} href={l.to} target="_blank" rel="noreferrer" className="ml-nav-link" style={{ padding: "10px 2px", fontSize: 15 }}>{l.label}</a>
          ) : (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => "ml-nav-link" + (isActive ? " active" : "")}
              style={{ padding: "10px 2px", fontSize: 15 }}>{l.label}</NavLink>
          ))}
        </div>
      )}
      <style>{`
        @media (max-width: 820px) {
          .ml-links { display: none !important; }
          .ml-burger { display: inline-block !important; }
        }
      `}</style>
    </nav>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${B.line}`, marginTop: 60 }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "30px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="" style={{ width: 30, height: 30, borderRadius: 7 }} />
          <span style={{ fontSize: 13, color: B.gray }}>
            © 2026 MapleSheet Co. · British Columbia, Canada · Stop Guessing. Start Tracking.
          </span>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 13.5, flexWrap: "wrap" }}>
          <a href={CONFIG.shopUrl} target="_blank" rel="noreferrer" style={{ color: B.grayLight, textDecoration: "none" }}>Etsy</a>
          <a href={CONFIG.youtubeUrl} target="_blank" rel="noreferrer" style={{ color: B.grayLight, textDecoration: "none" }}>YouTube</a>
          <a href={CONFIG.xUrl} target="_blank" rel="noreferrer" style={{ color: B.grayLight, textDecoration: "none" }}>X</a>
          <a href={CONFIG.affiliateUrl} target="_blank" rel="noreferrer" style={{ color: B.grayLight, textDecoration: "none" }}>Become an Affiliate</a>
          <a href={`mailto:${CONFIG.email}`} style={{ color: B.grayLight, textDecoration: "none" }}>{CONFIG.email}</a>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 26px", fontSize: 11.5, color: B.gray, lineHeight: 1.6 }}>
        MapleSheet trackers are record-keeping tools, not financial advice. Google Sheets is a trademark of Google LLC; MapleSheet Co. is not affiliated with Google or Etsy.
      </div>
    </footer>
  );
}

const ACCOUNT_COLORS = { TFSA: "#5B8DEF", RRSP: "#8B7CF6", RESP: "#34C77B", FHSA: "#F5A623", Margin: B.red };

export function DashboardMock({ accounts, total, totalLabel = "Combined net worth", ytd }) {
  return (
    <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, overflow: "hidden", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 16px", borderBottom: `1px solid ${B.line}`, background: B.black3 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: B.gray }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: B.gray }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: B.gray }} />
        <span style={{ marginLeft: 8, fontSize: 12, color: B.grayLight }}>MapleSheet Co. — Portfolio Dashboard</span>
      </div>
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: B.grayLight, marginBottom: 4 }}>{totalLabel}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: B.white, letterSpacing: "-0.02em" }}>${total}</div>
          </div>
          {ytd && <div style={{ fontSize: 13, fontWeight: 700, color: "#34C77B" }}>▲ {ytd} YTD</div>}
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {accounts.map((a) => (
            <div key={a.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "11px 14px", background: B.black3, borderRadius: 10,
              borderLeft: `3px solid ${ACCOUNT_COLORS[a.label] || B.red}`,
            }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: B.white }}>{a.label}</span>
              <span style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: B.white }}>${a.value}</span>
                <span style={{ fontSize: 11.5, color: "#34C77B" }}>{a.change}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageHead({ kicker, title, sub }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 8px", textAlign: "center" }}>
      {kicker && <div style={{ fontSize: 12, letterSpacing: "0.14em", color: B.red, fontWeight: 700, marginBottom: 12 }}>{kicker}</div>}
      <h1 style={{ fontSize: "clamp(30px, 5.5vw, 46px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em", color: B.white, lineHeight: 1.12 }}>{title}</h1>
      {sub && <p style={{ color: B.grayLight, fontSize: 15.5, maxWidth: 640, margin: "0 auto", lineHeight: 1.65 }}>{sub}</p>}
    </div>
  );
}
