import React from "react";
import { PageHead, RedWord, usePageMeta } from "../ui.jsx";
import WealthCalculator from "../WealthCalculator.jsx";
import { NewsletterBox } from "./Resources.jsx";

export default function FreeTools() {
  usePageMeta({
    title: "Free Canadian Investment Calculators | MapleSheet Co.",
    description: "Free tools to play with TFSA, RRSP, RESP, and compound growth numbers before you buy — built for the Canadian investing system.",
  });
  return (
    <div className="ml-fade">
      <PageHead kicker="FREE TOOLS" title={<>What could your money <RedWord>become?</RedWord></>}
        sub="Four tools in one: Grow, Goal, Compare, and Accounts. Free, interactive, no sign-up." />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 24px 60px" }}>
        <WealthCalculator />
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
