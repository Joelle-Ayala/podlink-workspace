# Pricing, Entitlements, and Unit Economics Brief

## Why this doc exists

The MVP cannot rely on vague tier names. AI video, captions, storage, and publishing can create real variable cost. Before launch, Claude Code should inspect MagicAI's plan/credit system and map every visible feature to explicit plan entitlements.

## Launch pricing placeholders to validate

These are working assumptions, not final decisions.

```text
Free       $0/mo
Pro        $19/mo or $190/year
Creator    $39–$49/mo or $390–$490/year
Studio     Coming soon / contact us
```

## Entitlement principles

- Free should acquire users through the public Podlink page, not expensive AI usage.
- Pro should monetize text/content generation and Podlink page upgrades.
- Creator should monetize expensive video/clip/caption workflows with usage limits.
- Studio should become the analytics/reporting/team/sponsor tier later.
- Every AI/video feature must have a usage limit, credit cost, or both.

## Initial entitlement matrix

| Capability | Free | Pro | Creator | Studio Later |
|---|---:|---:|---:|---:|
| Public podlink.fm handle | 1 | 1–3 | 3–10 | More/team |
| Podlink branding | Required | Removable | Removable | Removable/white-label |
| Blocks/links | Limited | More/unlimited | More/unlimited | More/unlimited |
| Podcast/social embeds | Basic | Full | Full | Full |
| QR/share page | Basic | Full | Full | Full |
| Basic page/link clicks | Basic | Basic+ | Basic+ | Advanced |
| Custom domain | No | Maybe add-on | Yes | Yes |
| Episode descriptions/show notes | No | Yes, usage-limited | Yes | Yes |
| YouTube titles/descriptions/tags | No | Yes | Yes | Yes |
| Social captions/newsletters | No | Yes | Yes | Yes |
| Transcription | No | Limited if installed | Higher limit | Higher limit |
| Viral Clips | No | Trial/upsell only | Yes, limited minutes | Higher limit |
| Smart Captions | No | No/trial | Yes, limited exports | Higher limit |
| Video editor | No | No | Yes if installed | Yes |
| Social publishing | No | Maybe limited | Yes if installed | Advanced/team |
| Analytics reports | No | Coming soon | Coming soon/preview | Yes later |

## Usage limit placeholders for Claude Code to configure or flag

Claude Code should inspect MagicAI's credit/plan/usage system and recommend exact enforcement. Starting placeholders:

```text
Pro:
- Text/content generations: 100–300/mo depending on API cost model
- Transcription: 30–60 minutes/mo if included
- Viral Clips: not included, or 1 trial export only

Creator:
- Clip processing: 60–300 minutes/mo depending on cost
- Clip exports: 10–50/mo
- Captions/subtitles: tied to clip minutes or exports
- Social scheduled posts: 50–200/mo if supported
```

## Claude Code tasks

1. Inspect MagicAI plan, credit, subscription, and usage-limit systems.
2. Identify whether feature gating is route-based, credit-based, plan-based, or custom.
3. Create a feature-to-plan entitlement map from confirmed installed features.
4. Identify high-cost AI/video tools that need limits before public launch.
5. Ensure Biolink public-page limits can be synced or enforced from MagicAI.
6. Document how Stripe products/prices map to internal plan IDs.
7. Do not expose unlimited AI/video usage unless the founder explicitly approves it.

## Output required

```text
/docs/confirmed-entitlements.md
/docs/stripe-plan-mapping.md
/docs/usage-limit-risk-report.md
```
