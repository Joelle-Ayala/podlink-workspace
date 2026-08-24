<?php
// Podlink pre-deploy runner (2026-07-28).
// WHY: Railway's Pre-Deploy Command is exec'd WITHOUT a shell, so
// "php a.php && php b.php" silently runs only a.php ("&&", "php", "b.php"
// become extra argv to PHP). Every chained step since 2026-07-27 was a no-op.
// This wrapper runs each step as its own process and fails loudly.
$steps = [
    'php import-seed-once.php',
    'php create-biolink-db.php',
    // reset-admin-once removed 2026-07-28 after founder login (it would
    // clobber the founder's password on every deploy)
    //
    // (2026-08-23) Passport bring-up for the MCP server. MUST run BEFORE
    // migrate: it clears the imported dump's false "Passport migrations
    // already applied" ledger rows so the very next migrate actually creates
    // the five oauth_* tables. Self-guarding + idempotent (no-ops once
    // oauth_clients exists). See provision-passport-once.php header.
    'php provision-passport-once.php',
    'php artisan migrate --force',
    // Read-only post-migrate evidence line in the deploy log.
    'php provision-passport-once.php verify',
];
foreach ($steps as $cmd) {
    echo "[predeploy] >>> $cmd\n";
    passthru($cmd, $rc);
    if ($rc !== 0) {
        fwrite(STDERR, "[predeploy] FAILED (rc=$rc): $cmd\n");
        exit($rc);
    }
}
echo "[predeploy] all steps OK\n";
