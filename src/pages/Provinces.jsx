import React from "react";
import { Link, useParams } from "react-router-dom";
import { B, PRODUCTS } from "../data.js";
import { CATALOG } from "../trackerPages.js";
import { PageHead, RedWord, usePageMeta, useJsonLd, Reveal } from "../ui.jsx";
import { SITE_URL, NOT_FOUND_META } from "../seo.js";
import {
  PROVINCES, TAX_YEAR, FEDERAL_BRACKETS, SAMPLE_INCOMES, RRSP_EXAMPLE,
  combinedRate, topRate, provinceBySlug, provinceMeta, PROVINCES_HUB_META, money,
} from "../provinces.js";

// The /provinces hub and one guide per province/territory. Content lives in
// src/provinces.js; see the note at the top of that file.

const card = { background: B.black2, border: `1px solid ${B.line}`, borderRadius: 16, padding: "20px 20px" };
const h2 = { fontSize: "clamp(21px, 3vw, 26px)", fontWeight: 800, color: B.white, margin: "44px 0 14px", letterSpacing: "-0.02em" };
const para = { color: B.grayLight, fontSize: 15.5, lineHeight: 1.75, margin: "0 0 14px" };
const th = { textAlign: "left", padding: "10px 12px", color: B.grayLight, fontWeight: 600, fontSize: 13, borderBottom: `1px solid ${B.line}` };
const td = { padding: "10px 12px", borderBottom: `1px solid ${B.line}`, color: B.white, fontSize: 14.5, fontVariantNumeric: "tabular-nums" };
const pct = (n) => `${Number(n.toFixed(2))}%`;

function bracketRows(brackets) {
  let from = 0;
  return brackets.map(([upTo, rate]) => {
    const label = upTo === Infinity ? `Over ${money(from)}` : from === 0 ? `Up to ${money(upTo)}` : `${money(from + 1)} to ${money(upTo)}`;
    from = upTo;
    return [label, rate];
  });
}

function Table({ head, rows }) {
  return (
    <div style={{ ...card, padding: 0, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 320 }}>
        <thead><tr>{head.map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} style={td}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0", fontSize: 13, color: B.gray }}>
      {items.map(([label, to], i) => (
        <span key={label}>
          {i > 0 && " › "}
          {to ? <Link to={to} style={{ color: B.grayLight, textDecoration: "none" }}>{label}</Link> : <span>{label}</span>}
        </span>
      ))}
    </nav>
  );
}

const breadcrumbLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${path}` })),
});

const faqLd = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

// FAQ answers stay visible (not an accordion) so they're in the page text
// Google reads, matching the FAQPage structured data.
function Faqs({ faqs }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {faqs.map(([q, a]) => (
        <div key={q} style={card}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: B.white, margin: "0 0 6px" }}>{q}</h3>
          <p style={{ ...para, fontSize: 14.5, margin: 0 }}>{a}</p>
        </div>
      ))}
    </div>
  );
}

function SetupSteps({ p }) {
  const step = { ...para, margin: "0 0 10px" };
  return (
    <div className="ml-prov-2">
      <div style={card}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: B.white, margin: "0 0 10px" }}>Set your province</h3>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li style={step}>Open your tracker and go to the <strong style={{ color: B.white }}>⚙️ Settings &amp; Goals</strong> tab.</li>
          <li style={step}>Find the <strong style={{ color: B.white }}>Province</strong> cell near the top (row 6 in most trackers).</li>
          <li style={step}>Type <strong style={{ color: B.white }}>{p.code}</strong> and press Enter.</li>
        </ol>
      </div>
      <div style={card}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: B.white, margin: "0 0 10px" }}>Enter your tax rate</h3>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li style={step}>Find your income in the <strong style={{ color: B.white }}>combined rate</strong> table above.</li>
          <li style={step}>If your tracker has a <strong style={{ color: B.white }}>Your Marginal Tax Rate</strong> cell (the Margin Multi-Brokerage trackers and the Ultimate Multi-Brokerage have one), type that rate in, e.g. <strong style={{ color: B.white }}>{pct(combinedRate(p, 80000))}</strong> at about $80,000.</li>
          <li style={step}>The tracker's after-tax figures, like the real cost of margin interest, then use your {p.name} rate.</li>
        </ol>
      </div>
    </div>
  );
}

function ProvStyles() {
  return (
    <style>{`
        .ml-prov-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
        .ml-prov-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ml-prov-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ml-prov-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 28px; }
        @media (max-width: 860px) { .ml-prov-3 { grid-template-columns: 1fr; } }
        @media (max-width: 700px) { .ml-prov-2, .ml-prov-stats { grid-template-columns: 1fr; } }
      `}</style>
  );
}

export function ProvincesHub() {
  usePageMeta(PROVINCES_HUB_META);
  const crumbs = [["Home", "/"], ["Province Guides", "/provinces"]];
  useJsonLd(breadcrumbLd(crumbs), "breadcrumbs");
  const groups = [["10 provinces", PROVINCES.filter((p) => p.kind === "province")], ["3 territories", PROVINCES.filter((p) => p.kind === "territory")]];
  const byTop = [...PROVINCES].sort((a, b) => topRate(b) - topRate(a));
  return (
    <div className="ml-fade">
      <ProvStyles />
      <Breadcrumbs items={[["Home", "/"], ["Province Guides"]]} />
      <PageHead kicker="EVERY PROVINCE & TERRITORY" title={<>{TAX_YEAR} tax brackets <RedWord>by province</RedWord></>}
        sub="Your TFSA, RRSP, FHSA and RESP rules are the same everywhere in Canada because the CRA sets them. Your income tax isn't. Pick your province or territory to see its brackets, your real combined rate, what an RRSP contribution saves you there, and how to set it up in your tracker." />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        {groups.map(([label, list]) => (
          <section key={label}>
            <h2 style={h2}>{label}</h2>
            <div className="ml-prov-grid">
              {list.map((p) => (
                <Link key={p.slug} to={`/provinces/${p.slug}`} className="ml-card" style={{ ...card, textDecoration: "none", display: "block" }}>
                  <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: B.white, background: B.black3, border: `1px solid ${B.line}`, borderRadius: 6, padding: "2px 8px", marginBottom: 10 }}>{p.code}</span>
                  <div style={{ fontSize: 17, fontWeight: 700, color: B.white, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13.5, color: B.gray }}>{p.brackets.length} brackets · top combined rate {pct(topRate(p))}</div>
                  <div style={{ fontSize: 13.5, color: B.redLink, fontWeight: 600, marginTop: 10 }}>Read the guide →</div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <Reveal as="section">
          <h2 style={h2}>Combined rates across Canada, {TAX_YEAR}</h2>
          <p style={para}>Federal plus provincial or territorial rate on the next dollar of ordinary income, for a single filer. Sorted from the highest top rate to the lowest.</p>
          <Table head={["Province / territory", "At $50,000", "At $80,000", "At $120,000", "Top rate"]}
            rows={byTop.map((p) => [
              <Link key={p.slug} to={`/provinces/${p.slug}`} style={{ color: B.white, textDecoration: "none", fontWeight: 600 }}>{p.name}</Link>,
              pct(combinedRate(p, 50000)), pct(combinedRate(p, 80000)), pct(combinedRate(p, 120000)), pct(topRate(p)),
            ])} />
        </Reveal>

        <Reveal as="section">
          <h2 style={h2}>Why your province matters to your tracker</h2>
          <div className="ml-prov-2">
            <div style={card}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: B.white, margin: "0 0 8px" }}>The same everywhere</h3>
              <p style={{ ...para, margin: 0 }}>TFSA room ($7,000 for 2026), the RRSP limit ($33,810), the FHSA ($8,000 a year, $40,000 lifetime) and the federal CESG on RESPs are set by the CRA. Every MapleSheet tracker works the same in all 13.</p>
            </div>
            <div style={card}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: B.white, margin: "0 0 8px" }}>Different in each province</h3>
              <p style={{ ...para, margin: 0 }}>Your provincial tax rate, which decides how much an RRSP or FHSA deduction gives back, plus a few local extras such as Quebec's QESI, BC's RESP grant and the northern residents deduction.</p>
            </div>
          </div>
          <p style={{ ...para, marginTop: 18 }}>
            Ready to track it? <Link to="/trackers" style={{ color: B.redLink, fontWeight: 600 }}>Browse all {PRODUCTS.length} trackers →</Link>
          </p>
          <p style={{ fontSize: 12.5, color: B.gray, lineHeight: 1.6 }}>Rates from KPMG's {TAX_YEAR} federal and provincial/territorial tax tables. Estimates for general education only, not tax advice. See our <Link to="/disclaimer" style={{ color: B.grayLight }}>disclaimer</Link>.</p>
        </Reveal>
      </div>
    </div>
  );
}

export function ProvincePage() {
  const { slug } = useParams();
  const p = provinceBySlug(slug);
  usePageMeta(p ? provinceMeta(p) : { ...NOT_FOUND_META, noindex: true });
  const crumbs = p ? [["Home", "/"], ["Province Guides", "/provinces"], [p.name, `/provinces/${p.slug}`]] : [];
  useJsonLd(p ? breadcrumbLd(crumbs) : null, "breadcrumbs");
  useJsonLd(p ? faqLd(p.faqs) : null, "province-faq");
  if (!p) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h1 style={{ color: B.white }}>Guide not found</h1>
        <Link to="/provinces" style={{ color: B.redLink }}>See all province guides →</Link>
      </div>
    );
  }
  const level = p.kind === "territory" ? "territorial" : "provincial";
  const picks = p.picks.map((s) => CATALOG.find((x) => x.slug === s)).filter(Boolean);
  const others = PROVINCES.filter((x) => x.slug !== p.slug);
  return (
    <div className="ml-fade">
      <ProvStyles />
      <Breadcrumbs items={[["Home", "/"], ["Province Guides", "/provinces"], [p.name]]} />
      <PageHead kicker={`${p.name.toUpperCase()} · ${p.code}`} title={<>{p.name} tax brackets {TAX_YEAR}, <RedWord>and your tracker</RedWord></>} sub={p.intro} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div className="ml-prov-stats">
          {[[pct(p.brackets[0][1]), `Lowest ${level} rate`], [String(p.brackets.length), `${p.kind === "territory" ? "Territorial" : "Provincial"} tax brackets`], [pct(topRate(p)), "Top combined rate"]].map(([v, l]) => (
            <div key={l} style={card}>
              <div style={{ fontSize: 28, fontWeight: 800, color: B.white }}>{v}</div>
              <div style={{ fontSize: 13, color: B.gray }}>{l}</div>
            </div>
          ))}
        </div>

        <section>
          <h2 style={h2}>{TAX_YEAR} {p.name} tax brackets</h2>
          <Table head={["Taxable income", `${p.name} rate`]} rows={bracketRows(p.brackets).map(([l, r]) => [l, pct(r)])} />
          {p.surtax && <p style={{ ...para, fontSize: 13.5, marginTop: 10 }}>Plus the Ontario surtax (see below). Excludes the Ontario Health Premium.</p>}
          <p style={{ ...para, fontSize: 13.5, marginTop: 10 }}>
            Federal tax comes on top: {bracketRows(FEDERAL_BRACKETS).map(([l, r]) => `${pct(r)} ${l.replace(/^(\$)/, "from $1").replace(/^Up/, "up").replace(/^Over/, "over")}`).join(", ")}.
            {p.quebec && " Quebec residents' federal tax is then reduced by the 16.5% Quebec abatement."}
          </p>
        </section>

        <section>
          <h2 style={h2}>Your real rate: federal + {level} combined</h2>
          <Table head={["Taxable income", "Combined marginal rate", `A ${money(RRSP_EXAMPLE)} RRSP contribution saves about`]}
            rows={SAMPLE_INCOMES.map((inc) => [money(inc), pct(combinedRate(p, inc)), money((RRSP_EXAMPLE * combinedRate(p, inc)) / 100)])} />
          <p style={{ ...para, fontSize: 13.5, marginTop: 10 }}>
            Single filer, ordinary income, basic personal amounts only, and a contribution that stays inside one bracket. The same rate applies to an FHSA deduction. Estimates, not tax advice.
          </p>
        </section>

        <section>
          <h2 style={h2}>What's different in {p.name}</h2>
          <div className="ml-prov-3">
            {p.notes.map((n) => (
              <div key={n.h} style={card}>
                <h3 style={{ fontSize: 16.5, fontWeight: 700, color: B.white, margin: "0 0 8px" }}>{n.h}</h3>
                <p style={{ ...para, fontSize: 14.5, margin: 0 }}>{n.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={h2}>How to set up your MapleSheet tracker for {p.name}</h2>
          <SetupSteps p={p} />
        </section>

        <section>
          <h2 style={h2}>Trackers that suit {p.name} investors</h2>
          <div className="ml-prov-3">
            {picks.map((t) => (
              <Link key={t.slug} to={`/trackers/${t.slug}`} className="ml-card" style={{ ...card, textDecoration: "none", display: "block" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: B.white, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 13.5, color: B.gray, lineHeight: 1.5 }}>{t.desc}</div>
                <div style={{ fontSize: 13.5, color: B.redLink, fontWeight: 600, marginTop: 10 }}>CA${t.price.toFixed(2)} · View tracker →</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 style={h2}>{p.name} questions</h2>
          <Faqs faqs={p.faqs} />
        </section>

        <section>
          <h2 style={h2}>Other provinces and territories</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {others.map((o) => (
              <Link key={o.slug} to={`/provinces/${o.slug}`} style={{ fontSize: 13, color: B.grayLight, background: B.black2, border: `1px solid ${B.line}`, borderRadius: 999, padding: "6px 13px", textDecoration: "none" }}>{o.name}</Link>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: B.gray, lineHeight: 1.6, marginTop: 24 }}>
            Rates from KPMG's {TAX_YEAR} federal and provincial/territorial tax tables, checked November {TAX_YEAR}. General education only, not tax advice. Confirm your own figures with the CRA{p.quebec ? " and Revenu Québec" : ""} or a tax professional. See our <Link to="/disclaimer" style={{ color: B.grayLight }}>disclaimer</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
