// ─── Extra content for tracker detail pages ─────────────────────
// Page content (slug, long description, feature list) for trackers whose
// entry in data.js doesn't have its own /trackers/:slug page yet. Kept in a
// separate file so it never touches the price/checkout/delivery fields in
// data.js. Matched by SKU, and anything data.js already sets wins — so if a
// product later gets a slug or description in data.js, that one is used.
//
// Every feature listed here is taken from the product's own screenshot or
// its existing description in data.js — don't add features the sheet
// doesn't actually have.
import { PRODUCTS } from "./data.js";

const PAGE_EXTRAS = {
  "MS-RESP-01": {
    slug: "resp-tracker",
    accounts: ["RESP"],
    longDescription: "A Google Sheets RESP tracker for Canadian parents: live prices, automatic ACB, and CESG grant tracking for up to 4 children, all in one sheet.",
    features: [
      "CESG grant tracking for up to 4 beneficiaries",
      "Live prices via GOOGLEFINANCE for up to 25 holdings",
      "Adjusted cost base (ACB) calculated automatically from your Transaction Log",
      "Total market value, cost basis, gain/loss, and return % at a glance",
      "Holdings allocation chart and a market value vs. cost basis chart, built in",
    ],
  },
  "MS-FHSA-01": {
    slug: "fhsa-tracker",
    accounts: ["FHSA"],
    longDescription: "An FHSA tracker for first-time home buyers in Canada: portfolio value, contribution room, tax-free dividends and down payment progress in one Google Sheet.",
    features: [
      "Main Dashboard with live portfolio value, contributions this year, contribution room remaining, and dividends year to date",
      "Down Payment Progress: set your withdrawal goal and target year, and see your progress % and years until purchase",
      "Optional RRSP Home Buyers' Plan goal, combined with your FHSA for your total down payment power",
      "Tax-free dividends charted month by month",
      "Holdings allocation chart with live prices via GOOGLEFINANCE",
      "Line 20805 tax dashboard for your FHSA deduction",
    ],
  },
  "MS-MARGIN-01": {
    slug: "margin-account-tracker",
    accounts: ["Margin"],
    longDescription: "A margin account tracker for Canadians: automatic ACB and capital gains, the Line 22100 interest deduction, and the break-even yield to cover your borrowing.",
    features: [
      "Automatic adjusted cost base (ACB) and a capital gains tax dashboard",
      "Margin interest paid this year, ready for your Line 22100 carrying-charges deduction",
      "Break-even yield compared with your portfolio's actual dividend yield",
      "Net income after interest, so you can see whether your leverage is paying off",
      "Monthly margin interest chart, filled in automatically from your Transaction Log",
      "Holdings allocation and market value vs. cost basis charts, with live prices via GOOGLEFINANCE",
    ],
  },
};

// PRODUCTS with the extra page content merged in. Use this (not PRODUCTS)
// anywhere that decides which trackers get a page.
export const CATALOG = PRODUCTS.map((p) => ({ ...PAGE_EXTRAS[p.sku], ...p }));

// The best single picture of a tracker: its main screenshot, else the
// dashboard/overview tab from its gallery (the gallery's first tab is often
// "Start Here" instructions), else nothing.
export function cardImage(p) {
  return p.screenshot
    || p.gallery?.find((g) => /dashboard|overview/i.test(g.label))?.src
    || p.gallery?.[0]?.src
    || null;
}
