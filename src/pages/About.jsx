import React from "react";
import { B, CONFIG, FAQS } from "../data.js";
import { PageHead, RedWord, usePageMeta, FaqAccordion, Reveal } from "../ui.jsx";

export default function About() {
  usePageMeta({
    title: "About MapleSheet Co. — Built by a Canadian, for Canadians",
    description: "Why MapleSheet Co. exists: investment trackers built for the CRA system from the ground up, not adapted from American spreadsheets. Meet the founder.",
  });
  return (
    <div className="ml-fade">
      <PageHead kicker="THE STORY" title={<>"Too complicated. Too American.<br /><RedWord>So I built my own."</RedWord></>} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "26px 24px 0" }}>
        <Reveal style={{ color: B.grayLight, fontSize: 15.5, lineHeight: 1.8 }}>
          <p>Hi, I'm Lino — the founder of MapleSheet Co., a Canadian investor based in British Columbia.</p>
          <p>I started MapleSheet because I couldn't find investment tracking tools that truly understood the Canadian investor.</p>
          <p>Most of the trackers I came across were built around U.S. accounts, tax rules, and investing
          terminology. They could track a portfolio, but they didn't account for the things that actually
          matter to Canadians — TFSA contribution room, RRSP limits, RESP and CESG grants, FHSA rules,
          adjusted cost base, and the tax considerations that come with investing in Canada.</p>
          <p>So I built my own.</p>
          <p>What started as a personal tracker for my TFSA and RRSP gradually became something much bigger.
          Friends asked for copies. Then family members wanted their own. Before long, MapleSheet Co. was born.</p>
          <p>Today, MapleSheet offers <strong style={{ color: B.white }}>13 purpose-built investment trackers</strong> designed
          specifically for Canadian investors — covering TFSA, RRSP, RESP, FHSA, Margin, and practical multi-account portfolios.</p>
          <p>Each tracker is built with the goal of making your investments easier to understand and manage,
          with features such as live market pricing, automatic ACB calculations, portfolio performance
          tracking, contribution tracking, and Canadian-specific rules and considerations.</p>
          <p>But MapleSheet is about more than spreadsheets.</p>
          <p>It's about helping Canadian investors answer the questions that matter:</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
            {[
              "What do I own?",
              "How much have I contributed?",
              "How much have I earned?",
              "What are my investments actually doing?",
              "And where do I stand financially?",
            ].map((q) => (
              <li key={q} style={{ color: B.white, fontWeight: 600, marginBottom: 6 }}>{q}</li>
            ))}
          </ul>
          <p>And there's one principle I intend to keep as MapleSheet grows:</p>
          <p style={{ color: B.red, fontWeight: 800, fontSize: 19, margin: "22px 0 10px" }}>
            Every MapleSheet customer gets personal support.
          </p>
          <p>When you buy a MapleSheet tracker, you're not dealing with a faceless company, a chatbot, or an automated support system.</p>
          <p style={{ color: B.white, fontWeight: 600 }}>You can reach me directly.</p>
          <p>No bots. No auto-replies. Just me — helping you get the most out of the tracker you purchased.</p>
          <p>Because MapleSheet was built by an investor who needed better tools himself, and that same standard continues to guide everything we build.</p>
          <p style={{ color: B.white, fontWeight: 700, marginTop: 20, marginBottom: 0 }}>
            MapleSheet Co.<br />
            Stop Guessing. Start Tracking. 🍁
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, margin: "34px 0" }}>
          {[
            ["📈 Live prices", "GOOGLEFINANCE-powered quotes, CAD & USD with automatic conversion"],
            ["🧮 Automatic ACB", "Adjusted cost base and capital gains calculated the CRA way"],
            ["🇨🇦 CRA rules built in", "Contribution room, CESG grants, Line 208, Line 20805 — the real rules"],
            ["💰 One-time purchase", "No subscription. Instant download. Yours forever, with personal support"],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 80} style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5, color: B.white }}>{t}</div>
              <div style={{ color: B.grayLight, fontSize: 13.5, lineHeight: 1.55 }}>{d}</div>
            </Reveal>
          ))}
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, color: B.white, margin: "10px 0 18px", letterSpacing: "-0.01em" }}>
          Common <RedWord>questions</RedWord>
        </h2>
        <Reveal style={{ marginBottom: 20 }}>
          <FaqAccordion faqs={FAQS} />
        </Reveal>
        <div style={{ textAlign: "center", padding: "10px 0 10px" }}>
          <a href={CONFIG.shopUrl} target="_blank" rel="noreferrer" className="ml-btn" style={{
            display: "inline-block", background: B.red, color: "#fff", textDecoration: "none",
            fontWeight: 700, fontSize: 15, padding: "15px 32px", borderRadius: 10,
            boxShadow: "0 6px 20px rgba(204,0,0,0.35)",
          }}>Browse the trackers →</a>
        </div>
      </div>
    </div>
  );
}
