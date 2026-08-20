# FUNNEL-ARCHITECTURE.md (project copy, 2026-08-19)

**Drafted:** 2026-08-05 · **Filed to project:** 2026-08-19 from Joelle's copy —
this ends the "canonical strategy lives in Downloads" problem for this doc.
**Companions still missing from project:** SHOP-CONTEXT.md, SHOP-MILESTONE-SPLICE.md,
GOAL_STATE.md (strip the live purchase codes before filing that one).

## ⚠️ Two founder decisions since drafting SUPERSEDE §1 of this doc

1. **Storefront lives on `podlink.ai`, not `shop.podlink.ai`** (decided
   2026-08-18). Routes: `/shop`, `/products/[handle]`, `/cart`. Funnel landing
   pages and the quiz live on the main site too.
2. **Shopify primary domain → `checkout.podlink.ai`** (recommended and adopted
   with #1): checkout is the only Shopify-hosted surface, so the hostname should
   say so. Everything else in this doc — the two-step landing, the bump-on-our-cart
   design, post-purchase OTOs, the Dynamic Mockups pipeline, the gates — is
   unaffected by the domain change and stands as written.

---

## 1. Domain architecture (as amended above)

| Surface | Domain |
|---|---|
| SaaS dashboard | `app.podlink.ai` |
| Public podcast pages | `podlink.fm/{handle}` |
| Marketing site + storefront + funnels | `podlink.ai` |
| Checkout | Shopify-hosted at `checkout.podlink.ai`; `*.myshopify.com` never visible |

`podlink.fm` appears in funnel copy as the *product* being claimed, never as the
store domain. Domain setup remains a HUMAN-ONLY task (already fenced).

## 2. Catalog hierarchy (revision of SHOP-CONTEXT.md §3)

Rule that drives everything: **AI creative can honestly demo sight, not sound.**
Sight products get paid spend; sound products get SEO/AEO/email.

- **Tier 1 (full-funnel heroes):** custom mic flag, on-air light box, foam covers
  (AOV add-on only, never own spend)
- **Tier 2 (channel specialists):** LED key light (ads-capable), teleprompter
  (ads + AEO), acoustic panels (SEO/AEO workhorse; paid ads only after real
  customer audio exists), Starter Kit as AEO/SEO entity (retargeting only, no
  cold spend)
- **Tier 3 (composition only, zero standalone spend):** USB mic, boom arm combo,
  wireless lav, stream deck (sample-gated, bundle-only, email-upsell only)
- Hero bundle: **Show Brand Kit ($109)**. Starter Kit ($129) is the SEO/content play.
- Price anchor for flag creative: RØDE PodMic Flag, preorder ~$199, PodMic-only
  fit, not yet shipping (verified 2026-08-05; re-check before launch).

## 3. Funnel 1 — Flag Funnel (Entry B, build first)

1. **Ad** → hook: "RØDE wants $199 to put your logo on ONE mic."
2. **Landing (on podlink.ai)** — two-step. Step 1 captures email + show name
   BEFORE payment fields (abandon = captured SaaS lead). Show name triggers live
   logo-on-flag preview via Dynamic Mockups API (§6).
3. **Cart/review page (ours)** — **ORDER BUMP lives here**, not inside checkout
   (§5): logo foam covers +$17, pre-checked-style checkbox, same logo shown.
4. **Handoff** → Shopify checkout via cart `checkoutUrl`. Branded per §7.
5. **OTO 1 (post-purchase, one-click):** on-air light box ~40% off. Decline →
   **downsell:** foam covers (if bump skipped) or smaller light box variant.
6. **Thank-you page:** "Flag enters production today. Your show's page is already
   built — claim it + 30 days Pro free."
7. **Production-window email sequence (5–7 sends over 7–10 days):** claim page →
   dashboard onboarding → analytics tease → day-of-delivery "post your unboxing,
   tag us" (manufactures real-human UGC to hedge AI creative).

Economics intent: bump + OTO lift AOV from $49 to ~$65–80, roughly doubling
breakeven CAC vs. bare flag. All COGS still yellow-cell until CJ quotes land.

## 4. Funnel 2 — Beginner Funnel (Entry A, second)

Quiz bait ("What's your podcast setup style?") → segments audio vs. video intent,
builds list, results page pitches **Starter Kit $129**. Bump: acoustic panels.
OTO 1: video upgrade (teleprompter + LED at bundle discount). OTO 2: stream deck —
sold ONLY here, two yeses deep, never cold. QR card in box + same email pattern
into claimed page. Quiz page doubles as the "what do I need to start a podcast"
AEO asset.

## 5. Constraint 1 — VALIDATED: post-purchase on headless

- Headless checkout = Storefront **Cart API** → `checkoutUrl` → Shopify-hosted
  checkout. (Old Checkout API dead since Apr 2025 — ignore tutorials using
  `checkoutCreate`.)
- **Post-purchase one-click OTOs and thank-you offers WORK on headless** — they
  extend Shopify Checkout itself. **Pre-purchase/in-checkout offers DO NOT** —
  in-checkout customization (Checkout Extensibility) is Plus-only.
- **Design change:** order bump moved upstream onto our own cart/review page.
  Expect somewhat lower take rate than an in-payment bump; fully ours to test.
- **Payment caveat:** one-click OTOs only fire on re-billable methods (cards,
  Shop Pay). Wallet checkouts (e.g. PayPal) typically skip the OTO screen —
  do not model 100% OTO exposure.
- **MANDATORY DEV-STORE TEST (Backend):** open question on Shopify dev forums
  (Aug 2026) whether Headless-channel-attributed orders are eligible for
  post-purchase extensions. Place a real test order through the headless cart on
  the dev store and confirm the OTO renders BEFORE building funnel logic on it.
  If ineligible: fallback is thank-you-page offer apps + email OTO within 1 hour
  of purchase (weaker, still viable).

## 6. Constraint 2 — SOLVED: mockup renderer = Dynamic Mockups API

Buy, don't build. One PSD smart-object template powers:
1. Landing-page live preview (API render of buyer's R2 artwork)
2. Personalized email mockups for existing podlink.fm users (batch endpoint)
3. **Production print file per order** (correct sizing + bleed) → attached to CJ
   order via CJ API

Pipeline: Shopify order webhook → Laravel pulls artwork from R2 → preflight
(resolution at print size, format, background) → fail = Higgsfield `upscale_image`
or exception-queue email → Dynamic Mockups render → CJ order created via API →
tracking syncs back. Per-order human touch: zero after setup.

Notes: API tier ~$19/mo; vendor ships an MCP server (agents can drive it during
build). Print file dimensions MUST match CJ's actual dieline — unknown until
sample + CJ listing are in hand. Fallback if vendor risk bites: Imagick
compositing in Laravel (do not build now). Verify CJ API's per-order print-file
attachment mechanism against developers.cjdropshipping.com — do not assume.

**Dependency chain: CJ sample → photograph → PSD template → landing page, email
channel, AND fulfillment.** The physical sample gates the funnel build, not just
SKU go/no-go.

## 7. Checkout continuity checklist (amended for checkout.podlink.ai)

- [ ] Store primary domain = `checkout.podlink.ai` (checkout URL inherits it) — HUMAN
- [ ] Checkout branding (logo, colors, fonts) set to exact `GOAL_STATE.md` brand
      values via checkout branding settings/API — Backend
- [ ] Final pre-checkout page shows the buyer's logo-on-flag mockup (continuity
      into payment) — Frontend
- [ ] No `*.myshopify.com` visible anywhere in the flow — Reviewer
- [ ] Shop Pay enabled (vaulted-card conversion lift is the point of the handoff)
- [ ] Remove the Online Store sales channel / use Headless channel, so Shopify
      never serves a duplicate themed storefront (added 2026-08-18)

## 8. Gates (nothing below builds until cleared)

1. Railway restart + R2 + worker (see `RESTART-KICKOFF-PROMPT.md`) — MagicAI core
   was chosen as first thread; this doc queues behind it
2. CJ account + dev store connection — HUMAN
3. CJ quotes replace every yellow-cell estimate — HUMAN + PM
4. **Samples** (flag print quality + per-order customization support; stream deck
   software) — HUMAN, go/no-go
5. Dev-store post-purchase eligibility test (§5) — Backend
6. Shopify store off trial plan, renamed, checkout.podlink.ai as primary domain
   (added 2026-08-19 — store is currently "My Store" on a bare trial)

## 9. Agent task split

- **PM:** splice funnel milestones into `GOAL_STATE.md` after gates 1–2 clear;
  own the blended-LTV framing (judge ad spend on product margin + SaaS
  conversion, never product margin alone); first 2 weeks of traffic = finding
  real bump/OTO take rates, not scaling
- **Backend:** dev-store OTO test; webhook → preflight → Dynamic Mockups → CJ API
  pipeline; checkout branding; CJ per-order file mechanism verification
- **Frontend:** landing page + live preview; cart page with bump; quiz funnel;
  thank-you claim flow
- **Reviewer:** continuity checklist §7; no vendor strings; brand pass/fail per
  `GOAL_STATE.md`
- **Sync:** keep this doc, `SHOP-CONTEXT.md`, and `GOAL_STATE.md` consistent once
  the PM splices milestones

## 10. Standing rules

- Blended LTV is the ad-account metric from day one.
- Bump/OTO take rates cited in planning (20–40% / 10–20%) are industry-typical,
  NOT ours — replace with measured rates before any scaling decision.
- AI-generated creative is labeled per platform policy; no fake customer
  testimonials; no synthesized audio demos of sound products, ever.
- Any correction discovered during build gets written back into this doc and
  `GOAL_STATE.md`, not just noted in a session.

---

## 11. Backup plan (added 2026-08-19; REVISED same day after founder review)

**Revision note:** the first draft proposed a digital template tripwire as the
backup ad product. Joelle rejected it, correctly, on two grounds: (1) templates
are AI-commoditized — weak perceived value for cold traffic; (2) it contradicts
the product story — Pro's core feature IS AI-generated custom content, so
selling static templates against paid ads undercuts Podlink's own pitch.
The revised plan below replaces it. Digital assets are demoted to bonus-stack
material; they are never the thing ads sell.

The Flag Funnel's goal is not selling flags. It is: **paid low-ticket
acquisition where product margin subsidizes CAC, the two-step landing captures
the lead before payment, and the thank-you page converts a buyer into a claimed
podlink.fm page + Pro trial.** What makes the flag work as an ad product is that
it is physical, personalized, and podcast-identity-shaped — a thing AI cannot
generate at home. Any backup must preserve THAT, not just the funnel shape.

The flag's failure modes concentrate in one place: **the automated per-order
customization pipeline** (CJ print quality, dieline match, API print-file
attachment, Dynamic Mockups fit). The funnel plumbing itself — two-step capture,
bump on our cart, post-purchase OTO, thank-you handoff — is product-agnostic.

### Layer 1 — de-risk the flag before abandoning it: manual fulfillment v1

The product isn't the fragile part; the automation is. If the CJ sample passes
but the API/print-file automation is shaky, launch anyway with a human loop:
first ~50 orders processed by hand (pull artwork, run the mockup, place the CJ
order manually). Volume at launch will be low; "zero per-order human touch" is
an optimization for scale, not a launch requirement. Automation gets built only
after real orders prove the funnel. This keeps the ad product — the one with
the magic — while deleting most of the technical risk from the critical path.

### Layer 2 — the ad-spend backup: promote the Beginner Funnel

If the flag fails at the SAMPLE gate (print quality, per-order customization
unsupported at acceptable cost), the backup ad product is the Beginner Funnel
(§4) — stock podcast gear. Stock hardware is not AI-commoditized either: nobody
generates an LED key light or acoustic panels at home. Quiz entry, Starter Kit
$129, panels bump, video-upgrade OTO, stream deck two yeses deep. No per-order
customization anywhere in the chain. Same thank-you handoff into the claimed
page + Pro trial. This is a build-order swap, not a redesign.

### Layer 3 — the plumbing test does NOT need an ads-worthy product

The take-rate question (are bump/OTO rates anywhere near the 20–40% / 10–20%
planning figures?) and the mandatory OTO-eligibility test need real
transactions, not cold traffic. Soft-launch the Beginner Funnel to existing
surfaces first — podlink.fm users, the email list, retargeting only (which is
already the Starter Kit's designated lane in §2: no cold spend). A few dozen
real orders through landing → cart bump → checkout.podlink.ai → OTO →
thank-you validates every joint in the chain and replaces guessed take rates
with measured ones, before a dollar of flag ad creative exists.

### Where digital assets DO belong

Not as a paid front end. As value-stack: bonuses that raise the perceived value
of physical offers ("Show Brand Kit includes the full template pack"), the free
lead magnet (pitch template — already live as a page), and Pro-trial sweeteners
on the thank-you page. Digital raises AOV and conversion on physical offers; it
never carries its own ad spend.

### Decision triggers (write outcomes back into this doc)

| Trigger | Action |
|---|---|
| CJ sample quality fails, or per-order customization unsupported at viable cost | Flag shelved → Beginner Funnel promoted to Entry/build-first |
| Sample passes but automation chain shaky (API print-file attach, dieline mismatch) | Launch flag with manual fulfillment v1; automate only after volume proves it |
| Dev-store OTO test fails (Headless orders ineligible) | ALL funnels switch to thank-you-page offers + 1-hour email OTO (§5 fallback) — not flag-specific |
| Soft-launch take rates land far below planning range | Re-price bump/OTO before scaling any cold spend |

---

## 12. Next-best front-end product analysis (added 2026-08-19)

Market research across nine candidates (full facts: backup-product-research.md;
summary below is the scored synthesis). Criteria: personalized identity purchase
· self-selects podcasters · visible on camera · sight-demoable · $30–90 impulse
window · mature POD pipeline (the axis the flag fails) · not home-AI-able.

### The verdict: Verified Milestone Plaque, and the reason is the data

**The product:** a framed/acrylic milestone award — "10,000 downloads",
"Episode 100", "Top 10% of podcasts" — engraved with the show's art and its
REAL numbers, verified against analytics. Think play-button plaque, for
podcasts, backed by data instead of vibes.

**Why it beats every other candidate strategically:**

1. **Podlink is the only company that can sell this honestly.** We hold the
   analytics (OP3, cross-platform). A generic Etsy plaque is decoration; a
   plaque with verified numbers is a credential. The moat isn't the object —
   it's the data behind it. Nobody can AI this at home (criterion G satisfied
   by verification, not manufacturing).
2. **The funnel personalizes at the landing page with ZERO custom-print risk.**
   Two-step landing: enter your show name → we look up public feed data live →
   "You're in the top 25% of podcasts. Claim the plaque." The wow moment the
   flag achieved with a logo mockup, achieved instead with THEIR OWN NUMBERS —
   which is also a better ad hook ("What's your show's percentile?").
3. **Fulfillment is genuinely solved** — Printify acrylic sign with stand,
   full API, no minimums, mockup generation included. This is the criterion
   the flag failed; the plaque passes it outright. Base ~$10–20 → retail
   $49–89, inside the window, margin comparable to the flag's intent.
4. **Repeat purchase is built in — the flag never had this.** Milestones recur.
   The SaaS handoff inverts from a favor into an engine: "claim your page +
   Pro trial" becomes *"your analytics are how you earn the next one."* The
   product sells the subscription and the subscription sells the next product.
5. **The organic front door already exists on the sitemap:**
   /tools/podcast-benchmark (the download-percentile tool) IS this funnel's
   free entry — check your rank → mint the plaque. Paid and organic converge
   on one mechanism.
6. Demand signal is proven adjacent: Spotify-style music plaques show 26k+
   reviews on Etsy; podcast-specific is underserved.

**Funnel shape (mirrors the flag funnel, slots renamed):** ad ("What's your
show's percentile?") → two-step landing with live stats reveal → plaque preview
with their art + numbers → cart bump: mini desk plaque or logo foam covers →
checkout.podlink.ai → OTO 1: ON AIR light box ~40% off (unchanged) → thank-you:
claim page + 30 days Pro, "track your run at the next milestone."

**Guardrails:** original design language only — NO mimicry of Spotify/Apple UI
(trademark exposure is the plaque category's main risk, and fake-platform-UI
plaques are the infringing kind). Claims limited to what public data shows;
percentiles cite the published benchmark table. Known objection to pre-empt in
copy: Spotify has gifted free plaques for big Spotify-only milestones since
2025 — ours are cross-platform, any milestone, any size show, with their
artwork.

### The demand winner that loses on logistics: custom neon sign

Strongest raw demand (23k+ review listings; neon vendors run podcast-specific
landing pages) and perfect on-camera presence — but no API path (quote/manual
per-order flows), acrylic transit breakage, no-returns custom, 2–4 week
overseas delivery that breaks the 7–10-day production-window email sequence,
and incumbents already own the podcast keywords. It recreates the flag's
pipeline problem with worse logistics. **Disposition: premium OTO / Tier-2
offer later, retargeting only, never the cold-spend front end.**

### The rest, briefly

ON AIR light box: stays exactly where the spec has it — the OTO. Poster/canvas:
fully API-solved but no moat (home-printable). Acoustic print panels: priced
out of the window, weak demand. Desk mat: invisible on camera. Guest kit: zero
demand evidence. Boom-arm sleeve: doesn't exist as a product anywhere — noted
as a curiosity, not a plan. Mic flag price anchor update: RØDE PodMic Flag
still preorder-only, no ship date (checked 2026-08-19) — the sub-$100 window
stays open for whichever front end ships.

### Decision path

Flag sample gate passes → flag first (manual fulfillment v1 per §11), plaque
becomes funnel #2 ahead of Beginner. Flag gate fails → **plaque funnel is the
new Entry B**, Beginner Funnel remains the stock-gear fallback behind it.
Either way, build /tools/podcast-benchmark early — it feeds every version.
