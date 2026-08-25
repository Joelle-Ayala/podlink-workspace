# Security, Legal, and Operations Brief

## Why this matters

Podlink will handle user accounts, public pages, user-uploaded media, AI-generated content, payment data, and potentially social tokens. This requires launch hygiene even for beta.

## Security requirements

- Production `APP_DEBUG=false`.
- Real secrets never committed.
- Password reset works securely.
- Admin routes protected.
- Upload file types and sizes restricted.
- Video/media uploads stored in a controlled disk/bucket.
- SSO tokens short-lived, signed, and not reusable if feasible.
- Social/API tokens encrypted at rest if stored.
- Rate limits on auth, AI generation, upload, and public endpoints.
- CSRF/session/cookie domains checked across subdomains.
- CORS only enabled where required.

## Legal/trust pages needed before public launch

- Terms of Service
- Privacy Policy
- Contact/Support
- Refund Policy if paid plans are live
- DMCA/Copyright contact if users upload media or publish public pages
- Acceptable Use / Prohibited Content language

## Licensing/IP checklist

- Confirm CodeCanyon license terms for MagicAI and Biolink usage.
- Confirm whether demo assets/templates can be used publicly.
- Do not use vendor testimonials/reviews as Podlink testimonials.
- Do not leave vendor logos/brands in public screenshots.
- Create fresh screenshots after reskin wherever possible.
- Verify any stock images/icons included in templates are allowed for SaaS use.

## Operational admin needs

Admin should be able to:

- Find a user by email.
- View user plan/status.
- View or disable abusive public pages.
- Reset/support account issues.
- Review failed payments/webhooks.
- Review failed AI jobs/uploads.
- Review failed SSO attempts.

## Support basics

- `support@podlink.ai` or similar mailbox.
- Basic support/contact form.
- Welcome email or onboarding email.
- Internal support doc for common failures.

## Output required

```text
/docs/security-launch-checklist.md
/docs/legal-pages-needed.md
/docs/admin-ops-checklist.md
```
