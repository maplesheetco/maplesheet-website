import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { B, CONFIG } from "./data.js";
import { trackLiveChatStarted } from "./analytics.js";

// Reads the user's reduced-motion preference once, synchronously, so the
// very first render already knows whether to skip animation — avoids a
// flash of animated content for people who asked their OS not to show it.
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const SITE_URL = "https://www.maplesheet.ca";

// Sets a unique <title>, meta description, canonical link, and matching
// OpenGraph tags for the current route. Without this, every page shared the
// homepage's title/description and canonical — which told Google every
// other page was a duplicate of the homepage instead of its own indexable
// page. Call once near the top of each page component.
export function usePageMeta({ title, description }) {
  const location = useLocation();

  useEffect(() => {
    if (title) document.title = title;

    const setMetaTag = (attr, attrValue, content) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      setMetaTag("name", "description", description);
      setMetaTag("property", "og:description", description);
    }
    if (title) {
      setMetaTag("property", "og:title", title);
    }

    const path = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
    const canonicalUrl = `${SITE_URL}${path}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    setMetaTag("property", "og:url", canonicalUrl);

    // Tell Tawk.to which page a visitor is on. Without this, a chat comes in
    // completely blind — Lino has no idea if someone's asking about the
    // FHSA tracker or stuck on checkout for the Ultimate bundle, and has to
    // ask before he can even start helping. Tawk_API already exists as a
    // global by the time this runs (index.html creates it synchronously
    // before the widget script loads), but the actual embed script loads
    // async — setAttributes silently no-ops if Tawk isn't ready yet or an
    // ad blocker stripped it, which is fine, this is a nice-to-have, never
    // something a page should depend on.
    if (window.Tawk_API?.setAttributes) {
      window.Tawk_API.setAttributes({ "page": title || path }, () => {});
    }
  }, [title, description, location.pathname]);
}

// Fades + slides a block in the moment it scrolls into view — the site-wide
// "Apple-style" scroll polish. Cheap on purpose: no animation library, just
// one IntersectionObserver per instance, so it's safe to wrap sections on
// every page (including text-heavy Resources/Article pages) without adding
// any bundle weight. Plays once per mount and respects prefers-reduced-motion
// (and the existing .ml-fade pattern's media query) by rendering already-in
// on the very first paint for those users.
export function Reveal({ children, as: Tag = "div", delay = 0, y = 24, style, className, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(prefersReducedMotion());

  useEffect(() => {
    if (shown || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref}
      className={["ml-reveal-js", className].filter(Boolean).join(" ")}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity .7s cubic-bezier(.16,.8,.24,1) ${delay}ms, transform .7s cubic-bezier(.16,.8,.24,1) ${delay}ms`,
        willChange: shown ? "auto" : "opacity, transform",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Wires up analytics for Tawk.to live chat — mount this once, near the top
// of the app (not per-page), so the handler is set exactly once. Tawk fires
// onChatStarted the moment a visitor sends their first message, which is a
// much better "engaged" signal than the bubble merely being open.
export function useLiveChatTracking() {
  const location = useLocation();
  const pathRef = useRef(location.pathname);
  useEffect(() => { pathRef.current = location.pathname; }, [location.pathname]);

  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    // Chain onto any handler Tawk's own snippet may already have set,
    // rather than clobbering it, in case that ever changes.
    const prev = window.Tawk_API.onChatStarted;
    window.Tawk_API.onChatStarted = function () {
      trackLiveChatStarted({ pagePath: pathRef.current });
      if (typeof prev === "function") prev();
    };
  }, []);
}

// Tiny mounting component for useLiveChatTracking(). useLiveChatTracking()
// calls useLocation() internally, which only works inside a <BrowserRouter>
// — so it can't be called directly in App() before the Router is rendered.
// Render <LiveChatTracker /> as JSX *inside* the <BrowserRouter> tree instead
// (e.g. alongside <GlobalStyles /> and <Nav />). Renders nothing itself.
export function LiveChatTracker() {
  useLiveChatTracking();
  return null;
}

// Injects (and keeps updated) a <script type="application/ld+json"> tag in
// <head> for structured data (schema.org). `id` must be unique per call site
// so multiple pages/components can each own their own script tag without
// clobbering each other. Pass `data: null` to skip (e.g. article not found).
// Removes its tag on unmount so stale schema never leaks onto another route.
export function useJsonLd(data, id) {
  useEffect(() => {
    if (!data) return;
    let el = document.querySelector(`script[data-jsonld-id="${id}"]`);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.setAttribute("data-jsonld-id", id);
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      const stale = document.querySelector(`script[data-jsonld-id="${id}"]`);
      if (stale) stale.remove();
    };
  }, [JSON.stringify(data), id]);
}

export const RedWord = ({ children }) => <span style={{ color: B.redLink }}>{children}</span>;

export const MapleLeaf = ({ size = 14, color = B.red, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style} aria-hidden="true">
    <path d="M12 2l1.8 3.6 3.2-1.2-.9 3.4 3.9.7-2.7 2.7 3.2 2.1-3.7 1 1.3 3.6-3.6-1.2-.6 3.9L12 18l-1.9 3.6-.6-3.9-3.6 1.2 1.3-3.6-3.7-1 3.2-2.1L4 9.5l3.9-.7-.9-3.4 3.2 1.2L12 2z"/>
  </svg>
);

export function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html, body { background: ${B.black}; }
      /* overflow-x: clip (not "hidden") on purpose — "hidden" with no
         overflow-y set makes the browser compute overflow-y as "auto" on
         both html and body, turning them into scroll containers. That
         silently breaks position: sticky for <Nav> (it starts tracking the
         nearest scroll container instead of the viewport) — a pre-existing
         bug on the live site, confirmed independently of the scroll-effects
         work below. "clip" suppresses horizontal overflow the same way
         without ever creating a scroll container, so sticky works again. */
      html, body { overflow-x: clip; }
      html { scroll-behavior: smooth; }
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
      @media (prefers-reduced-motion: reduce) {
        .ml-btn, .ml-card, .ml-fade { transition: none !important; animation: none !important; }
        html { scroll-behavior: auto; }
        .ml-reveal-js { opacity: 1 !important; transform: none !important; transition: none !important; }
      }
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
    { to: "/tools", label: "Free Tools" },
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

const FOOT_LINK_STYLE = {
  color: B.grayLight, textDecoration: "none", fontSize: 13.5,
  display: "inline-flex", alignItems: "center", gap: 5, width: "fit-content",
};

function FootCol({ heading, children }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: B.gray }}>
        {heading}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${B.line}`, marginTop: 60 }}>
      <div className="ml-foot-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 44px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="" style={{ width: 28, height: 28, borderRadius: 7 }} />
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em" }}>MapleSheet Co.</span>
          </div>
          <p style={{ margin: "16px 0 0", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3, maxWidth: 280 }}>
            Stop guessing. Start <span style={{ color: B.redLink }}>tracking.</span>
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 13.5, color: B.gray, lineHeight: 1.6, maxWidth: 260 }}>
            Google Sheets trackers for Canadian investors — TFSA, RRSP, RESP, FHSA and multi-brokerage.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <a href={CONFIG.shopUrl} target="_blank" rel="noreferrer"
              style={{ fontSize: 13.5, fontWeight: 600, textDecoration: "none", padding: "10px 18px", borderRadius: 8, background: B.red, color: B.white, border: `1px solid ${B.red}` }}>
              Shop Trackers
            </a>
            <a href={`mailto:${CONFIG.email}`}
              style={{ fontSize: 13.5, fontWeight: 600, textDecoration: "none", padding: "10px 18px", borderRadius: 8, background: "transparent", color: B.white, border: `1px solid ${B.line}` }}>
              Email us
            </a>
          </div>
        </div>

        <FootCol heading="Products">
          <NavLink to="/trackers" style={FOOT_LINK_STYLE}>Trackers</NavLink>
          <NavLink to="/tools" style={FOOT_LINK_STYLE}>Free Tools</NavLink>
          <NavLink to="/resources" style={FOOT_LINK_STYLE}>Resources</NavLink>
        </FootCol>

        <FootCol heading="Company">
          <NavLink to="/about" style={FOOT_LINK_STYLE}>About</NavLink>
          <NavLink to="/contact" style={FOOT_LINK_STYLE}>Contact</NavLink>
          <a href={CONFIG.shopUrl} target="_blank" rel="noreferrer" style={FOOT_LINK_STYLE}>Etsy Shop ↗</a>
        </FootCol>

        <FootCol heading="Recommended">
          <a href="https://wealthsimple.com/invite/R7ENSA" target="_blank" rel="noreferrer" style={FOOT_LINK_STYLE}>Wealthsimple ↗</a>
          <div>
            <a href="https://www.questrade.com" target="_blank" rel="noreferrer" style={FOOT_LINK_STYLE}>Questrade ↗</a>
            <div style={{ fontSize: 11.5, color: B.gray, marginTop: 2 }}>code: 786314335499127</div>
          </div>
          <a href={CONFIG.youtubeUrl} target="_blank" rel="noreferrer" style={FOOT_LINK_STYLE}>YouTube ↗</a>
          <a href={CONFIG.xUrl} target="_blank" rel="noreferrer" style={FOOT_LINK_STYLE}>X ↗</a>
          <a href={CONFIG.affiliateUrl} target="_blank" rel="noreferrer" style={FOOT_LINK_STYLE}>Become an Affiliate</a>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: B.gray, lineHeight: 1.5, maxWidth: 190 }}>
            Wealthsimple and Questrade are referral links/codes — MapleSheet may receive a benefit at no cost to you.
          </p>
        </FootCol>
      </div>

      <div style={{ borderTop: `1px solid ${B.line}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 24px" }}>
          <p style={{ margin: "0 0 16px", fontSize: 11.5, color: B.gray, lineHeight: 1.6, maxWidth: 760 }}>
            MapleSheet trackers are record-keeping tools, not financial advice. Google Sheets is a trademark of Google LLC; MapleSheet Co. is not affiliated with Google or Etsy.
          </p>
          <div className="ml-foot-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", paddingTop: 16, borderTop: `1px solid ${B.line}` }}>
            <div className="ml-foot-bottom-left" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 11.5, color: B.gray }}>
              <span>© 2026 MapleSheet Co. All rights reserved.</span>
              <span style={{ color: B.line }}>·</span>
              <a href="https://linocondigital.com" target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 6, color: B.gray, textDecoration: "none" }}>
                Built by
                <img src="/linocon-digital-logo.png" alt="LinoCon Digital" style={{ width: 15, height: 15, borderRadius: 4 }} />
                LinoCon Digital
              </a>
            </div>
            <div className="ml-foot-bottom-right" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", fontSize: 11.5 }}>
              <a href={`mailto:${CONFIG.email}`} style={{ color: B.gray, textDecoration: "none" }}>{CONFIG.email}</a>
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600, color: B.grayLight, background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer" }}>
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ml-foot-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px; }
        .ml-foot-grid a:hover { color: ${B.white} !important; }
        @media (max-width: 760px) {
          .ml-foot-grid { grid-template-columns: 1fr 1fr; row-gap: 36px; }
          .ml-foot-grid > div:first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .ml-foot-bottom { flex-direction: column; text-align: center; }
          .ml-foot-bottom-left, .ml-foot-bottom-right { justify-content: center; }
        }
      `}</style>
    </footer>
  );
}

const GROWTH_POINTS = [[0, 150], [45, 141], [90, 130], [135, 117], [180, 104], [225, 87], [270, 67], [315, 45], [360, 24], [395, 8]];

export function GrowthChart() {
  const path = GROWTH_POINTS.map((p, idx) => (idx === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
  const area = path + " L395,160 L0,160 Z";
  const last = GROWTH_POINTS[GROWTH_POINTS.length - 1];
  return (
    <div style={{ width: "100%" }}>
      <svg viewBox="0 0 400 160" style={{ width: "100%", height: 130, display: "block" }}>
        <path d={area} fill={B.red} opacity="0.08" />
        <path d={path} fill="none" stroke={B.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {GROWTH_POINTS.filter((_, idx) => idx % 3 === 0).map((p, idx) => (
          <circle key={idx} cx={p[0]} cy={p[1]} r="3" fill={B.black2} stroke={B.red} strokeWidth="1.8" />
        ))}
        <circle cx={last[0]} cy={last[1]} r="4.5" fill={B.red} />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: B.grayLight, marginTop: 6 }}>
        <span>5 years ago</span>
        <span style={{ color: B.redLink, fontWeight: 700 }}>+92% sample growth</span>
      </div>
    </div>
  );
}

export function Slideshow({ slides, intervalMs = 4500 }) {
  const [i, setI] = useState(0);
  const timer = useRef(null);
  const start = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setI((v) => (v + 1) % slides.length), intervalMs);
  };
  useEffect(() => { start(); return () => clearInterval(timer.current); }, [slides.length]);
  const go = (n) => { setI(((n % slides.length) + slides.length) % slides.length); start(); };
  const s = slides[i];
  const arrowBtn = {
    width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${B.line}`, background: "transparent",
    color: B.grayLight, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  };
  return (
    <div onMouseEnter={() => clearInterval(timer.current)} onMouseLeave={start}>
      <div style={{
        background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16,
        padding: s.graphic ? "26px 26px 22px" : "34px 30px",
        display: "flex", flexDirection: s.graphic ? "column" : "row",
        alignItems: s.graphic ? "stretch" : "center", gap: s.graphic ? 16 : 24,
        flexWrap: "wrap", minHeight: 300, justifyContent: "center",
      }}>
        {s.graphic ? (
          <>
            {s.graphic}
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: B.white, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: B.grayLight, lineHeight: 1.6 }}>{s.body}</div>
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: B.black3,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>{s.icon}</div>
            <div style={{ flex: "1 1 260px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: B.white, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: B.grayLight, lineHeight: 1.6 }}>{s.body}</div>
            </div>
          </>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginTop: 18 }}>
        <button onClick={() => go(i - 1)} aria-label="Previous slide" className="ml-btn" style={arrowBtn}>‹</button>
        <div style={{ display: "flex", gap: 7 }}>
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => go(idx)} aria-label={`Go to slide ${idx + 1}`} style={{
              width: 7, height: 7, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0,
              background: idx === i ? B.red : B.line,
            }} />
          ))}
        </div>
        <button onClick={() => go(i + 1)} aria-label="Next slide" className="ml-btn" style={arrowBtn}>›</button>
      </div>
    </div>
  );
}

// Auto-advancing gallery of real tracker screenshots (not mockups) — for the
// homepage, so visitors see actual product depth instead of just reading text.
export function ProductGallery({ slides, intervalMs = 4000 }) {
  const [i, setI] = useState(0);
  const timer = useRef(null);
  const start = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setI((v) => (v + 1) % slides.length), intervalMs);
  };
  useEffect(() => { start(); return () => clearInterval(timer.current); }, [slides.length]);
  const go = (n) => { setI(((n % slides.length) + slides.length) % slides.length); start(); };
  const s = slides[i];
  const arrowBtn = {
    width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${B.line}`, background: B.black2,
    color: B.grayLight, fontSize: 19, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 2,
  };
  return (
    <div onMouseEnter={() => clearInterval(timer.current)} onMouseLeave={start}>
      {/* Full-bleed: breaks out of any ancestor's centered max-width to span the
          entire viewport, regardless of how deeply this is nested. */}
      <div style={{
        position: "relative", width: "100vw", left: "50%", right: "50%",
        marginLeft: "-50vw", marginRight: "-50vw",
      }}>
        <button onClick={() => go(i - 1)} aria-label="Previous screenshot" style={{ ...arrowBtn, left: 20 }}>‹</button>
        <button onClick={() => go(i + 1)} aria-label="Next screenshot" style={{ ...arrowBtn, right: 20 }}>›</button>
        <div style={{
          background: B.black2, borderTop: `1px solid ${B.line}`, borderBottom: `1px solid ${B.line}`, overflow: "hidden",
        }}>
          <img
            src={s.src} alt={s.alt} loading="lazy"
            style={{
              width: "100%", display: "block", aspectRatio: "2 / 1", objectFit: "contain",
              background: B.black2, maxHeight: "72vh",
            }}
          />
        </div>
      </div>
      <div style={{ maxWidth: 560, margin: "16px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: B.white, marginBottom: 2 }}>{s.title}</div>
        <div style={{ fontSize: 13, color: B.grayLight }}>{s.tag}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 14 }}>
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => go(idx)} aria-label={`Go to screenshot ${idx + 1}`} style={{
            width: 7, height: 7, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0,
            background: idx === i ? B.red : B.line,
          }} />
        ))}
      </div>
    </div>
  );
}

const ACCOUNT_COLORS = { TFSA: "#5B8DEF", RRSP: "#8B7CF6", RESP: "#34C77B", FHSA: "#F5A623", Margin: B.red };

export function DashboardMock({ accounts, total, totalLabel = "Combined net worth", ytd, minContentHeight }) {
  return (
    <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, overflow: "hidden", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 16px", borderBottom: `1px solid ${B.line}`, background: B.black3 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: B.gray }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: B.gray }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: B.gray }} />
        <span style={{ marginLeft: 8, fontSize: 12, color: B.grayLight }}>MapleSheet Co. — Portfolio Dashboard</span>
      </div>
      <div style={{ padding: "20px 22px", ...(minContentHeight ? { minHeight: minContentHeight, display: "flex", flexDirection: "column", justifyContent: "center" } : {}) }}>
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

// Shared accordion for a [question, answer] pair list (FAQS in data.js).
// Used on About (general site FAQ) and TrackerDetail (same questions,
// surfaced right where someone's actually deciding whether to buy).
export function FaqAccordion({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {faqs.map(([q, a], i) => (
        <div key={q} style={{ background: B.black2, border: `1px solid ${open === i ? B.red : B.line}`, borderRadius: 12, overflow: "hidden" }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{
            width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
            color: B.white, fontWeight: 600, fontSize: 15, padding: "16px 18px", fontFamily: "inherit",
            display: "flex", justifyContent: "space-between", gap: 10,
          }}>
            {q} <span style={{ color: B.redLink }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="ml-fade" style={{ padding: "0 18px 16px", color: B.grayLight, fontSize: 14, lineHeight: 1.7 }}>{a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function PageHead({ kicker, title, sub }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 8px", textAlign: "center" }}>
      {kicker && <div style={{ fontSize: 12, letterSpacing: "0.14em", color: B.redLink, fontWeight: 700, marginBottom: 12 }}>{kicker}</div>}
      <h1 style={{ fontSize: "clamp(30px, 5.5vw, 46px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em", color: B.white, lineHeight: 1.12 }}>{title}</h1>
      {sub && <p style={{ color: B.grayLight, fontSize: 15.5, maxWidth: 640, margin: "0 auto", lineHeight: 1.65 }}>{sub}</p>}
    </div>
  );
}
