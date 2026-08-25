# Onboarding and User Journey Spec

## Goal

The MVP should not just expose features; it should guide a podcaster from signup to a live public page and first content output.

## Primary user journey

1. User lands on `podlink.ai`.
2. Clicks `Create your free Podlink`.
3. Registers at `app.podlink.ai/register`.
4. Chooses show/creator name.
5. Chooses handle: `podlink.fm/{handle}`.
6. Adds key links/embeds.
7. Publishes public page.
8. Is prompted to generate episode content or clips.
9. Is shown upgrade path only when relevant.

## Onboarding steps

```text
Step 1: Show / creator basics
- show name
- category
- avatar/artwork
- short bio

Step 2: Claim handle
- desired handle
- availability check
- preview URL

Step 3: Add links
- Spotify
- Apple
- YouTube
- website
- Instagram/TikTok/LinkedIn/X

Step 4: Choose template/theme
- use Biolink templates reskinned as podcast themes

Step 5: Publish
- show live URL
- copy/share QR
- next recommended action
```

## Post-publish next action

Free users:

```text
Your Podlink is live. Want to turn an episode into show notes, captions, and promo posts? Try Pro.
```

Pro users:

```text
Create your first Episode Content Kit.
```

Creator users:

```text
Upload/import a long episode and create clips.
```

## Empty states

Every major section should have a useful empty state:

- My Podlink: “Create your public podcast page.”
- AI Clip Studio: “Upload a long episode to create social clips.”
- Content Kit: “Generate show notes and promo copy from an episode.”
- Publish: “Connect channels to schedule episode content.”
- Analytics: “Automated reports are coming soon.”

## Output required

```text
/docs/onboarding-flow.md
/docs/empty-state-copy.md
/docs/first-run-qa.md
```
