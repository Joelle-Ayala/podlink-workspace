# Contact-Discovery P3 Amendment — send layer VERIFIED (2026-09-02)
**Filed as a sibling doc because contact-discovery-spec.md was file-locked on
the desktop at write time (likely open in an editor — possibly the other
session). MERGE this into the spec's §7/P3 when the lock clears; until then
this doc GOVERNS P3.**

Founder ask: confirm the "MagicAI AI-CRM as the send layer" recollection.
Sources: official MagicAI changelog (Codecanyon item page; v11.1 current) +
new.magicproject.ai feature pages. Our app runs a customized v10.8.1 fork.

## What actually exists today
1. **"AI-Powered CRM"** — NEW in MagicAI v11.0 (Jul 29, 2026), Paid /
   Premium-Membership tier.
   **IS:** a sales-pipeline CRM — clients, companies, deals, pipeline stages,
   sales tracking, invoices, payments, tasks, reports, an AI assistant you
   chat with about CRM data (incl. WhatsApp/Telegram), AI presentations from
   CRM data.
   **IS NOT:** an outreach sequencer. No email sequences, no scheduled
   multi-step campaigns, no reply-detection/stop-on-reply, no cold-email
   sending of any kind in its marketed feature list.
2. **Gmail/Outlook in the ecosystem** exist only as: (a) "Connectors for AI
   Chat Pro" — READS email/docs/calendar as chat context, drafts replies;
   (b) "AI Agent Builder" agents that connect to Gmail/Outlook to
   read/summarize/draft. Neither is a campaign engine (no steps, delays,
   per-tenant limits, suppression lists, warm-up awareness).
3. **Marketing Bot v2** = WhatsApp/Telegram broadcast via official Meta API —
   confirmed DISTINCT; stays deferred. "Social Media for AI Agent Builder"
   stays on the unverified-claims list. Neither is an email send layer.

## Verdict
The spec's P3 assumption — "one click into the AI CRM's Gmail/Outlook
sequences" — **does not exist as marketed.** Correction, two parts:
- **ADOPT (buy-later, under the standing purchase hold): the CRM extension as
  the PIPELINE layer** — booking deal/task tracking, contact records, the AI
  assistant over booking data. Genuinely useful; matches its marketing.
  **Price: TBD** — not published publicly ("Premium Membership"/Paid); exact
  number is readable in HER admin marketplace → buy-later list, price-TBD tag.
  **Version gate:** requires MagicAI v11.x; we run a customized v10.8.1 fork
  (Mcp/, analytics, episodes, transcripts) — upgrading is a real migration
  with regression risk; scope + test before any buy.
- **BUILD: the SEQUENCE ENGINE stays custom** — Laravel + Gmail/Outlook send
  APIs: steps/delays, stop-on-reply, per-tenant opt-outs + global suppression
  list, plan-level sending caps, warm-up-aware throttling.

## Gates (unchanged, binding, whichever layer)
Google/Microsoft OAuth app verification for send scopes (weeks; hers to
initiate, we prep) · CAN-SPAM/GDPR posture designed BEFORE the send button
exists · sending-domain warm-up (JOELLE-TODO #8 — 75-day clock, still the
longest pole) · Snov resale terms + separate Podlink account for P2.

## The booking system, one line (canon)
**P1 find shows** (Podcast Index key = only gate; zero send risk, ships now)
→ **P2 verified contacts** (Snov terms + account) → **P3 sequences** (custom
send engine; CRM extension optionally alongside as pipeline; OAuth +
compliance + warmed domains) → **P4 Clay deep tier + sponsor lanes.**
The send leg ships LAST by design; P1 is user-visible value on day one.
