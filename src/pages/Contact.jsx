import React, { useState, useRef, useEffect } from "react";
import { B, CONFIG } from "../data.js";
import { PageHead, RedWord, usePageMeta } from "../ui.jsx";
import { trackContactFormSubmitted } from "../analytics.js";

const SITE_URL = "https://www.maplesheet.ca";
const MAX_FILE_BYTES = 10 * 1024 * 1024; // FormSubmit's combined-attachment limit is 10MB

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// This form posts as a REAL <form> (not a JS fetch) straight to FormSubmit —
// that's the only officially-supported way to send a file attachment, since
// file uploads need a true multipart/form-data POST. FormSubmit then redirects
// the browser back to `_next` (this same page, with ?sent=1), and the
// useEffect below detects that and shows the "Message sent!" state. This is a
// deliberate swap away from Web3Forms (used before), whose free plan doesn't
// support attachments at all — file uploads there require a paid Pro plan.
//
// One-time setup Lino needs to do after this ships: submit the form once for
// real (with any test message) so FormSubmit sends a confirmation email to
// hello@maplesheet.ca — click "Confirm" in that email. Until that's done,
// FormSubmit holds new-destination submissions back for confirmation instead
// of delivering them, so the very first submission should be a test one sent
// by Lino, not a real customer inquiry.
export default function Contact() {
  usePageMeta({
    title: "Contact MapleSheet Co.",
    description: "Questions about a tracker, a bug, or a bulk order? Reach MapleSheet Co. directly — real answers from a real person, no support ticket queue.",
  });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setStatus("idle"); };

  // FormSubmit redirects here with ?sent=1 after a successful submission —
  // that's our signal to show the success state and fire the analytics event
  // (more reliable than firing it before the page navigates away).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("sent") === "1") {
      setStatus("done");
      trackContactFormSubmitted();
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) { setFile(null); setFileError(""); return; }
    if (f.size > MAX_FILE_BYTES) {
      setFileError("That file is over 10MB — please choose a smaller one or compress it first.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFileError("");
    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    if (!form.name || !form.email.includes("@") || !form.message) {
      e.preventDefault();
      setStatus("invalid");
      return;
    }
    if (fileError) { e.preventDefault(); return; }
    setStatus("sending"); // real submission proceeds — page will navigate to FormSubmit, then redirect back
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
            <form
              action={`https://formsubmit.co/${CONFIG.email}`}
              method="POST"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {/* Where FormSubmit sends visitors back to after a successful submit */}
              <input type="hidden" name="_next" value={`${SITE_URL}/contact?sent=1`} />
              <input type="hidden" name="_subject" value={`🍁 Website message from ${form.name || "someone"}`} readOnly />
              <input type="hidden" name="_template" value="table" />
              {/* Sends the person who submitted the form an instant "we got it"
                  copy — requires the visitor's own email field to be present
                  (it is, below) and a real (non-AJAX) submission with captcha
                  left on, both true here. */}
              <input type="hidden" name="_autoresponse" value="Thanks for your inquiry! We received your message and will reply as soon as we've reviewed it — usually within a day. — The MapleSheet Co. team" />
              {/* Honeypot: invisible to real visitors, bots tend to fill every field in */}
              <input type="text" name="_honey" tabIndex="-1" autoComplete="off" aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

              <input className="ml-input" name="name" placeholder="Your name" value={form.name} onChange={set("name")} aria-label="Name" />
              <input className="ml-input" type="email" name="email" placeholder="you@email.com" value={form.email} onChange={set("email")} aria-label="Email" />
              <textarea className="ml-input" name="message" placeholder="How can I help?" rows={6} value={form.message} onChange={set("message")}
                style={{ resize: "vertical" }} aria-label="Message" />

              <div>
                <label htmlFor="ml-attachment" style={{ display: "block", fontSize: 13, color: B.grayLight, marginBottom: 6 }}>
                  Attach a file (optional) — screenshot, PDF, spreadsheet, or short video, up to 10MB
                </label>
                <input
                  id="ml-attachment" ref={fileInputRef} className="ml-input" type="file" name="attachment"
                  onChange={handleFileChange}
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.mp4,.mpeg,.mpg,.mov"
                  style={{ padding: "10px 12px" }}
                />
                {file && !fileError && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, fontSize: 13, color: B.grayLight }}>
                    <span>📎 {file.name} ({formatBytes(file.size)})</span>
                    <button type="button" onClick={removeFile} style={{
                      background: "none", border: "none", color: B.redLink, fontWeight: 600,
                      fontSize: 13, cursor: "pointer", padding: 0, fontFamily: "inherit",
                    }}>Remove</button>
                  </div>
                )}
                {fileError && <div style={{ color: B.yellow, fontSize: 13, marginTop: 8 }}>{fileError}</div>}
              </div>

              <button type="submit" disabled={status === "sending"} className="ml-btn" style={{
                background: B.red, color: "#fff", border: "none", fontWeight: 700, fontSize: 15,
                padding: "14px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              }}>{status === "sending" ? "Sending…" : "Send message"}</button>
              {status === "invalid" && <div style={{ color: B.yellow, fontSize: 13 }}>Please fill in all three fields with a valid email.</div>}
            </form>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 22, color: B.grayLight, fontSize: 14.5 }}>
          Prefer email? Write to{" "}
          <a href={`mailto:${CONFIG.email}`} style={{ color: B.redLink, fontWeight: 700, textDecoration: "none" }}>{CONFIG.email}</a>
          <div style={{ fontSize: 13, color: B.gray, marginTop: 8 }}>MapleSheet Co. · British Columbia, Canada</div>
        </div>
      </div>
    </div>
  );
}
