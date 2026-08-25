# Visual Asset Inventory Template

Use this template while auditing MagicAI and Biolink visuals.

| Asset path | Source app | Asset type | Current use | Visible vendor branding? | Reuse classification | Podlink use | Required action | Notes |
|---|---|---|---|---|---|---|---|---|
| `/path/to/asset.png` | MagicAI | Screenshot | Dashboard hero | Yes | Reskin/screenshot again | Podlink dashboard preview | Replace labels, capture new screenshot | |
| `/path/to/icon.svg` | MagicAI | Icon | AI writing | No | Reuse after copy | Episode Content Kit | Rename label | |
| `/path/to/template.blade.php` | Biolink | Public template | Bio page | No | Reuse after reskin | `podlink.fm/{handle}` | Podcast-specific blocks | |

## Reuse classifications

- Reuse directly
- Reuse after Podlink reskin
- Use layout/component only
- Use internally but not public
- Screenshot again after reskin
- Replace/create new
- Discard/hide

## Scan locations

Inspect at minimum:

```text
/public
/public/assets
/public/assets/frontend
/public/assets/css
/public/assets/js
/resources
/resources/views
/resources/css
/storage
/database/seeders
```

Also inspect app/admin template records and demo content if seeded into the database.
