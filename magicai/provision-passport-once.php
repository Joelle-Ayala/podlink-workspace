<?php
// ============================================================================
// Podlink — Passport provisioning, one-shot + idempotent (2026-08-23).
//
// WHY THIS EXISTS
// ---------------
// app.podlink.ai was bootstrapped by importing a MagicAI SQL dump
// (import-seed-once.php). The imported `migrations` table claims Laravel
// Passport's five 2016_06_01_* migrations are already applied, but the five
// `oauth_*` tables were never created in this database. Consequence:
// `php artisan migrate --force` skips them forever and every Passport
// endpoint (/oauth/token, /oauth/authorize, /oauth/register) 500s on a
// missing table. This blocked the MCP server bring-up.
//
// Second half of the same fix, in the repo rather than here: laravel/passport
// 12.x REMOVED the vendor loadMigrationsFrom() that <= v11 had — v12 only
// *publishes* the migrations. So the five files were published into
// database/migrations/ (identical bytes to
// vendor/laravel/passport/database/migrations/) in the same commit as this
// script. Without them `migrate` would have nothing to run even with the
// stale rows deleted.
//
// WHAT IT DOES
// ------------
//   php provision-passport-once.php            (predeploy step, before migrate)
//     GUARD: if `oauth_clients` already exists -> report and no-op.
//     else : list + DELETE the stale `migrations` rows whose name matches
//            '%oauth%', so the very next `php artisan migrate --force` in the
//            same pre-deploy chain recreates all five tables and re-records
//            them honestly.
//
//   php provision-passport-once.php verify     (predeploy step, after migrate)
//     Read-only. Echoes the post-migrate state of the five tables for the
//     deploy log.
//
// SAFETY
// ------
//   * Never drops or truncates a data table. The only write is a DELETE of
//     migration LEDGER rows for tables that do not exist.
//   * Every deleted row name is echoed first.
//   * Verified before writing this: zero `oauth_clients` rows and zero live
//     tokens exist (the tables are absent), and /oauth/token was already
//     500ing before the MCP deploy — there is no working state to break.
//   * Both modes exit 0 on success. `verify` warns loudly but does NOT fail
//     the deploy, so a surprise here degrades to "MCP still unprovisioned"
//     rather than "the whole site cannot deploy".
// ============================================================================

mysqli_report(MYSQLI_REPORT_OFF);

$mode = strtolower((string) ($argv[1] ?? 'prepare'));

$host = getenv('DB_HOST');
$port = (int) (getenv('DB_PORT') ?: 3306);
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');
$db   = getenv('DB_DATABASE');

$m = @mysqli_connect($host, $user, $pass, $db, $port);
if (! $m) {
    fwrite(STDERR, '[passport] DB connect failed: ' . mysqli_connect_error() . "\n");
    exit(1);
}

$TABLES = [
    'oauth_auth_codes',
    'oauth_access_tokens',
    'oauth_refresh_tokens',
    'oauth_clients',
    'oauth_personal_access_clients',
];

/** @return bool */
function table_exists(mysqli $m, string $t): bool
{
    $stmt = $m->prepare('SELECT COUNT(*) c FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?');
    if (! $stmt) {
        return false;
    }
    $stmt->bind_param('s', $t);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    return ((int) $row['c']) > 0;
}

/** @return int|string  row count, or 'missing' */
function row_count(mysqli $m, string $t)
{
    $r = @$m->query("SELECT COUNT(*) c FROM `$t`");
    if (! $r) {
        return 'missing';
    }

    return (int) $r->fetch_assoc()['c'];
}

echo "[passport] mode=$mode\n";
foreach ($TABLES as $t) {
    echo "[passport] table $t: " . var_export(row_count($m, $t), true) . "\n";
}

// ---------------------------------------------------------------- verify ---
if ($mode === 'verify') {
    $missing = [];
    foreach ($TABLES as $t) {
        if (! table_exists($m, $t)) {
            $missing[] = $t;
        }
    }

    if ($missing === []) {
        echo "[passport] VERIFY OK - all 5 oauth_* tables present\n";
    } else {
        fwrite(STDERR, '[passport] VERIFY WARNING - still missing: ' . implode(', ', $missing) . "\n");
        fwrite(STDERR, "[passport] (deploy NOT failed on purpose; MCP OAuth will stay unavailable)\n");
    }

    // Signing keys live ONLY in Railway env vars (storage/ is ephemeral on
    // this container). Report their health without ever printing a key: the
    // failure mode we care about is an env var truncated at its first newline.
    foreach (['PASSPORT_PRIVATE_KEY', 'PASSPORT_PUBLIC_KEY'] as $var) {
        $pem = (string) getenv($var);

        if ($pem === '') {
            fwrite(STDERR, "[passport] key $var: NOT SET\n");
            continue;
        }

        // Exactly what PassportServiceProvider::makeCryptKey() does first.
        $pem = str_replace('\n', "\n", $pem);

        $key = @openssl_pkey_get_private($pem, '') ?: @openssl_pkey_get_public($pem);
        $details = $key ? @openssl_pkey_get_details($key) : null;

        printf(
            "[passport] key %s: len=%d newlines=%d parses=%s rsa=%s bits=%s\n",
            $var,
            strlen($pem),
            substr_count($pem, "\n"),
            $key ? 'yes' : 'NO',
            ($details && $details['type'] === OPENSSL_KEYTYPE_RSA) ? 'yes' : 'NO',
            $details['bits'] ?? '?'
        );
    }

    $r = @$m->query("SELECT migration, batch FROM `migrations` WHERE migration LIKE '%oauth%' ORDER BY migration");
    if ($r) {
        $n = 0;
        while ($row = $r->fetch_assoc()) {
            $n++;
            echo "[passport] ledger row: {$row['migration']} (batch {$row['batch']})\n";
        }
        echo "[passport] ledger rows matching '%oauth%': $n\n";
    }

    exit(0);
}

// --------------------------------------------------------------- prepare ---
if (table_exists($m, 'oauth_clients')) {
    echo "[passport] GUARD: oauth_clients already exists - nothing to do, exiting 0\n";
    exit(0);
}

echo "[passport] oauth_clients MISSING - clearing stale Passport rows from `migrations`\n";

$r = $m->query("SELECT id, migration, batch FROM `migrations` WHERE migration LIKE '%oauth%' ORDER BY migration");
if (! $r) {
    fwrite(STDERR, "[passport] FAILED reading migrations table: {$m->error}\n");
    exit(1);
}

$stale = [];
while ($row = $r->fetch_assoc()) {
    $stale[] = $row['migration'];
    echo "[passport] stale ledger row: id={$row['id']} batch={$row['batch']} migration={$row['migration']}\n";
}

if ($stale === []) {
    echo "[passport] no '%oauth%' rows in `migrations` - migrate will run the published files as new\n";
} else {
    if (! $m->query("DELETE FROM `migrations` WHERE migration LIKE '%oauth%'")) {
        fwrite(STDERR, "[passport] FAILED deleting stale rows: {$m->error}\n");
        exit(1);
    }
    echo '[passport] deleted ' . $m->affected_rows . " stale ledger row(s)\n";
}

echo "[passport] ready - `php artisan migrate --force` (next predeploy step) will create the oauth_* tables\n";
echo "[passport] OK\n";
