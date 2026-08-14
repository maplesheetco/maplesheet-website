import React from "react";
import { PageHead, RedWord, usePageMeta } from "../ui.jsx";
import WealthCalculator from "../WealthCalculator.jsx";

export default function FreeTools() {
  usePageMeta({
    title: "Free Canadian Investment Calculators | MapleSheet Co.",
    description: "Free tools to play with TFSA, RRSP, RESP, and compound growth numbers before you buy — built for the Canadian investing system.",
  });
  return (
    <div className="ml-fade">
      <PageHead kicker="FREE TOOLS" title={<>What could your money <RedWord>become?</RedWord></>}
        sub="Four tools in one: Grow, Goal, Compare, and Accounts. Free, interactive, no sign-up." />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 24px 0" }}>
        <WealthCalculator />
      </div>
    </div>
  );
}
