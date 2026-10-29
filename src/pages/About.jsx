import React from "react";
import { Link } from "react-router-dom";
import { B, FAQS, PRODUCTS } from "../data.js";
import { RedWord, usePageMeta, FaqAccordion, Reveal } from "../ui.jsx";
import { STATIC_META } from "../seo.js";

// Lino's story, split into short sections instead of one long column: who
// he is, how MapleSheet started, the questions it answers, the support
// promise, what's in every tracker, then the FAQ. The founder card on the
// right is where a real photo goes once Lino sends one.

const card = { background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, padding: "20px 20px" };
const h2 = { fontSize: "clamp(22px, 3.2vw, 28px)", fontWeight: 800, color: B.white, margin: "0 0 18px", letterSpacing: "-0.02em" };

const STEPS = [
  ["Step 1", "A personal tracker", "A Google Sheet for my own TFSA and RRSP."],
  ["Step 2", "Friends asked for copies", "Then family members wanted their own."],
  ["Step 3", "MapleSheet Co. was born", "Before long, it became a real business."],
  ["Today", `${PRODUCTS.length} purpose-built trackers`, "TFSA, RRSP, RESP, FHSA, Margin, and multi-account portfolios."],
];

const QUESTIONS = [
  "What do I own?",
  "How much have I contributed?",
  "How much have I earned?",
  "What are my investments actually doing?",
  "Where do I stand financially?",
];

const FEATURES = [
  ["📈 Live prices", "GOOGLEFINANCE-powered quotes, CAD & USD with automatic conversion"],
  ["🧮 Automatic ACB", "Adjusted cost base and capital gains calculated the CRA way"],
  ["🇨🇦 CRA rules built in", "Contribution room, CESG grants, Line 20800, Line 20805 — the real rules"],
  ["💰 One-time purchase", "No subscription. Yours forever, with personal support"],
];

export default function About() {
  usePageMeta(STATIC_META["/about"]);
  const para = { color: B.grayLight, fontSize: 15.5, lineHeight: 1.75, margin: "0 0 14px" };
  return (
    <div className="ml-fade">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 0" }}>
        <section className="ml-about-hero">
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", color: B.redLink, fontWeight: 700, marginBottom: 12 }}>THE STORY</div>
            <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)", fontWeight: 800, margin: "0 0 20px", letterSpacing: "-0.02em", color: B.white, lineHeight: 1.12 }}>
              "Too complicated. Too American. <RedWord>So I built my own."</RedWord>
            </h1>
            <p style={para}>Hi, I'm Lino — the founder of MapleSheet Co., a Canadian investor based in British Columbia.</p>
            <p style={para}>I started MapleSheet because I couldn't find investment tracking tools that truly understood the Canadian investor.</p>
            <p style={para}>Most of the trackers I came across were built around U.S. accounts, tax rules, and investing
            terminology. They could track a portfolio, but they didn't account for the things that actually
            matter to Canadians — TFSA contribution room, RRSP limits, RESP and CESG grants, FHSA rules,
            adjusted cost base, and the tax considerations that come with investing in Canada.</p>
            <p style={{ ...para, color: B.white, fontWeight: 700, marginBottom: 0 }}>So I built my own.</p>
          </div>
          <Reveal style={{ ...card, padding: "32px 28px", textAlign: "center", background: `linear-gradient(150deg, #2A0A0A, ${B.black2})` }}>
            <img src="/logo.png" alt="MapleSheet Co. logo" width="120" height="120" style={{ width: 120, height: 120, borderRadius: 24, display: "block", margin: "0 auto 18px" }} />
            <div style={{ fontSize: 20, fontWeight: 800, color: B.white }}>Lino</div>
            <div style={{ fontSize: 14, color: B.grayLight, marginBottom: 18 }}>Founder, MapleSheet Co.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {["🍁 British Columbia", `${PRODUCTS.length} trackers`, "One-time purchase", "Personal support"].map((f) => (
                <span key={f} style={{ background: B.black3, border: `1px solid ${B.line}`, borderRadius: 999, padding: "5px 12px", fontSize: 12.5, fontWeight: 600, color: B.white }}>{f}</span>
              ))}
            </div>
          </Reveal>
        </section>

        <Reveal as="section" style={{ marginTop: 56 }}>
          <h2 style={h2}>How MapleSheet <RedWord>started</RedWord></h2>
          <p style={{ ...para, maxWidth: 720 }}>What started as a personal tracker for my TFSA and RRSP gradually became something much bigger.</p>
          <div className="ml-grid-4">
            {STEPS.map(([step, title, body]) => (
              <div key={step} style={card}>
                <div style={{ fontSize: 11.5, letterSpacing: "0.1em", color: B.redLink, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>{step}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: B.white, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.55 }}>{body}</div>
              </div>
            ))}
          </div>
          <p style={{ ...para, maxWidth: 760, marginTop: 20 }}>
            Each tracker is built with the goal of making your investments easier to understand and manage,
            with features such as live market pricing, automatic ACB calculations, portfolio performance
            tracking, contribution tracking, and Canadian-specific rules and considerations.
          </p>
        </Reveal>

        <Reveal as="section" style={{ marginTop: 44 }}>
          <h2 style={h2}>More than <RedWord>spreadsheets</RedWord></h2>
          <p style={{ ...para, maxWidth: 720 }}>It's about helping Canadian investors answer the questions that matter:</p>
          <div className="ml-grid-5">
            {QUESTIONS.map((q) => (
              <div key={q} style={{ ...card, padding: "18px 14px", textAlign: "center", fontWeight: 700, fontSize: 14.5, color: B.white, lineHeight: 1.4 }}>{q}</div>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" style={{
          marginTop: 48, border: `1px solid ${B.red}`, borderRadius: 18, padding: "clamp(22px, 4vw, 32px)",
          background: `linear-gradient(120deg, #2A0A0A, ${B.black2} 65%)`,
          display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.12em", color: B.redLink, fontWeight: 700, marginBottom: 8 }}>ONE PRINCIPLE I INTEND TO KEEP</div>
            <h2 style={{ ...h2, margin: "0 0 10px" }}>Every MapleSheet customer gets personal support.</h2>
            <p style={{ ...para, marginBottom: 8 }}>
              When you buy a MapleSheet tracker, you're not dealing with a faceless company, a chatbot, or an automated
              support system. <strong style={{ color: B.white }}>You can reach me directly.</strong> No bots. No auto-replies.
              Just me — helping you get the most out of the tracker you purchased.
            </p>
            <p style={{ ...para, margin: 0 }}>
              Because MapleSheet was built by an investor who needed better tools himself, and that same standard continues to guide everything we build.
            </p>
          </div>
          <Link to="/contact" className="ml-btn" style={{
            background: B.red, color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 15,
            padding: "14px 26px", borderRadius: 10, whiteSpace: "nowrap",
          }}>Contact Lino →</Link>
        </Reveal>

        <Reveal as="section" style={{ marginTop: 48 }}>
          <h2 style={h2}>What's inside <RedWord>every tracker</RedWord></h2>
          <div className="ml-grid-4">
            {FEATURES.map(([t, d]) => (
              <div key={t} style={card}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5, color: B.white }}>{t}</div>
                <div style={{ color: B.grayLight, fontSize: 13.5, lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <section style={{ marginTop: 48 }}>
          <h2 style={h2}>Common <RedWord>questions</RedWord></h2>
          <Reveal style={{ marginBottom: 24 }}>
            <FaqAccordion faqs={FAQS} twoColumns />
          </Reveal>
        </section>

        <div style={{ textAlign: "center", padding: "10px 0 0" }}>
          <p style={{ color: B.white, fontWeight: 700, margin: "0 0 18px" }}>MapleSheet Co. · Stop Guessing. Start Tracking. 🍁</p>
          <Link to="/trackers" className="ml-btn" style={{
            display: "inline-block", background: B.red, color: "#fff", textDecoration: "none",
            fontWeight: 700, fontSize: 15, padding: "15px 32px", borderRadius: 10,
            boxShadow: "0 6px 20px rgba(204,0,0,0.35)",
          }}>Browse the trackers →</Link>
        </div>
      </div>
    </div>
  );
}
