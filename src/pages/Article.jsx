import React from "react";
import { useParams, Link } from "react-router-dom";
import { B, RESOURCES } from "../data.js";
import { PageHead, usePageMeta, useJsonLd } from "../ui.jsx";
import { NewsletterBox } from "./Resources.jsx";

// Lightweight inline-markdown renderer: supports **bold**, *italic*, and
// [text](url) links inside a plain paragraph string. Anything else is left
// as-is. This keeps article bodies as simple JS string arrays in data.js
// while still allowing occasional emphasis/links without needing JSX there.
function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) return <strong key={key} style={{ color: B.white }}>{boldMatch[1]}</strong>;
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={key} href={linkMatch[2]} target="_blank" rel="noreferrer" style={{ color: B.red, fontWeight: 600 }}>
          {linkMatch[1]}
        </a>
      );
    }
    const italicMatch = part.match(/^\*([^*]+)\*$/);
    if (italicMatch) return <em key={key}>{italicMatch[1]}</em>;
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

// Renders a single "block" string from article.body. Most blocks are plain
// paragraphs. A block that starts with a special prefix (and may contain
// internal "\n" line breaks) renders as a table, checklist, or bullet list.
function renderBlock(block, i) {
  if (block.startsWith("## ")) {
    return (
      <h2 key={i} style={{ fontSize: 16.5, fontWeight: 700, color: B.white, margin: i === 0 ? "0 0 10px" : "22px 0 10px" }}>
        {block.slice(3)}
      </h2>
    );
  }

  if (block.startsWith("### ")) {
    return (
      <h3 key={i} style={{ fontSize: 14.5, fontWeight: 700, color: B.white, margin: "18px 0 8px" }}>
        {block.slice(4)}
      </h3>
    );
  }

  if (block === "---") {
    return <hr key={i} style={{ border: "none", borderTop: `1px solid ${B.line}`, margin: "18px 0" }} />;
  }

  if (block.startsWith("| ") || block.startsWith("|")) {
    const rows = block.split("\n").filter((r) => r.trim().length > 0 && !/^\|[\s:|-]+\|$/.test(r.trim()));
    const cells = rows.map((r) => r.split("|").map((c) => c.trim()).filter((c) => c.length > 0));
    return (
      <div key={i} style={{ overflowX: "auto", margin: "0 0 14px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <tbody>
            {cells.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const Tag = ri === 0 ? "th" : "td";
                  return (
                    <Tag key={ci} style={{
                      textAlign: "left", padding: "7px 10px", borderBottom: `1px solid ${B.line}`,
                      color: ri === 0 ? B.white : B.grayLight, fontWeight: ri === 0 ? 700 : 400,
                      whiteSpace: "nowrap",
                    }}>
                      {renderInline(cell, `${i}-${ri}-${ci}`)}
                    </Tag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.startsWith("☐ ")) {
    const items = block.split("\n").filter((l) => l.trim().length > 0);
    return (
      <ul key={i} style={{ margin: "0 0 14px", padding: 0, listStyle: "none" }}>
        {items.map((item, ii) => (
          <li key={ii} style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, margin: "0 0 6px" }}>
            {renderInline(item.replace(/^☐\s*/, "☐ "), `${i}-${ii}`)}
          </li>
        ))}
      </ul>
    );
  }

  if (block.startsWith("- ")) {
    const items = block.split("\n").filter((l) => l.trim().length > 0);
    return (
      <ul key={i} style={{ margin: "0 0 14px", paddingLeft: 20 }}>
        {items.map((item, ii) => (
          <li key={ii} style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, margin: "0 0 6px" }}>
            {renderInline(item.replace(/^-\s*/, ""), `${i}-${ii}`)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={i} style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, margin: "0 0 14px" }}>
      {renderInline(block, i)}
    </p>
  );
}

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
  // Article schema — helps Google understand this is a dated, authored guide
  // (not just a generic page), which is what unlocks article-style rich
  // results and better relevance signals for the how-to/informational
  // keywords these guides are meant to rank for.
  useJsonLd(article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: article.image ? `https://www.maplesheet.ca${article.image}` : undefined,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: "MapleSheet Co.", url: "https://www.maplesheet.ca" },
    publisher: {
      "@type": "Organization",
      name: "MapleSheet Co.",
      logo: { "@type": "ImageObject", url: "https://www.maplesheet.ca/logo.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.maplesheet.ca/resources/${article.slug}` },
  } : null, "article-schema");

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
          {blocks.map((block, i) => renderBlock(block, i))}
        </article>
        <NewsletterBox sourcePage="article" />
      </div>
    </div>
  );
}
