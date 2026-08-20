# Podlink — Sitemap & Information Architecture Plan

**Written:** 2026-08-18
**Context:** adding six services pages puts a second business on `podlink.ai`.
This is the surface map, the keyword collision risk, and the ship order.
Companion to `claude/podlink-services-evidence-brief.md`.

---

## 1. Four surfaces, one brand

| Host | What it is | Status |
|---|---|---|
| `podlink.ai` | The marketing site — Next.js on Vercel. Product today; product **+ services** after this. The only host that should rank for anything commercial. | 21 pages, blocked on Vercel repo access |
| `app.podlink.ai` | The product (MagicAI on Railway) — **but also serving a complete duplicate marketing site** at `/` and `/features`. Two public marketing sites with near-identical copy. | ⚠️ Decide before DNS cutover |
| `podlink.fm` | Creator link-in-bio pages. Root 302s to podlink.ai; `/{handle}` and `/directory` still serve. The directory is an unused long-tail asset. | Live |
| `checkout.podlink.ai` | **Checkout only.** Shopify hosts checkout — it cannot run on Vercel. This is the one hostname commerce genuinely requires. | Not started |

---

## 2. Today — 21 pages, one audience

```
/                        live
/features                live
/features/[slug] ×8      live   download-analytics · transcripts · show-notes ·
                                templates · multilingual · clips-and-social ·
                                newsletter · link-in-bio
/pricing                 noindex, excluded from sitemap
/legal/{terms,privacy}   noindex placeholders
```

**The structural gap:** every page sells an $8–39/month self-serve product.
Nothing addresses the buyer who wants work done for them at $275/episode to
$6,750/month — which is where the entire revenue history actually sits.

---

## 3. Phase 1 — services + dependencies (→ 28 pages)

```
/services                            built, not merged
/services/podcast-editing            built
/services/podcast-clips              built   ← strongest page (1M likes on one clip)
/services/podcast-advertising        built   brands, buy-side
/services/podcast-sponsorship        built   creators, sell-side
/services/get-booked-on-podcasts     built
/services/podcast-growth             built
/contact                             REQUIRED — every services CTA 404s today
```

Mechanical edits: add Services to `SiteHeader`; extend `sitemap.ts`, which
currently derives entries from the feature list only.

---

## 4. The real risk — features vs. services cannibalization

Six of eight feature pages target keywords the services pages also want. Left
alone, Google picks one, splits authority, and you rank for neither. Fix is
intent separation written into the titles: **tool** language on features,
**done-for-you** language on services.

| Feature page | Service page | Risk | Separation |
|---|---|---|---|
| `/features/clips-and-social` | `/services/podcast-clips` | **High** | "AI podcast clip generator" vs "podcast clip editing service" |
| `/features/transcripts`, `/features/show-notes` | `/services/podcast-editing` | **High** | "automatic transcripts / AI show notes" vs "podcast editing & production service" |
| `/features/download-analytics` | `/services/podcast-growth` | Medium | "podcast analytics dashboard" vs "podcast audience growth agency" |
| `/features/newsletter` | `/services/podcast-growth` | Medium | Feature owns the tool; service mentions it only as a deliverable |
| `/features/link-in-bio` | — | Medium | Competes with `podlink.fm/{handle}`, not with services |
| `/features/templates`, `/features/multilingual` | — | None | Product-only |

**Which side leads?** Services. Product pages compete with Descript, Riverside
and Buzzsprout for head terms — brutal and expensive. Services compete for
"podcast booking agency", "podcast editing service", "podcast ad agency" —
winnable, higher intent, and worth 50–200× more per conversion. Services carry
indexing priority; features convert traffic already on-site.

---

## 5. Phase 2 — what the services work implies (→ ~40 pages)

**Advertising split — DONE (approved 2026-08-18).** Shipped in Phase 1 as two
pages. Opposite buyers, opposite searches, opposite money. Don't merge them back.

**Case studies.** `proof.ts` is already structured to generate these, and
permission is granted, so this is now purely a build task.

```
/case-studies
/case-studies/[slug] ×11          Go With Elmo ×3 · Opolis · My Divorce Solution
                                  · DocSend · Hell Has an Exit · Fruits of
                                  Motherhood · Worthy · Belfort · Koii
/case-studies/{cvs,oracle}        held — figures unverified, not a permission issue
```

**Also Phase 2:**
- `/about` — five years of work with no company page reads as a brand-new agency
- `/resources/podcast-guest-pitch-template` — the lead magnet already exists in
  Canva; built 2022, sent 4 times, never promoted
- `/legal/*` written for real
- `/pricing` still noindex

---

## 5b. Commerce — storefront on the main site (decided 2026-08-18)

**Founder decision:** the shop is headless **on podlink.ai**, not on a `shop.`
subdomain. This supersedes the `shop.podlink.ai` storefront in
`FUNNEL-ARCHITECTURE.md`.

That works, and it's the better call for SEO — product and collection pages
consolidate authority onto the one domain instead of splitting it across a
subdomain Google treats as a separate site.

```
podlink.ai/shop                     storefront index
podlink.ai/shop/[collection]        collections
podlink.ai/products/[handle]        product detail
podlink.ai/cart                     cart + order bump (ours, not Shopify's)
checkout.podlink.ai/...             Shopify-hosted checkout — the one exception
```

**The one thing that cannot live on podlink.ai: checkout.** Shopify hosts
checkout itself. The Storefront API gives you `cart.checkoutUrl`, which resolves
to the store's primary domain — there is no configuration that serves Shopify
checkout from Vercel. So a Shopify-owned hostname is required whatever the
architecture; the only choice is whether it's branded.

Recommended: set Shopify's primary domain to **`checkout.podlink.ai`**. It
self-documents as checkout-only, and it avoids the confusion of `shop.` pointing
at Shopify while `/shop` points at Next.js. Never let `*.myshopify.com` be
visible.

**Remove the Online Store sales channel** and use the Headless channel. Otherwise
Shopify serves a full themed storefront on that hostname too, and you're back to
a duplicate storefront — the same problem as app.podlink.ai.

**What this doesn't change:**
- Post-purchase one-click OTOs still work — they extend Shopify Checkout, so
  they're unaffected by where the storefront lives.
- In-checkout offers are still Plus-only, so the order bump belongs on our own
  cart page. That gets *easier* here: the cart page is now ours on podlink.ai.
- Shopify env vars still belong in Vercel, not Railway.

**Attribution caveat.** `podlink.ai` and `checkout.podlink.ai` share the
registrable domain, so a `.podlink.ai` cookie spans them — but Shopify checkout
won't read our analytics cookie. Campaign data has to be passed explicitly as
cart attributes and appended to `checkoutUrl`, or every order lands as direct.

**Catalog and funnels are now specified** — FUNNEL-ARCHITECTURE.md was filed to
the project 2026-08-19 (`claude/funnel-architecture.md`) with the two domain
supersessions noted (storefront on podlink.ai; checkout.podlink.ai primary).
Highlights: Flag Funnel first (custom mic flag → foam-covers bump +$17 →
on-air-light-box OTO → thank-you claims the podlink.fm page + 30 days Pro);
Beginner Funnel second (quiz → Starter Kit $129 → panels bump → video-upgrade
OTO 1 → stream deck OTO 2); three-tier catalog under the sight-vs-sound creative
rule; Dynamic Mockups + CJ pipeline for zero-touch fulfillment.

**Gates before any of it builds:** CJ account + dev store · CJ quotes replacing
yellow-cell COGS · physical samples (the sample gates the funnel build, not just
the SKU) · the MANDATORY dev-store test that Headless-channel orders are
post-purchase-OTO eligible · store off trial, renamed, checkout.podlink.ai set.
Companions still missing from the project: SHOP-CONTEXT.md,
SHOP-MILESTONE-SPLICE.md, GOAL_STATE.md (strip purchase codes first).

---

## 6. Phase 3 — long-tail, once the core ranks

- `/services/[slug]/[vertical]` — SaaS, fintech, web3, health & wellness,
  coaches, consumer. Verticals are already defined in the old decks. **Only with
  real per-vertical proof** — thin programmatic pages hurt more than they help.
- `/blog` or `/guides` — the download-percentile benchmark table is a linkable
  asset on its own. Note `podlink.fm/blog` currently 302s to podlink.ai with
  nothing to land on.
- `podlink.fm/directory` — a public, already-indexed directory of shows doing
  nothing for the brand.
- **Remove** `app.podlink.ai/` and `/features` — redirect or noindex, before the
  DNS cutover.

---

## 7. Order of operations

1. **Unblock Vercel repo access.** Nothing ships until this.
2. **Build `/contact`.** Six pages of CTAs point at a 404.
3. **Merge the services bundle**; extend `sitemap.ts` to derive from services as
   well as features.
4. **Rewrite the six colliding feature titles** toward tool intent. Twenty
   minutes; protects both sides.
5. **Kill the duplicate marketing site** on app.podlink.ai before DNS cutover.
6. **Build the case-study tier** — unblocked, permission granted.
7. **Verify the CVS and Oracle figures**, or leave them out permanently.
8. **Confirm 2026 pricing**, drop the noindex, let services into the index.
