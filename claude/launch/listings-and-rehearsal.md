# Listings Pack + Dress Rehearsal — every field in hand (2026-09-10)
**GATE: nothing here is submitted until her GO (external-comms gate).**
This doc = the paste-ready metadata pack + the walked-up-to-submit field
inventory per directory, so GO day is execution, not discovery.

## 1. THE ONE METADATA PACK (paste-ready everywhere)
- **Name:** Podlink · **Slug:** podlink (permanent)
- **Server URL:** https://app.podlink.ai/mcp (Streamable HTTP)
- **Auth:** OAuth 2.1 + PKCE (S256) + DCR; RFC 9728/8414 discovery; 401
  challenge with resource_metadata
- **Tagline (≤55):** "Your podcast's numbers, transcripts, and voice" (46)
- **Description (≤2,000, present-tense true):** "Podlink connects your
  podcast to Claude. Ask for your downloads by episode, app, and country —
  pulled live from the open OP3 standard, numbers a sponsor can check. See
  your top apps, your episode list, and your public podlink.fm page. Search
  and read your own episode transcripts — ask what you actually said in
  episode 12, and draft show notes that quote it. Requires a free Podlink
  account and a connected RSS feed — no host migration, ever. Read-only by
  design: every tool is declared read-only, scoped to your own account, and
  revocable from your dashboard."
- **Tools (6, titles = live annotations):** Show overview · Top listening
  apps · Recent episodes · Podlink page · Search your transcripts · Get an
  episode transcript. All readOnlyHint:true.
- **Docs URL:** https://podlink.ai/features/mcp/setup?utm_source={directory}&utm_medium=connector
- **Landing:** https://podlink.ai/claude · **llms.txt:** live
- **Privacy:** https://podlink.ai/legal/privacy (needs B1 green light)
- **Support:** support@podlink.ai (needs B3 alias)
- **Example prompts (3+):** "How did my podcast do this week?" · "Which
  apps do my listeners use?" · "What did I say in episode 12?" · "List my
  last 10 episodes."
- **Security blurb (least-privilege-as-copy):** "Read-only scopes, per-user
  OAuth, no identity parameters on any tool, tenant isolation tested,
  rate limits + daily caps against agent loops."

## 2. DRESS REHEARSAL — per-directory field inventory
**Claude connector directory (the tentpole):** portal at claude.ai admin
settings → directory → submissions — REQUIRES the Team org (B2), so the
portal itself cannot be walked until she buys it. Field list assembled from
the official docs (launch plan §2, re-verified): connection URL + tools
auto-sync + listing fields (name/tagline/description/categories 1–5/icon/
slug) + use-case answers + auth walkthrough + data-handling answers + TEST
ACCOUNT CREDENTIALS (B4: needs the demo account with real OP3 data + its
password — HER provisioning) + 7 compliance acknowledgments. NEEDS-HER:
Team org, test-account password, icon file approval, final submit.
**ChatGPT apps directory:** developer portal requires an OpenAI org +
domain verification for podlink.ai (DNS TXT — I can place the record when
the portal issues it, her account creates the app). Longer checklist: icon
64×64 <5KB, name ≤30, screenshots, T&C page (privacy live; terms page is
still placeholder — flag: TERMS PAGE needed before ChatGPT submission,
not before Claude), 5 positive + 3 negative test cases (drafted on GO
prep), country availability. NEEDS-HER: OpenAI org/account, submit.
**PulseMCP:** lists REMOTE servers; submission via their site form —
metadata pack §1 covers every field they ask (name, URL, description,
category). Account may be required — NEEDS-HER if so, otherwise C can
paste on GO.
**Glama / Smithery:** both lean GitHub-crawl for open-source servers; for
a CLOSED-SOURCE REMOTE server the path is their add/claim flows with the
server URL. Expect account creation (hers by rule). If either proves
repo-required on GO day, skip without loss — they're multipliers, not
gates.
**Directory-day re-verify (claims discipline):** search each directory for
podcast/analytics connectors BEFORE submitting; screenshot the state; the
"first/only" scoped claims unlock only from what that search shows.

## 3. Site launch-surface verification (2026-09-10 sweep — results)
Recorded in SESSION_LOG same date: all pages + endpoints swept post-/claude
deploy; rate-limit burst test result logged. Standing green: 6 services + 8
features + home/studio/contact/legal/setup/claude + report page + sitemap +
llms.txt.

## 4. What GO day needs from her (unchanged, now THE critical path)
B1 privacy green light · B2 Team org · B3 support@ alias · B4 demo OP3
data + test-account credentials · (B5 admin ladder — pricing flip, parallel)
· B6 Podcast Index key (feature, not launch) · B7 HubSpot link (contact
polish) · B8 GO.
