import React, { useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
} from "recharts";
import { B, CONFIG } from "./data.js";
import { trackCalculatorToolUsed } from "./analytics.js";

// ─── math helpers ──────────────────────────────────────────────
// Ordinary annuity: contributions land at the end of each period.
function fv(principal, contribution, periods, ratePerPeriod) {
  if (periods <= 0) return principal;
  if (ratePerPeriod === 0) return principal + contribution * periods;
  const growth = Math.pow(1 + ratePerPeriod, periods);
  return principal * growth + (contribution * (growth - 1)) / ratePerPeriod;
}

function yearlySeries(principal, contribution, years, annualPct, periodsPerYear = 12) {
  const r = annualPct / 100 / periodsPerYear;
  const pts = [{ year: 0, balance: principal, contributed: principal }];
  let balance = principal;
  let contributed = principal;
  for (let y = 1; y <= years; y++) {
    for (let p = 0; p < periodsPerYear; p++) {
      balance = balance * (1 + r) + contribution;
      contributed += contribution;
    }
    pts.push({ year: y, balance, contributed });
  }
  return pts;
}

// The year cumulative market growth first exceeds cumulative money put in.
function crossoverYear(pts) {
  for (let i = 1; i < pts.length; i++) {
    const added = pts[i].balance - pts[i].contributed;
    if (added > pts[i].contributed && pts[i].contributed > 0) return pts[i].year;
  }
  return null;
}

const fmt = (n) => (n < 0 ? "-" : "") + "$" + Math.round(Math.abs(n)).toLocaleString("en-CA");

// ─── shared UI pieces ──────────────────────────────────────────
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
              width: 84, background: B.black3, border: `1px solid ${B.line}`, borderRadius: 6,
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
      <div style={{ fontSize: "clamp(26px, 4.6vw, 36px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 12 }}>{big}</div>
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

function ChartCard({ title, children }) {
  return (
    <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, padding: "18px 18px 8px" }}>
      <div style={{ fontSize: 11.5, letterSpacing: "0.1em", color: B.gray, fontWeight: 700, marginBottom: 10 }}>{title}</div>
      <div style={{ height: 220 }}>{children}</div>
    </div>
  );
}

const axisStyle = { fontSize: 11, fill: B.gray };
const tickLine = false;
const yFmt = (v) => `$${Math.round(v / 1000)}K`;

// ─── tabs ──────────────────────────────────────────────────────
function GrowTab() {
  const [starting, setStarting] = useState(0);
  const [contribution, setContribution] = useState(50);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(10);
  const [freq, setFreq] = useState("monthly");
  const [realDollars, setRealDollars] = useState(false);

  const periodsPerYear = freq === "monthly" ? 12 : 26;
  const periodContribution = freq === "monthly" ? contribution : (contribution * 12) / 26;
  const pts = yearlySeries(starting, periodContribution, years, rate, periodsPerYear);
  const last = pts[pts.length - 1];
  const totalIn = last.contributed;
  const marketAdded = last.balance - totalIn;
  const crossover = crossoverYear(pts);
  const inflationFactor = Math.pow(1.025, years);
  const displayBalance = realDollars ? last.balance / inflationFactor : last.balance;

  return (
    <div className="ml-calc-grid">
      <div>
        <Field code="B2" label="STARTING AMOUNT" prefix="$" value={starting} onChange={setStarting} max={100000} step={500} />
        <Field code="B3" label="CONTRIBUTION" prefix="$" suffix="/mo" value={contribution} onChange={setContribution} max={2000} step={10} />
        <Field code="B4" label="YEARS INVESTED" suffix="yrs" value={years} onChange={setYears} min={1} max={40} step={1} />
        <Field code="B5" label="ANNUAL RETURN" suffix="%" value={rate} onChange={setRate} max={15} step={0.5} />
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["monthly", "biweekly"].map((f) => (
            <button key={f} onClick={() => setFreq(f)} style={{
              flex: 1, padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: `1.5px solid ${freq === f ? B.red : B.line}`,
              background: freq === f ? B.red : "transparent", color: freq === f ? "#fff" : B.grayLight,
            }}>{f === "monthly" ? "Monthly" : "Bi-weekly (payday)"}</button>
          ))}
        </div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: B.grayLight, cursor: "pointer" }}>
          <input type="checkbox" checked={realDollars} onChange={(e) => setRealDollars(e.target.checked)} />
          Show in today's dollars (inflation-adjusted)
        </label>
      </div>
      <div>
        <ResultCard
          eyebrow={`AFTER ${years} YEAR${years === 1 ? "" : "S"}`}
          big={fmt(displayBalance)}
          chips={[`You put in ${fmt(totalIn)}`, `Market added +${fmt(marketAdded)}`]}
          note={crossover ? `Year ${crossover}: the market out-earns your deposits` : null}
        />
        <ChartCard title="GROWTH OVER TIME">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pts} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="growFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={B.red} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={B.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={B.line} vertical={false} />
              <XAxis dataKey="year" tick={axisStyle} tickLine={tickLine} axisLine={{ stroke: B.line }}
                tickFormatter={(y) => `Yr ${y}`} interval={Math.max(0, Math.ceil(years / 12) - 1)} />
              <YAxis tick={axisStyle} tickLine={tickLine} axisLine={false} tickFormatter={yFmt} width={46} />
              <Area type="monotone" dataKey="balance" stroke={B.red} strokeWidth={2} fill="url(#growFill)" />
              <Area type="monotone" dataKey="contributed" stroke={B.yellow} strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function GoalTab() {
  const [target, setTarget] = useState(500000);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(10);
  const [starting, setStarting] = useState(0);

  const r = rate / 100 / 12;
  const n = years * 12;
  const growth = Math.pow(1 + r, n);
  const neededMonthly = r === 0
    ? (target - starting) / n
    : ((target - starting * growth) * r) / (growth - 1);
  const monthly = Math.max(0, neededMonthly);
  const biweekly = (monthly * 12) / 26;
  const daily = (monthly * 12) / 360;
  const pts = yearlySeries(starting, monthly, years, rate, 12);

  return (
    <div className="ml-calc-grid">
      <div>
        <Field code="B2" label="TARGET AMOUNT" prefix="$" value={target} onChange={setTarget} max={2000000} step={5000} />
        <Field code="B3" label="YEARS TO GET THERE" suffix="yrs" value={years} onChange={setYears} min={1} max={40} step={1} />
        <Field code="B4" label="ANNUAL RETURN" suffix="%" value={rate} onChange={setRate} max={15} step={0.5} />
        <Field code="B5" label="STARTING AMOUNT" prefix="$" value={starting} onChange={setStarting} max={500000} step={1000} />
      </div>
      <div>
        <ResultCard
          eyebrow={`TO REACH ${fmt(target)} IN ${years} YEARS`}
          big={`${fmt(monthly)}/month`}
          chips={[`${fmt(biweekly)} per bi-weekly paycheque`, `just ${fmt(daily)} a day`]}
        />
        <ChartCard title="YOUR PATH TO THE GOAL">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pts} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="goalFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={B.red} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={B.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={B.line} vertical={false} />
              <XAxis dataKey="year" tick={axisStyle} tickLine={tickLine} axisLine={{ stroke: B.line }}
                tickFormatter={(y) => `Yr ${y}`} interval={Math.max(0, Math.ceil(years / 12) - 1)} />
              <YAxis tick={axisStyle} tickLine={tickLine} axisLine={false} tickFormatter={yFmt} width={46} />
              <Area type="monotone" dataKey="balance" stroke={B.red} strokeWidth={2} fill="url(#goalFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

const COMPARE_PRESETS = [
  { label: "Start now vs wait 10 years", icon: "⏱️", a: { contribution: 100, wait: 0, rate: 10 }, b: { contribution: 100, wait: 10, rate: 10 } },
  { label: "$50 vs $100 per month", icon: "🧮", a: { contribution: 100, wait: 0, rate: 10 }, b: { contribution: 50, wait: 0, rate: 10 } },
  { label: "5% vs 10% return", icon: "📊", a: { contribution: 100, wait: 0, rate: 10 }, b: { contribution: 100, wait: 0, rate: 5 } },
];

function CompareTab() {
  const [horizon, setHorizon] = useState(30);
  const [a, setA] = useState({ contribution: 100, wait: 0, rate: 10 });
  const [b, setB] = useState({ contribution: 100, wait: 10, rate: 10 });

  const finalValue = (s) => {
    const activeYears = Math.max(0, horizon - s.wait);
    return fv(0, s.contribution, activeYears * 12, s.rate / 100 / 12);
  };
  const seriesFor = (s) => {
    const pts = [];
    for (let y = 0; y <= horizon; y++) {
      const activeYears = Math.max(0, y - s.wait);
      pts.push(fv(0, s.contribution, activeYears * 12, s.rate / 100 / 12));
    }
    return pts;
  };

  const fvA = finalValue(a);
  const fvB = finalValue(b);
  const sA = seriesFor(a);
  const sB = seriesFor(b);
  const merged = sA.map((v, i) => ({ year: i, a: v, b: sB[i] }));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {COMPARE_PRESETS.map((p) => (
          <button key={p.label} onClick={() => { setA(p.a); setB(p.b); }} style={{
            padding: "8px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            border: `1px solid ${B.line}`, background: B.black3, color: B.grayLight,
          }}>{p.icon} {p.label}</button>
        ))}
      </div>
      <div className="ml-calc-grid">
        <div>
          <div style={{ borderTop: `3px solid ${B.red}`, paddingTop: 12, marginBottom: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.redLink, marginBottom: 12 }}>● SCENARIO A</div>
            <Field code="B2" label="CONTRIBUTION" prefix="$" suffix="/mo" value={a.contribution} onChange={(v) => setA({ ...a, contribution: v })} max={1000} step={10} />
            <Field code="B3" label="WAIT BEFORE STARTING" suffix="yrs" value={a.wait} onChange={(v) => setA({ ...a, wait: v })} max={20} step={1} />
            <Field code="B4" label="ANNUAL RETURN" suffix="%" value={a.rate} onChange={(v) => setA({ ...a, rate: v })} max={15} step={0.5} />
          </div>
          <div style={{ borderTop: `3px solid ${B.yellow}`, paddingTop: 12, marginBottom: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.yellow, marginBottom: 12 }}>● SCENARIO B</div>
            <Field code="C2" label="CONTRIBUTION" prefix="$" suffix="/mo" value={b.contribution} onChange={(v) => setB({ ...b, contribution: v })} max={1000} step={10} />
            <Field code="C3" label="WAIT BEFORE STARTING" suffix="yrs" value={b.wait} onChange={(v) => setB({ ...b, wait: v })} max={20} step={1} />
            <Field code="C4" label="ANNUAL RETURN" suffix="%" value={b.rate} onChange={(v) => setB({ ...b, rate: v })} max={15} step={0.5} />
          </div>
          <Field code="D2" label="TIME HORIZON" suffix="yrs" value={horizon} onChange={setHorizon} min={1} max={40} step={1} />
        </div>
        <div>
          <ResultCard
            eyebrow={`DIFFERENCE AFTER ${horizon} YEARS`}
            big={fmt(Math.abs(fvA - fvB))}
            note={`Scenario A finishes with ${fmt(fvA)} vs ${fmt(fvB)}.`}
          />
          <ChartCard title="SIDE BY SIDE">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={merged} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
                <CartesianGrid stroke={B.line} vertical={false} />
                <XAxis dataKey="year" tick={axisStyle} tickLine={tickLine} axisLine={{ stroke: B.line }}
                  tickFormatter={(y) => `Yr ${y}`} interval={Math.max(0, Math.ceil(horizon / 12) - 1)} />
                <YAxis tick={axisStyle} tickLine={tickLine} axisLine={false} tickFormatter={yFmt} width={46} />
                <Line type="monotone" dataKey="a" stroke={B.red} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="b" stroke={B.yellow} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: B.grayLight, marginTop: 10 }}>
            <span><span style={{ color: B.redLink }}>●</span> Scenario A</span>
            <span><span style={{ color: B.yellow }}>●</span> Scenario B</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountsTab() {
  const [contribution, setContribution] = useState(50);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(10);
  const [taxRate, setTaxRate] = useState(30);

  const pts = yearlySeries(0, contribution, years, rate, 12);
  const last = pts[pts.length - 1];
  const gross = last.balance;
  const contributed = last.contributed;
  const gain = gross - contributed;

  const tfsa = gross;
  const rrspRefunds = contributed * (taxRate / 100);
  const rrsp = gross * (1 - taxRate / 100);
  const margin = gross - gain * 0.5 * (taxRate / 100);

  const spread = Math.max(tfsa, rrsp, margin) - Math.min(tfsa, rrsp, margin);

  return (
    <div className="ml-calc-grid">
      <div>
        <Field code="B2" label="CONTRIBUTION" prefix="$" suffix="/mo" value={contribution} onChange={setContribution} max={2000} step={10} />
        <Field code="B3" label="YEARS INVESTED" suffix="yrs" value={years} onChange={setYears} min={1} max={40} step={1} />
        <Field code="B4" label="ANNUAL RETURN" suffix="%" value={rate} onChange={setRate} max={15} step={0.5} />
        <Field code="B5" label="MARGINAL TAX RATE" suffix="%" value={taxRate} onChange={setTaxRate} max={54} step={1} />
      </div>
      <div>
        <div className="ml-calc-accounts">
          <div style={{
            background: `linear-gradient(135deg, #2A0A0A, ${B.black2})`, border: `1.5px solid ${B.red}`,
            borderRadius: 14, padding: "16px 18px",
          }}>
            <div style={{ fontSize: 11, color: "#F5A3A3", fontWeight: 700, marginBottom: 6 }}>🍁 TFSA</div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{fmt(tfsa)}</div>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 999 }}>100% tax-free ✓</span>
          </div>
          <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: B.gray, fontWeight: 700, marginBottom: 6 }}>RRSP</div>
            <div style={{ fontSize: 21, fontWeight: 800, color: B.white, marginBottom: 8 }}>{fmt(rrsp)}</div>
            <div style={{ fontSize: 11.5, color: B.grayLight, lineHeight: 1.5 }}>after {taxRate}% withdrawal tax<br /><strong style={{ color: B.white }}>+{fmt(rrspRefunds)} refunds</strong> along the way</div>
          </div>
          <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: B.gray, fontWeight: 700, marginBottom: 6 }}>MARGIN</div>
            <div style={{ fontSize: 21, fontWeight: 800, color: B.white, marginBottom: 8 }}>{fmt(margin)}</div>
            <div style={{ fontSize: 11.5, color: B.grayLight, lineHeight: 1.5 }}>capital gains taxed<br />(50% inclusion)</div>
          </div>
        </div>
        <div style={{ background: B.black2, border: `1px solid ${B.line}`, borderRadius: 14, padding: "18px 20px", marginTop: 14 }}>
          <p style={{ fontSize: 14, color: B.grayLight, lineHeight: 1.7, margin: "0 0 8px" }}>
            Same {fmt(contribution)}/month, same {rate}% return — the account you choose changes the outcome by up to{" "}
            <strong style={{ color: B.redLink }}>{fmt(spread)}</strong>. Knowing your contribution room, ACB, and tax treatment
            across accounts is exactly what MapleSheet trackers manage for you.
          </p>
          <p style={{ fontSize: 11.5, color: B.gray, lineHeight: 1.6, margin: 0 }}>
            Simplified illustration: RRSP taxed fully at withdrawal at your marginal rate (refunds shown separately, not
            reinvested); Margin assumes all growth is capital gains realized at the end. Real outcomes vary.
          </p>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { key: "grow", label: "Grow", icon: "📈", Comp: GrowTab },
  { key: "goal", label: "Goal", icon: "🎯", Comp: GoalTab },
  { key: "compare", label: "Compare", icon: "⚖️", Comp: CompareTab },
  { key: "accounts", label: "Accounts", icon: "🏦", Comp: AccountsTab },
];

export default function WealthCalculator() {
  const [tab, setTab] = useState("grow");
  const Active = TABS.find((t) => t.key === tab).Comp;

  return (
    <div>
      <style>{`
        .ml-calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .ml-calc-accounts { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 10px; }
        @media (max-width: 720px) {
          .ml-calc-grid { grid-template-columns: 1fr; }
          .ml-calc-accounts { grid-template-columns: 1fr; }
        }
      `}</style>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); trackCalculatorToolUsed({ tool: t.key }); }} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10,
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            border: `1.5px solid ${tab === t.key ? B.red : B.line}`,
            background: tab === t.key ? B.red : "transparent",
            color: tab === t.key ? "#fff" : B.grayLight,
          }}>{t.icon} {t.label}</button>
        ))}
      </div>
      <Active />
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20,
        background: B.black2, border: `1px solid ${B.line}`, borderRadius: 14, padding: "18px 22px",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontWeight: 800, color: B.white, fontSize: 15, marginBottom: 3 }}>Stop Guessing. Start Tracking.</div>
          <div style={{ color: B.grayLight, fontSize: 13 }}>Canadian TFSA · RRSP · FHSA trackers — live prices, ACB & CRA rules built in.</div>
        </div>
        <a href={CONFIG.shopUrl} target="_blank" rel="noreferrer" style={{
          background: B.red, color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14,
          padding: "11px 20px", borderRadius: 9, whiteSpace: "nowrap",
        }}>Shop trackers →</a>
      </div>
      <p style={{ fontSize: 11.5, color: B.gray, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
        For illustration only — assumes constant returns compounded monthly, before fees. Tax comparisons are simplified.
        Actual market returns vary year to year. Not financial advice.
      </p>
    </div>
  );
}
