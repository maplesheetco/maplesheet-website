// ─── Province & territory guides (/provinces and /provinces/:slug) ──
// One page per province and territory. Plain JS (no JSX) so src/seo.js and
// the build scripts can import it in Node.
//
// Every page is built from that province's own numbers and notes, so no two
// pages say the same thing (Google treats near-identical "city/province"
// pages as doorway pages).
//
// 2026 brackets: KPMG, "Federal and Provincial/Territorial Income Tax Rates
// and Brackets for 2026" (edition current as of September 30, 2026), checked
// Nov 2026. BC's lowest rate is 5.60% for 2026 (BC Budget 2026). Update every
// January — the yearly limits update is a good time.
//
// Combined marginal rates are worked out below from these brackets, for a
// single filer with ordinary (employment/interest) income and no other
// credits. They're estimates, and the pages say so.

export const TAX_YEAR = 2026;

// [upper limit of the bracket (Infinity for the top), rate %]
export const FEDERAL_BRACKETS = [
  [58523, 14], [117045, 20.5], [181440, 26], [258482, 29], [Infinity, 33],
];

// Sample incomes shown in each page's "your real rate" table. Kept under
// $181,440 so the federal basic-personal-amount phase-out (which nudges the
// federal rate a little above 29% between $181,440 and $258,482) doesn't
// make the simple bracket maths wrong.
export const SAMPLE_INCOMES = [50000, 80000, 120000, 160000];
export const RRSP_EXAMPLE = 5000;

const rateAt = (brackets, income) => brackets.find(([upTo]) => income <= upTo)[1];

// Federal + provincial marginal rate on the next dollar at this income.
export function combinedRate(p, income) {
  let fed = rateAt(FEDERAL_BRACKETS, income);
  if (p.code === "QC") fed *= 1 - 0.165; // Quebec abatement: federal tax is 16.5% lower in Quebec
  let prov = rateAt(p.brackets, income);
  // Ontario surtax: +20% of Ontario tax above the first threshold, +56% above
  // the second. With only the basic personal amount, those thresholds are
  // reached at about these incomes (2026).
  if (p.code === "ON") prov *= income > 111785 ? 1.56 : income > 94907 ? 1.2 : 1;
  return Math.round((fed + prov) * 100) / 100;
}

// Top combined rate: top federal + top provincial bracket.
export function topRate(p) {
  let fed = 33;
  if (p.code === "QC") fed *= 1 - 0.165;
  let prov = p.brackets[p.brackets.length - 1][1];
  if (p.code === "ON") prov *= 1.56;
  return Math.round((fed + prov) * 100) / 100;
}

// Tracker slugs (see src/trackerPages.js) suggested on each page.
const RRSP = "rrsp-multi-brokerage";
const FHSA = "fhsa-multi-brokerage";
const RESP = "resp-multi-brokerage";
const FAMILY = "tfsa-rrsp-resp-multi-brokerage";
const SPOUSAL = "rrsp-spousal-multi-brokerage";
const RRSP_FHSA = "rrsp-fhsa-multi-brokerage";
const MARGIN = "margin-cash-multi-brokerage";
const TFSA_RRSP = "tfsa-rrsp-multi-brokerage";
const ULTIMATE = "ultimate-multi-brokerage";

export const PROVINCES = [
  {
    slug: "british-columbia", name: "British Columbia", code: "BC", kind: "province",
    brackets: [[50363, 5.6], [100728, 7.7], [115648, 10.5], [140430, 12.29], [190405, 14.7], [265545, 16.8], [Infinity, 20.5]],
    intro: "British Columbia has seven tax brackets, more than any province except Newfoundland and Labrador. For 2026 the province raised its lowest rate from 5.06% to 5.60%, so even modest earners pay a little more BC tax than last year. BC parents also have a provincial RESP grant that most of the country doesn't.",
    notes: [
      { h: "BC's lowest rate went up for 2026", body: "BC Budget 2026 raised the first-bracket rate to 5.60% (it was 5.06%). The budget also announced that BC's bracket thresholds won't be raised for inflation from 2027 to 2030, so more of your income can drift into higher brackets over time. That makes the RRSP and FHSA deductions slightly more valuable for BC earners each year." },
      { h: "The BC Training and Education Savings Grant", body: "Children born in 2006 or later who live in BC can get a one-time $1,200 BCTESG paid into an RESP. You don't have to contribute anything to get it. You apply through your RESP provider between the child's 6th and 9th birthdays. It's on top of the federal CESG, so in BC an RESP can collect money from both governments." },
      { h: "A big jump in the middle brackets", body: "BC's rate climbs from 7.70% to 10.50% just above $100,728. If your income is near that line, an RRSP or FHSA contribution that brings your taxable income back under it is worth noticeably more." },
    ],
    picks: [RESP, FAMILY, RRSP],
    faqs: [
      ["Did BC tax go up in 2026?", "For most people, slightly. The lowest BC rate rose from 5.06% to 5.60% for 2026, which applies to the first $50,363 of taxable income. The higher brackets kept their rates."],
      ["Can my child get the BC RESP grant?", "If the child was born in 2006 or later and lives in BC, yes. The $1,200 BCTESG is applied for through an RESP provider between the child's 6th and 9th birthdays, and no contribution is required."],
    ],
  },
  {
    slug: "alberta", name: "Alberta", code: "AB", kind: "province",
    brackets: [[61200, 8], [154259, 10], [185111, 12], [246813, 13], [370220, 14], [Infinity, 15]],
    intro: "Alberta has some of the lowest income tax rates in Canada and no provincial sales tax. Since 2025 its first bracket has a lower 8% rate, which applies to the first $61,200 of taxable income in 2026. Because Alberta's provincial rates are low, the RRSP deduction is worth a little less here than in most provinces, which changes the TFSA versus RRSP maths.",
    notes: [
      { h: "The new 8% bracket", body: "Alberta used to have a flat 10% starting rate. From 2025 the first slice of income is taxed at 8%, and for 2026 that slice is the first $61,200. Everyone who files in Alberta benefits from it, whatever their income." },
      { h: "TFSA versus RRSP in a low-tax province", body: "An RRSP deduction saves you tax at your marginal rate today, and the withdrawal is taxed at your rate in retirement. With Alberta's lower provincial rates, the gap between those two rates is often smaller, so the TFSA can be the better first choice for middle incomes. Check both against the table on this page." },
      { h: "No provincial RESP grant", body: "Alberta's old RESP grant (ACES) ended in 2015. Alberta families get the federal CESG (20% on the first $2,500 a year per child) and, for lower incomes, the Canada Learning Bond." },
    ],
    picks: [TFSA_RRSP, RRSP, FHSA],
    faqs: [
      ["What is the lowest tax rate in Alberta for 2026?", "8%, on the first $61,200 of taxable income. Federal tax of 14% applies on top of it, for a combined 22% on that first slice of income above the basic personal amounts."],
      ["Is an RRSP worth it in Alberta?", "It depends on your rate now versus your expected rate in retirement. At $80,000 of income in Alberta your combined marginal rate is about 30.5%, so a $5,000 RRSP contribution saves roughly $1,525 this year."],
    ],
  },
  {
    slug: "saskatchewan", name: "Saskatchewan", code: "SK", kind: "province",
    brackets: [[54532, 10.5], [155805, 12.5], [Infinity, 14.5]],
    intro: "Saskatchewan keeps it simple with just three tax brackets: 10.5%, 12.5% and 14.5%. The middle bracket is very wide, running from $54,533 all the way to $155,805, so most working Saskatchewan investors pay the same provincial rate on their next dollar.",
    notes: [
      { h: "Three brackets, one wide middle", body: "Because the 12.5% bracket covers such a wide income range, your provincial rate barely changes between about $55,000 and $155,000. What moves your combined rate in that range is the federal side (20.5% up to $117,045, then 26%)." },
      { h: "The Saskatchewan RESP grant is paused", body: "Saskatchewan's own RESP grant (SAGES) has been suspended since January 1, 2018. Saskatchewan families still get the federal CESG and, for lower incomes, the Canada Learning Bond." },
      { h: "A good province for planning", body: "With so few bracket changes, it's easy to estimate what an RRSP or FHSA contribution is worth. Just read your rate off the table on this page." },
    ],
    picks: [RRSP_FHSA, TFSA_RRSP, FAMILY],
    faqs: [
      ["How many tax brackets does Saskatchewan have?", "Three for 2026: 10.5% up to $54,532, 12.5% up to $155,805, and 14.5% above that."],
      ["Is there a Saskatchewan RESP grant?", "Not right now. The Saskatchewan Advantage Grant for Education Savings (SAGES) has been suspended since 2018, so Saskatchewan RESPs get the federal CESG only."],
    ],
  },
  {
    slug: "manitoba", name: "Manitoba", code: "MB", kind: "province",
    brackets: [[47000, 10.8], [100000, 12.75], [Infinity, 17.4]],
    intro: "Manitoba has three tax brackets, and the top one starts at just $100,000, far lower than in most provinces. Manitoba has also stopped raising its brackets for inflation, so the $47,000 and $100,000 lines stay put while wages rise.",
    notes: [
      { h: "Brackets frozen at $47,000 and $100,000", body: "From the 2025 tax year Manitoba paused indexing its brackets, which is why the thresholds are round numbers. Each year a raise pushes a little more of your income into the next bracket." },
      { h: "17.4% from $100,000", body: "Manitoba's top rate kicks in at $100,000, well before the top bracket in provinces like Ontario or BC. If you earn a bit over $100,000, RRSP and FHSA deductions come off income taxed at 17.4% provincially plus 20.5% or 26% federally." },
      { h: "No provincial RESP grant", body: "Manitoba doesn't add its own RESP grant. Families get the federal CESG of 20% on the first $2,500 a year per child." },
    ],
    picks: [RRSP, RRSP_FHSA, SPOUSAL],
    faqs: [
      ["When does Manitoba's top tax rate start?", "At $100,000 of taxable income for 2026. Income above that is taxed at 17.4% by Manitoba, plus the federal rate."],
      ["Why haven't Manitoba's brackets changed?", "Manitoba paused bracket indexation starting with the 2025 tax year, so the thresholds stayed at $47,000 and $100,000 for 2026."],
    ],
  },
  {
    slug: "ontario", name: "Ontario", code: "ON", kind: "province",
    brackets: [[53891, 5.05], [107785, 9.15], [150000, 11.16], [220000, 12.16], [Infinity, 13.16]],
    surtax: true,
    intro: "Ontario has five tax brackets plus a surtax on higher incomes, which is why its middle and upper marginal rates jump faster than most provinces. Once the surtax applies, Ontario's top effective rate is 20.53%, not the 13.16% you see in the bracket table.",
    notes: [
      { h: "The Ontario surtax", body: "Ontario adds 20% to your Ontario tax above a first threshold and a further 36% above a second one (56% in total). With only the basic personal amount, that starts at roughly $94,907 and $111,785 of taxable income in 2026. That's why the combined rate leaps from about 31% to over 43% in that range, and why RRSP contributions are worth so much there." },
      { h: "The Ontario Health Premium", body: "Ontario also collects a health premium of up to $900 a year through your tax return, for taxable income over $20,000. It isn't part of the bracket rates on this page." },
      { h: "Where an RRSP pays off most", body: "If your taxable income is between about $95,000 and $120,000, each $1,000 you deduct saves about $310 to $430, depending on where you sit. That's the sweet spot to bring income down with RRSP or FHSA contributions." },
    ],
    picks: [RRSP, RRSP_FHSA, ULTIMATE],
    faqs: [
      ["What is the top tax rate in Ontario for 2026?", "53.53% combined: 33% federal plus 20.53% Ontario (the 13.16% top rate with the 56% surtax on top). It applies to taxable income over $258,482."],
      ["Does the Ontario surtax make RRSP refunds bigger?", "Yes. In the surtax range each dollar you deduct also saves surtax, so the refund is bigger than the bracket rate alone suggests."],
    ],
  },
  {
    slug: "quebec", name: "Quebec", code: "QC", kind: "province",
    brackets: [[54345, 14], [108680, 19], [132245, 24], [Infinity, 25.75]],
    quebec: true,
    intro: "Quebec is the only province that runs its own income tax return. You file the federal T1 with the CRA and a separate TP-1 with Revenu Québec. Quebec's provincial rates are the highest in Canada, but Quebec residents get a 16.5% abatement off their federal tax, and Quebec RESPs collect an extra provincial grant.",
    notes: [
      { h: "Two returns and the federal abatement", body: "Because Quebec collects its own income tax, federal tax for Quebec residents is reduced by 16.5% (the Quebec abatement). The combined rates on this page already include that. Your RRSP and FHSA deductions are claimed on both returns, so they reduce both taxes." },
      { h: "The Quebec Education Savings Incentive (QESI)", body: "Quebec adds 10% on top of the federal CESG, on up to $2,500 of RESP contributions a year per child (up to $250 a year), with more for lower-income families. Over a child's life it can add up to $3,600 to the RESP." },
      { h: "RRSP withdrawals are withheld differently", body: "When you take money out of an RRSP in Quebec, the federal withholding is lower than in the rest of Canada, and Quebec withholds its own provincial tax on top. Your tracker's notes flag this, and the real tax is settled when you file both returns." },
    ],
    picks: [RESP, FAMILY, RRSP],
    faqs: [
      ["Why is Quebec tax different?", "Quebec runs its own income tax system. Residents file a provincial return (TP-1) with Revenu Québec as well as the federal return, and their federal tax is cut by a 16.5% abatement."],
      ["Do Quebec RESPs get more grant money?", "Yes. On top of the federal CESG, the QESI adds 10% of contributions (up to $250 a year per child, more for lower incomes), up to $3,600 per child."],
    ],
  },
  {
    slug: "new-brunswick", name: "New Brunswick", code: "NB", kind: "province",
    brackets: [[52333, 9.4], [104666, 14], [193861, 16], [Infinity, 19.5]],
    intro: "New Brunswick has four tax brackets, and its second bracket jumps straight from 9.4% to 14% at $52,334. That makes New Brunswick one of the provinces where middle-income earners get the most from an RRSP deduction.",
    notes: [
      { h: "A steep second bracket", body: "Going from 9.4% to 14% is one of the biggest jumps between a first and second bracket anywhere in Canada. Combined with the federal rate, a New Brunswick investor at $80,000 is at about 34.5% on the next dollar." },
      { h: "RRSP versus TFSA at middle incomes", body: "Because New Brunswick's middle bracket is high, an RRSP deduction at $55,000 to $105,000 often saves more than you'd pay on the withdrawal in a lower-income retirement. Many people in that range lean RRSP first, TFSA second." },
      { h: "No provincial RESP grant", body: "New Brunswick doesn't add its own RESP grant, so RESPs here collect the federal CESG (and the Canada Learning Bond for lower incomes)." },
    ],
    picks: [RRSP, TFSA_RRSP, RRSP_FHSA],
    faqs: [
      ["What are New Brunswick's tax brackets for 2026?", "9.4% up to $52,333, 14% up to $104,666, 16% up to $193,861, and 19.5% above that."],
      ["How much does an RRSP save in New Brunswick?", "At $80,000 of taxable income the combined marginal rate is about 34.5%, so a $5,000 RRSP contribution saves roughly $1,725."],
    ],
  },
  {
    slug: "nova-scotia", name: "Nova Scotia", code: "NS", kind: "province",
    brackets: [[30995, 8.79], [61991, 14.95], [97417, 16.67], [157124, 17.5], [Infinity, 21]],
    intro: "Nova Scotia's tax brackets start rising early: the second bracket, at 14.95%, begins at just $30,996. For 2026 Nova Scotia also started raising its brackets with inflation for the first time, after years of keeping them fixed.",
    notes: [
      { h: "Brackets now move with inflation", body: "Nova Scotia began indexing its tax brackets in 2026 (by 1.6%), so thresholds are no longer frozen. The bracket lines on this page will change a little every January." },
      { h: "Higher rates at lower incomes", body: "With a 14.95% rate from about $31,000 and 16.67% from about $62,000, Nova Scotia investors reach a 37% combined rate on the next dollar at incomes many other provinces tax at around 30%. RRSP and FHSA deductions go further here." },
      { h: "One of Canada's highest top rates", body: "Nova Scotia's 21% top rate gives a 54% combined top rate, second only to Newfoundland and Labrador." },
    ],
    picks: [RRSP, RRSP_FHSA, FHSA],
    faqs: [
      ["What is the top tax rate in Nova Scotia?", "54% combined for 2026: 33% federal plus 21% Nova Scotia, on taxable income over $258,482."],
      ["Are Nova Scotia tax brackets indexed now?", "Yes. Starting in 2026, Nova Scotia raises its brackets with inflation each year (1.6% for 2026)."],
    ],
  },
  {
    slug: "prince-edward-island", name: "Prince Edward Island", code: "PE", kind: "province",
    brackets: [[33928, 9.5], [65820, 13.47], [106890, 16.6], [142250, 17.62], [200000, 19], [Infinity, 20]],
    intro: "Prince Edward Island has six tax brackets for 2026, after adding a new 20% rate on taxable income over $200,000 from January 1, 2026. Like Nova Scotia, PEI's rates rise quickly at modest incomes.",
    notes: [
      { h: "A new top bracket for 2026", body: "From January 1, 2026, PEI taxes income over $200,000 at 20%, up from 19%. That puts PEI's top combined rate at 53%." },
      { h: "Rates climb fast", body: "PEI's rate goes from 9.5% to 13.47% at $33,929 and to 16.6% at $65,821. For an investor earning $80,000, that's a combined rate of about 37% on the next dollar, so an RRSP or FHSA deduction is worth more than in most provinces at the same income." },
      { h: "No provincial RESP grant", body: "PEI doesn't add its own RESP grant. RESPs here collect the federal CESG and the Canada Learning Bond for lower incomes." },
    ],
    picks: [RRSP, RRSP_FHSA, TFSA_RRSP],
    faqs: [
      ["Did PEI add a new tax bracket in 2026?", "Yes. From January 1, 2026, taxable income over $200,000 is taxed at 20% provincially (it was 19%)."],
      ["How much does an RRSP save in PEI?", "At $80,000 of taxable income the combined marginal rate is about 37.1%, so a $5,000 RRSP contribution saves roughly $1,855."],
    ],
  },
  {
    slug: "newfoundland-and-labrador", name: "Newfoundland and Labrador", code: "NL", kind: "province",
    brackets: [[44678, 8.7], [89354, 14.5], [159528, 15.8], [223340, 17.8], [285319, 19.8], [570638, 20.8], [1141275, 21.3], [Infinity, 21.8]],
    intro: "Newfoundland and Labrador has eight tax brackets, the most in Canada, and the highest top rate: 54.8% combined on income over $1,141,275. For most investors, though, the brackets that matter are the first two, 8.7% and 14.5%.",
    notes: [
      { h: "Eight brackets", body: "The extra brackets only start above $223,340, so most people in the province deal with the 8.7%, 14.5% and 15.8% rates. Read your rate off the table for your income." },
      { h: "Canada's highest top rate", body: "At 21.8% provincially, NL's top rate gives a combined 54.8%, the highest in the country. For high earners, every RRSP dollar deducted saves more than half a dollar of tax." },
      { h: "Northern Labrador", body: "If you live in a prescribed northern zone in Labrador for at least six months in a row, you may also be able to claim the northern residents deduction on Line 25500 of your federal return." },
    ],
    picks: [RRSP, SPOUSAL, TFSA_RRSP],
    faqs: [
      ["What is the highest tax rate in Canada?", "Newfoundland and Labrador's, at 54.8% combined (33% federal plus 21.8% provincial) on taxable income over $1,141,275 in 2026."],
      ["How many tax brackets does Newfoundland and Labrador have?", "Eight for 2026, from 8.7% on the first $44,678 up to 21.8% above $1,141,275."],
    ],
  },
  {
    slug: "yukon", name: "Yukon", code: "YT", kind: "territory",
    brackets: [[58523, 6.4], [117045, 9], [181440, 10.9], [500000, 12.8], [Infinity, 15]],
    north: true,
    intro: "Yukon's tax brackets line up with the federal ones up to $181,440, which makes Yukon tax easy to estimate: the federal and territorial rates change at the same incomes. Yukon residents can also claim the northern residents deduction.",
    notes: [
      { h: "Brackets that match the federal ones", body: "Yukon's 6.4%, 9% and 10.9% brackets end at the same $58,523, $117,045 and $181,440 as the federal brackets. The 12.8% rate then runs all the way to $500,000, and only income above that is taxed at 15%." },
      { h: "The northern residents deduction", body: "If you've lived in a prescribed northern zone (all of Yukon qualifies) for at least six consecutive months, you can claim a residency deduction and, in some cases, a travel deduction on Line 25500. It lowers your taxable income, just like an RRSP contribution." },
      { h: "A moderate top rate", body: "Yukon's combined top rate is 48%, and it only applies above $500,000, so high earners in Yukon keep more than in most provinces." },
    ],
    picks: [TFSA_RRSP, RRSP, FHSA],
    faqs: [
      ["Do Yukon tax brackets match the federal ones?", "Up to $181,440, yes. Yukon's first three brackets end at the same incomes as the federal brackets for 2026."],
      ["Can Yukon residents claim the northern residents deduction?", "Yes. All of Yukon is in a prescribed northern zone, so residents who've lived there at least six months in a row can claim it on Line 25500."],
    ],
  },
  {
    slug: "northwest-territories", name: "Northwest Territories", code: "NT", kind: "territory",
    brackets: [[53003, 5.9], [106009, 8.6], [172346, 12.2], [Infinity, 14.05]],
    north: true,
    intro: "The Northwest Territories has four tax brackets and some of the lowest rates in Canada, starting at 5.9%. Add the northern residents deduction, and NWT investors often pay noticeably less tax than people with the same income in the south.",
    notes: [
      { h: "Low rates up to about $106,000", body: "The NWT taxes the first $53,003 at 5.9% and the next slice to $106,009 at 8.6%. Combined with federal tax, that's about 29% on the next dollar at $80,000." },
      { h: "The northern residents deduction", body: "All of the NWT is in a prescribed northern zone. After six consecutive months living there you can claim the residency deduction (and sometimes a travel deduction) on Line 25500, which lowers taxable income on top of any RRSP or FHSA deduction." },
      { h: "TFSA often goes first", body: "Because NWT rates are low at middle incomes, the RRSP deduction is worth a bit less than in most provinces. If you expect to retire somewhere with higher taxes, the TFSA can be the smarter first stop. Check both with the table here." },
    ],
    picks: [TFSA_RRSP, FHSA, FAMILY],
    faqs: [
      ["What are the Northwest Territories tax brackets for 2026?", "5.9% up to $53,003, 8.6% up to $106,009, 12.2% up to $172,346, and 14.05% above that."],
      ["What is the top tax rate in the NWT?", "47.05% combined for 2026: 33% federal plus 14.05% territorial, on taxable income over $258,482."],
    ],
  },
  {
    slug: "nunavut", name: "Nunavut", code: "NU", kind: "territory",
    brackets: [[55801, 4], [111602, 7], [181439, 9], [Infinity, 11.5]],
    north: true,
    intro: "Nunavut has the lowest income tax rates in Canada: 4% on the first $55,801 and a top rate of just 11.5%. Its 44.5% combined top rate is the lowest in the country, and residents can also claim the northern residents deduction.",
    notes: [
      { h: "Canada's lowest rates", body: "At 4%, 7%, 9% and 11.5%, Nunavut's rates are the lowest of any province or territory. A Nunavut investor earning $80,000 pays about 27.5% combined on the next dollar." },
      { h: "The northern residents deduction", body: "All of Nunavut is in a prescribed northern zone. After six consecutive months living there you can claim the residency deduction (and sometimes a travel deduction) on Line 25500." },
      { h: "Think about where you'll retire", body: "With such low rates, an RRSP deduction in Nunavut saves less now than it would elsewhere. If you plan to retire in a higher-tax province, the withdrawal could be taxed at a higher rate than you saved, which is a point in favour of the TFSA first." },
    ],
    picks: [TFSA_RRSP, FHSA, RESP],
    faqs: [
      ["Which province or territory has the lowest income tax?", "Nunavut. Its 2026 rates start at 4% and top out at 11.5%, for a 44.5% combined top rate, the lowest in Canada."],
      ["Is an RRSP worth it in Nunavut?", "It can be, but it saves less than in the south. At $80,000 the combined marginal rate is about 27.5%, so a $5,000 RRSP contribution saves roughly $1,375. Compare that with the rate you expect in retirement."],
    ],
  },
];

export const provinceBySlug = (slug) => PROVINCES.find((p) => p.slug === slug);

const money = (n) => "$" + Math.round(n).toLocaleString("en-CA");
export { money };

export function provinceMeta(p) {
  return {
    title: `${p.name} Tax Brackets ${TAX_YEAR} & Investing Guide | MapleSheet`,
    description: `${p.name}'s ${TAX_YEAR} tax brackets, your combined federal + ${p.kind === "territory" ? "territorial" : "provincial"} rate, what an RRSP saves you, and how to set ${p.code} in your MapleSheet tracker.`,
  };
}

export const PROVINCES_HUB_META = {
  title: `Tax Brackets by Province ${TAX_YEAR} — Investing Guides | MapleSheet`,
  description: `${TAX_YEAR} tax brackets and combined marginal rates for all 13 provinces and territories, what an RRSP saves you in each, and how to set your province in your tracker.`,
};
