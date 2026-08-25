# Internal Product Analytics and Observability

## Goal

Before custom podcast analytics exists, Podlink still needs internal product analytics and error monitoring so the founder can see whether the MVP works.

## Product events to track

```text
signup_started
signup_completed
podlink_handle_checked
podlink_created
podlink_published
podlink_link_clicked
upgrade_clicked
checkout_started
checkout_completed
content_kit_generated
clip_job_started
clip_job_completed
publish_connected_account
publish_post_scheduled
publish_post_sent
```

## Recommended tools

- Sentry for error monitoring.
- PostHog or Plausible/GA for product/website analytics.
- Railway logs for infra/runtime debugging.

## Claude Code tasks

1. Inspect whether MagicAI/Biolink already include analytics/event hooks.
2. Add a lightweight tracking abstraction if feasible.
3. Add env placeholders for analytics tools.
4. Do not block MVP launch if keys are missing.
5. Document where events are fired and how to disable them.

## Output required

```text
/docs/product-analytics-plan.md
/docs/error-monitoring-plan.md
```
