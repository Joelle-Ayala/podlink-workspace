# Automated Analytics Roadmap — Not Launch MVP

## Important

Do not make custom automated analytics a launch requirement for the first public MVP.

Do design the architecture now so analytics can be added cleanly.

## Product goal

Podlink should eventually provide:

1. Episode Reports
2. Channel Reports
3. Clip attribution
4. Sponsor-ready reports
5. Date/channel/platform/content-type filters

## Core concept

Each episode receives:

- unique tracking code
- tracking hashtag
- canonical Podlink episode URL
- optional sponsor/CTA tracking links

Connected channels are synced. Posts/clips are matched to episodes by:

1. exact platform post ID if published through Podlink/MagicAI
2. episode tracking code in caption/description
3. canonical Podlink URL in caption/description
4. title/guest/date fuzzy matching as fallback

## Analytics data model to design for

```text
podlink_shows
podlink_episodes
podlink_episode_assets
podlink_tracking_codes
podlink_platform_connections
podlink_metric_snapshots
podlink_episode_reports
```

## Initial automated analytics MVP later

Start with:

- YouTube OAuth/analytics sync if not already available in MagicAI
- Podlink first-party clicks
- tracking code/URL matching
- episode report dashboard
- date/channel/content-type filters

Then add:

- Instagram/Meta insights
- TikTok if feasible
- podcast host APIs
- Spotify/Apple/audio analytics where available

## What to build during launch MVP

Even before analytics is visible, add foundation where low-risk:

- Episode model or placeholder architecture
- tracking code generation
- canonical episode URL structure
- attach generated clips/posts to episode context
- store platform post IDs when publishing through MagicAI
- design connector interface

## Do not

- require manual metric entry as the main workflow
- promise cross-platform analytics is live before it is working
- delay the launch MVP for full analytics
