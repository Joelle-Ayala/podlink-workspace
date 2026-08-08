#!/bin/bash
# Podlink Biolink — container entrypoint.
# On Railway: rebinds Apache to $PORT and fills config.php from env vars.
# Under local docker-compose (no PORT, no DATABASE_* env): does nothing.
set -e

# ---- Bind Apache to Railway's injected $PORT (image default: 80) -----------
if [ -n "${PORT:-}" ] && [ "${PORT}" != "80" ]; then
  sed -ri "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
  sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT}>/" \
      /etc/apache2/sites-available/000-default.conf
fi

# ---- Fill config.php from env (only when DATABASE_SERVER is provided) ------
# The committed config.php is the blank vendor template; real values are
# injected here at boot so no credentials ever live in git.
# Recognised vars: DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,
#                  DATABASE_NAME, SITE_URL (include trailing slash, e.g.
#                  https://podlink.fm/)
if [ -n "${DATABASE_SERVER:-}" ]; then
  php -r '
    $file = "/var/www/html/config.php";
    $c = file_get_contents($file);
    foreach (["DATABASE_SERVER","DATABASE_USERNAME","DATABASE_PASSWORD","DATABASE_NAME","SITE_URL"] as $k) {
      $v = getenv($k);
      if ($v === false) continue;
      $c = preg_replace(
        "/define\\(\x27" . $k . "\x27,\\s*\x27[^\x27]*\x27\\)/",
        "define(\x27" . $k . "\x27, \x27" . addslashes($v) . "\x27)",
        $c
      );
    }
    file_put_contents($file, $c);
    echo "[entrypoint] config.php populated from env\n";
  '
fi

# ---- config.php must be writable by Apache (installer + license writes) -----
# (2026-08-08) 66biolinks /install requires writing /config.php; image ships it
# root-owned. Env repopulation at boot still wins for DATABASE_*/SITE_URL.
chown www-data:www-data /var/www/html/config.php 2>/dev/null || true
chmod ug+rw /var/www/html/config.php 2>/dev/null || true

# ---- installed marker (2026-08-08): DB install succeeded but the installer
# could not write install/installed (dir was root-owned). Create the marker at
# every boot: (a) survives ephemeral-FS resets, (b) keeps /install locked.
touch /var/www/html/install/installed 2>/dev/null || true
chown -R www-data:www-data /var/www/html/install 2>/dev/null || true

# ---- Enforce single Apache MPM at RUNTIME (Railway platform quirk) ----------
# Same issue hit on the MagicAI service 2026-07-27: Railway can surface a
# second MPM at container start even when the image ships only one ->
# "AH00534: More than one MPM loaded" crash loop. Fix at boot, not build.
a2dismod -f mpm_event mpm_worker 2>/dev/null || true
rm -f /etc/apache2/mods-enabled/mpm_event.* /etc/apache2/mods-enabled/mpm_worker.* 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

exec "$@"
