# Support, Admin, and Abuse Operations

## Goal

A public MVP needs basic admin/support controls before inviting real users.

## Required admin abilities

- Search users by email/name.
- See user plan and subscription status.
- See public Podlink pages owned by a user.
- Disable/unpublish abusive public pages.
- Reset or trigger password reset.
- View failed jobs: AI, upload, publishing, SSO.
- View payment/webhook status if Stripe is enabled.
- View storage usage if video uploads are enabled.

## Abuse controls

- Public pages can be unpublished by admin.
- User-generated uploads have size/type limits.
- Prohibited content language exists in Terms/Acceptable Use.
- Report/contact path exists for abuse complaints.
- DMCA/contact email exists for copyright issues.

## Founder support workflows

Common support scenarios:

1. User cannot log in.
2. User claimed wrong handle.
3. Public page not updating.
4. AI generation failed/charged credits.
5. Clip job failed.
6. Payment succeeded but plan not upgraded.
7. User wants page removed.

Claude Code should create a support checklist for each if feasible.

## Output required

```text
/docs/support-playbook.md
/docs/admin-feature-gaps.md
/docs/abuse-and-takedown-flow.md
```
