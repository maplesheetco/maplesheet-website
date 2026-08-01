import React from "react";
import { B, CONFIG, RESOURCES } from "../data.js";
import { PageHead, RedWord } from "../ui.jsx";

function NewsletterBox() {
  return (
    <div style={{
      background: `linear-gradient(135deg, #2A0A0A, ${B.black2})`, border: `1.5px solid ${B.red}`,
      borderRadius: 18, padding: "clamp(24px, 4vw, 36px)", textAlign: "center", marginTop: 34,
    }}>
      <h3 style={{ fontSize: 22, fontWeight: 800, color: B.white, margin: "0 0 8px" }}>
        Join the <RedWord>MapleSheet</RedWord> newsletter
      </h3>
      <p style={{ color: B.grayLight, fontSize: 14, margin: "0 0 18px", lineHeight: 1.6 }}>
        New trackers, free tools, and Canadian investing guides — straight to your inbox. No spam, unsubscribe anytime.
      </p>
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <div className="ml-embedded" data-form="FeetUf"></div>
      </div>
    </div>
  );
}

export default function Resources() {
  const posts = RESOURCES.filter((r) => r.live !== false);
  const comingSoon = RESOURCES.filter((r) => r.type === "video" && r.live === false);
  return (
    <div className="ml-fade">
      <PageHead kicker="LEARN" title={<>Resources for <RedWord>Canadian investors</RedWord></>}
        sub="Guides, video walkthroughs, and product news. Because understanding your money comes before tracking it." />
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "30px 24px 0" }}>
        {posts.map((r) => (
          <article key={r.title} style={{
            background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18,
            padding: "clamp(22px, 4vw, 32px)", marginBottom: 18,
          }}>
            <div style={{ fontSize: 12, color: B.gray, marginBottom: 8 }}>
              {r.type === "video" ? "🎬 Video" : "📝 Article"} · {r.date}
            </div>
            <h2 style={{ fontSize: 21, fontWeight: 800, color: B.white, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{r.title}</h2>
            {r.image && (
              <img src={r.image} alt={r.title} style={{
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
            {(() => {
              const raw = r.body || r.summary;
              const blocks = Array.isArray(raw) ? raw : [raw];
              return blocks.map((block, i) =>
                block.startsWith("## ") ? (
                  <h3 key={i} style={{ fontSize: 16.5, fontWeight: 700, color: B.white, margin: i === 0 ? "0 0 10px" : "22px 0 10px" }}>
                    {block.slice(3)}
                  </h3>
                ) : (
                  <p key={i} style={{ color: B.grayLight, fontSize: 14.5, lineHeight: 1.75, margin: "0 0 14px" }}>
                    {block}
                  </p>
                )
              );
            })()}
          </article>
        ))}
        {comingSoon.length > 0 && (
          <div style={{
            border: `1px dashed ${B.line}`, borderRadius: 16, padding: "20px 24px",
            color: B.gray, fontSize: 14, textAlign: "center",
          }}>
            🎬 {comingSoon[0].summary} Subscribe on{" "}
            <a href={CONFIG.youtubeUrl} target="_blank" rel="noreferrer" style={{ color: B.red, fontWeight: 600 }}>YouTube</a>{" "}
            to catch it first.
          </div>
        )}
        <NewsletterBox />
      </div>
    </div>
  );
}
