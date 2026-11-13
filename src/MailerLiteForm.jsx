import React, { useState, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { B } from "./data.js";

// One shared MailerLite signup form for the whole site (newsletter box and
// the free Goal Tracker). Before this, the newsletter box used MailerLite's
// pasted embed HTML plus their webforms.min.js script. That script only
// wires up forms that already exist when it first loads, so on a React
// single-page site any newsletter box reached by clicking around (instead of
// a fresh page load) fell back to a plain form post with target="_blank" —
// a new tab showing raw {"success":true} and no on-page thank-you. This
// component doesn't depend on that script at all.
//
// How it submits: a real <form> POST to MailerLite's public form endpoint,
// aimed at a hidden iframe on the same page. This is the same mechanism the
// Goal Tracker form already used and was confirmed working with real
// subscribers. The account and form IDs are public by design (they're in
// every MailerLite embed); no API key is used or needed in the browser.
//
// Two details that matter (both learned the hard way on the Goal Tracker):
// 1. The "takel" view beacon. MailerLite seems to ignore subscribe POSTs
//    that have no matching form view, so we record one on mount.
// 2. Don't swap to the thank-you state synchronously in onSubmit. That
//    unmounts the <form> while the browser is sending it, which can cancel
//    the POST. A setTimeout(0) lets the submission go first.
//
// The success state is optimistic: the response lands in a cross-origin
// iframe we can't read, so we show "check your inbox" once the browser has
// accepted a valid email.
const ML_ACCOUNT_ID = "2540563";

export const ML_FORMS = {
  newsletter: "194281571163833632",
  goalTracker: "197636741838931967",
};

export default function MailerLiteForm({
  formId,
  buttonLabel = "Subscribe",
  successMessage = "Thanks! Check your inbox for an email from MapleSheet. 🍁",
  consentText = "By subscribing, you agree to receive emails from MapleSheet Co. about trackers, free tools and Canadian investing guides. Unsubscribe anytime.",
  onSubmitted,
}) {
  const [submitted, setSubmitted] = useState(false);
  const iframeName = "ml-target-" + useId().replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    fetch(`https://assets.mailerlite.com/jsonp/${ML_ACCOUNT_ID}/forms/${formId}/takel`).catch(() => {});
  }, [formId]);

  return (
    <div>
      {/* Hidden submit target — keeps MailerLite's raw JSON response out of view. */}
      <iframe name={iframeName} title="Form submission target" aria-hidden="true" tabIndex={-1} style={{ display: "none" }} />

      {submitted ? (
        <p role="status" style={{ color: B.white, fontSize: 14, fontWeight: 700, margin: 0 }}>
          {successMessage}
        </p>
      ) : (
        <form
          action={`https://assets.mailerlite.com/jsonp/${ML_ACCOUNT_ID}/forms/${formId}/subscribe`}
          method="post"
          target={iframeName}
          onSubmit={() => {
            if (onSubmitted) onSubmitted();
            // Deferred on purpose — see note 2 at the top of this file.
            setTimeout(() => setSubmitted(true), 0);
          }}
          style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}
        >
          <input
            type="email"
            name="fields[email]"
            required
            autoComplete="email"
            aria-label="Email address"
            placeholder="you@email.com"
            style={{
              flex: "1 1 220px", padding: "12px 14px", borderRadius: 8, border: `1px solid ${B.line}`,
              background: B.black, color: B.white, fontSize: 14, outline: "none",
            }}
          />
          <input type="hidden" name="ml-submit" value="1" />
          <input type="hidden" name="anticsrf" value="true" />
          <button
            type="submit"
            style={{
              background: B.red, color: B.white, border: "none", borderRadius: 8, padding: "12px 20px",
              fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            {buttonLabel}
          </button>
        </form>
      )}

      {/* CASL: say who is sending, what they'll get, that they can withdraw
          consent, and link the privacy policy, right next to the button. */}
      <p style={{ color: B.gray, fontSize: 11.5, lineHeight: 1.55, margin: "14px auto 0", maxWidth: 440 }}>
        {consentText}{" "}
        <Link to="/privacy" style={{ color: B.grayLight, textDecoration: "underline" }}>Privacy Policy</Link>
      </p>
    </div>
  );
}
