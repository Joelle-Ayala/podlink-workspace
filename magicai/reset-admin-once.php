<?php
// Podlink ONE-OFF (2026-07-27): reset seed admin password to a temporary value
// so the founder can log in (seed default unknown). REMOVE from pre-deploy and
// delete this file after first successful login + founder password change.
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$db = $app->make('db');
$hash = password_hash('IVfqZSrmdvi3', PASSWORD_BCRYPT);
$n = $db->table('users')->where('id', 1)->update(['password' => $hash]);
echo "[admin-reset] updated rows: $n (user id 1, email " . ($db->table('users')->where('id',1)->value('email')) . ")\n";
