<?php
// Podlink seed import v2 (2026-07-27). Guard: runs only while settings_two is
// empty (the installer's SettingTwo::first()->update() 500s otherwise).
// Uses mysqli::multi_query so a mid-dump failure is REPORTED, not silent.
// After import, drops podcast_shows so the 2026_07_09 migration (not in the
// dump's migrations table) can recreate + record it via migrate --force.
$host = getenv('DB_HOST'); $port = (int) (getenv('DB_PORT') ?: 3306);
$user = getenv('DB_USERNAME'); $pass = getenv('DB_PASSWORD');
$db   = getenv('DB_DATABASE');
$m = mysqli_connect($host, $user, $pass, $db, $port);
if (!$m) { fwrite(STDERR, "[seed] DB connect failed: " . mysqli_connect_error() . "\n"); exit(1); }

function rowcount($m, $t) {
    $r = @$m->query("SELECT COUNT(*) c FROM `$t`");
    if (!$r) return 'missing';
    return (int) $r->fetch_assoc()['c'];
}
foreach (['settings','settings_two','users','migrations'] as $t) {
    echo "[seed] $t rows: " . var_export(rowcount($m, $t), true) . "\n";
}

$stCount = rowcount($m, 'settings_two');
if ($stCount !== 'missing' && $stCount > 0) {
    echo "[seed] settings_two populated - skipping import\n";
    exit(0);
}

echo "[seed] settings_two empty/missing - importing magicai.sql via multi_query\n";
$sql = file_get_contents(__DIR__ . '/magicai.sql');
$m->query('SET FOREIGN_KEY_CHECKS=0');
$batch = 0; $failed = false;
if (!$m->multi_query($sql)) {
    fwrite(STDERR, "[seed] FAILED at statement 1: {$m->error}\n"); $failed = true;
} else {
    do {
        $batch++;
        if ($r = $m->store_result()) { $r->free(); }
        if (!$m->more_results()) break;
        if (!$m->next_result()) {
            fwrite(STDERR, "[seed] FAILED after statement $batch: {$m->error}\n");
            $failed = true; break;
        }
    } while (true);
}
$m->query('SET FOREIGN_KEY_CHECKS=1');
echo "[seed] processed ~$batch statements\n";
foreach (['settings','settings_two','users','migrations'] as $t) {
    echo "[seed] post-import $t rows: " . var_export(rowcount($m, $t), true) . "\n";
}
if ($failed) { exit(1); }

// Let migrate --force recreate + record the podlink migration cleanly.
$m->query('DROP TABLE IF EXISTS `podcast_shows`');
echo "[seed] dropped podcast_shows for clean re-migration\n";
echo "[seed] OK\n";
