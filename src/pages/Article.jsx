import React from "react";
import { useParams, Link } from "react-router-dom";
import { B, RESOURCES } from "../data.js";
import { PageHead, usePageMeta, useJsonLd, Reveal, Picture } from "../ui.jsx";
import { articleMeta } from "../seo.js";
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
      const href = linkMatch[2];
      // Internal links (starting with "/") use react-router's Link so they
      // navigate within the SPA instead of forcing a full page reload —
      // matters for pages like /trackers that guides link back to.
      if (href.startsWith("/")) {
        return (
          <Link key={key} to={href} style={{ color: B.red, fontWeight: 600 }}>
            {linkMatch[1]}
          </Link>
        );
      }
      return (
        <a key={key} href={href} target="_blank" rel="noreferrer" style={{ color: B.red, fontWeight: 600 }}>
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

  usePageMeta(article ? articleMeta(article) : {
    title: "Guide not found | MapleSheet Co.",
    description: "This guide couldn't be found.",
    noindex: true,
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

  // A few other live guides to keep readers on the site once they finish
  // this one — same live/date gate as the main list, newest first, current
  // article excluded.
  const moreGuides = RESOURCES
    .filter((r) => r.type === "article" && r.slug !== article.slug && r.live !== false && new Date(r.date) <= today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="ml-fade">
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "52px 24px 0" }}>
        <Link to="/resources" style={{ color: B.gray, fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
          ← All guides
        </Link>
      </div>
      <PageHead kicker="GUIDE" title={article.title} />
      {/* Two columns on wider screens — article on the left, newsletter +
          More Guides stacked in a sidebar on the right (sidebar sticks while
          scrolling a long guide). Collapses to one column under 860px via
          the .ml-article-grid rule in GlobalStyles, sidebar falling below
          the article in source order. */}
      <div className="ml-article-grid" style={{ maxWidth: 1040, margin: "0 auto", padding: "10px 24px 0" }}>
        <Reveal as="article" style={{
          background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18,
          padding: "clamp(22px, 4vw, 32px)", marginBottom: 18,
        }}>
          <div style={{ fontSize: 12, color: B.gray, marginBottom: 8 }}>
            📝 Article · {article.date}
          </div>
          {article.image && (
            <Picture eager src={article.image} alt={article.title} style={{
              width: "100%", borderRadius: 12, marginBottom: 16, display: "block",
              border: `1px solid ${B.line}`, aspectRatio: "1200 / 630", objectFit: "cover",
            }} />
          )}
          {blocks.map((block, i) => renderBlock(block, i))}
        </Reveal>

        <div className="ml-article-sidebar">
          <Reveal delay={100} style={{ marginBottom: 18 }}>
            <NewsletterBox sourcePage="article" />
          </Reveal>
          {moreGuides.length > 0 && (
            <Reveal delay={150} style={{
              background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18,
              padding: "clamp(20px, 4vw, 28px)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: B.white, marginBottom: 14 }}>
                More Guides
              </div>
              <div
                className="ml-more-guides-list"
                style={{
                  display: "flex", flexDirection: "column", gap: 10, marginBottom: 16,
                  // Cap the height to roughly 5 links' worth of space, then let
                  // the rest scroll — so the sidebar card doesn't grow without
                  // bound as more guides get published, while every guide
                  // (not just the newest 3) stays reachable.
                  maxHeight: 230, overflowY: "auto", paddingRight: 6,
                }}
              >
                {moreGuides.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/resources/${g.slug}`}
                    style={{ color: B.grayLight, fontSize: 14.5, fontWeight: 600, textDecoration: "none", lineHeight: 1.5 }}
                  >
                    {g.title}
                  </Link>
                ))}
              </div>
              <Link to="/resources" style={{ color: B.red, fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
                ← Back to all guides
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
