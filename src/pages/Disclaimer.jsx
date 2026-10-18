import React from "react";
import { B, CONFIG } from "../data.js";
import { PageHead, RedWord, usePageMeta, Reveal } from "../ui.jsx";
import { STATIC_META } from "../seo.js";

const SECTIONS = [
  {
    h: "Not financial, tax, or legal advice",
    body: [
      "Everything MapleSheet Co. sells — the Google Sheets trackers, the PDF guides, the free tools, and the content on this site — is provided for educational and informational purposes only. None of it is financial, investment, tax, accounting, or legal advice, and nothing here creates an advisor-client, accountant-client, or lawyer-client relationship between you and MapleSheet Co. or its founder.",
      "The trackers are record-keeping and organization tools. They help you see what you've contributed, what you own, and how it's performing — they don't tell you what to buy, what to sell, or how to file your taxes. Decisions about your investments, your contribution room, or your tax return are yours to make, and we'd recommend making them with a licensed financial advisor, accountant, or tax professional where it matters.",
    ],
  },
  {
    h: "Canadian tax and contribution rules change",
    body: [
      "TFSA, RRSP, RESP, FHSA, and Margin account rules — contribution limits, CESG grant rates, withholding tax rates, and CRA line numbers — are set by the federal government and can change with each budget. Every figure built into a MapleSheet tracker or guide reflects the rules as of the date that product was last updated, which is stated on the relevant guide PDF.",
      "Always confirm your personal contribution room, deduction limit, and CESG eligibility directly through CRA My Account, your Notice of Assessment, or a licensed tax professional before making a contribution or filing decision. A spreadsheet is only as current as the numbers you — or we — put into it.",
    ],
  },
  {
    h: "Accuracy of calculations",
    body: [
      "We build and test every formula in a MapleSheet tracker carefully, and we fix mistakes when they're found. Even so, spreadsheets can break — a cell gets overwritten, a formula gets copied wrong, a ticker symbol isn't recognized by GOOGLEFINANCE — and we can't guarantee that every number a tracker shows you is correct at all times.",
      "Before relying on any figure for a real financial or tax decision — your actual adjusted cost base, your actual capital gain, your actual CESG room — double-check it against your brokerage statements, your Notice of Assessment, or a professional. MapleSheet Co. is not responsible for decisions made, or losses incurred, based on a number a tracker displayed.",
    ],
  },
  {
    h: "Live price data",
    body: [
      "Market prices inside MapleSheet trackers are pulled using Google Sheets' built-in GOOGLEFINANCE function. This data can be delayed, temporarily unavailable, or occasionally wrong — it's provided by Google, not by MapleSheet Co., and we have no control over its accuracy or uptime. Don't use a tracker's live price as the basis for a real-time trading decision; check your brokerage's own quote first.",
    ],
  },
  {
    h: "No investment recommendations",
    body: [
      "Any ETF, stock, or account type mentioned in a MapleSheet guide — for example, which investments tend to suit a TFSA versus an RRSP — is a general, educational illustration of how Canadian tax rules work, not a recommendation to buy, sell, or hold any specific security. Past performance of any investment, index, or sample portfolio shown in our marketing material is not indicative of future results.",
    ],
  },
  {
    h: "Affiliate and referral links",
    body: [
      "Some links on this site — including our Wealthsimple and Questrade links — are referral or affiliate links. If you sign up through one, MapleSheet Co. may receive a referral benefit at no additional cost to you. We only link to platforms we'd genuinely recommend to a Canadian investor, but you should still do your own research and compare options before opening any account.",
    ],
  },
  {
    h: "Trademarks",
    body: [
      "Google Sheets, Google Drive, and GOOGLEFINANCE are trademarks of Google LLC. Etsy is a trademark of Etsy, Inc. Stripe is a trademark of Stripe, Inc. MapleSheet Co. is an independent business and is not affiliated with, endorsed by, or sponsored by Google, Etsy, or Stripe.",
    ],
  },
  {
    h: "Intellectual property & license to use",
    body: [
      "When you purchase a MapleSheet tracker, you're buying a license for your own personal (or your household's) use — to copy it to your own Google Drive and track your own investments. The spreadsheet design, formulas, Apps Script code, and PDF guides remain the intellectual property of MapleSheet Co. Reselling, redistributing, or publicly sharing a MapleSheet tracker or guide, in whole or in part, isn't permitted without our written permission.",
    ],
  },
  {
    h: "Limitation of liability",
    body: [
      "To the fullest extent permitted by law, MapleSheet Co. and its founder are not liable for any direct, indirect, incidental, or consequential loss or damage arising from your use of — or inability to use — a MapleSheet tracker, guide, free tool, or this website, including losses related to investment decisions, missed contribution room, or tax filings. Your use of our products is at your own discretion and risk.",
    ],
  },
  {
    h: "Governing law",
    body: [
      "This disclaimer, and your use of maplesheet.ca and MapleSheet Co.'s products, is governed by the laws of the Province of British Columbia and the federal laws of Canada applicable within it.",
    ],
  },
  {
    h: "Questions",
    body: [
      "If anything here is unclear, or you have a question about a specific tracker, reach out directly — ",
    ],
    email: true,
  },
];

export default function Disclaimer() {
  usePageMeta(STATIC_META["/disclaimer"]);
  return (
    <div className="ml-fade">
      <PageHead kicker="LEGAL" title={<>Not advice.<br /><RedWord>Just a better spreadsheet.</RedWord></>}
        sub="MapleSheet Co. trackers are record-keeping and educational tools — here's exactly what that does and doesn't mean." />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "26px 24px 60px" }}>
        <Reveal style={{
          background: B.black2, border: `1px solid ${B.line}`, borderRadius: 14,
          padding: "18px 20px", marginBottom: 30, color: B.grayLight, fontSize: 13.5, lineHeight: 1.7,
        }}>
          Last updated: October 2026. This disclaimer applies to maplesheet.ca and every MapleSheet Co.
          tracker, PDF guide, and free tool, however you purchased it — directly through this site, or
          through our Etsy shop.
        </Reveal>

        {SECTIONS.map((s, i) => (
          <Reveal key={s.h} delay={i * 40} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: B.white, margin: "0 0 10px", letterSpacing: "-0.01em" }}>
              {s.h}
            </h2>
            {s.body.map((p, j) => (
              <p key={j} style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, margin: "0 0 10px" }}>
                {p}
                {s.email && j === s.body.length - 1 ? (
                  <a href={`mailto:${CONFIG.email}`} style={{ color: B.redLink, fontWeight: 600, textDecoration: "none" }}>
                    {CONFIG.email}
                  </a>
                ) : null}
                {s.email && j === s.body.length - 1 ? ". No bots, no auto-replies — just the founder." : null}
              </p>
            ))}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
