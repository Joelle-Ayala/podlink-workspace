# MagicAI + Biolink Feature Inventory Audit Brief

## Objective

Confirm what features are actually installed, licensed, enabled, routed, and production-usable in the local MagicAI and Biolink packages.

Do not assume a feature exists because public docs mention it. Verify the installed codebase.

## MagicAI modules to inspect

- Custom Templates
- AI text/content generator
- YouTube title/description/tag tools
- social caption/post templates
- newsletter tools
- summarization/TL;DR tools
- speech-to-text/transcription
- Viral Clips
- AI Captions
- Video Editor
- Social Media Suite
- AI Social Media
- Brand Voice
- Content Manager
- Creative Suite / AI Canvas
- Sora Video / AI Video Pro
- Fal AI / Flux / Fal Video
- AI Influencer
- UGC Factory
- URL to Video Ad
- Video Dubbing
- External Chatbot
- AI Chat Pro / File Chat / Document Chat
- AI Presentation
- MailChimp
- WordPress
- HubSpot
- REST API
- Cron jobs
- storage integrations: local/S3/Cloudflare R2
- SMTP/mail setup
- payment/billing/plan gates

## Biolink modules to inspect

- public page templates/themes
- link blocks
- social blocks
- YouTube/Spotify/TikTok/SoundCloud/Vimeo/embed blocks
- QR codes
- URL shortener
- analytics/click tracking
- custom domains
- tracking pixels
- public profile routes
- admin/user dashboard
- billing/plans if present
- login/register routes
- theme editor/customizer

## Classification

For each confirmed feature, classify as:

1. Core MVP
2. Pro
3. Creator
4. Studio / Later
5. Admin-only
6. Hide/disable from customer UI
7. Not installed / not usable

## Output required

Create:

```text
/docs/confirmed-feature-inventory.md
/docs/feature-tier-map.md
/docs/hidden-features-list.md
```

Each entry should include:

- feature name
- source app: MagicAI or Biolink
- file/routes/controllers/views involved if found
- enabled? yes/no
- customer-facing? yes/no
- recommended Podlink name
- recommended tier
- implementation notes
- risks/blockers
