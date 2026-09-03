# /about Page Draft v2 — with the founder story (HOLD FOR JOELLE'S SIGN-OFF)
**2026-09-02.** Extends the live /about (whose numbers are all evidence-brief
defensible: 27 clients, since Jan 2021, 5+yr longest relationship, 8-of-13
repeat). This draft ADDS a founder section from the voice memo
(founder-story-raw.md) using ONLY claims that pass §2's gates or are framed
first-person-experience rather than verifiable-fact. Nothing ships until she
approves; verbatim-memo attachment would strengthen it further.

Claims discipline applied: no revenue figures (unverified) · no Oracle/
NetSuite mention (unverified; adjacent to a dead claim) · no internship
employer names in headline claims (LinkedIn pass pending) — the sports-TV
past is framed as her telling · "my agency", never "Minting House" (standing
rule) · guest names omitted until archive-checked.

---

## NEW SECTION — insert after `story`, before `stats`
**eyebrow:** The founder
**headline:** This product is a career's worth of doing it by hand.

**paragraphs:**

1. "Joelle Ayala has been on every side of a podcast. In college she created
and hosted a campus sports show, called play-by-play on student radio, and
took the 1am Saturday slot nobody wanted. Her first jobs in sports radio and
television were cutting highlights — finding the forty seconds that mattered
in three hours of tape, before AI could do it. That's still the clip
philosophy here: the moment is found by judgment, and the judgment came
first."

2. "Two jobs turned that background into a thesis. As head of growth at a
returns-technology startup later acquired by PayPal, she booked the founder
on industry podcasts and watched appearances turn into backlinks, search
traffic, referrals and demo calls — the appearance was never the point; what
traveled afterward was. Then, running marketing for one of the biggest
business podcasts of the era, she built the loop this product is based on:
clips cut from episodes became the ads, the ads funded the growth, and the
show's numbers became something sponsors paid real money against."

3. "In 2021 she took that playbook independent — a podcast growth practice
that has produced, clipped, booked and monetized shows for solo creators,
funded startups and national brands ever since. PodLink is that practice's
method, productized: the measurement that survives a sponsor's checking, the
clips that make one episode a week of promotion, and the booking motion that
treats an appearance as the start of the work rather than the end of it."

**pull-line (optional, her call):**
"We booked podcasts by hand for five years. The product is that method,
productized." (already voice-guide canon, P3)

---

## Open slots that get stronger with verification
- [ ] Wolf's Den named explicitly? (currently "one of the biggest business
      podcasts of the era" — naming it is HER call; show is in proof.ts)
- [ ] "I turned down Andrew Tate" — belongs in the LinkedIn 1-pager or an
      interview answer more than /about; needs verbatim confirmation
- [ ] Guest-booking name-drops (Holiday/Brunson/Patel/Siu/Asprey) — add ONLY
      after checking each public episode archive
- [ ] LinkedIn cross-check of employment history (blocked anonymously;
      needs her lent session or her thumbs-up)

## Implementation note
One additive block in web/src/content/about.ts (founder: {eyebrow, headline,
paragraphs[]}) + one section render in app/about/page.tsx between story and
stats. metaDescription unchanged. Ships same-hour on her approval.
