// Vercel serverless function — the return page (src/pages/CheckoutReturn.jsx)
// calls this right after Stripe redirects back with a session_id, to
// confirm server-side that payment actually completed before revealing the
// download links. Never trust the mere presence of a session_id in the URL
// on its own — it has to come back as status "complete" from Stripe.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
