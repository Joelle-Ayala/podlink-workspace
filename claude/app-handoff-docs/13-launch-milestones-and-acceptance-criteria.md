# Launch Milestones and Acceptance Criteria

## Why this doc exists

The project should not become one giant ambiguous build. Work in acceptance-tested milestones.

## Milestone 0 — Codebase audit

Acceptance criteria:

- MagicAI and Biolink installed-feature inventory complete.
- Visual/demo/template inventory complete.
- Integration path recommended.
- Railway feasibility documented.
- No code changes except docs/setup unless approved.

## Milestone 1 — Local/staging install

Acceptance criteria:

- MagicAI runs locally or on staging.
- Biolink runs locally or on staging.
- Database migrations/seeds understood.
- Login/admin access works in staging.
- Known install/deployment blockers documented.

## Milestone 2 — Podlink brand shell

Acceptance criteria:

- Customer-facing MagicAI/Biolink/vendor labels hidden/replaced.
- Dashboard nav reflects Podlink sections.
- Irrelevant tools hidden from customer UI.
- Basic Podlink theme/logo/favicon placeholders installed.

## Milestone 3 — Tier packaging and feature gating

Acceptance criteria:

- Free/Pro/Creator/Studio plan map configured or documented.
- High-cost AI/video tools have limits or are hidden.
- Stripe test products/prices mapped if billing is enabled.
- Locked features route to one billing page.

## Milestone 4 — Podlink page experience

Acceptance criteria:

- User can create/login through MagicAI/app.podlink.ai.
- User can create or access a Podlink page.
- Public page renders at podlink.fm/{handle} or a staging equivalent.
- Public page is mobile-friendly.
- Duplicate handles are blocked.

## Milestone 5 — MagicAI/Biolink bridge

Acceptance criteria:

- One-login bridge works in staging.
- No second Biolink login required for normal user flow.
- Biolink login/register/pricing is hidden or redirected.
- SSO token expires quickly and contains no sensitive plaintext.

## Milestone 6 — Public website

Acceptance criteria:

- podlink.ai marketing site has required launch pages.
- CTAs route to app.podlink.ai signup/login.
- Feature pages match confirmed capabilities.
- No false analytics claims.
- Fresh Podlink screenshots used where possible.

## Milestone 7 — AI content/clip workflow

Acceptance criteria:

- Pro content tools work for episode copy outputs.
- Creator clip/caption/video tools work if installed.
- Content outputs are branded/packaged as Podlink workflows.
- Usage limits are enforced or high-cost tools are hidden.

## Milestone 8 — Launch readiness

Acceptance criteria:

- Password reset email works.
- Billing test flow works or billing is intentionally disabled for beta.
- Terms/privacy/contact pages exist.
- Error logging enabled.
- Backups/rollback plan documented.
- Founder completes final mobile/desktop QA.

## Do not proceed to production until

- Debug mode is off.
- Production secrets are set safely.
- Staging QA passes.
- DNS cutover plan exists.
- Rollback plan exists.
