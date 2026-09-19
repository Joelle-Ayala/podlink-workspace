# SESSION_LOG (web/GTM workstream)
Created 2026-08-20 by the mobile chief-of-staff thread. (The app workstream's session log
— Sessions 1–11, referenced by PODLINK-MCP-SCOPING — predates this file and was never
filed into the repo; file it here if found.) Newest entries on top.

## 2026-08-20 — Homepage rewrite shipped (mobile CoS thread)
Joelle approve-all on the six-item sign-off sheet (claude/homepage-copy-audit.md).
Shipped: hero sub (item 1 chosen over 1b — rationale in audit doc), two-door funnel band
under hero (personas §4.1), how-it-works step 2 truth rewrite + step 3 sponsor bridge,
closing band rewrite, producer-FAQ honesty rewrite (seeds Studio), consolidation FAQ added,
what-it-does lead-in with the sourced S1 pain, features.ts group-intro + transcripts-summary
claims fixes. All voice-guide-compliant; claims-truth RED rows 3/4/8 CLOSED on the homepage
(feature-page bodies still carry deeper instances — queued for template application).
Earlier same day: voice guide v1 (binding) · copy-audit brief · Pricing v2 adopted + shipped
· /studio page · nav CTA flip · services bundle merge verified · GA4 · MCP server branch ·
templates (feature/services/case-study/contact/pricing) · claims matrix v0 ·
analytics differentiators spec'd · JOELLE-TODO.md.

Next per committed order: services pages under the same lens (befores/afters →
sign-off → ship), engineering thread (episode persistence + unique(user_id) lift).

## 2026-08-26 morning (mobile CoS thread)
Services copy audit v1 delivered (best copy on site; 1 price bug fixed live; S1-S4 sign-off items queued). MCP branch code review DONE: high quality, spec-faithful, one deploy blocker (composer.lock not committed) + Passport-guard verification note - claude/mcp-branch-review.md. Overnight from other thread: MCP directory launch plan doc. Awaiting Joelle: S1-S3 approvals, JOELLE-TODO list (desktop sitting still #1).

## 2026-08-26 - THE DESKTOP SITTING (window seized)
CLEARED: GSC podlink.ai already verified -> sitemap submitted (42 pages discovered). podlink.fm VERIFIED (TXT added via Cloudflare, auto-verified). Bing Webmaster: signed in via Google SSO, GSC import completed - podlink.ai + podlink.fm + sitemap in. www.podlink.ai FIXED: was WP Engine SaaS-hostname interception (her zone rules could not fire); solution = www added to Vercel project as 301->apex + Cloudflare www repointed CNAME cname.vercel-dns.com DNS-only; verified 301 w/ path+query preserved. Claims verification pass 1 run in lent admin session (see claims audit). Admin plans: only Free exists - fix is additive. Task 9 (GA4/GSC/Bing) COMPLETE.

## 2026-08-27 (mobile relay session, cont.)
- MCP LAUNCH-READY: e2e verified on prod (OAuth 2.1/DCR/PKCE, all 4 tools on real data); annotations shipped (75b1a80fe) and confirmed in live tools/list; obsolete mcp-server branch deleted; review doc corrected (composer.lock blocker was wrong); WORK-CANON gained the frontend/backend lockstep standing rule (306960e22).
- S1-S3 SERVICES APPROVALS SHIPPED on Joelle's word (9eb0c9faf): booking pay-per-booking hero note + named-placements strip (4 clearance-checked names -> /work), sponsorship monetization-lockout wedge FAQ, DIY cross-links editing/clips/growth. Verified live cache-busted on all 6 service pages; skip-pages confirmed clean. S4 (31M recheck) still HOLD.
- MCP GROWTH RESEARCH ADOPTED: report filed at claude/mcp-growth-research-podlink.md; launch-plan amendment (governs on conflict) + scoping acceptance criteria added. Key: "first podcast MCP" RETIRED (Springcast/Transistor/Descript/Riverside/Castmagic shipped) -> new claim "the podcast analytics connector" (voice-guide updated); free-read MCP rule; rate limits blocking before submission; demo account + 3-prompt docs; ChatGPT directory + aggregators added to plan; D-1 recommendation flipped to SUBMIT EARLY (JOELLE-TODO #14).

## 2026-08-28 (mobile relay - five approvals executed + submission clock started)
- APPROVALS SHIPPED: D-1 accelerated track ON; pricing 7.1-7.3 CLOSED (flip checklist 3/5); support@podlink.ai; /contact reply promise ("2 business days"); booking = HubSpot meetings WANTED but NO scheduling page exists (portal 20159837, slugs 404, AI data toggle blocks CRM reads) -> JOELLE-TODO 15b activation steps, /contact stays mailto until her link exists.
- SUBMISSION PREP LIVE + VERIFIED (cache-busted): privacy policy v1 at /legal/privacy (pending her sign-off), /features/mcp/setup docs page (HowTo+FAQ schema, 4 prompts, indexable, sitemapped), llms.txt, daily hard cap on /mcp (2000/day + 60/min, X-RateLimit headers confirmed live, tools still 200).
- GSC + KEYWORD DIRECTIVES -> claude/seo-gsc-plan.md (baseline, pod.link collision assessment, clusters A-MCP/B-podcast-AI/C-services, weekly pull cadence). Org+WebSite schema was already shipped on homepage.
- REMAINING BEFORE SUBMISSION - hers: Team org purchase, privacy green light, support@ alias (Google Workspace), demo-account OP3 data (Megaphone prefix task or connect an already-prefixed feed). Code-side: DONE.

## 2026-08-29..31 (services template shipped; app stall x2 noted)
- Services page template v1 applied across ALL 6 pages and verified live cache-busted (b722104c2): trust strip (clearance-gated names via proof.ts selectors; brands wall on advertising), timeline process, HUGE proof numbers (growth EXCLUDED per S4 hold), fit qualifier for-you/not-for-you, why-Podlink hybrid section, See-the-work hero CTA, reassurance line under final CTA. Task #18 section-stack portion DONE; �7 from-card-vs-tier-table deviation held for sign-off (kept the shipped tier tables - template says "never a full tier table"; flag for Joelle).
- Weekly GSC pull: scheduled-task creation failed twice on an app-side permission-stream error (not a work failure). Cadence documented in seo-gsc-plan.md �5; will run manually Mondays until the scheduler cooperates.

## 2026-08-31 (two founder decisions executed)
- Scheduler KILLED per Joelle: no scheduled tasks ever (both creation attempts had failed anyway, so nothing existed to delete); GSC pull is a documented MANUAL Monday item (seo-gsc-plan.md 5).
- Hybrid services pricing SHIPPED + verified live on all 6 pages (f24697e5e): FromPriceCard in reading flow (from-price HUGE, what-moves-it, Book-a-call, transparency line), full tier tables collapsed-but-in-DOM via native <details id=pricing-detail> after Why-Podlink, and a snippet-phrased "how much does X cost" FAQ FIRST on every page (rides the existing FAQPage JSON-LD). Template rule ("never a full tier table" in primary flow) and SEO need both satisfied; no client JS added.

## 2026-09-01 ("move forward" - both canon tracks shipped)
- TRANSCRIPT PIPELINE V1 LIVE (fe6c9510b): episode_transcripts table (FULLTEXT) migrated on prod (deploy log confirms 577ms DONE); TranscribeEpisodeJob = download -> Whisper via existing entity -> credits metered IDENTICALLY to dashboard STT; 90-min cap; 25MB fit via ffmpeg-if-present with explicit failure states; user-triggered per-episode endpoint + dashboard Transcribe button; auto-transcribe-new behind PODLINK_AUTO_TRANSCRIBE_NEW (default OFF - billing is opt-in); worker timeout raised to 900s + redis retry_after 960. UNBLOCKS: MCP v1.1 transcript tools, Episode Report, insights v2. Remaining spec scope: Show Report page, unique(user_id) lift, percentile badge/insights/digest.
- FEATURE TEMPLATE v1.1 LIVE on all 8 pages (a577651c1), verified cache-busted: trust strip, persona problem moments, 3-step how-it-works, host compatibility chips, Free-only pricing card (LOCKSTEP: no Pro price on pages until the admin ladder exists), same-group related, GSC-phrased FAQs (dashboard/show-notes/clips/newsletter queries).
- CLAIMS FIXES shipped with it: transcripts page reframed to the actually-shipped user-triggered pipeline (dropped speaker-labels/auto-on-arrival/search-UI overclaims; archive-search future-tense w/ roadmap); clips page cutting moved to future-tense roadmap per audit row 8, present-tense only for moment-finding + copy. Claims matrix row 3 -> PARTIAL/SHIPPED (user-triggered transcription live).
- ffmpeg NOTE: if absent in the Railway image, episodes >25MB fail with a clear user-visible error - first real transcription run will tell; add ffmpeg via RAILPACK config if needed.

## 2026-09-02 (ungated push + brand question)
- MCP v1.1 SHIPPED + verified live (695d95695): search_transcripts (FULLTEXT + substring fallback, snippets, R5-sanitized) and get_transcript (chunked parts, strict own-show episode_ref). tools/list on prod shows all 6 tools; search returns the graceful no_transcripts state (correct - no transcripts on the test account yet; needs one Transcribe click + OP3 demo data for the full loop). GATE TIER DECLARED in routes/mcp.php: transcript READS free - creation is the metered step; exports stay paid.
- BRAND CONCEPTS: Joelle flagged the orange-on-black + wordmark proximity to Pornhub branding. Concept board built (agent): 5 directions - Warm Signal (sienna/navy, lowest migration), Open Meter (teal/ink), Ultraviolet Fieldnotes (violet/cream), Chartreuse Console (signal green/charcoal), Honest Paper (cream/ink/vermilion editorial). File: outputs/podlink-brand-concepts.html, presented to Joelle. Site uses CSS custom properties so palette swap is cheap; NO brand change ships without her pick.

## 2026-09-02b (founder story landed - voice-guide TODO #1)
- Origin story filed: claude/founder-story-raw.md - RELAYED ARC, marked not-verbatim (the actual memo transcript was not attached; flagged for attachment). Per-claim evidence table incl. the Oracle-NetSuite-sponsor nuance (distinct from the dead Oracle-3x case-study claim; verify via public Wolf''s Den episodes before any use). LinkedIn cross-check attempted: anonymous wall; needs her lent session (her Chrome now shows two connected browsers needing her pick).
- Voice guide updated: origin story DELIVERED, two narrative spines (clips-as-ads flywheel = product thesis origin; Happy Returns booking discovery), texture lines gated on verbatim; client-emails TODO stays open.
- /about draft v2: claude/about-page-draft.md - founder section written under full claims discipline (no revenue, no NetSuite, no employer names in claims, "my agency" not Minting House, guests omitted until archive-checked). HOLD for her sign-off; ships same-hour on approval.

## 2026-09-02c (two tone layers codified)
- claude/founder-voice-guide.md v1: her personal register derived from the origin story + her actual session messages (momentum grammar, numbers-as-plot-points, era-specific credibility, candid asides); phrasing templates; 3 calibration drafts (claims-marked); composition with the Gott launch system; public verification pass folded in; 6 questions only she can answer (Q1 Belfort prominence is the big one).
- VERIFIED against public record: Happy Returns->PayPal 5/2021 (TechCrunch/PayPal newsroom); her HR role third-party corroborated (RocketReach); Wolf''s Den 165 eps; Sales School 252 eps daily M-F (matches her telling); minting house LinkedIn page. FOUND: "mint: A Web3 podcast" publicly attributed to her - needs her framing call (Q4). Still unverified: LMU/internships/titles/revenue/NetSuite/The Click/guests (LinkedIn wall; needs her session).
- voice-guide.md sections 7-8 added: founder texture rules for PRODUCT copy (war stories as one-line origin notes, flywheel as thesis, by-hand register) + BINDING divergence table so future sessions never blur her voice and the brand voice.

## 2026-09-02d (positioning spine validated + booking feature sequenced)
- REPORTS PAIN VALIDATED (her ask): cross-channel-report-validation.md - fragmentation industry-documented, agencies literally stitch via AgencyAnalytics+Sheets, spreadsheet templates SOLD on Gumroad, and the market confirms it in real time (Simplecast unified analytics just shipped, PodAnalyst launched for exactly this). Honest caveats recorded: acute weekly form is producer/agency-side (persona nuance, two doors stand); dashboard slot contested - the REPORT artifact is not. Positioning line adopted: "the dashboard is table stakes; the report is the product."
- GTM-PLAN AMENDMENT (no fork): hero = unified cross-channel report; second act = talk to your podcast; supporting cast = "oh bonus" tools, her cadence verbatim. Two founder-truth features: the report (built to kill her own worst chore) + booking (the by-hand method productized). Show Report elevated to hero deliverable in the ingestion spec.
- Q1 RESOLVED: Belfort front-and-center approved; sample A + /about Wolf''s Den naming un-gated. Verbatim addendum filed (1b). Launch post #1 draft added (sample D, reports chore) + sample E (booking spine).
- CONTACT-DISCOVERY P1 = named next NEW feature (WORK-CANON sequencing note): capacity confirmed (pipeline shipped, submission prep code-complete), only gate = her Podcast Index API key (JOELLE-TODO #7 bumped: "three minutes buys a feature").

## 2026-09-02e (booking send-layer verified against MagicAI reality)
- Her recollection checked against the official changelog + feature pages: MagicAI v11.0 (Jul 2026) DID ship a paid "AI-Powered CRM" - but it is a sales-PIPELINE CRM (deals/tasks/invoices/AI assistant), NOT an outreach sequencer. No email sequences anywhere in the ecosystem; Gmail/Outlook only as read/draft connectors. Marketing Bot v2 = WhatsApp/Telegram (distinct, deferred).
- P3 corrected in claude/contact-discovery-p3-amendment.md (spec file was LOCKED on the desktop - merge when it clears; amendment governs meanwhile): CRM extension = adopt-later as pipeline layer (price TBD in her admin marketplace; v11 upgrade gate on our customized v10.8.1 fork - migration must be scoped/tested first); sequence engine = custom Laravel + Gmail/Outlook APIs. All gates binding: OAuth send-scope verification, CAN-SPAM/GDPR design-first, 75-day domain warm-up (still the longest pole).
- Booking system one-liner in canon: P1 (Index key only) -> P2 (Snov+terms) -> P3 (custom sends + optional CRM pipeline) -> P4 (Clay/sponsor lanes). Send leg last by design.

## 2026-09-02f (LAUNCH GATE + consolidation)
- HARD RULE added to WORK-CANON: nothing launches (directory submissions incl. aggregators, launch posts, launch-constituting index flips) without Joelle''s explicit final GO after verified-done review. Prep continues full speed; submit/post/flip actions wait. Ordinary drips continue.
- claude/launch/README.md created: the definitive launch checklist (13 DONE items with proof, 5 in-flight non-blocking, 8 HERS incl. B8 = the GO itself) + the one-folder index referencing every canonical launch doc (no duplication, no drift).
- feature-drip-calendar.md brought current via status amendment: drip #1 published, transcripts + MCP v1.1 queued as drips, contact-discovery P1 = next genuine new entry, Show Report = hero tentpole, tentpoles behind the gate.

## 2026-09-02g (drip calendar confirmed + upgraded to launch cadence)
- Confirmed to Joelle: the calendar exists (feature-drip-calendar.md, drip #1 published, verify-then-publish rule, Gott monthly-launch adoption). UPGRADED per her framing: claude/launch/drip-cadence-v2.md - every drip = mini-launch package (verify -> changelog -> founder post -> brand post -> <=40s video -> PR only for genuinely-new), 2-week spacing hard floor 1 week, tentpoles interrupt.
- DATES TENSION RESOLVED: no-public-dates rule stands for future work; public dates allowed ONLY as scheduled reveals of already-shipped verify-passed features. Roadmap page stays Now/Next/Later dateless.
- PROPOSED DATES (hers to approve): Sep 8 transcripts drip (needs her click-verify) -> Sep 22 talk-to-your-podcast drip (upgrades to tentpole if listing lives first) -> Oct 6 target contact-discovery P1 (real once Index key lands) -> Show Report tentpole Oct window -> stock-feature drips alternate. Listing tentpole = listing-live day.

## 2026-09-03 (product-first push: two features shipped + verified)
- SHOW REPORT v1 LIVE (5ee4b468d, hero deliverable): migration confirmed on prod (82ms DONE); public JSON endpoint 404s bogus hashes correctly; podlink.ai/report/[hash] page live (404 on unknown hash = route working); dashboard toggle card shipped (opt-in, default OFF, unguessable hash, instant kill + cache purge). Cross-channel columns: OP3 + YouTube live; layout ready for social/website. E2E-with-real-data check needs one enable click on the test account (her lent session or her click) - flagged.
- CONTACT-DISCOVERY P1 LIVE (4b14ff950): /dashboard/user/discovery route verified (302 auth redirect). Built feature-complete: Podcast Index search client inert-but-honest until her key (config podlink.podcastindex), KEYLESS contact cards work TODAY (RSS owner/managingEditor/webMaster + bounded own-site crawl, unverified-labeled per gate 2, PI attribution per terms), analytics cross-link card (sidebar menu is DB-managed - admin menu entry flagged for her/desktop session).
- CLAIMS MATRIX effect: episode report row -> Show Report SHIPPED (opt-in); booking-tool row -> P1 SHIPPED (search pending key). Frontend expression: report page shipped same motion; Find Shows is app-side (marketing page rides the P1 drip).
- NEXT IN PRODUCT QUEUE (not started this push): ML2 YouTube demographics expansion (API dimension verification at build), Biolink read bridge (shared-DB + drift guard), episode report v1 detail page, demo polish.

## 2026-09-07 (ML2 expanded shipped)
- YOUTUBE DEMOGRAPHICS LIVE (1d3f3ec97): yt-analytics.readonly scope added to the OAuth flow (BUILD-TIME VERIFICATION done per spec warning: Analytics API v2, dimensions ageGroup/gender + viewerPercentage, country/views geography; subscribedStatus deliberately excluded to avoid the 200% double-count). Dashboard demographics card with three honest states (ok / needs_reconnect for pre-scope connections / no_data for small channels); Show Report gains the Audience section - consented ok-shape only, source attributed ("owner-consented, read-only") - the media-kit line now lights up on the hero artifact. App healthy post-deploy (302/404 checks).
- CLAIMS RULE HELD: no marketing-surface demographics claims until a real scoped connection returns data - needs the test account YouTube reconnect (her lent session or her click). Claims matrix: demographics row = SHIPPED (code) / pending real-data verify.
- NEXT IN QUEUE: Biolink read bridge (shared-DB + drift guard per amendment 08-27b), episode report detail page, demo polish.

## 2026-09-10 (biolink bridge shipped + 2-week rollup delivered)
- BIOLINK READ BRIDGE LIVE (db478bee5): read-only biolink DB connection wired via Railway cross-service REFERENCE vars (agent-set on app+worker; no literal credentials ever surfaced); BiolinkStatsRepository = sole consumer, pinned schema (users/links/track_links verified against vendored 66biolinks source: LinksStatistics.php COUNT(id)/SUM(is_unique) on track_links), 6h drift guard degrades to unavailable. Dashboard "Your Podlink page" card (30d views/visitors + top links) + aggregate podlink_page column on Show Report JSON + web page "Link page" section. App healthy post-deploy (302 after the swap-502). REAL-DATA verify pending a logged-in request whose email exists in biolink (her lent session).
- TAP STATUS CHECKED for the rollup: PODCASTINDEX_KEY absent from Railway vars (B6 not landed); saved MCP token was wiped by Windows temp cleanup so B4 demo-data probe unavailable (last verified: no_op3_data); no privacy green light, Team org, or support-alias confirmations received in-session. All seven taps still open.
- Cross-channel report state: OP3 + YouTube views + YouTube demographics + Biolink page = FOUR columns live on the hero artifact; social (TikTok/Meta) pending app reviews; website/GA4-read later.

## 2026-09-10b (episode page + app-review prep)
- EPISODE DETAIL PAGE LIVE (db17bdc33): per-episode report v1 - metadata/duration/paired YouTube views + full transcript reader with copy affordance + transcribe/retry; titles in the analytics list link through; tenancy-checked.
- TIKTOK/META PREP COMPLETE (Claude-side): claude/tiktok-meta-app-review-prep.md - verified scope lists, use-case texts, demo plans, redirect URIs, Joelle-only field list. KEY FINDING: TikTok Display API has NO audience demographics (spec assumption falsified at build-time check) - TikTok = reach counts only; Instagram demographics verified real (instagram_manage_insights, constraints noted). media-kit spec amended.

## 2026-09-10c (LAUNCH PACKAGE FULLY STAGED)
- /claude landing page LIVE + sitemapped (08ccaee37) - Cluster A hero, present-tense true, zero directory claims until listing day; verified in the sweep.
- claude/launch/ completed: listings-and-rehearsal.md (ONE paste-ready metadata pack + per-directory field inventory; Claude portal itself walkable only after B2; ChatGPT needs terms page + OpenAI org + domain TXT; Glama/Smithery may be repo-leaning - skip-without-loss rule) - linkedin-one-pager.md (gate-A one-liner passes, 10 objection answers as her 2-hour crib) - launch-video-script.md (40s, real product only, records after her two data clicks) - go-day-runbook.md (Day 0 submission ~30min of her time, Day L cascade fully ordered, L+2..7 numbers post).
- VERIFICATION: full sweep 26/26 surfaces HTTP 200; /claude content check passed; rate limiter confirmed counting unauth per-IP (x-ratelimit headers, 60/min) on top of authed per-user+daily - burst criterion PASS (earlier 70x401 was a sequential-test artifact, not a gap).
- README updated: staged table replaces in-flight. CRITICAL PATH = her seven taps + GO, unchanged.

## 2026-09-12 (launch push continues)
- TERMS OF SERVICE v1 DRAFTED + shipping (same pattern as privacy: plain, honest, accurate to the product; services carved to engagement agreements; credits never-automatic language; connector acceptable-use; as-is + 12-month liability cap; ONE open field = governing-law state, TODO(legal) marked). Closes the ChatGPT-directory terms-URL gate code-side; her B1 review now covers BOTH legal pages in one read.
- ChatGPT test-case matrix drafted (5 positive + 3 negative) into listings-and-rehearsal.md 5 - the last ChatGPT checklist item that was ours.
- Drip #2 (transcripts) package STAGED: claude/launch/drip-2-transcripts-package.md - changelog entry + founder post + brand post + optional 15s video + preconditions. Fires the first Tuesday after her 2-min click-verify.

## 2026-09-16 - Ecosystem audit V3 + missed-deploy catch
- Produced claude/PODLINK_ECOSYSTEM_AUDIT_CONTEXT_V3.md (~10.5k words, 43 sections) from read-only repo inspection (3 parallel passes: MagicAI v10.8.1 inventory - zero extensions installed; 66biolinks v68 - all 15 plugins absent; custom surface) + live checks. For upload to the external ChatGPT audit.
- FOUND + FIXED: Vercel missed building 04bee89ef (Sept 12) - homepage REPORT_BAND was in-repo, not live. Docs push 0fb4be99b triggered the build; band verified live (cache-busted). Railway had deployed it fine (8 MCP tools live). New verification rule: confirm a Vercel deployment EXISTS for the pushed sha.
- Filed claude/mcp-scoping-amendment-2026-09-12.md into git (was untracked).

## 2026-09-16/17 - LAUNCH SPRINT 1 (A-G) shipped + verified
- Commits 344dbe974 (app) + d15f37efb (site); Railway app+worker SUCCESS, 3 migrations DONE, Vercel READY; live checks green (/analyze, /founders, /partners/pr-agencies, proof band, Episode transcripts rename, /mcp 401, feed-inspect ok, /test + /debug gated).
- Full detail: claude/LAUNCH-SPRINT-1-REPORT.md (10 sections incl. founder checklist + verdict).
- RED FLAG found during verification: GitHub repo flipped PUBLIC (was private through Sept 12). Not changed from this side; contains licensed vendored code + strategy canon. Founder action #1: make private again.

## 2026-09-17 - Sprint 2 solo items 1-2 (no founder input needed)
- YouTube watch metrics: watchStats() (channel 90d views/watch time/AVD/net subs) + episodeWatchStats() (per paired video) on YouTubeAnalyticsService, same Analytics-v2 client + honest states + 6h cache; channel strip on the YouTube card, per-episode watch time + AVD on the episode page; watch metrics ride along in the daily youtube/show snapshot.
- Transcript timestamps surfaced: episode page renders segment-timestamped transcript when transcript_segments exist (post-09-16 transcriptions); older transcripts fall back to plain text.

## 2026-09-17b - Solo queue continued (her check-in expected tomorrow)
- Tranche-2 case-study template pass: /case-studies/[slug] rebuilt to the 9-part canon stack (data-driven, one page; attribution-honest what-we-did from services[]; big-number results from existing metrics only; pull quotes on 4 exact-match cleared testimonials - chellew withheld pending Karen sign-off, Meadows used as producer-not-guest, worth a founder glance). Demotion candidates flagged, NOT demoted: united-recovery-project (no verified number), cvs-health (outcomes-only by direction), 3 borderline headline promotions needing founder approval (mudrex, shiftpixy, ritual).
- /contact qualifying form shipped per template: show/service/budget -> structured mailto (no backend, never a dead form), booking CTA stays primary.
- Downloads trend sparkline: analytics page renders a rolling-30d polyline from analytics_snapshots once >=7 daily points exist (self-appearing; nothing until ~Sep 24).

## 2026-09-18 - DISPATCH: Find Shows verify -> INCIDENT found + durable fix shipped
- Item 1 verdict: BLOCKED/FAILS - not Podcast Index. Env names align exactly (PODCASTINDEX_KEY/SECRET -> config/podlink.php); CoS-bot redeploy d53eec88 SUCCESS. But EVERY web route on app.podlink.ai (login included) 302s to /license: ApplicationStatus middleware gates the web group on storage/app/portal (serialized MagicAI license state), which lived on the EPHEMERAL container FS and is gone. APIs/MCP/podlink.ai/report endpoints unaffected (verified: health 200, mcp 401, report-404 clean, feed-inspect 200).
- Durable fix SHIPPED + deployed (9143c62a, deploy 1321bf70 SUCCESS): portal file now lives on the app/Extensions Railway volume (symlinked, same pattern as the .env stub) + optional LIQUID_LICENSE_DOMAIN_KEY boot bootstrap. One activation now sticks across redeploys.
- Reopening the app needs Joelle: EITHER visit app.podlink.ai/license and activate with the MagicAI purchase code once, OR have CoS bot set LIQUID_LICENSE_DOMAIN_KEY (purchase code) on podlink-workspace + redeploy. Then re-verify Find Shows search + demographics + B5 admin ladder (all behind the same wall).
- Dispatch items 2/3 blocked by same wall; item 4 drip dates refreshed for approval (Sep 22 transcripts, Oct 6 MCP, Oct 20 Find Shows - internal until GO); item 5 skipped per optional.
- Shared context absorbed: joelle-shared-context repo (Claude 09-17 + ChatGPT 09-18) - no canon conflicts; ChatGPT's wanted "verified feature matrix" = our PODLINK_ECOSYSTEM_AUDIT_CONTEXT_V3.md. NOTE dispatch pricing Pro $29/Studio $99 differs from web pricing.ts - reconcile at B5, no changes made without her confirmation.

## 2026-09-18b - FOLLOW-UP DISPATCH: wall DOWN + PR#1 merged + DESIGN.md
- LICENSE WALL DOWN without founder action: MAGICAI_PURCHASE_CODE already existed on the service; entrypoint bootstrap now accepts it (29acac97e, deploy dfdf7733 SUCCESS). /login = 200 "Podlink | Sign in" verified. Wall survives redeploys (volume-backed).
- Find Shows: gate open; env names verified; live search still needs an authenticated session (no stored session in the pane; credentials are founder-only). 30-second click for her: log in -> Find Shows -> search anything.
- PR #1 MERGED to main (dfdc0b1cc) per dispatch + claim softening ("Claude or any MCP-capable assistant" x5); analytics-first homepage LIVE + verified (title, hero, softened claim, /analyze CTAs).
- web/DESIGN.md v1 shipped (design OS complementing BRAND.md) + 09-18 visual QA pass logged: /, /pricing, /analyze desktop+mobile all clean; nits filed (footer PodLink casing, stale footer tagline, hero placeholder vs no-fake-dashboards - real screenshot post-B4).
- NEW PR #2 appeared (design/podlink-operating-system, ChatGPT/Codex): design-OS + agent skill docs - NOT merged; reconcile-with-DESIGN.md note filed.
