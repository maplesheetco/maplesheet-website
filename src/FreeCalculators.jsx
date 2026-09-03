import React, { useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { B } from "./data.js";
import { trackCalculatorToolUsed } from "./analytics.js";

// Shared visual pieces, styled to match WealthCalculator.jsx (Field / ResultCard /
// ChartCard live there as unexported locals, so small matching copies live here
// too rather than reaching into that file and risking a regression on the
// calculator that's already live and working).
function Field({ code, label, value, onChange, prefix, suffix, min = 0, max, step = 1 }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: B.grayLight, letterSpacing: "0.03em" }}>
          {code && <span style={{ color: B.gray, marginRight: 6 }}>{code}</span>}{label}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          {prefix && <span style={{ color: B.gray, fontSize: 13 }}>{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            style={{
              width: 88, background: B.black3, border: `1px solid ${B.line}`, borderRadius: 6,
              color: B.white, fontSize: 14, fontWeight: 700, padding: "5px 8px", textAlign: "right",
            }}
          />
          {suffix && <span style={{ color: B.gray, fontSize: 12.5 }}>{suffix}</span>}
        </span>
      </div>
      {max != null && (
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: "100%", accentColor: B.red, height: 4 }}
        />
      )}
    </div>
  );
}

function ResultCard({ eyebrow, big, chips = [], note }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, #2A0A0A, ${B.black2})`, border: `1.5px solid ${B.red}`,
      borderRadius: 16, padding: "22px 24px", marginBottom: 16,
    }}>
      <div style={{ fontSize: 11.5, letterSpacing: "0.12em", color: "#F5A3A3", fontWeight: 700, marginBottom: 8 }}>{eyebrow}</div>
      <div style={{ fontSize: "clamp(24px, 4.4vw, 34px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 12 }}>{big}</div>
      {chips.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: note ? 10 : 0 }}>
          {chips.map((c, i) => (
            <span key={i} style={{
              background: "rgba(255,255,255,0.14)", color: "#fff", fontSize: 12.5, fontWeight: 600,
              padding: "5px 10px", borderRadius: 999,
            }}>{c}</span>
          ))}
        </div>
      )}
      {note && <div style={{ fontSize: 13, color: "#F5CCCC" }}>{note}</div>}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, padding: "18px 18px" }}>
      {title && <div style={{ fontSize: 11.5, letterSpacing: "0.1em", color: B.gray, fontWeight: 700, marginBottom: 10 }}>{title}</div>}
      {children}
    </div>
  );
}

const fmt = (n) => (n < 0 ? "-" : "") + "$" + Math.round(Math.abs(n)).toLocaleString("en-CA");
const fmt2 = (n) => (n < 0 ? "-" : "") + "$" + Math.abs(n).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ────────────────────────────────────────────────────────────────
   TFSA Contribution Room Calculator
   Real CRA annual dollar limits, 2009 (the account's first year) through
   2026 — verified against the CRA's own published figures, and the
   $109,000 cumulative-since-2009 total matches the figure already cited
   elsewhere on this site (Resources articles + product FAQ).
   ──────────────────────────────────────────────────────────────── */
const TFSA_ANNUAL_LIMITS = {
  2009: 5000, 2010: 5000, 2011: 5000, 2012: 5000,
  2013: 5500, 2014: 5500,
  2015: 10000,
  2016: 5500, 2017: 5500, 2018: 5500,
  2019: 6000, 2020: 6000, 2021: 6000, 2022: 6000,
  2023: 6500,
  2024: 7000, 2025: 7000, 2026: 7000,
};
const CURRENT_YEAR = 2026;
const TFSA_START_YEAR = 2009;

function cumulativeLimitSince(startYear) {
  let total = 0;
  for (let y = Math.max(startYear, TFSA_START_YEAR); y <= CURRENT_YEAR; y++) {
    total += TFSA_ANNUAL_LIMITS[y] || 0;
  }
  return total;
}

// Fires the "tool used" event once per mount, on the visitor's first actual
// interaction — not on page load, since scrolling past a calculator isn't
// the same as using it. Mirrors the existing WealthCalculator's pattern of
// only tracking a real action, not passive render.
function useFirstUseTracker(tool) {
  const firedRef = useRef(false);
  return () => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackCalculatorToolUsed({ tool });
  };
}

export function TfsaRoomCalculator() {
  const [birthYear, setBirthYear] = useState(1995);
  const [contributed, setContributed] = useState(20000);
  const [priorWithdrawals, setPriorWithdrawals] = useState(0);
  const [thisYearWithdrawals, setThisYearWithdrawals] = useState(0);
  const markUsed = useFirstUseTracker("tfsa_room");

  const withTrack = (setter) => (v) => { markUsed(); setter(v); };
  const eligibleFrom = Math.max(TFSA_START_YEAR, birthYear + 18);
  const cumulativeLimit = eligibleFrom <= CURRENT_YEAR ? cumulativeLimitSince(eligibleFrom) : 0;
  const room = Math.max(0, cumulativeLimit - contributed + priorWithdrawals);
  const usedPct = cumulativeLimit > 0 ? Math.min(100, (contributed / cumulativeLimit) * 100) : 0;

  return (
    <div className="ml-calc-grid">
      <div>
        <Field code="B2" label="BIRTH YEAR" value={birthYear} onChange={withTrack(setBirthYear)} min={1940} max={CURRENT_YEAR - 17} step={1} />
        <Field code="B3" label="TOTAL CONTRIBUTED (ALL-TIME)" prefix="$" value={contributed} onChange={withTrack(setContributed)} max={150000} step={500} />
        <Field code="B4" label="WITHDRAWN BEFORE THIS YEAR" prefix="$" value={priorWithdrawals} onChange={withTrack(setPriorWithdrawals)} max={100000} step={500} />
        <Field code="B5" label="WITHDRAWN SO FAR THIS YEAR" prefix="$" value={thisYearWithdrawals} onChange={withTrack(setThisYearWithdrawals)} max={100000} step={500} />
        {eligibleFrom > CURRENT_YEAR && (
          <div style={{ fontSize: 12.5, color: B.yellow, marginTop: -6 }}>You won't turn 18 until {eligibleFrom} — no TFSA room yet.</div>
        )}
      </div>
      <div>
        <ResultCard
          eyebrow={`ESTIMATED ${CURRENT_YEAR} TFSA ROOM`}
          big={fmt(room)}
          chips={[`Cumulative limit since ${eligibleFrom}: ${fmt(cumulativeLimit)}`, `Already contributed: ${fmt(contributed)}`]}
          note={thisYearWithdrawals > 0
            ? `Heads up: the ${fmt(thisYearWithdrawals)} withdrawn this year doesn't count toward room until Jan 1, ${CURRENT_YEAR + 1} — it's not included above.`
            : "Withdrawals made in a previous calendar year are already added back above; this year's withdrawals aren't, until next January."}
        />
        <Card title="ROOM USED VS. AVAILABLE">
          <div style={{ height: 22, background: B.black3, borderRadius: 999, overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${usedPct}%`, background: B.red, transition: "width 0.2s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12.5, color: B.grayLight }}>
            <span><span style={{ color: B.redLink }}>●</span> Used: {fmt(contributed)}</span>
            <span><span style={{ color: B.line }}>●</span> Room: {fmt(room)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Simple ACB Calculator
   Average-cost-method ACB, matching how MapleSheet's own Margin and
   combo trackers calculate it. Deliberately doesn't model superficial
   losses or T5008 reconciliation — see the disclaimer under the tool.
   ──────────────────────────────────────────────────────────────── */
function computeAcbRuns(lots) {
  let shares = 0;
  let acbPool = 0;
  const rows = [];
  for (const lot of lots) {
    const qty = Number(lot.shares) || 0;
    const price = Number(lot.price) || 0;
    const fee = Number(lot.fee) || 0;
    if (lot.type === "buy") {
      shares += qty;
      acbPool += qty * price + fee;
      rows.push({ ...lot, shares: qty, acbPerShare: shares > 0 ? acbPool / shares : 0, gain: null, sharesHeld: shares });
    } else {
      const overSold = qty > shares;
      const acbPerShare = shares > 0 ? acbPool / shares : 0;
      const proceeds = qty * price - fee;
      const costSold = acbPerShare * qty;
      const gain = proceeds - costSold;
      shares = Math.max(0, shares - qty);
      acbPool = Math.max(0, acbPool - costSold);
      rows.push({ ...lot, shares: qty, acbPerShare, gain, sharesHeld: shares, overSold });
    }
  }
  const hasOverSold = rows.some((r) => r.overSold);
  return { rows, finalShares: shares, finalAcbPool: acbPool, finalAcbPerShare: shares > 0 ? acbPool / shares : 0, hasOverSold };
}

const emptyLot = () => ({ id: Math.random().toString(36).slice(2), type: "buy", shares: 100, price: 25, fee: 0 });

export function AcbCalculator() {
  const [lots, setLots] = useState([
    { id: "l1", type: "buy", shares: 100, price: 20, fee: 4.95 },
    { id: "l2", type: "buy", shares: 50, price: 24, fee: 4.95 },
    { id: "l3", type: "sell", shares: 60, price: 30, fee: 4.95 },
  ]);
  const markUsed = useFirstUseTracker("acb");

  const { rows, finalShares, finalAcbPool, finalAcbPerShare, hasOverSold } = computeAcbRuns(lots);
  const realizedGain = rows.reduce((sum, r) => sum + (r.gain || 0), 0);
  const taxableGain = realizedGain * 0.5;
  const chartData = rows.map((r, i) => ({ tx: i + 1, acb: Number(r.acbPerShare.toFixed(2)) }));
  const overSoldIds = new Set(rows.filter((r) => r.overSold).map((r) => r.id));

  const updateLot = (id, patch) => { markUsed(); setLots((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l))); };
  const removeLot = (id) => { markUsed(); setLots((ls) => ls.filter((l) => l.id !== id)); };
  const addLot = () => { markUsed(); setLots((ls) => [...ls, { ...emptyLot(), id: Math.random().toString(36).slice(2) }]); };

  return (
    <div>
      <Card title="BUY / SELL LOTS, IN ORDER">
        <div className="ml-acb-table">
          <div className="ml-acb-head">
            <span>Type</span><span>Shares</span><span>Price/share</span><span>Fee</span><span />
          </div>
          {lots.map((lot) => {
            const flagged = overSoldIds.has(lot.id);
            return (
            <div className="ml-acb-row" key={lot.id}>
              <select value={lot.type} onChange={(e) => updateLot(lot.id, { type: e.target.value })}
                style={{ background: B.black3, border: `1px solid ${flagged ? B.red : B.line}`, borderRadius: 6, color: lot.type === "buy" ? B.redLink : B.yellow, fontWeight: 700, fontSize: 13, padding: "6px 8px" }}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
              <input type="number" value={lot.shares} onChange={(e) => updateLot(lot.id, { shares: Number(e.target.value) || 0 })}
                style={{ background: B.black3, border: `1px solid ${flagged ? B.red : B.line}`, borderRadius: 6, color: B.white, fontSize: 13, padding: "6px 8px", width: "100%" }} />
              <input type="number" step="0.01" value={lot.price} onChange={(e) => updateLot(lot.id, { price: Number(e.target.value) || 0 })}
                style={{ background: B.black3, border: `1px solid ${flagged ? B.red : B.line}`, borderRadius: 6, color: B.white, fontSize: 13, padding: "6px 8px", width: "100%" }} />
              <input type="number" step="0.01" value={lot.fee} onChange={(e) => updateLot(lot.id, { fee: Number(e.target.value) || 0 })}
                style={{ background: B.black3, border: `1px solid ${flagged ? B.red : B.line}`, borderRadius: 6, color: B.white, fontSize: 13, padding: "6px 8px", width: "100%" }} />
              <button onClick={() => removeLot(lot.id)} title="Remove" style={{
                background: "transparent", border: `1px solid ${B.line}`, borderRadius: 6, color: B.gray,
                cursor: "pointer", fontSize: 13, padding: "6px 10px",
              }}>✕</button>
            </div>
            );
          })}
        </div>
        {hasOverSold && (
          <div style={{
            marginTop: 12, background: "rgba(204,0,0,0.12)", border: `1px solid ${B.red}`, borderRadius: 8,
            padding: "10px 14px", fontSize: 12.5, color: "#F5A3A3",
          }}>
            ⚠ A sell above (outlined in red) sells more shares than you were actually holding at that point in the
            list. Check the share counts or the order of your rows — the totals below aren't reliable until this
            is fixed.
          </div>
        )}
        <button onClick={addLot} style={{
          marginTop: 12, background: "transparent", border: `1.5px dashed ${B.line}`, borderRadius: 8,
          color: B.grayLight, fontWeight: 700, fontSize: 13, padding: "9px 16px", cursor: "pointer", width: "100%",
        }}>+ Add a lot</button>
      </Card>

      <div className="ml-calc-grid" style={{ marginTop: 20, opacity: hasOverSold ? 0.55 : 1 }}>
        <div>
          <ResultCard
            eyebrow={hasOverSold ? "CURRENT POSITION (UNRELIABLE — SEE WARNING ABOVE)" : "CURRENT POSITION"}
            big={`${finalShares.toLocaleString("en-CA")} shares`}
            chips={[`ACB per share: ${fmt2(finalAcbPerShare)}`, `Total ACB: ${fmt(finalAcbPool)}`]}
          />
        </div>
        <div>
          <ResultCard
            eyebrow={hasOverSold ? "REALIZED GAIN (UNRELIABLE — SEE WARNING ABOVE)" : "REALIZED CAPITAL GAIN (ALL SELLS)"}
            big={fmt(realizedGain)}
            chips={[`Taxable at 50% inclusion: ${fmt(taxableGain)}`]}
          />
        </div>
      </div>

      {chartData.some((d) => !isNaN(d.acb)) && (
        <Card title="ACB PER SHARE, TRANSACTION BY TRANSACTION">
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
                <CartesianGrid stroke={B.line} vertical={false} />
                <XAxis dataKey="tx" tick={{ fontSize: 11, fill: B.gray }} tickLine={false} axisLine={{ stroke: B.line }}
                  tickFormatter={(t) => `#${t}`} />
                <YAxis tick={{ fontSize: 11, fill: B.gray }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `$${v}`} width={46} />
                <Line type="stepAfter" dataKey="acb" stroke={B.red} strokeWidth={2.5} dot={{ r: 3, fill: B.red }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <p style={{ fontSize: 11.5, color: B.gray, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
        Average-cost method, the same approach the CRA expects for identical properties. Doesn't model superficial
        losses (selling at a loss and rebuying within 30 days), currency conversion, or return-of-capital
        adjustments — for a real non-registered position, MapleSheet's Margin Tracker handles those automatically.
        Not tax advice.
      </p>

      <style>{`
        .ml-acb-table { display: flex; flex-direction: column; gap: 8px; }
        .ml-acb-head, .ml-acb-row {
          display: grid; grid-template-columns: 90px 1fr 1fr 1fr 34px; gap: 8px; align-items: center;
        }
        .ml-acb-head span { font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${B.gray}; }
        @media (max-width: 560px) {
          .ml-acb-head, .ml-acb-row { grid-template-columns: 70px 1fr 1fr 1fr 30px; gap: 5px; }
        }
      `}</style>
    </div>
  );
}
