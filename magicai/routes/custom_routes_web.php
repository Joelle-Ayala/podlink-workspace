<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Podlink custom web routes
|--------------------------------------------------------------------------
|
| routes/web.php ends with:
|
|     if (file_exists(base_path('routes/custom_routes_web.php'))) {
|         include base_path('routes/custom_routes_web.php');
|     }
|
| ...which is MagicAI's own extension point (routes/web.php:91-93). Putting
| Podlink routes here rather than editing routes/web.php means a MagicAI
| script upgrade that replaces routes/web.php cannot silently delete them.
|
| `checkInstallation` mirrors the middleware the landing page and the CMS
| pages run under (routes/web.php:36) so these pages behave identically
| before/after installation.
|
*/

use App\Http\Controllers\Marketing\MarketingController;
use Illuminate\Support\Facades\Route;

Route::middleware('checkInstallation')
    ->controller(MarketingController::class)
    ->name('marketing.')
    ->group(static function () {
        Route::get('features', 'features')->name('features');
        Route::get('pricing', 'pricing')->name('pricing');

        // Coming next — the slugs in config('marketing.groups.*.features.*.slug')
        // are already stable, and the layout and partials are in place:
        //   Route::get('features/{slug}', 'feature')->name('feature');
    });
