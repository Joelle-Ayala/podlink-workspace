# RAILWAY-NOTES.md — Biolink on Railway

> Prepared by Backend agent, 2026-07-09. Findings from reviewing the shipped
> `Dockerfile` / `docker-compose.yml` against Railway's runtime, plus the
> tweaks already applied in this workspace copy. Referenced by
> DEPLOY-DAY-RUNBOOK.md Phase 2 (service 4) and Phase 4.

## Verdict

The shipped Dockerfile builds a solid php:8.4-apache runtime (mysqli, gd,
intl, zip, bcmath, opcache, custom-compiled maxminddb) **but was written for
docker-compose, not Railway**. Two things broke push-button deploy; both are
now fixed in this workspace copy:

## Issues found → fixes applied (2026-07-09)

### 1. No app code in the image (BLOCKER — fixed)
The original Dockerfile never `COPY`s the source; docker-compose bind-mounts
`.:/var/www/html`. Railway does not mount your repo into the container, so the
image served an empty webroot.
**Fix:** `COPY . /var/www/html/` added at the end of the Dockerfile (harmless
locally — the compose volume overlays it).

### 2. Port binding (fixed)
Apache listens on 80; Railway injects `$PORT` and expects the process to bind
to it. **Fix:** new `docker-entrypoint.sh` rewrites `ports.conf` +
`000-default.conf` to `$PORT` at boot (no-op when `PORT` is unset or 80, so
local compose is unaffected). Fallback if the entrypoint is ever removed:
Railway → service → Settings → Networking → set target port **80** when
generating the domain.

### 3. config.php credentials (fixed — and why committing it is fine)
The committed `config.php` **is the blank vendor template** — every
`DATABASE_*` / `SITE_URL` define is an empty string (verified 2026-07-09).
Committing it to the PRIVATE repo is fine and expected (the runbook's Phase 1
evidence check looks for it). Real values never go into git: the entrypoint
fills `config.php` at boot from Railway env vars when `DATABASE_SERVER` is
set.

Railway env vars for `biolink-public`:

| Var | Value |
| --- | --- |
| `DATABASE_SERVER` | Railway MySQL internal host (reference variable) |
| `DATABASE_USERNAME` | from Railway MySQL |
| `DATABASE_PASSWORD` | from Railway MySQL |
| `DATABASE_NAME` | `biolink` |
| `SITE_URL` | `https://podlink.fm/` (trailing slash — DEPLOY-PREP.md) |

## Remaining Railway to-dos (config, not code)

- **`uploads/` is ephemeral.** Railway's filesystem resets on every deploy.
  Attach a Railway **Volume** mounted at `/var/www/html/uploads` before real
  users upload avatars/QR codes/etc. (The stock placeholder tree ships in the
  image, so first boot works either way.)
- **Cron service.** docker-compose runs a second container looping over
  `uploads/main/cron.txt` every 60s (`Dockerfile.cron`). On Railway, create a
  second service from the same repo/Dockerfile with custom Start Command:
  ```
  bash -c 'while true; do CF=/var/www/html/uploads/main/cron.txt; if [ -f "$CF" ]; then while IFS= read -r l || [ -n "$l" ]; do [ -n "$l" ] && sh -c "$l" >/dev/null 2>&1; done < "$CF"; fi; sleep 60; done'
  ```
  If `uploads/` gets a Volume, attach the SAME volume here (cron.txt is
  written by the app at install time). Not needed for first boot — add when
  scheduled features (webhooks, digests) matter.
- **Database:** use the shared Railway MySQL service, database `biolink`
  (runbook Phase 2 service 1). The compose file's MariaDB block is local-only.
- **Installer:** first hit on the Railway temp domain runs `/install`
  (founder step, Phase 4 — needs the Biolink purchase code).
- **PHP 8.4 note:** image is php:8.4; Biolink v68 supports it (it shipped this
  Dockerfile). No change needed.
