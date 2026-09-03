# Joelle's List — updated 2026-08-20 (evening)
Ordered by leverage. 📱 phone / 🖥 desktop. Strike items as done; threads re-read this file.

## 1. One desktop sitting — 5 min 🖥 — unblocks FOUR workstreams
Sit at the desktop once: (a) click Chrome in the taskbar so its window is visible;
(b) in that Chrome, log into app.podlink.ai and leave the tab open; (c) approve the
"Claude wants to control…" dialog if it appears.
Unblocks: Search Console (both domains) + Bing + Cloudflare TXT, AND lends the app session
so Claude can run the claims-truth verification + drip #1 check. Password never shared.

## 2. Answer 5 one-liners — 1 min 📱
(a) Free caps: bio link ~10 links + no episode report on Free — yes/no?
(b) Trial: 14 days full Pro on signup, then drop to Free — yes/no?
(c) Studio overage: $2/episode past 40, hard-capped — yes/no?
(d) /contact reply promise: "we reply within 2 business days" — yes/no?
(e) Booking URL (Calendly/Cal.com) if you have one — paste it.

## 3. MagicAI admin → Pro $29 — 10 min 📱/🖥
app.podlink.ai → Admin → Finance/Plans. Pro: $29 monthly, $232 yearly. Only Free + Pro
visible; retire old Creator $19 / Pro $49 rows. Turn ON reset_credits_on_renewal per plan.
Admin only — NEVER edit Stripe directly. If anyone ever subscribed at $19, stop and say so.

## 4. Megaphone side-by-side (NEW) — 20 min 📱/🖥
Create THREE Podlink accounts (one show each — product limit for now), plus-addressed:
joelle+moms@…, joelle+elmo@…, joelle+mds@… Connect each show's RSS. Then in Megaphone, per
show (Moms Moving On, Go With Elmo, My Divorce Solution): settings → analytics prefix → add
the OP3 prefix (the app shows the exact URL during connect). Real accounts, not demo — we
tag them internal on our side so they never pollute metrics. These 3 become the first
Studio-roster migration later. Expect OP3 vs Megaphone numbers to DIFFER — that's the data.

## 5. www redirect — 3 min 📱 (www.podlink.ai is a dead 404 right now)
dash.cloudflare.com → podlink.ai → Rules → Redirect Rules → Create: name "www to apex";
When: Hostname equals www.podlink.ai; Then: Dynamic redirect, 301, expression
concat("https://podlink.ai", http.request.uri.path) → Deploy.

## 6. Drip #1 click-verify — 2 min 📱
Log into app.podlink.ai → sidebar → Podcast Analytics → confirm downloads render by
episode/app/country → reply "verified". Claude publishes the changelog entry same hour.

## 7. Podcast Index API key — 3 min — NOW THE ONLY GATE ON THE NEXT NEW FEATURE
api.podcastindex.org → sign up → verify email → dashboard → copy API Key + Secret → paste
to Claude. UPGRADED FRAMING (2026-09-02): contact-discovery P1 — find shows by niche
+ show contact cards, the free no-vendor layer of the booking feature YOU can uniquely
sell ("the method I ran by hand for five years, productized") — is sequenced as the
named next NEW feature, and this key is its only blocker. It also still unlocks the
producer-universe count that sizes Studio. Three minutes buys a feature.

## 8. Cold-email sending domains — 30 min 🖥 — 75-DAY CLOCK, every day waits costs a day
Buy 2 fresh domains (NOT podlink.ai/fm — e.g. getpodlink.com, podlinkhq.com). Google
Workspace Starter on each, 2–3 inboxes per domain, enable warm-up (outbound doc), and pay
something early — the send-limit raise keys off $100 cumulative spend.

## 9. cPanel password rotation — 5 min 📱 (credentials = yours by rule)
hosting.com → account, user podlinka → change password (went out in plaintext July 2025).

## 10. Spotify Audience Network payout — 10 min 🖥
Graphite Connect → activate the payout account approved July 2025. Possibly uncollected money.

## 11. app-podlink-cleanup.zip — 2 min 📱
Re-upload from the Aug 18–19 chat, OR reply "rebuild it" and a thread writes the middleware
fresh. Until then app.podlink.ai shows a duplicate marketing site w/ minting-house footer.

---
Done recently (no action): services bundle live · Pricing v2 adopted + live · /studio page ·
nav CTA flip (Start free primary) · GA4 (G-6BJQCTFXZZ) · MCP server on review branch ·
all templates committed · claims matrix v0 · analytics differentiators spec'd.

## See also (added 2026-08-25)
claude/WORK-CANON.md is now the full sequenced canon. New on your side since this list: branding voice interview (claude/branding-voice-interview.md - answer by voice memo), asset capture per claude/asset-shot-list.md (or lend a session), admin hygiene (admin email + 2FA + OpenAI key rotation), Stripe activation decisions, social accounts + support inbox, transactional email provider choice.

## 12. TikTok + Meta/Instagram developer app reviews (NEW, calendar-time critical)
Start both applications early - approval queues are the cost. You will likely need: business identity/verification (legal entity details - note Minting House dissolution status), app privacy policy URL (podlink.ai/legal/privacy), and a demo video of the integration. Claude preps everything prep-able; the identity/verification steps are yours. Flag anything the forms ask that you want drafted.

### #12 amendment (2026-08-25): request insight scopes DAY ONE
TikTok Display + Meta/Instagram applications must request audience/follower-insight permissions (age/gender/territory) in the FIRST submission so we never re-apply. Claude verifies the exact scope names for current API versions and preps the application text; you supply business identity/verification.

## 13. Two GTM decisions from the 8-lever analysis (NEW) - 1 min each
(a) Agency channel: white-label reports + rev-share on Pro seats - yes/no? (KMG history says wholesale margins were thin; terms matter more than the yes.) (b) ML2 YouTube-analytics beta: dual-publisher waitlist + founding pricing framing - yes/no? Full analysis: claude/growth-plan-8-levers-verdict.md.

## 14. MCP directory: "start the clock"? (NEW 2026-08-27) - 1 min decision + 2 taps
The growth research (claude/mcp-growth-research-podlink.md) flips the D-1 recommendation
to SUBMIT EARLY: reviews run 2wk-1mo+ in silence; the listing is a multiplier, not a
prerequisite; the "podcast analytics connector" window is ~1-2 quarters. The server is
already live and e2e-verified. If you say "start the clock": (a) buy the minimum-seat
Claude Team org (submission portal requires it), (b) give me a privacy-policy URL
green light (I draft, you approve - it also unblocks TikTok/Meta #12), (c) name a
support address. I ship rate limits + demo account + setup-docs this week either way.
UPDATE 08-27: clock STARTED on your word. Support address = support@podlink.ai (decided).
Privacy policy DRAFTED and live at podlink.ai/legal/privacy — review it; your green light
is one of the two remaining gates (the other is the Team org purchase).

## 15. Three 2-minute mailbox/calendar taps (NEW 2026-08-27)
(a) support@podlink.ai mailbox: podlink.ai mail is Google Workspace (MX verified) - in
Google Admin, add "support" as an ALIAS on your user (free, 1 min) or a group. Until it
exists, mail to it bounces - it's now on /legal/privacy and submission materials.
(b) HubSpot meetings link: you have NO active scheduling page (portal 20159837 checked;
all public slugs 404). In HubSpot: Sales -> Meetings -> Create scheduling page -> connect
your Google Calendar -> pick a slug (suggest "podlink"). Send me the link and /contact
flips from mailto to the calendar as primary the same hour ("I'd not just do email" -
this is the missing piece).
(c) Optional, helps me see HubSpot data: Settings -> AI -> enable "Customer conversation
data" (their AI access toggle currently blocks meeting/conversation reads).
