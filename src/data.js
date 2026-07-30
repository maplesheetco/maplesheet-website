// ─── MapleSheet Co. — central data & config ─────────────────────
// Lino: this is the ONE file you'll edit most often.

export const CONFIG = {
  shopUrl: "https://maplesheetco.etsy.com",
  calcUrl: "https://claude.ai/public/artifacts/1620ddd7-219c-4052-8557-2a8c6d63e7fb",
  email: "hello@maplesheet.ca",
  xUrl: "https://x.com/MapleSheetCo",
  youtubeUrl: "https://www.youtube.com/@MapleSheetCo", // ← Lino: confirm handle
  affiliateUrl: "https://payhip.com/auth/register/af6a64b512341ea",
  promoCode: "MAPLE25",
  promoText: "25% off everything with code MAPLE25",
  // Web3Forms: create a free access key at https://web3forms.com (enter hello@maplesheet.ca)
  // and paste it below to activate the contact + newsletter forms:
  web3formsKey: "88c72f3b-a279-446a-871b-91d29a308bc5",
};

export const B = {
  black: "#131312",
  black2: "#1B1B1A",
  black3: "#232322",
  white: "#FFFFFF",
  red: "#CC0000",
  redHover: "#DC2626",
  gray: "#5C5C5B",
  grayLight: "#9C9C9A",
  line: "#2E2E2C",
  yellow: "#FCD34D",
};

export const PRODUCTS = [
  { name: "TFSA Tracker", tag: "TFSA", price: 9.99, url: "https://www.etsy.com/listing/4529134188", directUrl: "https://payhip.com/b/rb9SR", desc: "Live prices, ACB, dividends, tax-free growth" },
  { name: "RRSP Tracker", tag: "RRSP", price: 9.99, url: "https://www.etsy.com/listing/4529584584", directUrl: "https://payhip.com/b/DQS5l", desc: "Contribution room, live prices, ACB" },
  { name: "TFSA Multi-Brokerage Tracker", tag: "TFSA", price: 9.99, url: "https://www.etsy.com/listing/4541253114", directUrl: "https://payhip.com/b/8CqQU", desc: "Up to 8 brokerages in one sheet — the only one of its kind", badge: "NEW" },
  { name: "RESP Tracker", tag: "RESP", price: 14.99, url: "https://www.etsy.com/listing/4530779418", directUrl: "https://payhip.com/b/w8PXD", desc: "CESG grants, up to 4 beneficiaries" },
  { name: "FHSA Tracker", tag: "FHSA", price: 14.99, url: "https://www.etsy.com/listing/4534938230", directUrl: "https://payhip.com/b/dEXy3", desc: "First Home Savings, Line 20805 tax dashboard" },
  { name: "Margin Account Tracker", tag: "Margin", price: 14.99, url: "https://www.etsy.com/listing/4534229751", directUrl: "https://payhip.com/b/yKoBQ", desc: "ACB, capital gains tax dashboard" },
  // ⚠️ Lino: double-check this one — you sent "fSgIz" (capital I), earlier test-purchase record shows "fSglz" (lowercase l). Same-looking chars, please verify against your Payhip dashboard before publishing.
  { name: "TFSA + RRSP Tracker", tag: "Combo", price: 19.99, url: "https://www.etsy.com/listing/4522093988", directUrl: "https://payhip.com/b/fSgIz", desc: "Our original — both registered accounts, one sheet" },
  { name: "RRSP + Spousal RRSP Tracker", tag: "Combo", price: 19.99, url: "https://www.etsy.com/listing/4535354991", directUrl: "https://payhip.com/b/mdRzx", desc: "Income splitting, attribution rules, Line 208" },
  { name: "TFSA + Margin Linked Tracker", tag: "Combo", price: 24.99, url: "https://www.etsy.com/listing/4534821592", directUrl: "https://payhip.com/b/dOqcI", desc: "Linked accounts with collateral tax dashboard" },
  { name: "TFSA + RRSP + Margin Tracker", tag: "Combo", price: 27.99, url: "https://www.etsy.com/listing/4523804765", directUrl: "https://payhip.com/b/29CVO", desc: "Registered + taxable in one place" },
  { name: "TFSA + RRSP + RESP Tracker", tag: "Combo", price: 27.99, url: "https://www.etsy.com/listing/4526534020", directUrl: "https://payhip.com/b/DrfbA", desc: "Family bundle with CESG maximizer" },
  { name: "TFSA + RRSP + RESP + Margin", tag: "Combo", price: 34.99, url: "https://www.etsy.com/listing/4528655460", directUrl: "https://payhip.com/b/xNGr1", desc: "Four accounts — ACB, CESG, capital gains" },
  { name: "Ultimate Tracker — All 5 Accounts", tag: "Flagship", price: 44.99, url: "https://www.etsy.com/listing/4536628550", directUrl: "https://payhip.com/b/wkqoH", desc: "TFSA + RRSP + RESP + FHSA + Margin. Everything, one sheet.", badge: "FLAGSHIP" },
];

// ─── Resources: add a new object to the TOP of this list to publish a post.
// type: "video" (YouTube embed) or "article" (text post)
// For videos: youtubeId is the part after v= in the URL (e.g. dQw4w9WgXcQ)
export const RESOURCES = [
  {
    type: "article",
    title: "TFSA Contribution Room in 2026: The Complete Guide",
    date: "2026-07-30",
    summary: "The 2026 TFSA limit, how cumulative room actually adds up, and the withdrawal rule that trips up even experienced investors.",
    body: [
      "The TFSA annual dollar limit for 2026 is $7,000 — the third year in a row it's held at that number after a run of increases. If you've been eligible since the TFSA started in 2009 and have never contributed, your cumulative room now sits at $109,000.",
      "## How contribution room actually adds up",
      "Room isn't just this year's $7,000. It's the sum of every annual limit since the year you turned 18 (or since 2009, whichever is later), plus any amount you've withdrawn in a previous calendar year, minus whatever you've already contributed. Unused room never expires — it carries forward indefinitely, which is exactly why long-time TFSA holders can have six-figure room even if they've barely contributed.",
      "## The withdrawal rule that catches people off guard",
      "Withdrawing money from a TFSA doesn't shrink your lifetime room — but it also doesn't restore it immediately. If you pull out $5,000 this year, that $5,000 gets added back to your room on January 1 of next year, not the same day you withdraw it. Contribute that same $5,000 again before the calendar flips, and you've over-contributed, which triggers a 1% per month penalty on the excess until it's withdrawn.",
      "## Why this is hard to track by hand",
      "The CRA's own portal often lags behind your actual contributions, especially early in the year — which means the number it shows you isn't always the number you can safely rely on. Between multiple brokerages, withdrawals from prior years, and this year's fresh room, keeping an accurate running total takes more than memory.",
      "That's the exact problem our TFSA trackers solve — automatic room calculation that accounts for withdrawals, carry-forward, and multiple institutions, so you're never guessing.",
    ],
  },
  {
    type: "article",
    title: "RRSP Deduction Limit vs. Contribution Room: What's the Difference?",
    date: "2026-07-28",
    summary: "They sound like the same number. They're usually not — and mixing them up is one of the most common RRSP mistakes.",
    body: [
      "Your RRSP contribution room for 2026 is 18% of your 2025 earned income, up to a maximum of $33,810. That's the ceiling the CRA sets on how much new room you earn this year. But the number on your Notice of Assessment — your deduction limit — isn't the same thing, and the difference matters at tax time.",
      "## Contribution room vs. deduction limit",
      "Contribution room is the running total of everything you're allowed to have contributed, ever — this year's new room plus any unused room carried forward from every prior year. Your deduction limit, shown on your CRA Notice of Assessment, is that same figure adjusted for a few extra factors: a pension adjustment if you belong to an employer pension plan, and any contributions you've already made that haven't been deducted yet. For most people without a workplace pension, the two numbers are close. For anyone with a pension plan, they can diverge meaningfully.",
      "## The first-60-days rule",
      "RRSP contributions made in the first 60 days of a calendar year can be applied to either that year or the previous year's tax return — your choice. This is the single most useful piece of RRSP timing flexibility available, and it's also the rule most people forget exists until their accountant asks about it in March.",
      "## What earned income doesn't include",
      "Investment income, capital gains, and pension income don't count toward earned income for RRSP room purposes — only employment, self-employment, and a few other specific categories do. If most of your income comes from investments, your RRSP room may grow slower than you'd expect.",
      "Our RRSP trackers pull your actual deduction limit as an editable field rather than assuming a flat number, so the tracker matches what your Notice of Assessment actually says — not a generic formula.",
    ],
  },
  {
    type: "article",
    title: "How Adjusted Cost Base (ACB) Works for Canadian Investors",
    date: "2026-07-26",
    summary: "The number that determines how much tax you actually owe when you sell — and why most spreadsheets get it wrong.",
    body: [
      "Adjusted cost base, or ACB, is what the CRA uses to figure out your capital gain or loss when you sell an investment. Get it wrong, and you either overpay tax or under-report — neither of which you want to explain in an audit.",
      "## The core formula",
      "ACB is your average cost per share across every purchase of that security, not the price of your most recent buy. Every time you buy more shares of something you already hold, your ACB recalculates as a weighted average of the old and new cost. Sell shares, and your ACB per remaining share stays the same — only the total drops proportionally.",
      "## Capital gains stay at the 50% inclusion rate",
      "For 2026, capital gains are still taxed at the 50% inclusion rate — meaning only half of your gain gets added to your taxable income. A proposed increase to two-thirds on gains above $250,000 was cancelled, so the math investors have used for years still applies. Your gain is simply your sale proceeds minus your ACB, minus any transaction costs, with half of that result taxed at your marginal rate.",
      "## Why this gets complicated fast",
      "Dividend reinvestment plans, stock splits, return-of-capital distributions, and buying the same stock across multiple brokerages all adjust your ACB — and most people's mental math (or a basic spreadsheet) doesn't account for all of it. A single missed adjustment years ago compounds into a wrong number today.",
      "This is exactly why our Margin and multi-brokerage trackers calculate ACB automatically as you log each transaction, instead of asking you to track a running average by hand.",
    ],
  },
  {
    type: "article",
    title: "Welcome to MapleSheet Resources",
    date: "2026-07-22",
    summary: "Why we built this page, and what's coming: tracker tutorials, Canadian investing guides, and product updates.",
    body: "This is the learning hub of MapleSheet Co. We believe you should understand your money before you track it — so alongside our products, we'll be posting free guides on TFSA contribution room, RRSP limits, ACB and capital gains, CESG grants, and walkthroughs of every tracker we make. New videos land on our YouTube channel first, then get posted here with notes. Subscribe to the newsletter below and you'll never miss one.",
  },
  // Example video post — Lino: replace youtubeId with a real video and set live: true
  {
    type: "video",
    title: "Tracker walkthrough (video coming soon)",
    date: "2026-07-22",
    summary: "Our first walkthrough video will appear here — how to set up your MapleSheet tracker in under 10 minutes.",
    youtubeId: "",
    live: false,
  },
];

export const FAQS = [
  ["Do I need Excel or Google Sheets?", "Google Sheets — which is free with any Google account. No Excel needed, no software to install. You'll receive a link, click 'Make a copy', and the tracker is yours."],
  ["Is this a subscription?", "No. One-time purchase, yours forever. Free updates to the version you bought, and no recurring fees of any kind."],
  ["How do live prices work?", "Trackers use Google's built-in GOOGLEFINANCE function to pull live stock and ETF quotes automatically — CAD and USD, with automatic currency conversion."],
  ["Will it work on my phone?", "Yes — through the free Google Sheets app. The dashboards are designed on desktop but fully usable on mobile."],
  ["Does it handle Canadian tax rules?", "That's the whole point. TFSA contribution room, RRSP deduction limits, FHSA Line 20805, CESG grant tracking, ACB and capital gains with the 50% inclusion rate — built the CRA way."],
  ["What if I need help?", "Email us. Every buyer gets personal support from Lino directly — no bots, no auto-replies."],
  ["What's your refund policy?", "Because these are instant digital downloads, Etsy's digital-goods policy applies — but if something isn't working, contact us first. We fix problems."],
];
