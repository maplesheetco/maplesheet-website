import React, { useState } from "react";
import { Link } from "react-router-dom";
import { B } from "./data.js";
import { CATALOG } from "./trackerPages.js";

// Two shopping aids for the /trackers page: a 2-question "which tracker is
// right for me?" picker, and a table comparing every tracker side by side.
// Both read CATALOG, so a new tracker shows up here automatically as long as
// its `accounts` list is filled in.

const ACCOUNTS = ["TFSA", "RRSP", "Spousal", "FHSA", "RESP", "Margin"];
const LABEL = {
  TFSA: "TFSA", RRSP: "RRSP", Spousal: "Spousal RRSP", FHSA: "FHSA", RESP: "RESP", Margin: "Margin / cash",
};

// Spousal RRSP isn't its own entry in `accounts` (it's part of RRSP), so the
// two trackers that handle it are named here by SKU.
const SPOUSAL_SKUS = ["MS-COMBO-RRSP-SPOUSAL", "MS-FLAGSHIP-ULTIMATE"];
const isMultiBrokerage = (p) => /-MB$/.test(p.sku || "");
const accountsOf = (p) => [...(p.accounts || []), ...(SPOUSAL_SKUS.includes(p.sku) ? ["Spousal"] : [])];
const money = (v) => `CA$${v.toFixed(2)}`;

// Fewest extra accounts first (the closest fit), then cheapest.
const closestFit = (list) =>
  list.slice().sort((a, b) => accountsOf(a).length - accountsOf(b).length || a.price - b.price)[0];

// Returns { products: [...], note } — usually one product, but when someone
// needs multi-brokerage for a mix no single MB tracker covers, it pairs the
// MB trackers that do (the TFSA + RRSP MB combo where it fits, then singles).
export function recommend(selected, multi) {
  if (!selected.length) return null;
  const covers = CATALOG.filter((p) => selected.every((a) => accountsOf(p).includes(a)));
  if (multi) {
    const mb = covers.filter(isMultiBrokerage);
    if (mb.length) return { products: [closestFit(mb)] };
    const combo = CATALOG.find((p) => isMultiBrokerage(p) && p.accounts?.length === 2
      && selected.includes(p.accounts[0]) && selected.includes(p.accounts[1]));
    const rest = selected.filter((a) => !combo?.accounts.includes(a));
    const singles = rest.map((a) => CATALOG.find((p) => isMultiBrokerage(p) && p.accounts?.length === 1 && p.accounts[0] === a));
    if (singles.every(Boolean)) {
      return {
        products: [...(combo ? [combo] : []), ...singles],
        note: "No single multi-brokerage tracker covers this mix yet, so these work together, one per account.",
      };
    }
    const best = closestFit(covers);
    return best && {
      products: [best],
      note: "There's no multi-brokerage version for this mix yet. This one tracks each account at one brokerage.",
    };
  }
  const best = closestFit(covers);
  return best && { products: [best] };
}

function Chip({ id, type, name, checked, onChange, children }) {
  return (
    <label htmlFor={id} style={{ position: "relative", cursor: "pointer" }}>
      <input
        id={id} type={type} name={name} checked={checked} onChange={onChange}
        className="ml-chip-input"
        style={{ position: "absolute", opacity: 0, inset: 0, margin: 0, cursor: "pointer" }}
      />
      <span style={{
        display: "block", padding: "9px 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 600,
        border: `1.5px solid ${checked ? B.red : B.line}`,
        background: checked ? "#2A0A0A" : B.black2,
        color: checked ? B.white : B.grayLight,
      }}>{children}</span>
    </label>
  );
}

export function TrackerPicker() {
  const [selected, setSelected] = useState(["TFSA"]);
  const [multi, setMulti] = useState(false);
  const toggle = (a) => setSelected((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));
  const result = recommend(selected, multi);
  const total = result ? result.products.reduce((s, p) => s + p.price, 0) : 0;
  const single = result?.products.length === 1 ? result.products[0] : null;
  const extras = single ? accountsOf(single).filter((a) => !selected.includes(a)) : [];
  const q = { fontSize: 15.5, fontWeight: 700, color: B.white, marginBottom: 12 };

  return (
    <section id="picker" style={{
      scrollMarginTop: 90, background: B.black2, border: `1px solid ${B.line}`, borderRadius: 18,
      padding: "clamp(20px, 4vw, 32px)", marginBottom: 32,
    }}>
      <div style={{ fontSize: 12, letterSpacing: "0.14em", color: B.redLink, fontWeight: 700, marginBottom: 6 }}>NOT SURE WHERE TO START?</div>
      <h2 style={{ fontSize: "clamp(22px, 3.4vw, 28px)", fontWeight: 800, color: B.white, margin: "0 0 22px", letterSpacing: "-0.02em" }}>
        Find your tracker in 2 questions
      </h2>
      <div className="ml-picker">
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={q}>1. Which accounts do you have?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ACCOUNTS.map((a) => (
                <Chip key={a} id={`pick-${a}`} type="checkbox" checked={selected.includes(a)} onChange={() => toggle(a)}>
                  {LABEL[a]}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div style={q}>2. Is any of them spread across more than one bank or brokerage?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Chip id="pick-mb-no" type="radio" name="pick-mb" checked={!multi} onChange={() => setMulti(false)}>No, one place each</Chip>
              <Chip id="pick-mb-yes" type="radio" name="pick-mb" checked={multi} onChange={() => setMulti(true)}>Yes, more than one</Chip>
            </div>
          </div>
        </div>
        <div aria-live="polite" style={{
          background: B.black, border: `1.5px solid ${result ? B.red : B.line}`, borderRadius: 14,
          padding: "22px 22px", display: "flex", flexDirection: "column", gap: 10,
        }}>
          <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: "#34C77B", fontWeight: 700 }}>YOUR MATCH</div>
          {!result ? (
            <div style={{ color: B.grayLight, fontSize: 14 }}>Tick at least one account and your match appears here.</div>
          ) : (
            <>
              <div style={{ fontSize: 21, fontWeight: 800, color: B.white, lineHeight: 1.25 }}>
                {single ? single.name : `${result.products.length} trackers that work together`}
              </div>
              {single ? (
                <div style={{ fontSize: 13.5, color: B.grayLight, lineHeight: 1.6 }}>{single.desc}</div>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18, color: B.grayLight, fontSize: 13.5, lineHeight: 1.7 }}>
                  {result.products.map((p) => (
                    <li key={p.sku}><Link to={`/trackers/${p.slug}`} style={{ color: B.white, fontWeight: 600 }}>{p.name}</Link> — {money(p.price)}</li>
                  ))}
                </ul>
              )}
              <div style={{ fontSize: 22, fontWeight: 800, color: B.white }}>
                {money(total)} <span style={{ fontSize: 13, fontWeight: 500, color: B.grayLight }}>{single ? "one-time" : "total, one-time"}</span>
              </div>
              {single && (
                <Link to={`/trackers/${single.slug}`} className="ml-btn" style={{
                  alignSelf: "flex-start", background: B.red, color: "#fff", textDecoration: "none",
                  fontWeight: 700, fontSize: 14, padding: "12px 22px", borderRadius: 10,
                }}>View this tracker →</Link>
              )}
              {extras.length > 0 && (
                <div style={{ fontSize: 12.5, color: B.grayLight }}>Also covers: {extras.map((a) => LABEL[a]).join(", ")}</div>
              )}
              {result.note && (
                <div style={{ fontSize: 12.5, color: B.grayLight, borderTop: `1px solid ${B.line}`, paddingTop: 10 }}>{result.note}</div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function CompareTable() {
  const rows = CATALOG.slice().sort((a, b) => accountsOf(a).length - accountsOf(b).length || a.price - b.price);
  const cell = { padding: "11px 12px", borderBottom: `1px solid ${B.line}`, textAlign: "center", whiteSpace: "nowrap" };
  const yes = <span style={{ color: "#34C77B", fontWeight: 800 }} aria-label="Yes">✓</span>;
  const no = <span style={{ color: B.line }} aria-label="No">–</span>;
  return (
    <section id="compare" style={{ scrollMarginTop: 90, marginTop: 48 }}>
      <h2 style={{ fontSize: "clamp(22px, 3.4vw, 28px)", fontWeight: 800, color: B.white, margin: "0 0 6px", letterSpacing: "-0.02em", textAlign: "center" }}>
        Compare all {CATALOG.length} trackers
      </h2>
      <p style={{ color: B.grayLight, fontSize: 14, textAlign: "center", margin: "0 0 20px" }}>
        Which accounts each tracker covers, and which ones handle more than one brokerage.
      </p>
      <div style={{ overflowX: "auto", border: `1px solid ${B.line}`, borderRadius: 14 }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 820, fontSize: 13.5, fontVariantNumeric: "tabular-nums" }}>
          <thead>
            <tr style={{ background: B.black2 }}>
              {["Tracker", ...ACCOUNTS.map((a) => LABEL[a]), "Multi-brokerage", "Price"].map((h, i) => (
                <th key={h} scope="col" style={{
                  ...cell, textAlign: i === 0 ? "left" : "center", fontSize: 11, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: B.grayLight, fontWeight: 700,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const acc = accountsOf(p);
              const flagship = p.badge === "FLAGSHIP";
              return (
                <tr key={p.sku} style={{ background: flagship ? "#1F0D0D" : "transparent" }}>
                  <th scope="row" style={{ ...cell, textAlign: "left", whiteSpace: "normal", minWidth: 230, fontWeight: 600 }}>
                    <Link to={`/trackers/${p.slug}`} style={{ color: B.white, textDecoration: "none" }}>{p.name}</Link>
                  </th>
                  {ACCOUNTS.map((a) => <td key={a} style={cell}>{acc.includes(a) ? yes : no}</td>)}
                  <td style={cell}>{isMultiBrokerage(p) ? <span style={{ color: "#34C77B", fontWeight: 700 }}>✓ up to 8</span> : no}</td>
                  <td style={{ ...cell, fontWeight: 800, color: B.white }}>{money(p.price)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ color: B.gray, fontSize: 12.5, margin: "10px 0 0" }}>
        Multi-brokerage means up to 8 banks or brokerages per account, in one sheet. Swipe the table sideways on a phone.
      </p>
    </section>
  );
}
