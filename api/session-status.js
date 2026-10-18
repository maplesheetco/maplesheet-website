// Vercel serverless function — the return page (src/pages/CheckoutReturn.jsx)
// calls this right after Stripe redirects back with a session_id, to
// confirm server-side that payment actually completed before revealing the
// download links. Never trust the mere presence of a session_id in the URL
// on its own — it has to come back as status "complete" from Stripe.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// A session created from a Stripe Payment Link does NOT automatically
// carry metadata.sku the way api/create-checkout-session.js's hand-built
// sessions do — that only gets set if you add it manually in the Stripe
// Dashboard (Payment Link → ⋯ → Edit → Advanced → Metadata: key "sku",
// value e.g. "MS-RRSP-MB"). Set it on every product's Payment Link before
// going live, or the buyer sees the generic "email us" fallback instead
// of their real download links.
//
// Earlier (pilot, one product only) this guessed a flat FALLBACK_SKU when
// metadata was missing, on the logic that a guess beats nothing. Now that
// a second product (TFSA Multi-Brokerage, MS-TFSA-MB) shares this same
// endpoint, that guess became actively dangerous: a TFSA buyer with
// missing metadata would have been handed the RRSP tracker's download
// links instead of their own — wrong product delivered confidently beats
// no product delivered. Removed. A missing/unmatched sku now passes
// through as-is; CheckoutReturn.jsx already handles `product` being
// undefined by showing the safe "email us" fallback (see its
// `PRODUCTS.find((p) => p.sku === state.sku)` — finds nothing, falls
// through to the generic message) rather than guessing.

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
      sku: session.metadata?.sku || null,
      customerEmail: session.customer_details?.email || null,
    });
  } catch (err) {
    console.error("session-status error:", err);
    return res.status(500).json({ error: "Could not retrieve session" });
  }
}
