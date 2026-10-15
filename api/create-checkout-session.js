// Vercel serverless function — creates a Stripe Checkout Session in
// "embedded_page" ui_mode so payment happens inside an iframe on
// maplesheet.ca itself, not a redirect to a Stripe-hosted page or to
// Payhip. The client (src/pages/Checkout.jsx) calls this with just a SKU
// and gets back a `clientSecret` to mount the embedded form.
//
// Needs STRIPE_SECRET_KEY set as an environment variable in the Vercel
// project (Project Settings → Environment Variables). Never expose this
// key client-side — that's why this lives under /api, not src/.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pilot catalog: only the RRSP Multi-Brokerage Tracker is wired up for
// on-site Stripe checkout right now (see `stripeCheckout: true` in
// src/data.js). The price charged always comes from here, server-side —
// never trust a price sent from the browser. Keep this in sync by hand
// with the matching product's `price` in src/data.js until this grows
// into something that reads data.js directly.
const CATALOG = {
  "MS-RRSP-MB": {
    name: "RRSP Multi-Brokerage Tracker",
    unitAmountCents: 999, // CA$9.99 — keep in sync with data.js
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sku } = req.body || {};
  const product = CATALOG[sku];
  if (!product) {
    return res.status(400).json({ error: "Unknown product" });
  }

  try {
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            unit_amount: product.unitAmountCents,
            product_data: { name: product.name },
          },
          quantity: 1,
        },
      ],
      // Carried through to the return page via session-status.js so it
      // knows which product's delivery links to show.
      metadata: { sku },
      return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return res.status(200).json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return res.status(500).json({ error: "Could not start checkout" });
  }
}
