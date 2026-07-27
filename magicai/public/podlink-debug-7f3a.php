<?php
// Podlink temp diagnostic v3 (REMOVE AFTER FIX) - theme engine probe
require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Igaster\LaravelTheme\Facades\Theme;

echo '[dbg3] front_theme setting=', var_export(setting('front_theme'), true), ' dash=', var_export(setting('dash_theme'), true), "\n";
try {
    echo '[dbg3] Theme::exists(default)=', var_export(Theme::exists('default'), true), "\n";
    Theme::set('default');
    echo '[dbg3] Theme::get()=', var_export(Theme::get(), true), "\n";
    $cur = Theme::current();
    echo '[dbg3] current name=', $cur->name, ' viewsPath=', var_export($cur->viewsPath, true), ' assetPath=', var_export($cur->assetPath, true), "\n";
    echo '[dbg3] Theme::url(assets)=', var_export(Theme::url('assets'), true), "\n";
    echo '[dbg3] theme_url(assets)=', var_export(theme_url('assets'), true), "\n";
    echo '[dbg3] custom_theme_url(assets)=', var_export(custom_theme_url('assets'), true), "\n";
} catch (Throwable $e) {
    echo '[dbg3] EX: ', get_class($e), ': ', $e->getMessage(), ' @ ', basename($e->getFile()), ':', $e->getLine(), "\n";
}
echo "[dbg3] done\n";
