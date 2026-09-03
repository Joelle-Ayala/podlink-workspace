# Podlink — Feature Drip Calendar (PRIVATE — dates never go public)

**Created:** 2026-08-19
**The play:** MagicAI stock features are already live in the product. Announce
them one at a time, every ~2 weeks, while engineering builds the tentpoles
(episode persistence → Content Kit/Pro → Episode Report). Real features,
honestly announced, on a schedule we control. Public surface shows Now/Next/
Later only — no dates.

**Per-announcement checklist (every time, no exceptions):**
1. ✅ VERIFY the feature is enabled and working on app.podlink.ai — log in and
   click it. The stock module list varies by MagicAI config; never announce
   from the vendor's feature list.
2. Add the entry to `web/src/content/changelog.ts` (this is what makes it
   "shipped" on the site).
3. Newsletter blurb + 1 social post (copy below is ready).
4. If the feature has a marketing page, add a "New" badge and link the
   changelog entry.

**Cadence:** one every 2 weeks ≈ 16 weeks of visible momentum. Reorder freely;
tentpole launches (Pro, Episode Reports) interrupt the drip and take priority.

---

## The eight drip announcements (drafted, ready to verify → ship)

### 1. Download Analytics
**Tag:** New · Free
**Changelog:** "See every download, free. Podlink now shows your downloads by
episode, app and country — live from the open OP3 standard, no migration, no
new host. Connect your feed and the numbers are just there."
**Social angle:** "Most hosts make you pay to see your own numbers. We made it
free." → benchmark-table graphic (26/72/231/539/3,062).

### 2. Your Link-in-Bio Page
**Tag:** New · Free
**Changelog:** "One page for your whole show. Claim your podlink.fm page —
every platform, every episode, one link that fits in any bio. Free, and it's
where your listeners stop getting lost between apps."
**Social angle:** before/after of a cluttered bio vs. one clean link.

### 3. Brand Voice
**Tag:** New · Pro
**Changelog:** "Your show's voice, remembered. Set your show's tone, audience
and language once — every piece of content Podlink generates uses it. No more
re-explaining your podcast to an AI every session."
**Social angle:** the anti-generic pitch — "AI content that doesn't sound like
AI content" (this is the #1 documented complaint about competitor tools).

### 4. The Template Library
**Tag:** New · Pro
**Changelog:** "Fifty ways to repurpose one episode. Show notes, social
threads, YouTube descriptions, quote posts — the full template library is live,
and every template respects your Brand Voice."
**Social angle:** "1 episode → a week of content" carousel.

### 5. Episode Transcripts
**Tag:** New · Pro
**Changelog:** "Transcripts, in the same place as everything else. Upload an
episode and get a clean, editable transcript — the raw material for every kit
Podlink builds. (Automatic from your RSS feed: in development — see the
roadmap.)"
**Honesty note:** stock transcription is manual upload today. Say so — the
roadmap line turns the limitation into anticipation.

### 6. Multilingual Content
**Tag:** New · Pro
**Changelog:** "Your show, in more languages. Generate show notes and posts in
dozens of languages — reach the listeners your English-only content never
touches."
**Social angle:** stat — non-English podcast listening growth.

### 7. AI Episode Art
**Tag:** New · Pro
**Changelog:** "Episode art without a designer. Generate cover and episode
images in your show's style, sized for every platform, inside the same
dashboard as everything else."

### 8. AI Chat (your podcast copilot)
**Tag:** New · Pro
**Changelog:** "Ask your dashboard anything. Brainstorm titles, draft a guest
pitch, outline next week's episode — the chat assistant lives next to your
show's content, not in another tab."
**Social angle:** demo clip of a real prompt → result.

---

## Tentpoles (interrupt the drip when they ship — these get full launches)

| Launch | What must be true first |
|---|---|
| **Pro launch: the Episode Content Kit** | Episode persistence + auto-transcription live; pricing tiers fixed in MagicAI admin (currently inverted!); /pricing rewritten + indexed |
| **YouTube connect (lite)** | Channel OAuth + per-episode views working |
| **Episode Reports v1** | Tracked links + per-episode pages + correlation view |
| **Podlink MCP** | The server committed, deployed, and connectable by a real user |
| **Booking / Sponsor Outreach system** | Google/Microsoft OAuth app verification for send scopes; deliverability guardrails; licence check on enabling the module |

## Standing rules
- Changelog = usable today. Roadmap = no dates. Never backdate.
- Every claim survivable by a screenshot — same rule as the case studies.
- Announcement copy stays in the buyer's language (personas doc §3): time back,
  in-your-voice, prove-it. Never "revolutionary AI."

## STATUS AMENDMENT 2026-09-02 (post-SSD recovery - current state)
- Drip #1 (Download Analytics) PUBLISHED (2026-08-25, changelog live - verified by the desktop thread).
- SHIPPED SINCE, queued as drip candidates (verify-then-ship per the checklist): episode transcripts (one-click, credit-metered - pipeline live 09-01) - "talk to your podcast" MCP connector incl. transcript search (v1.1 live 09-02; announcement carries directory-scoped claims ONLY per voice-guide, and its TENTPOLE version waits on the directory listing).
- NEXT GENUINE NEW ENTRY: contact-discovery P1 (find shows by niche + contact cards) - named next new feature (WORK-CANON 09-02); only gate = Joelle''s Podcast Index key; announcement spine = founder-voice sample E.
- TENTPOLES UPDATE: Show Report is now the HERO deliverable (gtm-plan positioning amendment 09-02) - its launch interrupts the drip when it ships. MCP directory listing remains the other tentpole.
- LAUNCH GATE (09-02, NARROWED same day - external comms only): tentpole ANNOUNCEMENTS, launch posts, PR and directory submissions wait on Joelle's final go (claude/launch/README.md). Code, site updates, feature ships and index flips proceed on their own condition checklists. Ordinary drip entries (real shipped features, honestly announced) continue on cadence.
