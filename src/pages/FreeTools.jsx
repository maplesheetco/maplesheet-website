import React from "react";
import { PageHead, RedWord, usePageMeta, Reveal } from "../ui.jsx";
import { B } from "../data.js";
import WealthCalculator from "../WealthCalculator.jsx";
import { TfsaRoomCalculator, AcbCalculator } from "../FreeCalculators.jsx";
import { NewsletterBox } from "./Resources.jsx";
import { trackGoalTrackerRequested } from "../analytics.js";
import { STATIC_META } from "../seo.js";
import MailerLiteForm, { ML_FORMS } from "../MailerLiteForm.jsx";

function ToolSection({ eyebrow, title, sub, children }) {
  return (
    <Reveal as="section" style={{ marginTop: 56 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: B.redLink, fontWeight: 700, marginBottom: 6 }}>{eyebrow}</div>
        <h2 style={{ fontSize: "clamp(20px, 3.4vw, 26px)", fontWeight: 800, color: B.white, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{title}</h2>
        <p style={{ fontSize: 14, color: B.grayLight, margin: 0, maxWidth: 640, lineHeight: 1.6 }}>{sub}</p>
      </div>
      {children}
    </Reveal>
  );
}

// Unlike the calculators above, this one isn't sign-up-free — it's a
// spreadsheet, not an interactive on-page tool, so the only way to "use" it
// is to have your own copy. Email gets a link to a Google Sheet you make
// your own copy of. It uses its own MailerLite form/group ("Goal Tracker
// Leads") so these leads don't mix with newsletter subscribers. See
// MailerLiteForm.jsx for how the submission works.
function GoalTrackerGate() {
  return (
    <div style={{
      background: `linear-gradient(135deg, #2A0A0A, ${B.black2})`, border: `1.5px solid ${B.red}`,
      borderRadius: 18, padding: "clamp(24px, 4vw, 36px)", textAlign: "center",
    }}>
      <h3 style={{ fontSize: 22, fontWeight: 800, color: B.white, margin: "0 0 8px" }}>
        Get the Free Goal Tracker
      </h3>
      <p style={{ color: B.grayLight, fontSize: 14, margin: "0 auto 18px", lineHeight: 1.6, maxWidth: 460 }}>
        A two-tab Google Sheet — set a goal, log deposits, and watch a live dashboard and progress chart update on their own. Enter your email and we'll send your copy.
      </p>
      <MailerLiteForm
        formId={ML_FORMS.goalTracker}
        buttonLabel="Send Me the Tracker"
        successMessage="Check your inbox — your Goal Tracker link is on its way. 🍁"
        consentText="We'll email you your Goal Tracker link from MapleSheet Co. Unsubscribe anytime."
        onSubmitted={() => trackGoalTrackerRequested({ sourcePage: "free_tools" })}
      />
    </div>
  );
}

export default function FreeTools() {
  usePageMeta(STATIC_META["/tools"]);
  return (
    <div className="ml-fade">
      <PageHead kicker="FREE TOOLS" title={<>What could your money <RedWord>become?</RedWord></>}
        sub="Six free, interactive calculators below — no sign-up. Plus a free Goal Tracker spreadsheet we'll email you a copy of." />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 24px 60px" }}>
        <Reveal>
          <WealthCalculator />
        </Reveal>

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

        <ToolSection
          eyebrow="NEW"
          title="Free Goal Tracker"
          sub="A dedicated spreadsheet for one savings goal — an emergency fund, a trip, a down payment. Two tabs, a live dashboard, two charts. This one's a Google Sheet we email you a copy of, not an on-page calculator."
        >
          <GoalTrackerGate />
        </ToolSection>

        {/* The calculator itself stays free and sign-up-free, matching the promise
            in the page header above — this is a separate, optional newsletter
            opt-in placed after someone's already gotten value from the tool,
            not a gate in front of it. sourcePage="free_tools" lets this page's
            subscribe rate show up distinctly from the Resources/Article boxes. */}
        <Reveal delay={100}>
          <NewsletterBox
            sourcePage="free_tools"
            heading={<>Want more free tools like this?</>}
            subtext="New calculators, trackers, and Canadian investing guides — straight to your inbox. No spam, unsubscribe anytime."
          />
        </Reveal>
      </div>
    </div>
  );
}
