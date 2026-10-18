import React from "react";
import { Link } from "react-router-dom";
import { B } from "../data.js";
import { PageHead, RedWord, usePageMeta } from "../ui.jsx";
import { NOT_FOUND_META } from "../seo.js";

// Shown for any URL that isn't a real page (typos, old links). Previously
// these rendered the full homepage, which Google reports as a "soft 404".
// The prerender step also copies this page's meta into dist/404.html, which
// Vercel serves with a real 404 status code.
export default function NotFound() {
  usePageMeta({ ...NOT_FOUND_META, noindex: true });
  const linkStyle = {
    display: "inline-block", textDecoration: "none", fontWeight: 700, fontSize: 15,
    padding: "14px 28px", borderRadius: 10,
  };
  return (
    <div className="ml-fade">
      <PageHead kicker="404" title={<>This page <RedWord>doesn't exist.</RedWord></>}
        sub="The link may be old or mistyped. Here's where most people are headed:" />
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: "22px 24px 90px" }}>
        <Link to="/trackers" className="ml-btn" style={{ ...linkStyle, background: B.red, color: "#fff", boxShadow: "0 6px 20px rgba(204,0,0,0.35)" }}>
          Browse the trackers
        </Link>
        <Link to="/resources" className="ml-btn" style={{ ...linkStyle, color: B.white, border: `1.5px solid ${B.line}` }}>
          Read the guides
        </Link>
        <Link to="/" className="ml-btn" style={{ ...linkStyle, color: B.white, border: `1.5px solid ${B.line}` }}>
          Home
        </Link>
      </div>
    </div>
  );
}
