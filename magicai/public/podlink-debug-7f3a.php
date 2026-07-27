<?php
// Podlink temp diagnostic v2 (REMOVE AFTER FIX)
require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo '[dbg2] cached database_tables count=', count(Cache::get('database_tables') ?? []), "\n";
try {
    $fresh = Schema::getTableListing();
    echo '[dbg2] FRESH getTableListing count=', count($fresh), "\n";
} catch (Throwable $e) { echo '[dbg2] getTableListing EX: ', $e->getMessage(), "\n"; }
try {
    $show = DB::select('SHOW TABLES');
    echo '[dbg2] SHOW TABLES count=', count($show), "\n";
} catch (Throwable $e) { echo '[dbg2] SHOW TABLES EX: ', $e->getMessage(), "\n"; }

Cache::forget('database_tables');
echo '[dbg2] forgot database_tables; now cached=', var_export(Cache::get('database_tables'), true), "\n";
echo "[dbg2] done - reload /login to test\n";
