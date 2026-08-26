# Podcast Data Vendors — Consolidated Verdicts (v1, 2026-08-25)
**Joelle's full 12-item list, one canonical doc.** Sites + pricing fetched 2026-08-25.
**Her constraint, verbatim:** "How can this help or enhance our analytics and podcast
features without going too far out" → tight scope: only what strengthens the OP3/OAuth
backbone, episode/show reports, media kit, contact discovery, or rankings tracking.
**The governing line (unchanged):** product analytics = consented own-show data; market
intelligence about OTHER shows = services/research layer, licensed, never silently resold.
Verdicts: USE (services-team tool) · INTEGRATE (API into product, terms-gated) ·
COPY (build ourselves) · SKIP (with reason).

## ⛔ PURCHASE HOLD — founder decision 2026-08-25
All tool purchases below are ON HOLD: no Pod Engine / Podchaser / Particle / Rephonic
trials or subscriptions until Joelle says buy. Verdicts stand as **approved-to-buy-later,
on her word** — when she green-lights, start with the Pod Engine $75 trial per the
recommendation below. Nothing in this hold blocks the now-plan (all engineering items run
on free/owned data: OP3, Podcast Index, RSS, YouTube OAuth).

## USE — services-team tools (approved-to-buy-later, ON HOLD)
| Vendor | What | Cost | Notes |
|---|---|---|---|
| **Particle** (particle.pro) | 100k+ shows transcribed/diarized in minutes; entity search; SPONSORSHIP INTEL (every ad read→brand); Apple Top 200 ×130+ verticals; MCP server | ~$0.01/req, $10 free | Sponsor prospecting + booking research; MCP into the team's Claude today. INTEGRATE later: sponsor-intel in media kit + P4 lanes (⚠️ verify API ToS resale) |
| **Pod Engine** (podengine.ai) | 2.6M shows; transcripts (84k shows); 2.6M contact emails incl. 285k NON-RSS; 27 socials mapped; guest/sponsor extraction; **HISTORICAL Apple charts daily ×174 countries + Spotify ×26**; used by booking agencies (Interview Valet etc.) | **$75/mo all-in** (API+MCP included) | The value pick — Rephonic/Podchaser capability at a quarter of the price. Trial first for booking research; non-RSS emails = candidate Snov-adjacent waterfall step; historical charts = candidate rankings-tracking vendor. ⚠️ Their data is partly scraped ("20+ sources scraped daily") — licensing shifts the compliance burden to them, but resale/provenance terms need the contact-discovery legal gate before any in-product use |
| **Rephonic** (rephonic.com/developers) | 4M shows: modeled listener estimates + demographics, contacts w/ verification votes, audience graph, charts API, trends | $299/mo · 10k req | Booking/PR research. ⚠️ JUDGMENT CALL (open with Joelle): modeled estimates stay OUT of the user-facing media kit (dilutes "sponsor can check the source"); internal use only |
| **Podchaser** (podchaser.com/api) | 5.5M shows; the guest/credits graph (27M credits, unique); full contacts incl. agency/mgmt; sponsors + est. ad spend; historical charts (Enterprise) | $30 Starter / $300 Pro / Enterprise | Credits graph = "which shows has this guest done" for booking. ToS FORBIDS resale below Enterprise — services-tool only. ($30 trial is the cheap test.) Pricing note: competitive research's "quote-only ~$2.5–3K/yr" is stale |

## COPY — confirms what we already build
| Item | Verdict |
|---|---|
| **Spotify** (2020 engineering blog) | Historical post; the finding stands today: NO public third-party podcast-analytics API (Spotify for Creators/Megaphone stats are first-party/partner only — Joelle's Megaphone client logins remain the consented path). Spotify's PUBLIC charts (podcastcharts.byspotify.com) stay the rankings-tracking source per that roadmap item (⚠️ terms verify unchanged) |

## SKIP — with one line each
| Vendor | Reason |
|---|---|
| **Taddy** (taddy.org) | Directory/search/transcripts/webhooks/top-charts GraphQL API — Podcast Index already covers discovery free; noted ONLY as fallback vendor for episode webhooks + charts if our free layers hit limits |
| **Listen Notes** (github.com/PodcastAPI) | Metadata search engine ($200/mo per competitive research) — no transcripts/demographics/sponsor data; Podcast Index free layer covers the same ground for our needs |
| **Open Podcast API** (openpodcastapi.org) | Not a vendor — an open SPEC for listener-app sync (subscriptions/progress). Listener-side sync is new product surface = out of scope; watch it only if podlink.fm ever grows listener accounts |
| **Fifty Five and Five** (labs/podcast-api) | Not a data source at all — an agency's shelved prototype that GENERATES AI podcasts from news feeds; irrelevant |
| **RSS.com API** (Feb 2026 launch) | Host PUBLISHING api (Network plans only) — publish-side automation, no analytics for us; noted only as a future "publish the kit back to your host" integration candidate, which is new surface = not now |
| **Apify actor** (vivid_astronaut/podcast) | Community scraper actor, 4 users, 0 rating, unmaintained 7 months — fails our no-scraping compliance gates outright; hard skip |
| **Podbean API** (developers.podbean.com) | Host OAuth API (docs JS-rendered, ⚠️ unverified scope) — reportedly includes own-show stats for authenticated users, which WOULD fit the OAuth-only rule, but per-host analytics integrations are a new surface; revisit as a "host connections" ML after ML3, not now |

## What this changes in existing specs
- Rankings tracking (media-kit spec §3): Pod Engine's historical charts join Rephonic's
  charts API as VENDOR fallbacks if DIY public-endpoint terms fail. DIY remains plan A.
- Contact discovery waterfall: Pod Engine non-RSS emails = candidate step between site
  crawl and Snov (cheaper, podcast-specific). Legal gate (§6.1) applies identically.
- Recommended first action: ONE trial — Pod Engine $75 — covers booking research,
  contacts, and charts evaluation in a single vendor before touching the $300 tiers.
Earlier per-vendor detail for Particle/Rephonic/Podchaser: media-kit-demographics-spec.md §3b.
