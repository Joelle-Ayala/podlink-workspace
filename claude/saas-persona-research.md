# SaaS Buyer Persona Research: Podlink (podlink.ai)
**Date:** 2026-08-19 | **Method:** Web research — competitor review sites (Capterra, App Store, Trustpilot-adjacent), industry surveys (Buzzsprout, Alitu, RSS.com, Podcast Marketing Trends), Hacker News first-person accounts, vendor pricing pages. Reddit was inaccessible through the research proxy (403); first-person verbatim language was sourced from Hacker News comments, app-store reviews, and Capterra reviews instead — all verbatim quotes below are real and marked with quotation marks + source.

---

## 1. Competitor user reviews — WHO buys these tools and why

### Castmagic (transcript → content repurposing; closest Pro-tier competitor)
Source: [Capterra reviews](https://www.capterra.com/p/10012225/Castmagic/reviews) (9 verified, 5.0 avg), [Marie O'Sullivan 18-month review](https://themarieosullivan.com/castmagic-review/)

**Who reviews it** (Capterra reviewer roles — striking pattern: almost none are "podcasters" by title):
- Travis A. — CEO, Marketing & Advertising agency
- Chris C. — Founder, Media Production
- Martin B. — Managing Director, Marketing & Advertising
- Becky S. — Sr. Partner, Medical Practice (podcast promotion + omnichannel publishing)
- Shanti B. — Marketing Director, Management Consulting
- Sarah L. — Business Systems Coach (podcasts + coaching sessions)
- Colin S. — Digital Conversion & AI Specialist, Marketing & Advertising
- Nicole S. — Executive Assistant, Marketing & Advertising
- Verified Founder/Principal, Management Consulting

**Jobs hired for:** show notes, social clips, chapter markers, newsletters, transcribing client calls, repurposing coaching/course content.

**Praise (verbatim):**
- "reduced time to write show notes...by at least 75%" — Travis A., Capterra
- "Saved me 100's of hours" — Shanti B., Capterra
- Magic Chat / custom prompts repeatedly named as the killer feature (control over output voice).

**Complaints:** no Buzzsprout API integration ("requires manual copy-paste"), limited export options, mobile weak, monthly minute limits restrictive for heavy users, "may be expensive for casual creators" (O'Sullivan). Notably, zero "output feels generic" complaints on Capterra — reviewers credit custom-prompt control for this.

**Signal:** Castmagic's buyer skews professional-services / marketing-side, not hobbyist. Solo course-creator reviewer (O'Sullivan) calls the Hobby plan ($276/yr) "excellent ROI" and uses it across client calls + courses + podcast.

### Podsqueeze (podcast-specific content kit)
Source: [aigearbase review](https://aigearbase.com/tool/podsqueeze), [castmagic.io competitive review](https://www.castmagic.io/software-reviews/podsqueeze), pricing page

**Who it targets/serves:** "Independent podcasters, podcast managers, podcasting agencies, content marketers, YouTube creators, media companies." Praised for podcast-specific outputs, minute rollover, multi-show management. Complaints: video clip caps per plan, no à-la-carte credits, no mobile app. Very little organic review volume anywhere (thin G2/Capterra presence) — indie-audience tool with low review-writing energy.

### Capsho — status check
Source: [Podnews directory](https://podnews.net/directory/company/capsho), [Sounds Profitable press release](https://soundsprofitable.com/press-release/capsho-ready-to-relaunch-their-new-platform-capsho-nextgen-and-youre-invited/)
Still alive; rebuilt from scratch as "Capsho NextGen" (open beta June 18, 2024) with "self-learning, more flexibility and a custom tone of voice" — i.e., their own admission that v1 output wasn't voice-matched enough. Their historical ICP: entrepreneur/coach podcasters who use the show for lead gen. The NextGen rebuild is direct market evidence that **"output not in my voice" was the #1 product failure of gen-1 podcast AI tools** — exactly the wedge Podlink's "transcript-grounded, in the show's voice" positioning attacks.

### Swell AI (agency-oriented writer)
Source: [xpay pricing](https://www.xpay.sh/saas-pricing/swell-ai/)
Tiers literally named for the persona ladder: Hobby (free, 1 upload/mo) → Studio $29/mo (300 min) → **Agency $49/mo (600 min)**. Explicitly targets podcast production agencies writing for client shows.

### Podium (podium.page, AI copywriter)
Source: [pricing page](https://hello.podium.page/pricing)
Creator + Professional subscription tiers plus **credit packs: $6/60 min (subscribers), $9/60 min (non-subscribers), credits never expire** — pay-as-you-go structure aimed at irregular publishers (a real segment: only ~34% of shows publish weekly).

### Headliner (audiograms/clips)
Source: [App Store reviews](https://apps.apple.com/us/app/headliner-app-podcast-videos/id1485577013?see-all=reviews&platform=iphone)
**Who:** solo podcast hosts and promoters doing their own social assets (e.g., Roneill88, host of "This Amazing Life," "seeking to save time on video creation workflows").
**Verbatim complaints:**
- "YOU CAN'T NAME AN AUDIOGRAM ON MOBILE?? Seriously what?" — Goal crusher 9000
- "Absolutely destroys the quality of any image I put in it" — madenbury (watermark/quality)
- "Complete dumpster fire UI design" — FB1223451111
- "there doesn't seem to be any way for me to give you money in the app" — FB1223451111
**Signal:** DIY hosts will tolerate a lot for a free/cheap clip tool, but churn on quality + UX friction; willingness to pay exists even when the product makes paying hard.

### OpusClip (AI clips — Creator-tier competitor)
Source: [Capterra reviews](https://www.capterra.com/p/10006559/Opus-Clip/reviews)
**Who reviews it:** Digital Marketing Specialist, Podcast Producer (fine art), Support Worker making YouTube Shorts, small-business Owner, IT Marketer clipping customer interviews. Marketer-heavy, not podcast-native.
**Praise:** speed ("This was done in less than 5 minutes" — Jennifer M.), auto-captions, time saved.
**Complaints — the two Podlink cares about:**
- Generic output: "can become generic if you don't make templates that fit your branding" — Daze M.
- Relevance/churn: "The promise 'AI' in their name is only propaganda, is not an intelligent app" — Luis M., podcast producer, **requested refund and switched to Vizard** (documented churn event: clips lacked relevance + creative control)
- Pricing/credits: "The price can be quite high for essential features" — Fungai Nicole C.; videos deleted after one week; credit-waste complaints are common enough that third parties publish guides ("How to Stop OpusClip Wasting Credits on Bad Clips" — vyroclips.com).

### Link-page side: Linktree / Podpage
- [Linktree stats (productmint)](https://productmint.com/linktree-statistics/): 30M+ users, ~5M paying, 80% of link-in-bio market — proof that creators pay small monthly sums for a link page alone. Linktree ships a dedicated [podcast links feature](https://linktr.ee/for/podcasts); competitors (Beamly) explicitly market "Linktree for podcasts? You'll be better off with an alternative" — the podcast-specific link page is a recognized wedge.
- [Podpage review (WebsitePlanet)](https://www.websiteplanet.com/website-builders/podpage/): Free / $9 Basic / $15 Pro / network custom. Target: podcasters wanting zero-effort auto-updating sites. Praise: SEO (91-99 scores), auto-publish. Complaints: "The awkward editing process really brings down the experience," limited customization, weak marketing integrations. **Signal:** hosts pay $9-15/mo just for a passive presence layer; the complaint surface is customization + marketing integrations — i.e., the layer Podlink fuses with promotion.

---

## 2. The podcaster population (2025-2026 data)

Source: [The Podcast Host industry stats hub](https://www.thepodcasthost.com/listening/podcast-industry-stats/) (aggregating Buzzsprout platform data June 2026 + Independent Podcast Report 2025), [Alitu Independent Podcaster Report 2025](https://alitu.com/creator/content-creation/the-independent-podcaster-report-2025/) (n=558), [RSS.com Podcaster Insights Survey Q2 2026](https://rss.com/blog/podcaster-insights-survey/) (n=195), [Podcast Marketing Trends 2025](https://podcastmarketingacademy.com/podcast-marketing-trends-report-2025/) (n=311)

**Market size & activity**
- ~483k active podcasts on Apple Podcasts (June 2026) — only 16% of all registered feeds; down from 756k in June 2021. The market is consolidating to serious publishers.
- Publishing cadence (Buzzsprout, June 2026): 34% every 3-7 days; 39% every 8-14 days; 20% every 15-29 days; 7% more often than every 3 days. → roughly 4 in 10 shows are weekly-or-faster.

**Downloads (Buzzsprout, first 7 days, June 2026)**
| Percentile | Downloads/ep |
|---|---|
| Top 1% | >4,611 |
| Top 5% | >1,012 |
| Top 10% | >413 |
| Top 25% | >101 |
| Median | ~28 |

(Podcast Marketing Trends 2025's self-selected, more-professional sample: median 469 dl/ep, 1,246 dl/mo; **first-ever negative median annual growth, -1.3% — more shows shrank than grew in 2025**.)

**Video**
- Independent Podcast Report 2025: 31% publish full video; 32% considering; 19% never. RSS.com Q2 2026: 51% record some video; 63% of those say video grew their audience.

**Who does the work (Alitu, n=558)**
- 52% handle everything solo; 30% have co-hosts; 21% hire an editor/producer; only 8% have social/marketing help. Women hire editors at 28% vs 16% for men.
- Time per episode: 27% spend 1-3 hrs, 28% 4-5 hrs, 20% 6-8 hrs, 13% 10+ hrs.
- Demographics: 47% of independent podcasters are over 50; 48% male / 45% female.

**Challenges (Alitu, post-launch creators)**
- Growing audience/discoverability **72%** · Making money 39% · Audience engagement 32% · Time/burnout 30% · Costs 23% · Technical 21%.
- RSS.com Q2 2026 concurs: growing audience 70%, discoverability 32%, monetizing 24%, marketing 18%.
- Podcast Marketing Trends 2025: most common answer to "How would you describe your podcast growth strategy?" was **"I don't have one."** Only 25% of even 10k+ dl/ep shows have a defined strategy.

**AI adoption (Alitu)**
- 38% AI transcripts, 30% AI show notes/titles, 27% AI editing, 21% AI marketing; 17% refuse AI. Caution flag: report "detected no significant time savings between AI users and non-users" — current tools aren't yet converting AI into felt time savings.

**Spend (RSS.com)**
- 72% pay for podcast tools. Monthly spend: $1-25 (32%), $26-50 (18%), $51-100 (15%).

**Company/branded shows**
Source: [Omniscient B2B podcast stats](https://beomniscient.com/blog/b2b-podcasting-statistics/): 91% of marketers plan to maintain/expand podcast investment in 2025; 76% of businesses launch podcasts for thought leadership; 90% of branded-podcast investors satisfied; branded podcasts show 89% higher brand awareness lift. No reliable share-of-all-shows figure found, but Capterra review rosters (above) show marketing-agency and company staff are disproportionate reviewers/buyers of repurposing tools.

---

## 3. Jobs-to-be-done — verbatim language (all real, sourced)

**The post-publish chore:**
1. "content creators spend more time writing descriptions, show notes, and social posts than actually creating content." — LevinGruenhagen, [HN comment 42238443](https://news.ycombinator.com/item?id=42238443)
2. "I found myself stuck juggling transcripts, show notes, chapters, metadata, and audio exports across different tools, losing creative momentum." — konstantint, [HN 44109915](https://news.ycombinator.com/item?id=44109915) (Show HN: Headroom)
3. "Those show notes take a long time to make (I do them manually)." — nickjj, [HN 21744268](https://news.ycombinator.com/item?id=21744268)
4. "I'm also creating timestamped show notes... along the way while editing so I have to pause to write these down." — nickjj, [HN 29296607](https://news.ycombinator.com/item?id=29296607)
5. "This is a best case scenario where I 'only' had to do 305 cuts for a 90 minute show. In the worst case scenario it's gone as high as 1,800 cuts for 90 minutes." — nickjj, same thread (why Podlink rightly stays out of editing — that pain is owned elsewhere)

**Time saved when the job is done right:**
6. "reduced time to write show notes...by at least 75%" — Travis A., agency CEO, [Capterra Castmagic](https://www.capterra.com/p/10012225/Castmagic/reviews)
7. "Saved me 100's of hours" — Shanti B., Marketing Director, Capterra Castmagic
8. "It saves me time by automatically finding and trimming long videos" — Lindsey M., owner, [Capterra OpusClip](https://www.capterra.com/p/10006559/Opus-Clip/reviews)

**"Output feels generic" / trust failures:**
9. "can become generic if you don't make templates that fit your branding" — Daze M., digital marketing specialist, Capterra OpusClip
10. "The promise 'AI' in their name is only propaganda, is not an intelligent app" — Luis M., podcast producer who refunded OpusClip and switched to Vizard, Capterra
11. "AI tools certainly help with creating a mass of notes, but of generic information stated generically." — qaadika, [HN 47645085](https://news.ycombinator.com/item?id=47645085)

**Growth/"nobody listens" frustration:**
12. "It's not uncommon (in the first six months) to average fewer than 30 downloads per episode." — [Podcast Advice Show](https://podcastadviceshow.substack.com/p/what-to-do-when-nobodys-listening)
13. Most common self-described growth strategy: "I don't have one." — [Podcast Marketing Trends 2025](https://podcastmarketingacademy.com/podcast-marketing-trends-report-2025/)
14. "YOU CAN'T NAME AN AUDIOGRAM ON MOBILE?? Seriously what?" — Goal crusher 9000, [Headliner App Store review](https://apps.apple.com/us/app/headliner-app-podcast-videos/id1485577013?see-all=reviews&platform=iphone)
15. "The price can be quite high for essential features" — Fungai Nicole C., Capterra OpusClip

(Reddit r/podcasting was directly inaccessible via the research proxy; the HN quotes are the closest first-person equivalents and are verifiably real.)

---

## 4. Willingness to pay — 2026 pricing landscape

| Tool | Category | Current tiers (2026) | Notes / where pricing stings |
|---|---|---|---|
| **Castmagic** | Repurposing | Hobby **$19/mo** annual ($239/yr, 30 hrs) · Starter $48/mo · Team $139/mo · Business $699+/mo | Minute limits sting heavy users; "expensive for casual creators" ([pricing](https://www.castmagic.io/pricing)) |
| **Podsqueeze** | Repurposing | Starter **$8.99/mo** (120 min) · Pro $49/mo (320 min) · Agency Lite $89/mo | Clip caps per tier; no credit top-ups ([pricing](https://podsqueeze.com/pricing/)) |
| **Swell AI** | Repurposing (agency) | Free · Studio $29/mo (300 min) · Agency $49/mo (600 min) | ([xpay](https://www.xpay.sh/saas-pricing/swell-ai/)) |
| **Podium** | Repurposing | Subscription + credits: $6/60min (subs), $9/60min (non-subs), never expire | Pay-as-you-go for irregular publishers ([pricing](https://hello.podium.page/pricing)) |
| **OpusClip** | Clips | Free (60 credits) · Starter $15/mo · Pro $29/mo ($14.50 annual) | Credit-waste on bad clips; files deleted after 7 days on free; "price can be quite high for essential features" ([pricing](https://www.opus.pro/pricing)) |
| **Descript** | Editing | Free · Hobbyist $16-24/mo · Creator $24-35/mo · Business $50-65/mo | ([pricing](https://www.descript.com/pricing)) |
| **Riverside** | Recording | Free · Pro $24-29/mo · Grow $34-39/mo · Webinar $79-99/mo | ([pricing](https://riverside.com/pricing)) |
| **Buzzsprout** | Hosting | Audio $15/mo · Audio+Video $25/mo · Multi $30/mo (+ Cohost AI add-on) | ([pricing](https://www.buzzsprout.com/pricing)) |
| **Podpage** | Website | Free · Basic $9/mo · Pro $15/mo | Editor clunky; weak marketing integrations ([WebsitePlanet](https://www.websiteplanet.com/website-builders/podpage/)) |
| **Headliner** | Audiograms | Free w/ watermark · paid desktop plans | Watermark + quality complaints drive churn |

**Where $19/mo sits:** exactly on Castmagic's Hobby anchor, above Podsqueeze Starter ($8.99) and OpusClip Starter ($15), below Podsqueeze Pro ($49) and Swell Studio ($29). It's the established "serious solo creator" price point. Constraint check: RSS.com — half of paying podcasters spend ≤$25/mo **total** on all tools; $19 must therefore displace or consolidate spend (hosting is the most common paid item at $15). Podlink's strongest pricing story is consolidation: $19 replaces Podsqueeze ($9-49) + Headliner + Linktree/Podpage ($9-15) line items.

---

## 5. The two-sided / monetization angle

Source: [The Podcast Haven sponsor guide](https://thepodcasthaven.com/how-to-get-podcast-sponsors-downloads-needed-and-what-you-can-earn), [Castos ads guide](https://castos.com/podcast-ads-guide/), [Podnews Podcorn entry](https://podnews.net/directory/company/podcorn), [Audacy Creator Lab announcement](https://x.com/CreatorLab_/status/1908265239310938228)

- Hard threshold problem: "most podcast advertising agencies and online marketplaces won't work with you until you have 10k – 20k downloads PER episode, in a 30-day period." Libsyn Ads minimum: 5,000 dl/ep. Median show: ~28-469 dl/ep — **the overwhelming majority of shows are locked out of the standard sponsorship market.**
- 2026 CPM benchmarks: Tech $25-35, Business/Finance $25-40, Health $20-30, Entertainment $18-25 — with practitioner caveat that real-world rates run closer to ~$17.
- Small-show monetization market motion: Podcorn (low-barrier sponsorship marketplace) was folded into **Audacy Creator Lab** (April 2025): "sponsorship marketplace and new podcast hosting platform are now part of one creator-first experience. Built to help you maximize your revenue potential." — the market is already bundling *hosting + monetization*; nobody yet bundles *promotion + attribution + monetization-readiness*.
- Demand evidence: "making money" is the #2 challenge (39%, Alitu); 85% of independents earn $0; of non-monetizers, 48% say "audience too small" and 17% "unsure how to monetize" (RSS.com). Sponsorships are the most profitable stream among those who do monetize (41%).
- **Implication for Podlink:** the attribution loop (content → clicks → downloads) is precisely the evidence a sub-5k show needs to pitch direct/niche sponsors, since they can't get into marketplaces. "Sponsor-ready analytics/media kit" is an unclaimed pitch at the $19-49 price band.

---

## 6. Candidate persona archetypes (evidence-backed)

### P1 — "The 28-Download Solo Host" (Hobbyist-Plus)
- **Who:** Solo creator, often 40-60+, 52% do everything themselves, 1-5 hrs/episode, median ~28-100 dl/ep, spends $1-25/mo total on tools.
- **JTBD:** "Make the post-publish chore disappear and finally get some listeners" — 72% say growth is the #1 problem and most admit "I don't have one" as a strategy.
- **Buys:** Free tier → $19 Pro only if it visibly replaces existing line items (hosting site add-on, Linktree, Headliner). Price-sensitive; churns on caps and watermarks.
- **Evidence strength: STRONG** (Alitu n=558, Buzzsprout platform data, RSS.com, Headliner reviews).

### P2 — "The Expert-Entrepreneur" (coach/consultant/course creator with a lead-gen show)
- **Who:** Coach, consultant, professional-services founder; podcast exists to feed the business. Capterra Castmagic roster: business systems coach, management consultants, medical practice partner. Capsho's entire historical ICP.
- **JTBD:** "Turn every episode into a week of marketing in MY voice" — most sensitive to generic-output failures (Capsho rebuilt its whole product over this).
- **Buys:** $19-49 without flinching; ROI framed vs. VA hours ("saved me 100's of hours"). Most likely first paying cohort for Episode Content Kit.
- **Evidence strength: STRONG** (Capterra reviews, Capsho NextGen pivot, O'Sullivan long-term review).

### P3 — "The Fractional Producer / Podcast VA / Boutique Agency"
- **Who:** Manages 2-10 client shows; 21% of podcasters hire editors (28% of women hosts); tools explicitly build tiers for them (Swell "Agency" $49, Podsqueeze "Agency Lite" $89, Castmagic Team $139).
- **JTBD:** "Deliver show notes + clips + newsletter for every client episode, fast, at margin" — needs multi-show workspaces, per-show voice profiles, white-label/export.
- **Buys:** $49-139/mo; low churn once client workflows embed. Podlink's Creator tier and beyond.
- **Evidence strength: STRONG** (competitor tier design + Capterra reviewer roles + Alitu hiring data).

### P4 — "The Company Show Marketer" (B2B/branded podcast owner)
- **Who:** Marketing director/manager or agency running a brand's thought-leadership show; 76% of business podcasts launched for thought leadership; 91% of marketers maintaining/expanding podcast spend.
- **JTBD:** "Prove the podcast is working" — needs content output AND attribution/ROI reporting for the boss. Closed-loop attribution is uniquely valuable here; downloads alone don't justify budget.
- **Buys:** $49+ easily (company card); evaluates like SaaS (integrations, seats, reporting).
- **Evidence strength: MODERATE-STRONG** (B2B stats directional; Capterra reviewer roles concrete; no direct review of an attribution-loop product exists yet — white space).

### P5 — "The Video-First Clipper" (growth-hacking creator/marketer)
- **Who:** Creator or marketer treating the podcast as raw material for Shorts/Reels/TikTok; 31-51% of podcasters now do video; OpusClip's reviewer base (digital marketers, shorts creators).
- **JTBD:** "Get scroll-stopping clips without watching my own 90-minute episode" — but burned by credit systems and "generic if you don't make templates" output; documented churn to rivals (Luis M. → Vizard).
- **Buys:** $15-29/mo; switches easily; retention comes from clip quality + attribution proof that clips drive listens (currently nobody closes that loop).
- **Evidence strength: MODERATE** (strong for the clip-tool market generally; Podlink's Clip Studio is post-launch, so persona is for the roadmap).

---

## 7. Strategic observations for Podlink

1. **The review rosters say the buyer is often not "a podcaster."** Capterra reviewers of Castmagic/OpusClip are agency CEOs, marketing directors, coaches, EAs. Marketing pages say "podcasters"; money comes disproportionately from P2-P4.
2. **"In the show's voice" is the proven differentiator, not a nice-to-have.** Capsho rebuilt its product around custom tone; Castmagic's loved feature is prompt control; OpusClip's top complaint is generic output. Transcript-grounded + voice-matched is the right wedge.
3. **AI tools haven't yet delivered felt time savings** (Alitu: no measurable difference between AI users and non-users) — a credibility gap Podlink can attack with the attribution loop: don't just save time, show clicks → downloads.
4. **$19/mo is the market-anchored price** (Castmagic Hobby, between OpusClip $15 and Swell $29), but for P1 it must be a consolidation purchase; for P2 it's trivially cheap vs. VA hours.
5. **Monetization white space:** marketplaces exclude sub-5k shows; Audacy is bundling hosting+sponsorship; nobody bundles promotion+attribution+sponsor-readiness. A "sponsor-ready media kit from your attribution data" feature would be unique at this price band.
6. **Caution:** the category's review volume is thin (Podsqueeze: zero reviews on some directories) — this market under-reviews, so organic G2 momentum will be slow; case-study-driven proof will matter more.

---

## Source index
- The Podcast Host industry stats (Buzzsprout data June 2026, Independent Podcast Report 2025): https://www.thepodcasthost.com/listening/podcast-industry-stats/
- Alitu Independent Podcaster Report 2025 (n=558): https://alitu.com/creator/content-creation/the-independent-podcaster-report-2025/
- RSS.com Podcaster Insights Survey Q2 2026 (n=195): https://rss.com/blog/podcaster-insights-survey/
- Podcast Marketing Trends 2025 (n=311): https://podcastmarketingacademy.com/podcast-marketing-trends-report-2025/
- Castmagic Capterra reviews: https://www.capterra.com/p/10012225/Castmagic/reviews · pricing: https://www.castmagic.io/pricing · 18-mo review: https://themarieosullivan.com/castmagic-review/
- OpusClip Capterra reviews: https://www.capterra.com/p/10006559/Opus-Clip/reviews · pricing: https://www.opus.pro/pricing
- Headliner App Store reviews: https://apps.apple.com/us/app/headliner-app-podcast-videos/id1485577013?see-all=reviews&platform=iphone
- Podsqueeze pricing: https://podsqueeze.com/pricing/ · review: https://aigearbase.com/tool/podsqueeze
- Swell AI pricing: https://www.xpay.sh/saas-pricing/swell-ai/
- Podium pricing: https://hello.podium.page/pricing
- Descript pricing: https://www.descript.com/pricing · Riverside: https://riverside.com/pricing · Buzzsprout: https://www.buzzsprout.com/pricing
- Podpage review/pricing: https://www.websiteplanet.com/website-builders/podpage/
- Linktree stats: https://productmint.com/linktree-statistics/ · podcast feature: https://linktr.ee/for/podcasts
- Capsho status: https://podnews.net/directory/company/capsho · NextGen: https://soundsprofitable.com/press-release/capsho-ready-to-relaunch-their-new-platform-capsho-nextgen-and-youre-invited/
- Sponsorship thresholds/CPMs: https://thepodcasthaven.com/how-to-get-podcast-sponsors-downloads-needed-and-what-you-can-earn · https://castos.com/podcast-ads-guide/
- Podcorn → Audacy Creator Lab: https://podnews.net/directory/company/podcorn · https://x.com/CreatorLab_/status/1908265239310938228
- B2B/branded stats: https://beomniscient.com/blog/b2b-podcasting-statistics/
- HN first-person accounts: comments 42238443, 44109915, 21744268, 29296607, 47645085 (via hn.algolia.com API)
- "Nobody listens" language: https://podcastadviceshow.substack.com/p/what-to-do-when-nobodys-listening
