// ─── MapleSheet Co. — central data & config ─────────────────────
// Lino: this is the ONE file you'll edit most often.

export const CONFIG = {
  shopUrl: "https://maplesheetco.etsy.com",
  calcUrl: "https://claude.ai/public/artifacts/1620ddd7-219c-4052-8557-2a8c6d63e7fb",
  email: "hello@maplesheet.ca",
  xUrl: "https://x.com/MapleSheetCo",
  youtubeUrl: "https://www.youtube.com/@MapleSheetCo", // ← Lino: confirm handle
  promoCode: "MAPLE25",
  promoText: "25% off everything with code MAPLE25",
  // Web3Forms: create a free access key at https://web3forms.com (enter hello@maplesheet.ca)
  // and paste it below to activate the contact + newsletter forms:
  web3formsKey: "PASTE_WEB3FORMS_ACCESS_KEY_HERE",
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
  { name: "TFSA Tracker", tag: "TFSA", price: 9.99, url: "https://www.etsy.com/listing/4529134188", desc: "Live prices, ACB, dividends, tax-free growth" },
  { name: "RRSP Tracker", tag: "RRSP", price: 9.99, url: "https://www.etsy.com/listing/4529584584", desc: "Contribution room, live prices, ACB" },
  { name: "TFSA Multi-Brokerage Tracker", tag: "TFSA", price: 9.99, url: "https://www.etsy.com/listing/4541253114", desc: "Up to 8 brokerages in one sheet — the only one of its kind", badge: "NEW" },
  { name: "RESP Tracker", tag: "RESP", price: 14.99, url: "https://www.etsy.com/listing/4530779418", desc: "CESG grants, up to 4 beneficiaries" },
  { name: "FHSA Tracker", tag: "FHSA", price: 14.99, url: "https://www.etsy.com/listing/4534938230", desc: "First Home Savings, Line 20805 tax dashboard" },
  { name: "Margin Account Tracker", tag: "Margin", price: 14.99, url: "https://www.etsy.com/listing/4534229751", desc: "ACB, capital gains tax dashboard" },
  { name: "TFSA + RRSP Tracker", tag: "Combo", price: 19.99, url: "https://www.etsy.com/listing/4522093988", desc: "Our original — both registered accounts, one sheet" },
  { name: "RRSP + Spousal RRSP Tracker", tag: "Combo", price: 19.99, url: "https://www.etsy.com/listing/4535354991", desc: "Income splitting, attribution rules, Line 208" },
  { name: "TFSA + Margin Linked Tracker", tag: "Combo", price: 24.99, url: "https://www.etsy.com/listing/4534821592", desc: "Linked accounts with collateral tax dashboard" },
  { name: "TFSA + RRSP + Margin Tracker", tag: "Combo", price: 27.99, url: "https://www.etsy.com/listing/4523804765", desc: "Registered + taxable in one place" },
  { name: "TFSA + RRSP + RESP Tracker", tag: "Combo", price: 27.99, url: "https://www.etsy.com/listing/4526534020", desc: "Family bundle with CESG maximizer" },
  { name: "TFSA + RRSP + RESP + Margin", tag: "Combo", price: 34.99, url: "https://www.etsy.com/listing/4528655460", desc: "Four accounts — ACB, CESG, capital gains" },
  { name: "Ultimate Tracker — All 5 Accounts", tag: "Flagship", price: 44.99, url: "https://www.etsy.com/listing/4536628550", desc: "TFSA + RRSP + RESP + FHSA + Margin. Everything, one sheet.", badge: "FLAGSHIP" },
];

// ─── Resources: add a new object to the TOP of this list to publish a post.
// type: "video" (YouTube embed) or "article" (text post)
// For videos: youtubeId is the part after v= in the URL (e.g. dQw4w9WgXcQ)
export const RESOURCES = [
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
