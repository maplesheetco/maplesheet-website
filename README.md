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
