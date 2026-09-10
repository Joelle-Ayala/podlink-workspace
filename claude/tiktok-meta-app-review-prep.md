# TikTok + Meta App-Review Prep (Claude-side, 2026-09-10)
Per WORK-CANON item + JOELLE-TODO #12 (+ day-one insight-scopes amendment).
Everything below is preppable without her; the identity/verification fields
are listed at the bottom for handoff. Review clocks: Meta ~2–6 weeks;
TikTok comparable — calendar time is the cost, hence start early.

## ⚠️ BUILD-TIME VERIFICATION FINDING — TikTok demographics DO NOT EXIST
The media-kit spec's TikTok line ("follower demographics: age/gender/
territory") is **FALSIFIED for the official Display API** (verified against
developers.tiktok.com docs + 2026 integration guides, 09-10): the Display
API exposes profile info (`user.info.basic`), follower/likes counts
(`user.info.stats`), and the user's videos (`video.list`) — **no audience
age/gender/geo for standard commercial apps** (that data exists only in the
academic Research API and aggregator vendors). CONSEQUENCE:
- TikTok column on the media kit = follower count, likes, per-video views.
  Demographics on the media kit come from YouTube (SHIPPED) + Instagram
  (below) + OP3 countries. No import flows, no vendors (standing rules).
- The day-one-scopes amendment still applies to what EXISTS: request
  user.info.basic + user.info.stats + video.list in the FIRST submission.
- media-kit-demographics-spec.md §1 TikTok row corrected by this doc.

## 1. TIKTOK — application package (Display API + Login Kit)
**Scopes to request day one:** `user.info.basic`, `user.info.stats`,
`video.list`. (Do NOT invent demographic scopes — none exist.)
**Products:** Login Kit + Display API (both need approval).
**Use-case text (draft, hers to paste/edit):**
"Podlink (podlink.ai) is podcast analytics software. Podcasters connect
their own TikTok account via OAuth to see their own follower count and
their own videos' view counts alongside their podcast download statistics —
a single, read-only performance report of their own content. We display
data only to the authenticated account owner, never to third parties;
nothing is posted, modified, or scraped."
**Demo plan:** screen recording of the Podlink analytics dashboard showing
the connect flow + where TikTok stats render (record after the connect
button exists behind the env gate — same inert-until-configured pattern as
YouTube; build is a thin ML3 follow-on of the youtube_connections pattern).
**Redirect URI:** https://app.podlink.ai/dashboard/user/analytics/tiktok/callback
(reserve now; route ships with the connect build).

## 2. META / INSTAGRAM — application package (Graph API)
**Verified 2026 reality:** demographics are REAL here —
`instagram_manage_insights` returns follower age (7 brackets, 13-17…65+),
gender (M/F/undisclosed), top 45 cities + 45 countries, active hours.
Constraints: Business/Creator account linked to a Facebook Page; 100+
followers minimum for demographic data; owner-only (no third-party lookups)
— which is exactly our OAuth-consented model; ~200 calls/hr cap.
**Scopes to request day one:** `instagram_basic`,
`instagram_manage_insights`, `pages_show_list`, `pages_read_engagement`
(page-link plumbing). Advanced Access via App Review.
**Use-case text (draft):**
"Podlink is podcast analytics software. Podcasters connect their own
Instagram professional account to see their own follower demographics
(age, gender, location) and content performance alongside their podcast
downloads, in a single read-only report of their own audience. Data is
shown only to the authenticated account owner and to pages they explicitly
share their report with; we never access accounts the user doesn't own,
never post, and never store data beyond the report's cache window."
**Demo plan:** same dashboard recording pattern; screencast requirement is
strict at Meta — record the full OAuth → insights render path.

## 3. Build sequencing (ML3, after the current queue)
Both connects follow the youtube_connections pattern (Socialite, env-gated,
inert until keys): tiktok_connections + instagram_connections tables →
social_accounts generalization at platform #2 per ML3 (this IS platform #2
— do the generalization in this build). Stats render on dashboard + media
kit columns. Applications can be SUBMITTED before the build is public —
the demo runs against the env-gated feature.

## 4. JOELLE-ONLY fields (the actual handoff)
- Business identity/verification on both portals (legal entity — note the
  Minting House dissolution status question; her call which entity applies)
- Privacy policy URL: podlink.ai/legal/privacy (LIVE — needs her green
  light first, same B1 gate)
- TikTok developer account + Meta Business/developer account creation
  (accounts = hers by rule)
- App icons/branding uploads, and the final submit clicks
- Instagram: a professional (Business/Creator) account of hers linked to a
  Facebook Page for the demo recording

## 5. Canon effects
- media-kit-demographics-spec.md §1: TikTok row → views/follower counts
  only (this doc governs); Instagram row → verified real, constraints noted.
- Media kit demographics stack = YouTube (shipped) + Instagram (post-review)
  + OP3 geography. TikTok contributes reach numbers, not demographics.
