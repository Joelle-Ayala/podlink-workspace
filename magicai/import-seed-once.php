<?php
// Podlink one-off: import the rebranded magicai.sql seed IF AND ONLY IF the
// settings table is empty/missing. Safe to leave in pre-deploy: it no-ops once
// seeded. Added 2026-07-27 — the 2026-07-01 deploy ran migrations but never
// imported the seed, so the installer's Setting::first() was null (500 on
// POST /license, ApplicationStatusRepository.php:96).
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$db = $app->make('db');
$needsSeed = true;
try {
    $needsSeed = ((int) $db->table('settings')->count()) === 0;
} catch (Throwable $e) {
    $needsSeed = true; // table missing -> definitely seed
}
if (!$needsSeed) {
    echo "[seed] settings table already populated - skipping import\n";
    exit(0);
}
echo "[seed] settings empty - importing magicai.sql (" . filesize(__DIR__.'/magicai.sql') . " bytes)\n";
$db->unprepared(file_get_contents(__DIR__.'/magicai.sql'));
echo "[seed] import complete - settings rows: " . $db->table('settings')->count() . "\n";
