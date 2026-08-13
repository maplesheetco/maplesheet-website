import React from "react";
import { useParams, Link } from "react-router-dom";
import { B, RESOURCES } from "../data.js";
import { PageHead, usePageMeta } from "../ui.jsx";
import { NewsletterBox } from "./Resources.jsx";

export default function Article() {
  const { slug } = useParams();
  // Same auto-publish gate as the Resources index: a slug only resolves once
  // its scheduled date arrives, so linking/sharing a draft early doesn't work.
  const today = new Date();
  const article = RESOURCES.find(
    (r) => r.type === "article" && r.slug === slug && r.live !== false && new Date(r.date) <= today
  );

  usePageMeta({
    title: article ? `${article.title} | MapleSheet Co.` : "Guide not found | MapleSheet Co.",
    description: article ? article.summary : "This guide couldn't be found.",
  });

  if (!article) {
    return (
      <div className="ml-fade">
        <PageHead kicker="RESOURCES" title="Guide not found" />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "10px 24px 60px", textAlign: "center" }}>
          <Link to="/resources" style={{ color: B.red, fontWeight: 600 }}>← Back to all guides</Link>
        </div>
      </div>
    );
  }

  const raw = article.body || article.summary;
  const blocks = Array.isArray(raw) ? raw : [raw];

  return (
    <div className="ml-fade">
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "52px 24px 0" }}>
        <Link to="/resources" style={{ color: B.gray, fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
          ← All guides
        </Link>
      </div>
      <PageHead kicker="GUIDE" title={article.title} />
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "10px 24px 0" }}>
        <article style={{
          background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18,
          padding: "clamp(22px, 4vw, 32px)", marginBottom: 18,
        }}>
          <div style={{ fontSize: 12, color: B.gray, marginBottom: 8 }}>
            📝 Article · {article.date}
          </div>
          {article.image && (
            <img src={article.image} alt={article.title} style={{
              width: "100%", borderRadius: 12, marginBottom: 16, display: "block",
              border: `1px solid ${B.line}`, aspectRatio: "1200 / 630", objectFit: "cover",
            }} />
          )}
          {blocks.map((block, i) =>
            block.startsWith("## ") ? (
              <h2 key={i} style={{ fontSize: 16.5, fontWeight: 700, color: B.white, margin: i === 0 ? "0 0 10px" : "22px 0 10px" }}>
                {block.slice(3)}
              </h2>
            ) : (
              <p key={i} style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, margin: "0 0 14px" }}>
                {block}
              </p>
            )
          )}
        </article>
        <NewsletterBox />
      </div>
    </div>
  );
}
