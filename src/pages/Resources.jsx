import React from "react";
import { Link } from "react-router-dom";
import { B, CONFIG, RESOURCES } from "../data.js";
import { PageHead, RedWord, usePageMeta, Reveal, Picture } from "../ui.jsx";
import { STATIC_META } from "../seo.js";
import { trackNewsletterSubscribed } from "../analytics.js";
import MailerLiteForm, { ML_FORMS } from "../MailerLiteForm.jsx";


export function NewsletterBox({
  sourcePage = "resources",
  heading = <>Join the <RedWord>MapleSheet</RedWord> newsletter</>,
  subtext = "New trackers, free tools, and Canadian investing guides — straight to your inbox. No spam, unsubscribe anytime.",
}) {
  return (
    <div style={{
      background: `linear-gradient(135deg, #2A0A0A, ${B.black2})`, border: `1.5px solid ${B.red}`,
      borderRadius: 18, padding: "clamp(24px, 4vw, 36px)", textAlign: "center", marginTop: 34,
    }}>
      <h3 style={{ fontSize: 22, fontWeight: 800, color: B.white, margin: "0 0 8px" }}>
        {heading}
      </h3>
      <p style={{ color: B.grayLight, fontSize: 14, margin: "0 0 18px", lineHeight: 1.6 }}>
        {subtext}
      </p>
      <MailerLiteForm
        formId={ML_FORMS.newsletter}
        onSubmitted={() => trackNewsletterSubscribed({ sourcePage })}
      />
    </div>
  );
}

export default function Resources() {
  usePageMeta(STATIC_META["/resources"]);
  // An article/video appears automatically once its `date` arrives — no need to
  // flip `live` by hand. `live: false` is still respected as a hard override for
  // content that truly isn't ready yet (e.g. a video with no youtubeId set),
  // even if its scheduled date has already passed.
  const today = new Date();
  const posts = RESOURCES
    .filter((r) => r.live !== false && new Date(r.date) <= today)
    // RESOURCES isn't stored in chronological order (articles get slotted in
    // wherever they're added), so without this sort the cards render in
    // whatever order they happen to sit in the array — newest and oldest
    // interleaved. Sort newest-first by date so the page always reads
    // top-to-bottom in the order things were actually published.
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const comingSoon = RESOURCES.filter((r) => r.type === "video" && r.live === false);
  return (
    <div className="ml-fade">
      <PageHead kicker="LEARN" title={<>Resources for <RedWord>Canadian investors</RedWord></>}
        sub="Guides, video walkthroughs, and product news. Because understanding your money comes before tracking it." />
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "30px 24px 0" }}>
        <div className="ml-res-grid">
        {posts.map((r, i) => (
          <Reveal as="article" key={r.title} delay={Math.min(i * 60, 240)} style={{
            background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18,
            padding: "clamp(22px, 4vw, 32px)", display: "flex", flexDirection: "column",
          }}>
            <div style={{ fontSize: 12, color: B.gray, marginBottom: 8 }}>
              {r.type === "video" ? "🎬 Video" : "📝 Article"} · {r.date}
            </div>
            <h2 style={{ fontSize: 21, fontWeight: 800, color: B.white, margin: "0 0 10px", letterSpacing: "-0.01em" }}>
              {r.type === "article" && r.slug ? (
                <Link to={`/resources/${r.slug}`} style={{ color: "inherit", textDecoration: "none" }}>{r.title}</Link>
              ) : r.title}
            </h2>
            {r.image && (
              <Picture eager={i === 0} src={r.image} alt={r.title} style={{
                width: "100%", borderRadius: 12, marginBottom: 16, display: "block",
                border: `1px solid ${B.line}`, aspectRatio: "1200 / 630", objectFit: "cover",
              }} />
            )}
            {r.type === "video" && r.youtubeId && (
              <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden", marginBottom: 14, border: `1px solid ${B.line}` }}>
                <iframe src={`https://www.youtube-nocookie.com/embed/${r.youtubeId}`} title={r.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen />
              </div>
            )}
            <p style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, margin: "0 0 14px" }}>{r.summary}</p>
            {r.type === "article" && r.slug && (
              <Link to={`/resources/${r.slug}`} style={{ color: B.red, fontWeight: 600, fontSize: 14, marginTop: "auto" }}>
                Read the full guide →
              </Link>
            )}
          </Reveal>
        ))}
        </div>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {comingSoon.length > 0 && (
          <Reveal style={{
            border: `1px dashed ${B.line}`, borderRadius: 16, padding: "20px 24px",
            color: B.gray, fontSize: 14, textAlign: "center",
          }}>
            🎬 {comingSoon[0].summary} Subscribe on{" "}
            <a href={CONFIG.youtubeUrl} target="_blank" rel="noreferrer" style={{ color: B.red, fontWeight: 600 }}>YouTube</a>{" "}
            to catch it first.
          </Reveal>
        )}
        <Reveal>
          <NewsletterBox />
        </Reveal>
        </div>
      </div>
      <style>{`
        .ml-res-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-bottom: 22px; align-items: stretch; }
        @media (max-width: 860px) {
          .ml-res-grid { grid-template-columns: 1fr; gap: 18px; }
        }
      `}</style>
    </div>
  );
}
