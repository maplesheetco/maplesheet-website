import React, { useState } from "react";
import { B, CONFIG, FAQS } from "../data.js";
import { PageHead, RedWord, usePageMeta } from "../ui.jsx";

export default function About() {
  usePageMeta({
    title: "About MapleSheet Co. — Built by a Canadian, for Canadians",
    description: "Why MapleSheet Co. exists: investment trackers built for the CRA system from the ground up, not adapted from American spreadsheets. Meet the founder.",
  });
  const [open, setOpen] = useState(null);
  return (
    <div className="ml-fade">
      <PageHead kicker="THE STORY" title={<>"Too complicated. Too American.<br /><RedWord>So I built my own."</RedWord></>} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "26px 24px 0" }}>
        <div style={{ color: B.grayLight, fontSize: 15.5, lineHeight: 1.8 }}>
          <p>Hi, I'm Lino — a Canadian investor based in British Columbia who got tired of tools that didn't speak our language.
          Every tracker I tried had no TFSA contribution room, no RRSP limits, no CESG grants, no CRA rules.
          Just generic American spreadsheets with a maple leaf slapped on, if that.</p>
          <p>So I built a tracker for my own TFSA and RRSP. Then friends wanted copies. Then family wanted copies.
          Then friends of family. That's how MapleSheet Co. was born — every tracker built from scratch,
          tested on real Canadian portfolio data, no shortcuts.</p>
          <p>Today there are 13 trackers covering every Canadian account type — TFSA, RRSP, RESP, FHSA, Margin,
          and every practical combination — each with live prices, automatic ACB, and the actual CRA rules built in.</p>
          <p style={{ color: B.white, fontWeight: 600 }}>
            And one promise that will never change: every buyer gets personal support. No bots. No auto-replies. Just me. — Lino 🍁
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, margin: "34px 0" }}>
          {[
            ["📈 Live prices", "GOOGLEFINANCE-powered quotes, CAD & USD with automatic conversion"],
            ["🧮 Automatic ACB", "Adjusted cost base and capital gains calculated the CRA way"],
            ["🇨🇦 CRA rules built in", "Contribution room, CESG grants, Line 208, Line 20805 — the real rules"],
            ["💰 One-time purchase", "No subscription. Instant download. Yours forever, with personal support"],
          ].map(([t, d]) => (
            <div key={t} style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5, color: B.white }}>{t}</div>
              <div style={{ color: B.grayLight, fontSize: 13.5, lineHeight: 1.55 }}>{d}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, color: B.white, margin: "10px 0 18px", letterSpacing: "-0.01em" }}>
          Common <RedWord>questions</RedWord>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {FAQS.map(([q, a], i) => (
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
