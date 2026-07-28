<?php
// Podlink pre-deploy runner (2026-07-28).
// WHY: Railway's Pre-Deploy Command is exec'd WITHOUT a shell, so
// "php a.php && php b.php" silently runs only a.php ("&&", "php", "b.php"
// become extra argv to PHP). Every chained step since 2026-07-27 was a no-op.
// This wrapper runs each step as its own process and fails loudly.
$steps = [
    'php import-seed-once.php',
    'php create-biolink-db.php',
    'php reset-admin-once.php',   // REMOVE this line after founder login + password change
    'php artisan migrate --force',
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
