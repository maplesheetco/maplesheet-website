// Vercel serverless function — the return page (src/pages/CheckoutReturn.jsx)
// calls this right after Stripe redirects back with a session_id, to
// confirm server-side that payment actually completed before revealing the
// download links. Never trust the mere presence of a session_id in the URL
// on its own — it has to come back as status "complete" from Stripe.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pilot note: right now exactly one product sells through a Stripe Buy
// Button / Payment Link (RRSP Multi-Brokerage Tracker, sku MS-RRSP-MB).
// A session created from a Payment Link does NOT automatically carry
// metadata.sku the way api/create-checkout-session.js's hand-built
// sessions do — that only gets set if you add it manually in the Stripe
// Dashboard (Payment Link → ⋯ → Edit → Advanced → Metadata: key "sku",
// value "MS-RRSP-MB"). If that metadata is missing, CheckoutReturn.jsx
// can't match the session back to a product in data.js and the buyer
// sees the generic "email us" fallback instead of their real download
// links — so this falls back to the one pilot SKU below rather than
// leaving a paying customer with nothing.
//
// Before a second product goes live on a Payment Link / Buy Button,
// either (a) set metadata.sku on every new Payment Link in the Stripe
// Dashboard so this never needs to guess, or (b) replace this flat
// fallback with a real price-ID → sku lookup (expand `line_items` on the
// retrieve call below and map `line_items.data[0].price.id`).
const FALLBACK_SKU = "MS-RRSP-MB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return res.status(200).json({
      status: session.status, // "open" | "complete" | "expired"
      sku: session.metadata?.sku || FALLBACK_SKU,
      customerEmail: session.customer_details?.email || null,
    });
  } catch (err) {
    console.error("session-status error:", err);
    return res.status(500).json({ error: "Could not retrieve session" });
  }
}
