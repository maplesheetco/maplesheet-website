import React from "react";
import { B, CONFIG } from "../data.js";
import { PageHead, RedWord } from "../ui.jsx";

export default function FreeTools() {
  return (
    <div className="ml-fade">
      <PageHead kicker="FREE TOOLS" title={<>Learn by <RedWord>playing</RedWord> with the numbers.</>}
        sub="Free, interactive, no sign-up. Because you should see what steady investing becomes before you spend a dollar." />
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "30px 24px 0" }}>
        <div style={{
          background: `linear-gradient(135deg, ${B.black2}, ${B.black3})`, border: `1px solid ${B.line}`,
          borderRadius: 20, padding: "clamp(26px, 5vw, 40px)",
        }}>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", color: B.red, fontWeight: 700, marginBottom: 10 }}>WEALTH CALCULATOR</div>
          <h2 style={{ fontSize: "clamp(22px, 3.6vw, 30px)", fontWeight: 800, margin: "0 0 12px", color: B.white, letterSpacing: "-0.02em" }}>
            The MapleSheet Wealth Calculator
          </h2>
          <p style={{ color: B.grayLight, fontSize: 15, lineHeight: 1.7, margin: "0 0 8px" }}>
            Four tools in one: <strong style={{ color: B.white }}>Grow</strong> (what your contributions become, with milestone flags and the famous
            crossover year), <strong style={{ color: B.white }}>Goal</strong> (work backwards from a target), <strong style={{ color: B.white }}>Compare</strong> (what
            waiting 10 years really costs), and <strong style={{ color: B.white }}>Accounts</strong> (TFSA vs RRSP vs Margin, after tax).
          </p>
          <p style={{ color: B.grayLight, fontSize: 14, lineHeight: 1.65, margin: "0 0 24px" }}>
            Try the classic: $50/month for 30 years at 10% → <strong style={{ color: B.red }}>$113,024</strong> — from just $18,000 of your own money.
          </p>
          <a href={CONFIG.calcUrl} target="_blank" rel="noreferrer" className="ml-btn" style={{
            display: "inline-block", background: B.red, color: "#fff", textDecoration: "none",
            fontWeight: 700, fontSize: 15, padding: "14px 28px", borderRadius: 10,
            boxShadow: "0 6px 20px rgba(204,0,0,0.35)",
          }}>Open the calculator →</a>
          <div style={{ fontSize: 12.5, color: B.gray, marginTop: 14 }}>Opens in a new tab · works on mobile · nothing to install</div>
        </div>
        <div style={{
          marginTop: 18, background: B.black2, border: `1px dashed ${B.line}`, borderRadius: 16,
          padding: "22px 24px", textAlign: "center", color: B.grayLight, fontSize: 14,
        }}>
          More free tools are on the way — TFSA room checker, dividend income planner, and more.
          Suggest one at <a href={`mailto:${CONFIG.email}`} style={{ color: B.red, fontWeight: 600 }}>{CONFIG.email}</a> 🍁
        </div>
      </div>
    </div>
  );
}
