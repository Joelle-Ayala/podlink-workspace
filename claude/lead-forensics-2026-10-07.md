# Lead forensics, tracking gaps & HubSpot forms verdict — 2026-10-07

Directive: analyze HubSpot, GA, and Search Console to see how we got the Morris lead, what's missing for tracking, and whether to switch to HubSpot forms.

---

## 1. How the lead reached us — hop-by-hop reconstruction

**Lead:** Morris Chavin (morrischavin@gmail.com), first email Sun **Sep 28**, via the /contact qualifying form (mailto composer). Call booked Fri Oct 9, 11:00 ET.

| Hop | What happened | Confidence | Evidence |
|---|---|---|---|
| 1. Query | Searched for help advertising/growing his podcast | **PROBABLE** | His own words: "I came across Podlink while looking for help advertising the podcast." No log evidence possible (see gaps). |
| 2. Engine / exact query | Unknown engine, unknown terms | **UNKNOWN** | GSC would show impressions/clicks on service-intent queries ~Sep 27–28 — needs your Google session (see §2). |
| 3. Landing page | Entered somewhere on podlink.ai | **UNKNOWN** | GA4 wasn't verified/complete on Sep 28 and HubSpot didn't exist yet. Likely /services/* or homepage given his intent, but that's inference, not evidence. |
| 4. Pages browsed | Unknown path through the site | **UNKNOWN** | Same — nothing was recording sessions on Sep 28. |
| 5. Conversion | Used /contact qualifying form → mailto → Gmail | **CERTAIN** | His email carries the exact form template fingerprint (subject `Podcast inquiry — {show}`, body field order). First-ever conversion through that form. |
| 6. Receipt | Landed in Minting House Gmail label-only (skipped inbox) → 9-day lag | **CERTAIN** | Thread headers; no INBOX/IMPORTANT labels. |

**Verdict:** channel = organic search (probable, self-reported); capture = /contact form (certain). Everything between the search box and the send button is unrecoverable — and that's the finding, not a failure of the analysis.

### What each tool actually has on him

- **HubSpot (checked live, portal 20159837):** NO contact for morrischavin@gmail.com. Portal has 12,988 contacts — all Minting House/SchoolGig legacy imports (OFFLINE source) plus GrowSignal test contacts. Zero PodLink web-sourced contacts. Expected: tracker installed Oct 7 ~16:00 UTC, his visits were Sep 28; and the mailto form never creates a contact anyway.
- **GA4:** property G-6BJQCTFXZZ existed on podlink.ai before Sep 28, but I can't read the console — **needs your lent Google session** (in-app browser holds no Google login; pane also hit the hook-timeout freeze again today, so I stopped rather than risk a hang). If the tag was firing Sep 27–28, Reports → Acquisition for that window may show his session as 1 organic-search user. Worth 5 minutes in your sitting.
- **Search Console:** same — **needs your session**. Pull Performance for podlink.ai, Sep 25–29, filter queries containing advertis/promot/grow/market. Even 1–2 impressions with a click would upgrade hop 2 from UNKNOWN to PROBABLE-with-evidence.

---

## 2. What the current stack cannot see (honest gaps)

1. **The mailto form is analytically invisible.** No server receives the submission; there is no event, no contact record, no session linkage, no timestamp independent of Gmail. A `mailto:` click can't even be reliably counted as a GA event today (no event wired).
2. **No identity join anywhere.** Even with GA4 + HubSpot both live, nothing connects "anonymous session" → "person who emailed." GA is aggregate-only by design; HubSpot only joins identity when a tracked form or tracked email click identifies the visitor. The mailto form breaks that join permanently.
3. **Pre-Oct-7 is gone.** HubSpot has zero history before install. GA4 has whatever the tag caught (unverified until your session). Nothing retroactive exists.
4. **GSC can never join to a person.** It shows queries/clicks in aggregate only — useful for hop-2 probability, never for attribution of a specific lead. (By design; not fixable.)
5. **Inbox delivery is a tracking gap too.** His email skipped the inbox for 9 days. Capture isn't complete until the Gmail filter for `Podcast inquiry —` exists (your 2-min task, still open).
6. **Partial mitigation already shipped (Oct 7):** the form now appends "How did you hear about us?" + visible `Came to the site via: {referrer}` to the composed email. That gives future leads self-reported + referrer attribution — but it's text in an email, still not a joined record.

---

## 3. HubSpot forms verdict

**Yes — your instinct is right. Replace the mailto composer's delivery mechanism with a HubSpot form submission. Recommended route: Forms API (keep our UI), not the native embed.**

### Why switch at all
- Closes gap #1 and #2 in one move: every submission creates/updates a HubSpot contact with the `hutk` tracking cookie attached, which retroactively stitches the visitor's full page-view history (post-Oct-7) onto the contact. That's the exact forensic trail we couldn't build for Morris.
- Submissions can't skip an inbox. The lead exists in the CRM the second they hit send, with timestamps, source, and page history — the 9-day-lag class of failure dies.
- Free tier covers it (forms + contacts are free in HubSpot).

### Native embed vs Forms API
- **Native embed (hbspt.forms.create):** fastest, but injects HubSpot's own markup/styles — fights DESIGN.md (form grammar, tokens, focus states), adds iframe/script weight, and the qualifying-form UX (show-name-driven subject, inline referrer line) doesn't port.
- **Forms API (recommended):** keep QualifyingForm.tsx exactly as designed; on submit, POST JSON to `https://api.hsforms.com/submissions/v3/integration/submit/20159837/{formGuid}` with fields + `hutk` (read from the `hubspotutk` cookie) + `pageUri`/`pageName`. Public endpoint, no auth, no backend needed — a client-side fetch works. Full attribution, zero design compromise.

### Costs / cons (stated plainly)
- We must create one form in HubSpot (to get the formGuid) with matching fields — 10 minutes, I can do it via MCP with your go-ahead.
- Data flow changes: form contents go to HubSpot's servers instead of only her Gmail. **Privacy page must say so before the swap ships** — the pending HubSpot one-liner you haven't green-lit yet covers the tracker; the form swap needs one more clause ("information you submit through our contact form is processed via HubSpot"). Both ship together, only on your green light.
- Need a notification path so leads still reach email: HubSpot form notifications → joelle@mintinghouse.co (built-in, free). The mailto behavior can stay as fallback if the POST fails.
- Consent posture: `hutk` attach uses the existing tracking cookie. If we later add a cookie banner, submissions still work without `hutk` (just lose session stitching).

### Staged implementation brief (HELD — not shipping until you confirm)
1. Create "Podcast inquiry" form in HubSpot (fields: email, name, show name, feed/host, goal, heard-from, referrer) → capture formGuid.
2. QualifyingForm.tsx: on submit, POST to the submissions endpoint with hutk + pageUri; on success show confirmation state; on network failure fall back to the current mailto compose (no lead ever lost).
3. Turn on HubSpot form notification → joelle@mintinghouse.co; she also gets the CRM record.
4. Ship privacy additions (tracker one-liner + form clause) in the same commit.
5. Verify live: submit a test, confirm contact created with page-view history attached, confirm notification email arrives.

**Blocked on two words from you:** (a) green light on the privacy language, (b) go on the form swap. Everything else I can execute solo.

---

## 4. What I need from you (unchanged + one new)
- GA4 + GSC: 5-min lent session (or just screenshots of Acquisition Sep 27–28 and GSC queries Sep 25–29).
- Gmail filter for `Podcast inquiry —` (2 min, kills the inbox-skip failure).
- Privacy green light + forms go/no-go.

*All checks today were read-only. No emails sent, no CRM objects created or modified.*
