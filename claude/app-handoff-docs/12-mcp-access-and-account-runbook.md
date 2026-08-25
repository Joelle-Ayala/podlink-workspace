# MCP, Access, and Account Runbook

## Goal

Make Claude Code useful as a technical operator without giving it unsafe or unclear authority.

## Accounts/tools to connect when ready

| Tool/account | Purpose | Claude Code can do | Founder must approve |
|---|---|---|---|
| GitHub | Source control | branches, commits, PRs, diffs | repo creation/access level |
| Railway | Hosting/deploy/logs/env | deploy, inspect logs, env placeholders, services | production changes, secrets |
| Cloudflare | DNS/SSL/redirects/security | propose records, possibly apply with approval | nameserver/DNS changes |
| GoDaddy | Registrar | mostly reference only | nameserver changes/renewals |
| Stripe test mode | Billing setup/testing | products, prices, webhooks, checkout tests | live mode activation |
| Resend/Postmark | Transactional email | configure/test mail env | domain verification/API keys |
| OpenAI/AI providers | AI tool enablement | configure env placeholders/test calls | keys/budget limits |
| Database | Schema/testing | inspect tables, run migrations in dev | production migrations |
| Browser/Playwright | QA | signup/publish/billing tests | final approval |

## Access safety rules

- Never commit real secrets.
- Use test-mode Stripe until founder approves live mode.
- Use staging domains/environments before production when possible.
- DNS changes require explicit founder approval.
- Production migrations require backup and rollback plan.
- Any destructive action must be proposed first.

## First MCP-enabled tasks

1. Create/import GitHub repo.
2. Get both apps running locally.
3. Create Railway project/services in staging.
4. Add env placeholders and deployment docs.
5. Deploy staging services.
6. Connect staging domains or Railway preview domains.
7. Run browser QA against staging.
8. Only then prepare production DNS and Stripe live mode.

## Environment strategy

Use at least:

```text
local
staging
production
```

Each service should have separate env values for:

```text
APP_URL
APP_ENV
APP_DEBUG
DB_DATABASE
STRIPE_* keys
MAIL_* keys
OPENAI_API_KEY
PODLINK_SSO_SHARED_SECRET
```

## Output required

```text
/docs/access-needed-checklist.md
/docs/staging-setup-checklist.md
/docs/production-cutover-checklist.md
```
