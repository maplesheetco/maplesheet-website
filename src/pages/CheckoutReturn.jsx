import React, { useEffect, useState } from "react";
import { useSearchParams, Link, Navigate } from "react-router-dom";
import { B, PRODUCTS } from "../data.js";
import { PageHead, usePageMeta } from "../ui.jsx";

// Stripe redirects here after the embedded checkout form finishes (success
// OR cancel — both land on this URL). The only thing that proves payment
// actually went through is api/session-status.js reporting status
// "complete" — the presence of a session_id in the URL on its own proves
// nothing, so this page always checks with the server before showing
// anything a non-paying visitor could use.
export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState({ loading: true, status: null, sku: null, email: null, error: null });

  usePageMeta({ title: "Checkout | MapleSheet Co.", description: "Confirming your purchase." });

  useEffect(() => {
    if (!sessionId) {
      setState({ loading: false, status: null, sku: null, email: null, error: "Missing session." });
      return;
    }
    fetch(`/api/session-status?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setState({ loading: false, status: data.status, sku: data.sku, email: data.customerEmail, error: null });
      })
      .catch((err) => setState({ loading: false, status: null, sku: null, email: null, error: err.message }));
  }, [sessionId]);

  if (state.loading) {
    return (
      <div className="ml-fade">
        <PageHead kicker="CHECKOUT" title="Confirming your payment…" />
      </div>
    );
  }

  if (state.status === "open") {
    // Checkout was abandoned or the payment didn't go through — send them
    // back to try again rather than showing a dead end.
    const product = PRODUCTS.find((p) => p.sku === state.sku);
    return <Navigate to={product ? `/checkout/${product.sku}` : "/trackers"} replace />;
  }

  if (state.error || state.status !== "complete") {
    return (
      <div className="ml-fade">
        <PageHead
          kicker="CHECKOUT"
          title="We couldn't confirm that payment"
          sub="If you were charged, email us and we'll sort it out right away."
        />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "10px 24px 60px", textAlign: "center" }}>
          <Link to="/trackers" style={{ color: B.redLink, fontWeight: 600 }}>← Back to all trackers</Link>
        </div>
      </div>
    );
  }

  const product = PRODUCTS.find((p) => p.sku === state.sku);
  const delivery = product?.delivery;

  return (
    <div className="ml-fade">
      <PageHead
        kicker="THANK YOU"
        title="You're all set!"
        sub={state.email ? `A receipt was sent to ${state.email}.` : "Your purchase is confirmed."}
      />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "10px 24px 60px" }}>
        <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18, padding: "clamp(22px, 4vw, 32px)" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: B.white, marginBottom: 16 }}>
            {product ? product.name : "Your tracker"}
          </div>

          {delivery ? (
            <>
              <a
                href={delivery.sheetUrl} target="_blank" rel="noreferrer"
                style={{ display: "block", color: B.redLink, fontWeight: 700, fontSize: 15, marginBottom: 14, textDecoration: "none" }}
              >📄 Open your Google Sheet (make a copy) →</a>
              {delivery.pdfs?.map((pdf, i) => (
                <a
                  key={i} href={pdf.url} target="_blank" rel="noreferrer"
                  style={{ display: "block", color: B.redLink, fontWeight: 600, fontSize: 14, marginBottom: 6, textDecoration: "none" }}
                >📘 {pdf.label} →</a>
              ))}
            </>
          ) : (
            <p style={{ color: B.grayLight, fontSize: 14, lineHeight: 1.6 }}>
              Your payment went through, but we couldn't load your download links automatically.
              Email us at hello@maplesheet.ca with your receipt and we'll send them right over.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
