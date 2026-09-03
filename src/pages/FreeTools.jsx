import React from "react";
import { PageHead, RedWord, usePageMeta } from "../ui.jsx";
import { B } from "../data.js";
import WealthCalculator from "../WealthCalculator.jsx";
import { TfsaRoomCalculator, AcbCalculator } from "../FreeCalculators.jsx";
import { NewsletterBox } from "./Resources.jsx";

function ToolSection({ eyebrow, title, sub, children }) {
  return (
    <section style={{ marginTop: 56 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: B.redLink, fontWeight: 700, marginBottom: 6 }}>{eyebrow}</div>
        <h2 style={{ fontSize: "clamp(20px, 3.4vw, 26px)", fontWeight: 800, color: B.white, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{title}</h2>
        <p style={{ fontSize: 14, color: B.grayLight, margin: 0, maxWidth: 640, lineHeight: 1.6 }}>{sub}</p>
      </div>
      {children}
    </section>
  );
}

export default function FreeTools() {
  usePageMeta({
    title: "Free Canadian Investment Calculators | MapleSheet Co.",
    description: "Free tools to play with TFSA, RRSP, RESP, ACB, and compound growth numbers before you buy — built for the Canadian investing system.",
  });
  return (
    <div className="ml-fade">
      <PageHead kicker="FREE TOOLS" title={<>What could your money <RedWord>become?</RedWord></>}
        sub="Six free tools: the Grow, Goal, Compare, and Accounts calculator below, plus a TFSA Contribution Room Calculator and a Simple ACB Calculator. All free, interactive, no sign-up." />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 24px 60px" }}>
        <WealthCalculator />

        <ToolSection
          eyebrow="ALSO FREE"
          title="TFSA Contribution Room Calculator"
          sub="Your real room isn't just this year's annual limit — it's the sum of every year you've been eligible, plus past withdrawals, minus what you've already put in. Estimate yours below."
        >
          <TfsaRoomCalculator />
        </ToolSection>

        <ToolSection
          eyebrow="ALSO FREE"
          title="Simple ACB Calculator"
          sub="Track a series of buys and sells for one non-registered holding and see your running adjusted cost base, current position, and realized capital gain — the same average-cost method the CRA expects."
        >
          <AcbCalculator />
        </ToolSection>

        {/* The calculator itself stays free and sign-up-free, matching the promise
            in the page header above — this is a separate, optional newsletter
            opt-in placed after someone's already gotten value from the tool,
            not a gate in front of it. sourcePage="free_tools" lets this page's
            subscribe rate show up distinctly from the Resources/Article boxes. */}
        <NewsletterBox
          sourcePage="free_tools"
          heading={<>Want more free tools like this?</>}
          subtext="New calculators, trackers, and Canadian investing guides — straight to your inbox. No spam, unsubscribe anytime."
        />
      </div>
    </div>
  );
}
