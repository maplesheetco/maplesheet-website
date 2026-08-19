import React, { useState } from "react";
import { B, CONFIG } from "../data.js";
import { PageHead, RedWord, usePageMeta } from "../ui.jsx";
import { trackContactFormSubmitted } from "../analytics.js";

export default function Contact() {
  usePageMeta({
    title: "Contact MapleSheet Co.",
    description: "Questions about a tracker, a bug, or a bulk order? Reach MapleSheet Co. directly — real answers from a real person, no support ticket queue.",
  });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const keyMissing = CONFIG.web3formsKey.startsWith("PASTE_");
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setStatus("idle"); };
  const submit = async () => {
    if (!form.name || !form.email.includes("@") || !form.message) { setStatus("invalid"); return; }
    if (keyMissing) { setStatus("nokey"); return; }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: CONFIG.web3formsKey,
          subject: `🍁 Website message from ${form.name}`,
          from_name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) trackContactFormSubmitted();
      setStatus(data.success ? "done" : "error");
    } catch { setStatus("error"); }
  };
  return (
    <div className="ml-fade">
      <PageHead kicker="CONTACT" title={<>Talk to a <RedWord>human</RedWord>. That's me.</>}
        sub="Questions before buying, help with a tracker, or an idea for a new product — I answer everything personally." />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "30px 24px 0" }}>
        <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18, padding: "clamp(22px, 4vw, 32px)" }}>
          {status === "done" ? (
            <div className="ml-fade" style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🍁</div>
              <div style={{ color: B.white, fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Message sent!</div>
              <div style={{ color: B.grayLight, fontSize: 14 }}>I usually reply within a day. — Lino</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input className="ml-input" placeholder="Your name" value={form.name} onChange={set("name")} aria-label="Name" />
              <input className="ml-input" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} aria-label="Email" />
              <textarea className="ml-input" placeholder="How can I help?" rows={6} value={form.message} onChange={set("message")}
                style={{ resize: "vertical" }} aria-label="Message" />
              <button onClick={submit} disabled={status === "sending"} className="ml-btn" style={{
                background: B.red, color: "#fff", border: "none", fontWeight: 700, fontSize: 15,
                padding: "14px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              }}>{status === "sending" ? "Sending…" : "Send message"}</button>
              {status === "invalid" && <div style={{ color: B.yellow, fontSize: 13 }}>Please fill in all three fields with a valid email.</div>}
              {status === "error" && <div style={{ color: B.yellow, fontSize: 13 }}>Something went wrong — please email us directly below.</div>}
              {status === "nokey" && <div style={{ color: B.yellow, fontSize: 13 }}>The form goes live shortly — meanwhile, email us directly below. 🍁</div>}
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 22, color: B.grayLight, fontSize: 14.5 }}>
          Prefer email? Write to{" "}
          <a href={`mailto:${CONFIG.email}`} style={{ color: B.red, fontWeight: 700, textDecoration: "none" }}>{CONFIG.email}</a>
          <div style={{ fontSize: 13, color: B.gray, marginTop: 8 }}>MapleSheet Co. · British Columbia, Canada</div>
        </div>
      </div>
    </div>
  );
}
