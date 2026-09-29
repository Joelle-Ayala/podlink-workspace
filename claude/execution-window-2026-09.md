# Execution window staging — one ~10-minute desktop sitting (staged 2026-09-28)

## Delegation record (canon)
Joelle, via orchestrator dispatch 2026-09-28: "Can you do this for me?" — B5 admin
execution is DELEGATED. The price decision is hers and long-made ($29 Pro / $232
annual, $99 Studio / $990 annual, reset_credits_on_renewal ON; confirmed in
podlink-pricing-v2 §7, the 09-18 dispatch, and the 09-28 check-in). The old
"don't touch pricing admin" rule gated on her DECISION, which exists; execution
in her lent session is authorized. Payments rule unchanged: no purchase executes
without her explicit per-purchase confirmation of the amount.

## The sitting (she logs in at app.podlink.ai, lends the session, ~10 min total)

### 1. B5 — admin plan ladder (me driving, her session)
1. Dashboard → Admin → Finance → **Payment Gateways**: confirm Stripe row uses
   the STRIPE_* env creds; if disabled, PAUSE and confirm with her before
   enabling live payments (one word from her, then enable).
2. Admin → Finance → **Membership Plans**: create **Pro** — $29/mo, $232/yr
   (annual = 8×, "4 months free"); create **Studio** — $99/mo, $990/yr
   (annual = 10×, "2 months free"); feature/credit fields per
   `claude/podlink-pricing-v2.md` tier spec; **reset_credits_on_renewal: ON**
   for both.
3. Hide/deactivate the seeded stock plans (deactivate, don't delete).
4. Verify Stripe sync: each saved plan shows a Stripe product/price id; open
   Stripe dashboard read-only to confirm objects exist.
5. Run the /pricing flip checklist (`claude/pricing-page-template.md`, 5
   conditions). If all clear: drop noIndex on web /pricing, un-comment the
   sitemap line, push, verify live + link-preview meta. If any condition
   fails: report which, flip stays.

### 2. Find Shows WORKS stamp (me driving, ~1 min)
Dashboard → Podcast → **Find Shows** → search "true crime" → screenshot results
(w/ Podcast Index attribution) → mark WORKS in SESSION_LOG + launch README.
(Keys verified present on Railway since 09-18; env names verified matching.)

### 3. YouTube scoped reconnect (~30 s of her)
Dashboard → Podcast Analytics → YouTube card → Disconnect → **Connect YouTube**
→ SHE clicks the Google consent (must include the "view YouTube Analytics"
scope line). Then I verify: demographics card shows real data, watch-time strip
renders, Show Report Audience section populates → un-qualify any "Soon" copy.

### 4. While in there (me, zero her-time)
Eyeball the downloads sparkline (snapshots since 09-17); transcribe-click one
episode if she nods (verifies transcript segments/timestamps live); capture
dashboard screenshots for the site (feeds design Brief 2 prerequisites).

## Already answered from her phone (sent 09-28)
5. Drip dates (one line, yes/no).
6. Privacy summary + URL (one word green light = B1).
7. Team org steps + cost (do-it-herself or authorize lent-session purchase
   with per-purchase amount confirmation).

## Status ledger for the sitting
- [ ] B5 ladder + Stripe verify + flip-or-report
- [ ] Find Shows WORKS proof
- [ ] YouTube reconnect + demographics/watch verify
- [ ] Sparkline eyeball + transcript click-verify + screenshots
