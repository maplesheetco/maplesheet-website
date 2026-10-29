import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { B, CONFIG } from "../data.js";
import { PageHead, RedWord, usePageMeta, Reveal } from "../ui.jsx";
import { trackContactFormSubmitted } from "../analytics.js";
import { STATIC_META } from "../seo.js";

const SITE_URL = "https://www.maplesheet.ca";
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: B.grayLight, marginBottom: 6 };
const sideCard = { background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18, padding: "22px 22px" };
const MAX_FILE_BYTES = 10 * 1024 * 1024; // FormSubmit's combined-attachment limit is 10MB

// "What's this about?" chips. The choice is sent as its own `topic` field and
// added to the email subject, so messages are easy to sort in the inbox.
const TOPICS = ["Question before buying", "Help with my tracker", "Idea for a new tracker", "Something else"];

const QUICK_HELP = [
  { q: "Which tracker should I buy?", a: <>Answer 2 quick questions in the <Link to="/trackers#picker" style={{ color: B.redLink, fontWeight: 600 }}>tracker picker</Link>, or see the <Link to="/trackers#compare" style={{ color: B.redLink, fontWeight: 600 }}>comparison table</Link>.</> },
  { q: "Lost your sheet link or PDFs?", a: "Email me with your Stripe receipt and I'll send them right over." },
  { q: "Something not working in your sheet?", a: "Use the form and attach a screenshot. It helps me fix it faster." },
  { q: "Learning the account rules?", a: <>The <Link to="/resources" style={{ color: B.redLink, fontWeight: 600 }}>Resources</Link> guides cover TFSA, RRSP, FHSA, RESP and ACB in plain English.</> },
];

// Opens the Tawk.to chat window if the widget has loaded (it's added in
// index.html); otherwise the button is simply not shown.
function openChat() {
  if (typeof window !== "undefined" && window.Tawk_API?.maximize) window.Tawk_API.maximize();
}

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
  usePageMeta(STATIC_META["/contact"]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [topic, setTopic] = useState(TOPICS[0]);
  const [chatReady, setChatReady] = useState(false);
  useEffect(() => { setChatReady(!!window.Tawk_API?.maximize); }, []);
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
      <div className="ml-contact" style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 24px 0" }}>
        <Reveal style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18, padding: "clamp(22px, 4vw, 32px)" }}>
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
              <input type="hidden" name="_subject" value={`🍁 ${topic}: website message from ${form.name || "someone"}`} readOnly />
              <input type="hidden" name="topic" value={topic} readOnly />
              <input type="hidden" name="_template" value="table" />
              {/* Sends the person who submitted the form an instant "we got it"
                  copy — requires the visitor's own email field to be present
                  (it is, below) and a real (non-AJAX) submission with captcha
                  left on, both true here. */}
              <input type="hidden" name="_autoresponse" value="Thanks for your inquiry! We received your message and will reply as soon as we've reviewed it — usually within a day. — The MapleSheet Co. team" />
              {/* Honeypot: invisible to real visitors, bots tend to fill every field in */}
              <input type="text" name="_honey" tabIndex="-1" autoComplete="off" aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

              <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
                <legend style={{ ...labelStyle, padding: 0 }}>What's this about?</legend>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TOPICS.map((tp, i) => (
                    <label key={tp} htmlFor={`ml-topic-${i}`} style={{ position: "relative", cursor: "pointer" }}>
                      <input id={`ml-topic-${i}`} type="radio" name="ml-topic-choice" checked={topic === tp} onChange={() => setTopic(tp)}
                        className="ml-chip-input" style={{ position: "absolute", opacity: 0, inset: 0, margin: 0, cursor: "pointer" }} />
                      <span style={{
                        display: "block", padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                        border: `1.5px solid ${topic === tp ? B.red : B.line}`,
                        background: topic === tp ? "#2A0A0A" : B.black, color: topic === tp ? B.white : B.grayLight,
                      }}>{tp}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="ml-contact-pair">
                <div>
                  <label htmlFor="ml-name" style={labelStyle}>Your name</label>
                  <input id="ml-name" className="ml-input" name="name" placeholder="First name is fine" value={form.name} onChange={set("name")} />
                </div>
                <div>
                  <label htmlFor="ml-email" style={labelStyle}>Email</label>
                  <input id="ml-email" className="ml-input" type="email" name="email" placeholder="you@email.com" value={form.email} onChange={set("email")} />
                </div>
              </div>
              <div>
                <label htmlFor="ml-message" style={labelStyle}>Message</label>
                <textarea id="ml-message" className="ml-input" name="message" placeholder="How can I help?" rows={7} value={form.message} onChange={set("message")}
                  style={{ resize: "vertical" }} />
              </div>

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
              {status === "invalid" && <div style={{ color: B.yellow, fontSize: 13 }}>Please fill in your name, a valid email and a message.</div>}
            </form>
          )}
        </Reveal>

        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Reveal delay={80} style={{ ...sideCard, background: `linear-gradient(150deg, #2A0A0A, ${B.black2})`, borderColor: B.red }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.white, marginBottom: 12 }}>Other ways to reach me</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: B.grayLight }}>
              <div>
                <div style={{ color: B.white, fontWeight: 600 }}>✉️ Email</div>
                <a href={`mailto:${CONFIG.email}`} style={{ color: B.redLink, fontWeight: 700, textDecoration: "none" }}>{CONFIG.email}</a>
              </div>
              {chatReady && (
                <div>
                  <div style={{ color: B.white, fontWeight: 600 }}>💬 Live chat</div>
                  <button type="button" onClick={openChat} style={{
                    background: "none", border: "none", padding: 0, color: B.redLink, fontWeight: 700,
                    fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                  }}>Open the chat window →</button>
                </div>
              )}
              <div>
                <div style={{ color: B.white, fontWeight: 600 }}>⏱ Reply time</div>
                I usually reply within a day, personally. No bots.
              </div>
              <div>
                <div style={{ color: B.white, fontWeight: 600 }}>🍁 Based in</div>
                British Columbia, Canada
              </div>
            </div>
          </Reveal>

          <Reveal delay={160} style={sideCard}>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.white, marginBottom: 12 }}>Quick answers</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {QUICK_HELP.map(({ q, a }) => (
                <div key={q}>
                  <div style={{ color: B.white, fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{q}</div>
                  <div style={{ color: B.grayLight, fontSize: 13.5, lineHeight: 1.6 }}>{a}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </aside>
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
