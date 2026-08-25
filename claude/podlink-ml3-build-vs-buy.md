# PodLink ML3 — Social Video Analytics: Build vs Buy
*Research date: 2026-08-15. Scope: per-episode/per-post view analytics for TikTok, Instagram Reels, YouTube Shorts, plus scope addition: Twitch, X, and Kick. Frame: ML2 = custom YouTube Data API integration (already planned); ML3 = everything else. Pricing verified on official sites where possible; this market changes fast.*

Note on "kik": interpreted as **Kick.com** (the streaming platform), given the Twitch context. Kik Messenger has no show/view analytics and would be out of scope. Confirm with Joelle.

---

## 1. Unified third-party APIs

### Ayrshare (verified on ayrshare.com/pricing)
- **Model:** billed per "social profile" = one customer/creator, who can connect *all* supported networks under that one profile. Perfect shape for "1 podcaster = 1 profile."
- **Tiers (monthly billing):** Premium $149 (1 profile, single-user — not usable for SaaS), Launch $299 (10 profiles), **Business $599 (30 profiles included, then tiered: $8.99/profile for 31–100, $3.49 for 101–500, $2.49 for 500+; ~17% less on annual)**, Enterprise custom (~$1/profile at volume, from 300 profiles).
- **Cost at PodLink scale:** 100 connected creators ≈ **$1,228/mo** monthly ($1,058/mo annual). 1,000 creators ≈ **$3,869/mo** monthly ($3,249/mo annual). Ayrshare's own calculator confirms $1,228 at 100 profiles.
- **Coverage:** 13+ networks incl. TikTok, Instagram, YouTube, X, Facebook, Threads, Pinterest, Reddit, Snapchat, Bluesky. **No Twitch, no Kick.**
- **Metrics:** Post Analytics endpoint returns per-post analytics (video views, likes, shares, etc.) for TikTok, Instagram, YouTube, X — including posts *not* published through Ayrshare. This is exactly the "episode clip views" data ML3 needs.
- **Onboarding:** Ayrshare holds the platform app approvals (TikTok, Meta, Google). PodLink's creators connect accounts through Ayrshare's hosted linking page (JWT-based SSO, white-labelable on Business). No Meta/TikTok app review for PodLink at all. 28-day free trial on Launch.
- **API quality:** mature, SaaS-multi-tenant-first, good docs, webhooks, 99.99% uptime claim. The strongest fit of the buy options.

### Phyllo / InsightIQ (getphyllo.com)
- **Pricing:** entirely quote-based, no public tiers; third-party sources report entry around $199/mo, scaling with API volume and connected accounts. Sales-led.
- **Coverage:** 20+ platforms incl. TikTok, Instagram (incl. Reels/Stories), YouTube, **Twitch**, X, Snapchat. **No Kick.** Consented creator-auth model ("Authenticated APIs" via their Linkage SDK) plus public-data products.
- **Fit:** built for influencer-marketing/creator-economy data (audience demographics, income, screening). Overkill for "views per episode clip," and enterprise sales motion is a poor match for PodLink's stage. Worth a quote only if PodLink later wants audience intelligence or Twitch via a vendor.

### Metricool API
- API access only on Advanced plan (~$53+/mo by brand count), token auth, "brands" model. It's a social-management tool exposing an API, not a multi-tenant infrastructure API — connecting hundreds of end-user accounts is not what it's licensed or priced for. **Not viable for reselling analytics.**

### Data365 / EnsembleData / scraper-style APIs
- Data365 sells per-network subscriptions to read APIs for *public* data (credits model, quote-based). No user OAuth, so no consented per-creator auth; public scraping of view counts is ToS-gray, fragile, and a bad foundation for a paid analytics feature. **Avoid as the primary source**; possible fallback for platforms with no official path.

---

## 2. DIY: platform APIs directly

| Platform | API | Per-video views? | Approval burden | Notes |
|---|---|---|---|---|
| YouTube (incl. Shorts) | Data API v3 + Analytics API | Yes | Low — OAuth consent; default 10k units/day on Data API; quota extension needs Google's audit form (weeks–months, manual review). Analytics API is per-channel-owner OAuth and separately quota'd. | **ML2 already covers this. Shorts are ordinary videos — ML3 YouTube Shorts is free with ML2.** Multi-tenant quota is the main scaling risk on Data API; lean on Analytics API + caching. |
| TikTok | Display API (`video.list` scope) | Yes — view/like/comment/share counts on the user's own videos with consent | Medium — developer registration + app review (~3–7 days per round, feedback loops common). Research API is closed to commercial use. | Ongoing compliance/UX review risk; audited client access needed for production. |
| Instagram Reels | Instagram API (Graph) media insights | Yes ("views" metric) — but Meta has churned insights metrics repeatedly in the last 18 months | **High** — Professional (Business/Creator) accounts only, Advanced Access via full Meta App Review + business verification, privacy policy, data-deletion endpoint. Typically weeks. | The single most painful DIY integration; metrics deprecate on short notice. |
| Twitch | Helix API | Yes — VOD `view_count` via Get Videos; live `viewer_count` via Get Streams | **Very low** — register app, OAuth, no app review, free. Rate limits via token bucket. | Easiest DIY of the whole set. No "buy" option needed. |
| X | X API, pay-per-use since Feb 2026 | Yes — post `public_metrics` incl. impressions/views on owned posts (user OAuth) | Low — sign up, buy credits. Legacy $200 Basic / $5,000 Pro tiers closed to new signups. | ~$0.005 per post read. E.g. 100 creators × 20 posts polled weekly ≈ 8.7k reads/mo ≈ **$45/mo**; 1,000 creators ≈ **$450/mo** (halve it with smarter polling). Viable for a small SaaS now, which it wasn't under the old tiers. |
| Kick | Official Kick Dev API (OAuth 2.1 + PKCE) | Partial — channel/livestream viewer counts; **no real per-VOD historical analytics endpoint yet**; API still maturing, narrow scopes | Low — register at kick.com/settings/developer | No unified provider covers it. DIY-only, and thin. **Defer** until the API exposes VOD analytics. |

---

## 3. Social auth architecture ("connect your accounts")

Recommendation: **PodLink owns the OAuth layer with Laravel Socialite**, and treats any unified provider's hosted connect flow as a scoped exception, not the foundation.

- Use Socialite + community SocialiteProviders for Google/YouTube (ML2), Twitch, X, TikTok — all have providers; Kick's OAuth 2.1/PKCE is simple enough for a small custom provider if no maintained package exists.
- One `social_accounts` table: `(user_id, platform, external_account_id, encrypted access/refresh tokens, scopes, expires_at)` + a scheduled token-refresh job and per-platform poller jobs writing into a normalized `video_stats` table (platform, external_video_id, episode_id, views, fetched_at). This is the same shape regardless of source, so a platform can later be swapped between DIY and vendor without touching the schema.
- If Ayrshare is adopted for TikTok/Instagram: those two platforms connect via Ayrshare's hosted linking page (white-labeled, JWT SSO) instead of Socialite. Store the Ayrshare profile key in the same `social_accounts` row shape. Accept the split — it's what you're paying them for (they hold the Meta/TikTok app approvals).
- Keep OP3 exactly where it is: OP3 prefix = audio download analytics for the RSS feed; the social layer = video/clip views. They meet only in PodLink's episode dashboard, never in auth.

---

## 4. Bottom line for PodLink

**Sequencing (keeps ML2 → ML3 frame):**

1. **ML2 (now):** DIY YouTube as planned. Note Shorts come free with it — quietly delivers a third of ML3.
2. **ML3 phase 1 (cheap DIY wins):** Twitch (free, no review) and X (pay-per-use, ~$45/mo at 100 creators). Both via Socialite. Small effort, real coverage.
3. **ML3 phase 2 (the hard two):** TikTok + Instagram Reels. Start DIY platform approvals now (they're free, the cost is calendar time: days for TikTok, weeks for Meta) — but if approvals stall or maintenance burn is too high, **buy Ayrshare Business** for exactly these platforms. That's the honest build-vs-buy pivot point: Ayrshare's $599/mo floor buys you out of Meta App Review, TikTok audits, and metric-deprecation churn.
4. **Defer:** Kick (no analytics API worth building on yet — recheck in 6 months), Phyllo (enterprise motion, wrong fit), Metricool/Data365 (not viable as primary sources).

**Rough monthly cost:**

| Scenario | 100 creators | 1,000 creators |
|---|---|---|
| Full DIY (YT + TikTok + IG + Twitch + X) | ~$50–100 (X credits + infra) + heavy eng/maintenance | ~$300–700 + heavy eng/maintenance |
| Hybrid: DIY YT/Twitch/X + Ayrshare for TikTok+IG | ~$1,100–1,300 | ~$3,300–3,900 (Enterprise pricing could cut this materially) |
| All-Ayrshare (drop X DIY too; still no Twitch/Kick) | ~$1,060–1,230 | ~$3,250–3,870 |

At 100 creators the hybrid is ~$12/creator/mo — fine if ML3 analytics is a paid-tier feature, painful if it's free. At 1,000 creators, negotiate Ayrshare Enterprise (~$1–2/profile) or revisit DIY for whichever of TikTok/IG proved approvable.

**Recommendation in one line:** build YouTube (ML2), Twitch, and X yourself on a Socialite-owned auth layer; run TikTok/Meta approvals in parallel and buy Ayrshare Business only if they block; defer Kick and skip Phyllo.

---

## Sources
- [Ayrshare pricing (official)](https://www.ayrshare.com/pricing/) · [Ayrshare Analytics API docs](https://www.ayrshare.com/docs/apis/analytics/overview)
- [Phyllo pricing (official, quote-based)](https://www.getphyllo.com/pricing) · [Phyllo pricing reviews](https://www.influencer-hero.com/blogs/phyllo-pricing-and-review) · [xpay.sh on Phyllo](https://www.xpay.sh/saas-pricing/getphyllo/)
- [Metricool pricing explained](https://socialk.it/en/pricing/metricool) · [Data365 pricing](https://data365.co/pricing)
- [TikTok app review FAQ](https://developers.tiktok.com/doc/getting-started-faq) · [TikTok Research API FAQ](https://developers.tiktok.com/doc/research-api-faq) · [TikTok API guide](https://zernio.com/blog/tiktok-api)
- [Instagram API reference 2026](https://gist.github.com/jameschapman2c/65eff9f54a2d350b17a6ce5127b9fe42) · [Instagram Graph API open questions](https://zernio.com/blog/instagram-graph-api)
- [YouTube quota & compliance audits (Google)](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits) · [YouTube quota audit walkthrough](https://singhamandeep.com/youtube-data-api-quota-increase-audit/)
- [Twitch API reference](https://dev.twitch.tv/docs/api/reference) · [Twitch auth docs](https://dev.twitch.tv/docs/authentication/)
- [X API pricing 2026](https://postproxy.dev/blog/x-api-pricing-2026/) · [X API cost breakdown](https://twitterapi.io/blog/x-api-cost-breakdown-2026)
- [Kick Dev docs (GitHub)](https://github.com/KickEngineering/KickDevDocs) · [Kick Dev help center](https://help.kick.com/en/articles/8159966-kick-dev) · [Kick API guide](https://repostit.io/kick-api-guide/)
