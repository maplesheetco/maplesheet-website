import React, { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { B, PRODUCTS } from "../data.js";
import { PageHead, usePageMeta } from "../ui.jsx";

// Loaded once, outside the component, per Stripe's own guidance — avoids
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// On-site checkout for the pilot product(s) — see `stripeCheckout: true`
// in data.js. This renders Stripe's embedded Checkout form directly on
// maplesheet.ca (an iframe, not a redirect), so the buyer never leaves the
// site. The actual price charged is decided server-side in
// api/create-checkout-session.js — this page never sends a price.
export default function Checkout() {
  const { sku } = useParams();
  const product = PRODUCTS.find((p) => p.sku === sku && p.stripeCheckout);

  usePageMeta({
    title: product ? `Checkout — ${product.name} | MapleSheet Co.` : "Checkout | MapleSheet Co.",
    description: "Secure checkout, powered by Stripe.",
  });

  const fetchClientSecret = useCallback(() => {
    return fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        return data.clientSecret;
      });
  }, [sku]);

  if (!product) {
    return (
      <div className="ml-fade">
        <PageHead kicker="CHECKOUT" title="Checkout not available" />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "10px 24px 60px", textAlign: "center" }}>
          <Link to="/trackers" style={{ color: B.redLink, fontWeight: 600 }}>← Back to all trackers</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-fade">
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 24px 0" }}>
        <Link
          to={product.slug ? `/trackers/${product.slug}` : "/trackers"}
          style={{ color: B.gray, fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}
        >← Back</Link>
      </div>
      <PageHead kicker="CHECKOUT" title={product.name} sub={`CA$${product.price.toFixed(2)} — one-time purchase, no subscription`} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "10px 24px 60px" }}>
        <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: `1px solid ${B.line}` }}>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
        <p style={{ textAlign: "center", color: B.gray, fontSize: 12.5, marginTop: 14 }}>
          🔒 Payment processed securely by Stripe. MapleSheet Co. never sees your card details.
        </p>
      </div>
    </div>
  );
}
