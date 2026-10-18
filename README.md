# 🍁 MapleSheet Co. — Official Website (maplesheet.ca)

Multi-page React site: Home · Trackers · Free Tools · Resources · About · Contact

## How to deploy (one time)
1. Go to github.com → your repositories → **New** → name it `maplesheet-website` → Create
2. On the empty repo page, click **"uploading an existing file"**
3. Drag ALL files/folders from this zip (NOT the zip itself) → Commit
4. Go to vercel.com → **Add New → Project** → Import `maplesheet-website` → **Deploy**
5. Test the temporary vercel.app link Vercel gives you
6. Vercel → Project → Settings → **Domains** → add `maplesheet.ca` → follow the DNS
   instructions (paste the shown records into Spaceship → Domain → DNS settings)
7. Wait up to ~1 hour → https://maplesheet.ca is live 🎉

## Files you'll edit later (only these!)
- `src/data.js` — products, prices, resources/posts, FAQ, links, promo code.
  To publish a new Resource post: add an object to the TOP of the RESOURCES list.
- To activate the contact form + newsletter box:
  1. Go to web3forms.com → enter hello@maplesheet.ca → copy your free Access Key
  2. Paste it into `web3formsKey` in `src/data.js`
  (Until then, both forms show a friendly "email us instead" message.)

## Updating the live site
Edit the file on GitHub (pencil icon) → Commit → Vercel redeploys automatically in ~60s.

## Still to do (Phase 3, with Claude)
- [ ] Web3Forms key (5 min)
- [ ] hello@maplesheet.ca forwarding via ImprovMX or Cloudflare (20 min)
- [ ] Confirm YouTube channel URL in src/data.js (currently a guess)
- [ ] Phase B: direct checkout (Payhip) → replace "Direct — soon" buttons
- [ ] Phase C: newsletter service (MailerLite) if list grows beyond inbox-manageable
- [x] Paste the real RRSP Google Sheet link into `src/data.js` → `delivery.sheetUrl`
- [x] Stripe Dashboard → RRSP Payment Link → "After the payment" → redirect to
      `https://www.maplesheet.ca/checkout/return?session_id={CHECKOUT_SESSION_ID}`
- [x] Set up the email delivery backup (`api/stripe-webhook.js`) — see below
- [x] RRSP Multi-Brokerage Tracker is fully live: Stripe Buy Button, real
      sheet link, 3 delivery PDFs, backup email, all tested with a real
      purchase + refund.

### TFSA Multi-Brokerage Tracker — fully live
- [x] `src/data.js` entry built out (gallery, overview, features, included,
      delivery.pdfs) from the real tracker screenshots
- [x] 3 delivery PDFs built (Template Link, User Guide, TFSA Government
      Rules — figures verified against current CRA/third-party sources)
- [x] Stripe Product + Payment Link + Buy Button created, pasted into
      `src/data.js`
- [x] Payment Link metadata confirmed: `sku` = `MS-TFSA-MB`
- [x] Payment Link "After the payment" redirect confirmed set to
      `https://www.maplesheet.ca/checkout/return?session_id={CHECKOUT_SESSION_ID}`
- [x] Real TFSA Multi-Brokerage Google Sheet link swapped into
      `delivery.sheetUrl`, and `pdfbuild/build_tfsa_mb_templatelink.py`
      rerun so the Template Link PDF matches (⚠️ still double-check Share
      settings = "Anyone with the link" → Viewer)
- [x] Real test purchase confirmed working end to end (sheet link, PDFs,
      Thank You redirect)

### Canadian Ultimate Tracker — All 5 Accounts (really 6: TFSA, RRSP,
### Spousal RRSP, RESP, FHSA, Margin — 15 tabs) — fully live
- [x] `src/data.js` entry fully built out (gallery of 13 real screenshots,
      overview, features, included, delivery) from your real P12 Ultimate
      Tracker v1.0 screenshots + PDFs
- [x] Delivery sheet link wired up — real "make a copy" link from your own
      P12_Template_Link.pdf, Share settings not yet independently confirmed
      (double-check it's "Anyone with the link" → Viewer)
- [x] 3 delivery PDFs added — your own real P12_Template_Link.pdf,
      P12_Clear_Sample_Data_Guide.pdf, and P12_CRA_Rules_and_Complete_Guide.pdf,
      copied in as-is and relabeled to match the site's /downloads naming
      (see the comment above this product's `delivery` block in src/data.js —
      these 3 PDFs all have a "maplesheeet.etsy.com" typo in the footer,
      worth fixing next time you touch them)
- [x] Stripe Buy Button pasted into `src/data.js`
- [x] Payment Link metadata confirmed: `sku` = `MS-FLAGSHIP-ULTIMATE`
- [x] Payment Link "After the payment" redirect confirmed working (real
      test purchase landed on the on-site Thank You page)
- [x] MAPLE25 discount confirmed working end to end (checkout total and
      actual charged amount both correctly showed $33.74 after 25% off)
- [x] Real test purchase confirmed working end to end

### RRSP Multi-Brokerage Tracker — fully live
- [x] Real sheet link, 3 delivery PDFs, Stripe Buy Button (done earlier)
- [x] Payment Link "After the payment" redirect fixed — was still set to
      "Show confirmation page" instead of the custom redirect; corrected
- [x] Payment Link metadata fixed — `sku` was accidentally set to
      `MS-TFSA-MB` (the two Payment Links' metadata had gotten crossed when
      both were set up around the same time), corrected to `MS-RRSP-MB`
- [x] TFSA-MB's Payment Link metadata double-checked too, in case of the
      mirrored mistake — confirmed correctly set to `MS-TFSA-MB`
- [x] Real test purchase confirmed working end to end (own sheet link this
      time, not TFSA's)

### TFSA + RRSP + RESP + Margin Tracker — fully live
- [x] `src/data.js` entry fully built out (gallery of 9 real screenshots,
      overview, features, included, delivery) from your real P4 screenshots
      + PDFs
- [x] Delivery sheet link wired up — real "make a copy" link from your own
      P4 Template Link, Share settings not yet independently confirmed
      (double-check it's "Anyone with the link" → Viewer)
- [x] 6 delivery PDFs added — Template Link (rebuilt with your current
      logo/brand colors, old one had a leftover navy/green logo), Clear
      Sample Data Guide, and 4 separate account guides (TFSA, RRSP, RESP,
      Margin — this product ships one guide per account instead of a single
      combined CRA doc). The 5 guide PDFs are your own real P4_*.pdf files,
      copied in as-is (same "maplesheeet.etsy.com" footer typo as Ultimate's
      PDFs, not fixed — worth a batch fix across all of them sometime)
- [x] Stripe Buy Button pasted into `src/data.js`
- [x] Real test purchase confirmed — Template Link + sheet delivery working,
      MAPLE25 discount applying correctly
- [ ] Still to confirm: Thank You redirect page, the other 5 PDFs in the
      bundle (not just Template Link), and that the Payment Link's `sku`
      metadata is set to `MS-COMBO-TFSA-RRSP-RESP-MARGIN` (not crossed with
      another product — see the RRSP/TFSA mix-up above for why this matters)

**4 of 14 products now migrated to MapleSheet's own direct Stripe checkout**
(RRSP-MB, TFSA-MB, Ultimate, TFSA+RRSP+RESP+Margin). 10 products still sell
through Etsy/Payhip only. All 4 migrated so far are metadata-correct,
redirect-correct, delivery-correct, with MAPLE25 verified on the first 3 and
partially verified on the 4th. ⚠️ Remember to refund any remaining test
charges in Stripe Dashboard → Payments.

### MAPLE25 launch discount — missing on Stripe checkout
The site shows "🏷 25% off everything with code MAPLE25" (`CONFIG.promoText`
in `src/data.js`) on the homepage, the Trackers catalog, and every tracker
detail page — including the 3 products that now check out through Stripe
(RRSP-MB, TFSA-MB, Ultimate). But `CONFIG.promoCode` is just display text;
nothing in the code wires it into Stripe. A Stripe Buy Button only shows a
promo-code field at checkout if that's turned on for the Payment Link *and*
a matching coupon/promotion code exists in Stripe — right now, almost
certainly neither is set up, so buyers on those 3 products see the code
advertised but have nowhere to enter it.
- [ ] Stripe Dashboard → Product catalog → Coupons → Create coupon → 25%
      off → "Redeem by" = **January 16, 2027** (the real end date for this
      launch discount)
- [ ] On that coupon → Create promotion code → code = `MAPLE25` (must match
      exactly, case-sensitive)
- [ ] On each of the 3 Payment Links (RRSP-MB, TFSA-MB, Ultimate) → Edit
      link → turn on **"Allow promotion codes"** → Update link
      (one coupon + one promotion code covers all 3 Payment Links — no need
      to recreate it per product)
- [ ] Separately confirm Etsy and Payhip each have their own MAPLE25 coupon
      configured — those are both independent of Stripe and of each other

## Email delivery backup (api/stripe-webhook.js)

The on-site `/checkout/return` page is the main way buyers get their download
links. This webhook is a second, automatic path: the moment Stripe confirms a
payment, it emails the buyer the same links directly — so they're still
covered even if they close the tab before the on-site page loads.

One-time setup, in order:
1. **Stripe** → Developers → Webhooks → Add endpoint
   - URL: `https://www.maplesheet.ca/api/stripe-webhook`
   - Events to send: `checkout.session.completed`
   - Copy the "Signing secret" it shows you (starts with `whsec_`)
2. **Resend** (resend.com) → sign up (free, 3,000 emails/month) → Dashboard →
   API Keys → Create API Key → copy it
3. **Vercel** → this project → Settings → Environment Variables → add:
   - `STRIPE_WEBHOOK_SECRET` = the `whsec_...` value from step 1
   - `RESEND_API_KEY` = the `re_...` value from step 2
   - Redeploy (or it picks these up on the next deploy automatically)
4. **Test it**: Stripe Dashboard → your webhook endpoint → "Send test webhook"
   → `checkout.session.completed`, then check Vercel → Deployments →
   Functions → `stripe-webhook` logs for errors. For a real end-to-end check,
   switch Stripe to test mode and pay with card `4242 4242 4242 4242` through
   the live Buy Button, then confirm the email actually lands in your inbox.
5. Once Resend's domain verification is done (Resend → Domains, a few DNS
   records), change `FROM_EMAIL` in `api/stripe-webhook.js` from the shared
   `onboarding@resend.dev` test address to something on your own domain.
