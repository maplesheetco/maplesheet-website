// src/analytics.js
// Centralized GA4 event tracking for MapleSheet Co.
//
// Source of truth: .telemetry/tracking-plan.yaml — if the plan changes,
// update it there first, then reflect the change here and in
// .telemetry/instrument.md.
//
// No identify() or group() calls exist in this module on purpose: this site
// has no login (pure anonymous visitors) and no accounts/groups, so neither
// applies. See .telemetry/instrument.md "Identity" section for why.

/**
 * Central registry of GA4 event names. Never pass a raw string to
 * window.gtag() — always reference these constants.
 */
export const EVENTS = {
  TRACKER_BUY_CLICKED: "tracker_buy_clicked",
  CALCULATOR_TOOL_USED: "calculator_tool_used",
  NEWSLETTER_SUBSCRIBED: "newsletter_subscribed",
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
};

/**
 * True once gtag.js has loaded and attached window.gtag. False in dev
 * environments without the script, or if an ad blocker strips it.
 */
function gtagAvailable() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

function send(eventName, params = {}) {
  if (!gtagAvailable()) return; // no-op — analytics must never block a user action
  window.gtag("event", eventName, params);
}

/**
 * Fired when a visitor clicks through to buy a tracker, via either the
 * Etsy listing or the "Buy Direct" (Payhip) button. The primary value
 * action for this site — checkout itself happens off-platform, so this
 * click is the closest on-site signal to a sale.
 *
 * @category core_value
 * @param {Object} props
 * @param {string} props.productName - e.g. "RRSP Tracker"
 * @param {"TFSA"|"RRSP"|"RESP"|"FHSA"|"Margin"|"Combo"|"Flagship"} props.productTag
 * @param {number} props.priceCad
 * @param {"etsy"|"direct"} props.checkoutDestination
 * @param {"home_featured"|"trackers_catalog"} props.sourceSection
 */
export function trackBuyClicked({ productName, productTag, priceCad, checkoutDestination, sourceSection }) {
  send(EVENTS.TRACKER_BUY_CLICKED, {
    product_name: productName,
    product_tag: productTag,
    price_cad: priceCad,
    checkout_destination: checkoutDestination,
    source_section: sourceSection,
  });
}

/**
 * Fired when a visitor switches to one of the four WealthCalculator tools
 * (Grow / Goal / Compare / Accounts) on the /tools page. A pre-purchase
 * intent signal — this is the site's main lead magnet.
 *
 * @category core_value
 * @param {Object} props
 * @param {"grow"|"goal"|"compare"|"accounts"} props.tool
 */
export function trackCalculatorToolUsed({ tool }) {
  send(EVENTS.CALCULATOR_TOOL_USED, { tool });
}

/**
 * Fired on a successful MailerLite newsletter embed submission.
 *
 * @category lifecycle
 * @param {Object} props
 * @param {"resources"|"article"} props.sourcePage
 */
export function trackNewsletterSubscribed({ sourcePage }) {
  send(EVENTS.NEWSLETTER_SUBSCRIBED, { source_page: sourcePage });
}

/**
 * Fired on a successful contact form submission (FormSubmit). No message
 * content or contact details are sent as properties — pii_policy is
 * 'none' in the tracking plan.
 *
 * @category configuration
 */
export function trackContactFormSubmitted() {
  send(EVENTS.CONTACT_FORM_SUBMITTED, {});
}
