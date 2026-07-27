<?php
// Podlink one-off: ensure the `biolink` database exists on the shared MySQL
// (RAILWAY-NOTES.md / DEPLOY-DAY-RUNBOOK Phase 2 service 1). Idempotent.
$m = mysqli_connect(getenv('DB_HOST'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'), '', (int) (getenv('DB_PORT') ?: 3306));
if (!$m) { fwrite(STDERR, "[biolink-db] connect failed: " . mysqli_connect_error() . "\n"); exit(1); }
if ($m->query('CREATE DATABASE IF NOT EXISTS `biolink` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')) {
    $r = $m->query("SHOW DATABASES LIKE 'biolink'");
    echo "[biolink-db] ok - exists: " . ($r && $r->num_rows ? 'yes' : 'NO') . "\n";
} else {
    fwrite(STDERR, "[biolink-db] create failed: {$m->error}\n"); exit(1);
}
