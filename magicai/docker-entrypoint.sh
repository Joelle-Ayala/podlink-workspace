#!/bin/bash
# Podlink MagicAI — container entrypoint for Railway.
# Rebinds Apache to Railway's $PORT, asserts Laravel writability, rebuilds
# config/view caches from the injected env, optionally migrates.
set -e
cd /var/www/html

# ---- Bind Apache to Railway's injected $PORT (default 8080 locally) --------
PORT="${PORT:-8080}"
sed -ri "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT}>/" \
    /etc/apache2/sites-available/000-default.conf

# ---- Laravel runtime dirs must exist and be writable ------------------------
mkdir -p storage/framework/cache/data storage/framework/sessions \
         storage/framework/views storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R ug+rwX storage bootstrap/cache 2>/dev/null || true

# ---- Extensions dir must exist and be writable (UI marketplace installs) ----
# (2026-08-07) Marketplace install failed: "Unable to create a directory at
# /var/www/html/app/Extensions" - app/ is root-owned, Apache runs as www-data.
# A Railway volume is mounted at app/Extensions so UI-installed extensions
# survive redeploys (container FS is ephemeral). Worker-parity caveat: the
# volume is web-service-only; if an extension ever needs worker-side code
# (e.g. social scheduling jobs), commit its files into the repo at that point.
mkdir -p app/Extensions routes/extroutes resources/extensions
# (2026-08-07 follow-up) The LEGACY extension installer (extensions without an
# extension_folder: introductions, newsletter, checkout-registration, etc.)
# writes into resources/extensions, routes/extroutes, app/Http/Controllers and
# public/ - MagicAI assumes classic-hosting full-tree writability. Grant it for
# the app tree (vendor/ excluded - never written at runtime, and huge).
# NOTE: legacy-installed extension FILES live outside the app/Extensions volume
# and are LOST on redeploy - DB rows persist, so re-install after each deploy
# (one POST per slug) until extension files are committed into the repo.
chown -R www-data:www-data app resources routes public database app/Extensions 2>/dev/null || true
chmod -R ug+rwX app resources routes public database 2>/dev/null || true

# ---- .env stub on the volume (extensions write settings into .env) ----------
# (2026-08-07) Settings->Cloudflare R2 'Save' crashed:
#   file_get_contents(/var/www/html/.env): Failed to open stream
# This deployment is env-var-driven and ships no .env; the R2 extension (and
# possibly others) persist admin-form settings by rewriting .env. Provide one,
# stored on the app/Extensions Railway volume so UI-written values survive
# redeploys, symlinked to the expected path. SAFE: Dotenv never overrides
# variables already present in the real environment, so Railway vars win.
touch app/Extensions/.env
ln -sfn /var/www/html/app/Extensions/.env /var/www/html/.env
chown www-data:www-data app/Extensions/.env 2>/dev/null || true
chmod ug+rw app/Extensions/.env 2>/dev/null || true

# ---- License portal file must survive redeploys (2026-09-18 incident) -------
# ApplicationStatus middleware (web group) gates EVERY web route on
# storage/app/portal (serialized license state written by the /license
# activation flow). That file lived on the ephemeral container FS, so a
# container recreate sends the whole app - login included - to the
# "Activate your license" screen. Fix: keep the real file on the
# app/Extensions Railway volume (same pattern as the .env stub above) and
# symlink it into place. Activating once at /license now sticks forever.
# Optional self-heal: if LIQUID_LICENSE_DOMAIN_KEY is set in the environment
# and no portal file exists yet, bootstrap one at boot (no activation click
# needed). LIQUID_LICENSE_TYPE optionally overrides the license type;
# default "Regular License".
if [ -f storage/app/portal ] && [ ! -L storage/app/portal ] && [ ! -s app/Extensions/portal ]; then
  cp storage/app/portal app/Extensions/portal  # adopt any live file first
fi
# MAGICAI_PURCHASE_CODE already exists on the Railway service (2026-09-18),
# so accept it as the bootstrap key when LIQUID_LICENSE_DOMAIN_KEY is unset.
LICENSE_BOOT_KEY="${LIQUID_LICENSE_DOMAIN_KEY:-${MAGICAI_PURCHASE_CODE:-}}"
if [ ! -s app/Extensions/portal ] && [ -n "${LICENSE_BOOT_KEY}" ]; then
  PORTAL_TYPE="${LIQUID_LICENSE_TYPE:-Regular License}" \
  PORTAL_KEY="${LICENSE_BOOT_KEY}" \
  php -r 'file_put_contents("app/Extensions/portal", serialize(["liquid_license_type" => getenv("PORTAL_TYPE"), "liquid_license_domain_key" => getenv("PORTAL_KEY"), "installed" => true]));'
  echo "[entrypoint] portal license file bootstrapped from environment"
fi
rm -f storage/app/portal 2>/dev/null || true
ln -sfn /var/www/html/app/Extensions/portal /var/www/html/storage/app/portal
chown -h www-data:www-data storage/app/portal 2>/dev/null || true
chown www-data:www-data app/Extensions/portal 2>/dev/null || true
chmod ug+rw app/Extensions/portal 2>/dev/null || true

# ---- public/storage symlink (idempotent) ------------------------------------
php artisan storage:link >/dev/null 2>&1 || true

# ---- Optional boot-time migration (prefer Railway Pre-Deploy Command) -------
if [ "${AUTO_MIGRATE:-false}" = "true" ]; then
  echo "[entrypoint] AUTO_MIGRATE=true -> php artisan migrate --force"
  php artisan migrate --force
fi

# ---- DO NOT config:cache (2026-07-27) ----------------------------------------
# MagicAI's theme engine (igaster/laravel-theme) prepends the active theme's
# path to view.paths AT RUNTIME. Running `config:cache` bakes that mutated
# array into the cached config; on the next boot the theme scanner then looks
# in resources/views/default/default (missing), theme.json never loads,
# Theme::url() returns null and head.blade.php crashes with
# "htmlspecialchars(): Argument #1 must be string, UrlGenerator given".
# Symptom chain verified on Railway 2026-07-27. config:cache and view:cache
# must stay OFF for this app. Clear any stale caches instead:
php artisan config:clear >/dev/null 2>&1 || true
php artisan view:clear   >/dev/null 2>&1 || true

# ---- Enforce single Apache MPM at RUNTIME (Railway platform quirk) ----------
# Railway can surface a second MPM (mpm_event) at container start even when the
# image ships only mpm_prefork -> "AH00534: More than one MPM loaded" crash
# loop. Known issue, see station.railway.com "More than one MPM loaded error on
# php:8.2-apache image". Build-time a2dismod is NOT sufficient; do it at boot.
a2dismod -f mpm_event mpm_worker 2>/dev/null || true
rm -f /etc/apache2/mods-enabled/mpm_event.* /etc/apache2/mods-enabled/mpm_worker.* 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

exec "$@"
