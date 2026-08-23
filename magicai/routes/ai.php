<?php

declare(strict_types=1);

use App\Http\Controllers\Mcp\ClientRegistrationController;
use App\Http\Controllers\Mcp\OAuthDiscoveryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Podlink MCP — OAuth 2.1 discovery + Dynamic Client Registration (ML2.5)
|--------------------------------------------------------------------------
|
| Registered by App\Providers\RouteServiceProvider under the `api` middleware
| group, WITHOUT the /api prefix, and BEFORE routes/web.php.
|
| Why `api` and not `web` (MCP-P0-AUDIT.md Q5):
|   * `web` carries VerifyCsrfToken             -> every DCR POST would 419
|   * `web` carries the custom LocaleMiddleware -> pointless work per call
|   * `web` carries the igaster ThemeMiddleware -> the exact runtime config
|     mutation the never-config:cache rule exists for
|   * `api` is just throttle:api + SubstituteBindings — clean for cookie-free,
|     machine-consumed JSON.
|
| NOT registered here, on purpose:
|   * POST/GET/DELETE /mcp  — registered by php-mcp/laravel from config/mcp.php
|     (transports.http_integrated), with its own middleware stack.
|   * /oauth/authorize, /oauth/token — already registered by Passport itself,
|     under `web` (the authorize screen needs a session + login + CSRF-protected
|     consent POST). We deliberately do not touch, wrap or re-register them,
|     and /oauth/* is deliberately NOT added to the CSRF exception list beyond
|     the single 'oauth/register' path below.
|
*/

Route::get('.well-known/oauth-protected-resource', [OAuthDiscoveryController::class, 'protectedResource'])
    ->name('mcp.well-known.protected-resource');

// RFC 9728 §3.1 path-insertion form. Clients that know the resource lives at
// /mcp may probe this variant first; serve the same document from both.
Route::get('.well-known/oauth-protected-resource/{resource}', [OAuthDiscoveryController::class, 'protectedResource'])
    ->where('resource', '[A-Za-z0-9._~\-\/]+')
    ->name('mcp.well-known.protected-resource.path');

Route::get('.well-known/oauth-authorization-server', [OAuthDiscoveryController::class, 'authorizationServer'])
    ->name('mcp.well-known.authorization-server');

Route::get('.well-known/oauth-authorization-server/{resource}', [OAuthDiscoveryController::class, 'authorizationServer'])
    ->where('resource', '[A-Za-z0-9._~\-\/]+')
    ->name('mcp.well-known.authorization-server.path');

// RFC 7591 Dynamic Client Registration. Unauthenticated by design; kept on a
// tight per-IP budget by the `mcp-register` limiter.
Route::post('oauth/register', ClientRegistrationController::class)
    ->middleware('throttle:mcp-register')
    ->name('mcp.oauth.register');
