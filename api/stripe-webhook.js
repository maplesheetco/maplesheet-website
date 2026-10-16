// Vercel serverless function — Stripe webhook endpoint.
//
// This is the SERVER-SIDE backup to the on-site /checkout/return reveal
// page. It fires the instant Stripe confirms a payment, independent of
// whether the buyer's browser ever successfully loads the return page
// (closed tab, flaky connection, ad blocker, etc). The buyer gets their
// download links two ways now: the on-site page, AND this email — whichever
// reaches them first, they're covered.
//
// ─────────────────────────────────────────────────────────────────────────
// ⚠️ Lino — 3 one-time setup steps before this does anything:
//
// 1. Stripe Dashboard → Developers → Webhooks → Add endpoint
//      URL:    https://www.maplesheet.ca/api/stripe-webhook
//      Events: checkout.session.completed
//    Stripe shows you a "Signing secret" (starts with whsec_) — copy it.
//
// 2. Vercel → this project → Settings → Environment Variables, add:
//      STRIPE_WEBHOOK_SECRET = whsec_...        (from step 1)
//      RESEND_API_KEY        = re_...            (from resend.com — sign up,
//                                                  Dashboard → API Keys →
//                                                  Create API Key)
//    (STRIPE_SECRET_KEY should already be set from the existing checkout code.)
//
// 3. Test it before trusting it: Stripe Dashboard → your new webhook
//    endpoint → "Send test webhook" → checkout.session.completed. Check
//    Vercel → Deployments → Functions → stripe-webhook logs for errors.
//    Better test: switch Stripe to test mode, pay with a test card
//    (4242 4242 4242 4242) through the real Buy Button, and confirm the
//    email actually lands in your own inbox.
//
// Once a sending domain is verified in Resend (Resend → Domains — takes a
// few DNS records), change FROM_EMAIL below to an address on your own
// domain. Until then it sends from Resend's shared test address, which
// works but looks less trustworthy to buyers.
// ─────────────────────────────────────────────────────────────────────────

// Needed raw, unparsed request bytes to verify Stripe's signature — if
// Vercel auto-parses the body to JSON first, the signature check fails
// every time (the re-serialized bytes never match what Stripe signed).
export const config = { api: { bodyParser: false } };

import Stripe from "stripe";
import { PRODUCTS } from "../src/data.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SITE_URL = "https://www.maplesheet.ca";
const FROM_EMAIL = "MapleSheet Co. <onboarding@resend.dev>"; // ⚠️ swap once your domain is verified in Resend

// Same pilot-phase fallback as api/session-status.js — only one product
// sells through a Payment Link right now. Keep both files' fallback in
// sync if that changes.
const FALLBACK_SKU = "MS-RRSP-MB";

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Stripe Payment Links collect the buyer's name one of two ways depending
// on how you set it up, and they land in different places on the session:
//   - "Billing address" collection → session.customer_details.name
//   - A custom field (e.g. a text field labeled "Full name") →
//     session.custom_fields[], NOT customer_details.name
// Check both so this works regardless of which one is configured.
function extractName(session) {
  if (session.customer_details?.name) return session.customer_details.name;
  const field = (session.custom_fields || []).find(
    (f) => f.type === "text" && /name/i.test(f.label?.custom || f.key || "")
  );
  return field?.text?.value || null;
}

function buildEmailHtml({ firstName, product }) {
  const pdfRows = (product.delivery?.pdfs || [])
    .map(
      (p) =>
        `<li style="margin-bottom:6px;"><a href="${SITE_URL}${p.url}" style="color:#15614A;">${p.label}</a></li>`
    )
    .join("");

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color:#1A1A1A; line-height:1.5;">
      <h2 style="color:#15614A; margin-bottom: 4px;">Thanks, ${firstName}!</h2>
      <p style="margin-top:0;">Your <b>${product.name}</b> is ready. Here's everything you need:</p>

      <table cellpadding="0" cellspacing="0" style="width:100%; margin: 18px 0;">
        <tr>
          <td style="background:#E9F3EF; border:1px solid #15614A; border-radius:6px; padding:16px; text-align:center;">
            <a href="${product.delivery?.sheetUrl}" style="color:#15614A; font-weight:bold; font-size:15px; text-decoration:none;">
              → Get your Google Sheet (opens &ldquo;Make a copy&rdquo;)
            </a>
          </td>
        </tr>
      </table>

      <p style="margin-bottom:6px;"><b>Your included guides:</b></p>
      <ul style="padding-left:20px; margin-top:0;">${pdfRows}</ul>

      <p style="margin-top:22px;">Questions about setup or anything else — just reply to this email, we're happy to help.</p>
      <p style="color:#8F8F8D; font-size:12px; margin-top:24px;">MapleSheet Co. &middot; ${SITE_URL}</p>
    </div>
  `;
}

async function sendDeliveryEmail({ to, name, product }) {
  if (!process.env.RESEND_API_KEY) {
    console.error("stripe-webhook: RESEND_API_KEY not set — skipping delivery email");
    return;
  }
  const firstName = (name || "").trim().split(" ")[0] || "there";

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      reply_to: "hello@maplesheet.ca",
      subject: `Your ${product.name} — download links inside`,
      html: buildEmailHtml({ firstName, product }),
    }),
  });

  if (!resendRes.ok) {
    const errText = await resendRes.text();
    console.error("stripe-webhook: Resend send failed:", resendRes.status, errText);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("stripe-webhook: signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Note: Stripe retries an event if this endpoint doesn't return 2xx, and
  // may occasionally deliver the same event twice even on success (its own
  // documented at-least-once guarantee). At this volume that just means an
  // occasional duplicate email, not a double charge — nothing here charges
  // anything. Not worth a dedupe store for a one-product pilot; revisit if
  // volume grows.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email;
    const name = extractName(session);
    const sku = session.metadata?.sku || FALLBACK_SKU;
    const product = PRODUCTS.find((p) => p.sku === sku);

    if (email && product?.delivery) {
      try {
        await sendDeliveryEmail({ to: email, name, product });
      } catch (err) {
        // Deliberately don't fail the response over an email error — a
        // non-2xx here makes Stripe retry the *whole* event, and the
        // on-site reveal page is still the buyer's primary path regardless.
        console.error("stripe-webhook: sendDeliveryEmail threw:", err);
      }
    } else {
      console.error(
        "stripe-webhook: missing email or product.delivery — sku:",
        sku,
        "email present:",
        !!email
      );
    }
  }

  return res.status(200).json({ received: true });
}
