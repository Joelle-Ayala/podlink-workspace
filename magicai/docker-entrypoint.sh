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

# ---- public/storage symlink (idempotent) ------------------------------------
php artisan storage:link >/dev/null 2>&1 || true

# ---- Optional boot-time migration (prefer Railway Pre-Deploy Command) -------
if [ "${AUTO_MIGRATE:-false}" = "true" ]; then
  echo "[entrypoint] AUTO_MIGRATE=true -> php artisan migrate --force"
  php artisan migrate --force
fi

# ---- Cache config/views from the live env (never baked into the image) ------
if [ -n "${APP_KEY:-}" ]; then
  php artisan config:cache || echo "[entrypoint] WARN: config:cache failed (continuing)"
  php artisan view:cache   || echo "[entrypoint] WARN: view:cache failed (continuing)"
else
  echo "[entrypoint] WARN: APP_KEY not set — skipping config:cache (set all env vars in Railway)"
fi

# ---- Enforce single Apache MPM at RUNTIME (Railway platform quirk) ----------
# Railway can surface a second MPM (mpm_event) at container start even when the
# image ships only mpm_prefork -> "AH00534: More than one MPM loaded" crash
# loop. Known issue, see station.railway.com "More than one MPM loaded error on
# php:8.2-apache image". Build-time a2dismod is NOT sufficient; do it at boot.
a2dismod -f mpm_event mpm_worker 2>/dev/null || true
rm -f /etc/apache2/mods-enabled/mpm_event.* /etc/apache2/mods-enabled/mpm_worker.* 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

exec "$@"
