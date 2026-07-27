# ============================================================
# Podlink — MagicAI (Laravel 10, PHP 8.2) production image for Railway
# ============================================================
# WHY A DOCKERFILE (not nixpacks): this is a production server build with
# vendor/ and public/build/ COMMITTED — there is no composer install and no
# npm build on Railway. Nixpacks' PHP provider insists on running composer,
# guesses extensions, and swaps webservers between releases. A pinned
# php:8.2-apache image is deterministic and matches the Biolink service.
#
# ---------------- RAILWAY SERVICE SETUP (one web service + 2 workers) ------
# 1. WEB service (this image, default CMD):
#    - Railway injects $PORT; the entrypoint rebinds Apache to it.
#    - Pre-Deploy Command (Railway service Settings → Deploy → Pre-Deploy
#      Command) — this is the "release phase":
#         php artisan migrate --force
#      (config:cache runs automatically in the entrypoint on every boot,
#      AFTER env vars are injected — do NOT bake caches into the image.)
#    - Alternatively set AUTO_MIGRATE=true to run migrations at boot
#      (single-instance only; pre-deploy command is preferred).
#
# 2. CRON service (same repo/Dockerfile, separate Railway service).
#    Railway has no in-container crontab; use a scheduler loop as the
#    service's custom Start Command:
#      bash -c 'while true; do php artisan schedule:run --no-interaction; sleep 60; done'
#    (Required before social scheduling goes live — CLAUDE.md scope rule.)
#
# 3. QUEUE WORKER service (same repo/Dockerfile, separate Railway service).
#    Custom Start Command:
#      php artisan queue:work --tries=3 --timeout=300 --sleep=3
#
#    Both workers share the web service's env vars (use Railway shared
#    variables / reference variables). Neither needs a public domain.
#
# Env vars: full list in DEPLOY-PREP.md § "MagicAI .env for Railway"
# (+ BIOLINK_BASE_URL / BIOLINK_ADMIN_API_KEY per API_CONTRACT.md).
# Landmines: fresh APP_KEY (never the shipped one), APP_DEBUG=false.
# ============================================================

FROM php:8.2-apache

# ---- System packages + PHP extensions -------------------------------------
# Baseline image already ships: curl, mbstring, openssl, pdo, tokenizer, xml,
# ctype, fileinfo, iconv, session, simplexml, sodium.
# composer.json requires ext-curl (built in) + ext-zip; the stack (Cashier,
# Intervention/Image v3, laravel-datatables, google clients, phpspreadsheet,
# php-ffmpeg, spatie/pdf-to-text) needs the rest below.
#   ffmpeg        -> php-ffmpeg (audio/video tools — in scope for Podlink)
#   poppler-utils -> spatie/pdf-to-text (Chat with Documents)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev libjpeg-dev libfreetype6-dev libwebp-dev \
    libicu-dev libzip-dev \
    ffmpeg poppler-utils unzip \
 && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install -j"$(nproc)" \
    pdo_mysql mysqli bcmath gd intl zip exif pcntl opcache \
 && pecl install redis \
 && docker-php-ext-enable redis \
 && rm -rf /var/lib/apt/lists/*

# ---- Apache: docroot = public/, allow .htaccess, hide server tokens --------
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
# mod_php needs prefork; the apt-get upgrade above can re-enable mpm_event,
# leaving TWO MPMs enabled -> "AH00534: More than one MPM loaded" crash loop
# (hit on Railway 2026-07-26). Force exactly one MPM before enabling modules.
RUN a2dismod -f mpm_event mpm_worker 2>/dev/null; a2enmod mpm_prefork \
 && a2enmod rewrite headers expires \
 && sed -ri 's!/var/www/html!/var/www/html/public!g' \
      /etc/apache2/sites-available/000-default.conf \
 && printf '<Directory /var/www/html/public>\nAllowOverride All\nRequire all granted\n</Directory>\n' \
      >> /etc/apache2/apache2.conf \
 && sed -i 's/ServerTokens OS/ServerTokens Prod/' /etc/apache2/conf-available/security.conf \
 && sed -i 's/ServerSignature On/ServerSignature Off/' /etc/apache2/conf-available/security.conf

# ---- PHP configuration (media SaaS: bigger uploads, longer jobs) -----------
RUN { \
    echo 'upload_max_filesize = 128M'; \
    echo 'post_max_size = 128M'; \
    echo 'memory_limit = 512M'; \
    echo 'max_execution_time = 300'; \
    echo 'max_input_vars = 20000'; \
} > /usr/local/etc/php/conf.d/podlink.ini \
 && { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=192'; \
    echo 'opcache.interned_strings_buffer=16'; \
    echo 'opcache.max_accelerated_files=30000'; \
    echo 'opcache.validate_timestamps=1'; \
    echo 'opcache.revalidate_freq=5'; \
} > /usr/local/etc/php/conf.d/opcache.ini

# ---- App code (vendor/ + public/build/ ship in the repo — zero-build) ------
WORKDIR /var/www/html
COPY . /var/www/html/

# storage/ + bootstrap/cache writability (entrypoint re-asserts at boot)
RUN mkdir -p storage/framework/cache/data storage/framework/sessions \
      storage/framework/views storage/logs bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R ug+rwX storage bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
