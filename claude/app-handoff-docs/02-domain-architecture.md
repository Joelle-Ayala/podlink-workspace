# Domain and App Architecture

## Domains

```text
podlink.ai
  Public marketing website, pricing, features, examples, signup CTAs.

app.podlink.ai
  Main logged-in SaaS app, likely powered by MagicAI.

podlink.fm
  Public creator/podcast pages, likely powered initially by Biolink.

builder.podlink.ai
  Optional hidden builder service if Biolink remains separate behind SSO.
```

## User mental model

```text
podlink.ai = learn/sign up
app.podlink.ai = build/manage
podlink.fm = share
```

## Recommended near-term architecture

```text
MagicAI = master app
Biolink = public page/builder engine
SSO bridge/wrapper = integration layer
podlink.fm = public output domain
```

## Preferred user flow

1. User visits `podlink.ai`.
2. User clicks “Create your free Podlink.”
3. User registers at `app.podlink.ai/register`.
4. User builds/edits their Podlink from inside `app.podlink.ai`.
5. Published public page lives at `podlink.fm/{handle}`.

## Integration options to evaluate

### Option 1: SSO bridge

MagicAI owns auth/billing. Biolink remains separate but hidden. MagicAI generates a short-lived signed token to log the user into Biolink without a second login.

### Option 2: Wrapper module

MagicAI exposes `/podlinks` routes and embeds/proxies/wraps Biolink builder functionality.

### Option 3: Native port

Biolink page-builder models/views/routes are ported into MagicAI.

### Option 4: True plugin/extension

Biolink functionality is packaged into MagicAI’s extension/marketplace system if that system supports routes, migrations, views, nav, permissions, settings, and install/uninstall lifecycle.

## Bias

Start with SSO bridge or wrapper if fastest and safest. Design so it can become native later.
