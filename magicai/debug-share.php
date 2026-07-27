<?php
// Podlink temp diagnostic (2026-07-27): why is $setting not shared to views?
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Helpers\Classes\Helper;
use App\Helpers\Classes\TableSchema;
use App\Models\Setting;
use Illuminate\Support\Facades\View;

echo '[dbg] cache.default=', config('cache.default'), ' session=', config('session.driver'), "\n";
echo '[dbg] dbConnectionStatus=', var_export(Helper::dbConnectionStatus(), true), "\n";
try {
    $tables = app('magicai_tables');
    echo '[dbg] magicai_tables count=', count($tables), "\n";
    foreach (['migrations','settings','settings_two','app_settings'] as $t) {
        echo '[dbg] hasTable ', $t, '=', var_export(TableSchema::hasTable($t, $tables), true), "\n";
    }
} catch (Throwable $e) { echo '[dbg] magicai_tables EX: ', $e->getMessage(), "\n"; }
try {
    $s = Setting::getCache();
    echo '[dbg] Setting::getCache => ', $s ? ('id='.$s->id.' site='.$s->site_name) : 'NULL', "\n";
} catch (Throwable $e) { echo '[dbg] getCache EX: ', $e->getMessage(), "\n"; }
echo '[dbg] View::shared(setting) after console boot: ', var_export(View::shared('setting') !== null, true), "\n";

// Simulate the real HTTP request path
try {
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $req = Illuminate\Http\Request::create('https://podlink-workspace-production.up.railway.app/login', 'GET');
    $res = $kernel->handle($req);
    echo '[dbg] GET /login status=', $res->getStatusCode(), "\n";
    echo '[dbg] View::shared(setting) after request: ', var_export(View::shared('setting') !== null, true), "\n";
} catch (Throwable $e) {
    echo '[dbg] request EX: ', get_class($e), ': ', $e->getMessage(), ' @ ', $e->getFile(), ':', $e->getLine(), "\n";
}
echo "[dbg] done\n";
