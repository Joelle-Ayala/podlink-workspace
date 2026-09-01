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
