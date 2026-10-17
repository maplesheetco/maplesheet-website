import React from "react";
import { B, CONFIG } from "../data.js";
import { PageHead, RedWord, usePageMeta, Reveal } from "../ui.jsx";

const SECTIONS = [
  {
    h: "Who this applies to",
    body: [
      "This policy covers maplesheet.ca and anything you give us directly through it — buying a tracker, messaging us through the contact form, or signing up for the newsletter. If you bought a MapleSheet tracker through our Etsy shop instead, Etsy collects and handles that purchase information under its own privacy policy, not this one.",
    ],
  },
  {
    h: "What we collect, and why",
    body: [
      "When you buy a tracker directly through maplesheet.ca, Stripe — our payment processor — collects your name, email address, and payment details to process the charge. We never see or store your full card number; Stripe handles that end entirely. What we do receive from Stripe is your email address (and name, if you gave one at checkout), which we use for exactly one purpose: automatically sending you your download links by email, as a backup to the on-screen confirmation page, in case you close the tab before it loads.",
      "If you message us through the Contact page, our form provider (Web3Forms) collects your name, email address, your message, and an optional file attachment, and forwards it to our inbox so we can reply. If you check the newsletter box, we also keep your email address to send you future updates — you can unsubscribe at any time, and we only use it for MapleSheet-related emails, never for anything else.",
      "We also use Google Analytics to understand how visitors use the site — which pages get visited, roughly how people found us, and general device/browser information. This is aggregate usage data; it isn't used to identify you personally.",
    ],
  },
  {
    h: "Payment processing",
    body: [
      "All payments on maplesheet.ca are handled directly by Stripe, a PCI-compliant payment processor. Your card number, expiry, and CVC are entered directly into Stripe's own secure checkout — they never pass through our website or our servers. Stripe's own privacy policy governs how they handle that information.",
    ],
  },
  {
    h: "Cookies & analytics",
    body: [
      "This site uses Google Analytics (GA4), which sets cookies in your browser to track pages visited and general usage patterns. You can block or delete these cookies through your browser's privacy settings, or opt out of Google Analytics specifically using Google's own browser add-on, without affecting your ability to browse the site or buy a tracker.",
    ],
  },
  {
    h: "Who we share information with",
    body: [
      "We don't sell, rent, or trade your personal information to anyone, for any reason. We share it only with the service providers that make the site and checkout work: Stripe (payment processing), Resend (the email service that sends your download links after purchase), Web3Forms (the contact form), and Google Analytics (site usage). Each of these providers has its own privacy policy governing how they handle data on our behalf.",
    ],
  },
  {
    h: "How long we keep it",
    body: [
      "Purchase and delivery emails are kept as long as needed to support you if you ever need your download links resent, and for our own basic business recordkeeping (sales records, tax purposes). Contact form messages are kept as long as needed to resolve your inquiry. If you'd like something deleted sooner, email us and we'll take care of it — see \"Your rights\" below.",
    ],
  },
  {
    h: "Your rights",
    body: [
      "Under Canada's federal privacy law (PIPEDA), you can ask us what personal information we hold about you, ask us to correct it if it's wrong, ask us to delete it, or withdraw consent for things like the newsletter at any time. To do any of these, just email us — we're a small, one-person-run business, so these requests go straight to the founder, not a support queue.",
    ],
  },
  {
    h: "Children's privacy",
    body: [
      "MapleSheet Co.'s products and this website are intended for adults managing their own investments. We don't knowingly collect personal information from children, and our products aren't marketed to or designed for use by minors.",
    ],
  },
  {
    h: "Changes to this policy",
    body: [
      "If we change how we collect or use information, we'll update this page and the \"Last updated\" date below. We won't start using previously collected information in a materially different way without telling you.",
    ],
  },
  {
    h: "Questions",
    body: [
      "If anything here is unclear, or you want to exercise any of the rights above, reach out directly — ",
    ],
    email: true,
  },
];

export default function Privacy() {
  usePageMeta({
    title: "Privacy Policy — MapleSheet Co.",
    description: "What information MapleSheet Co. collects when you buy a tracker or contact us, how it's used, who it's shared with, and your rights under Canadian privacy law.",
  });
  return (
    <div className="ml-fade">
      <PageHead kicker="LEGAL" title={<>Your information,<br /><RedWord>handled plainly.</RedWord></>}
        sub="What we collect when you buy a tracker or get in touch, and what we do — and don't do — with it." />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "26px 24px 60px" }}>
        <Reveal style={{
          background: B.black2, border: `1px solid ${B.line}`, borderRadius: 14,
          padding: "18px 20px", marginBottom: 30, color: B.grayLight, fontSize: 13.5, lineHeight: 1.7,
        }}>
          Last updated: October 2026. This policy applies to maplesheet.ca — purchases made through our
          Etsy shop are covered by Etsy's own privacy policy instead. See also our{" "}
          <a href="/disclaimer" style={{ color: B.redLink, fontWeight: 600, textDecoration: "none" }}>Disclaimer</a>.
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
