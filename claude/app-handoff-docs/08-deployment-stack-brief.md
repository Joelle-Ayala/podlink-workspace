# Deployment Stack Brief

## Preferred MVP stack

```text
GoDaddy     = registrar only
Cloudflare  = DNS, SSL/proxy, redirects, security, caching
GitHub      = source control
Claude Code = technical operator / build-debug-deploy assistant
Railway     = primary app hosting if feasible
Stripe      = payments
Resend/Postmark = transactional email
OpenAI/other AI providers = AI features
```

## Railway services to evaluate

```text
podlink-marketing
  serves podlink.ai

magicai-app
  serves app.podlink.ai

biolink-builder-or-public
  serves builder.podlink.ai if needed and/or podlink.fm public pages

database
  MySQL/Postgres depending on app requirements

redis/cache
  if required by app/queues/sessions
```

## Domain routing

```text
podlink.ai          -> marketing service
app.podlink.ai      -> MagicAI service
builder.podlink.ai  -> hidden builder service if needed
podlink.fm          -> public page service
```

## Claude Code tasks with MCPs

If connected, Claude Code can help:

- create Railway project/services
- set env variables
- inspect build/deploy logs
- debug failed deployments
- redeploy services
- validate app URLs
- create docs for DNS records

## Environment variable docs to create

Claude Code should create:

```text
/docs/env-required.md
.env.magicai.example
.env.biolink.example
.env.marketing.example
```

Do not commit real secrets.

## Deployment blockers that require founder action

- account access approvals
- live Stripe keys
- email provider credentials
- OpenAI/provider keys
- Cloudflare/GoDaddy DNS approvals
- final launch signoff
