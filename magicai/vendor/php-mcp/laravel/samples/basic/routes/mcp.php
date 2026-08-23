<?php

use App\Mcp\GenerateSeoKeywordsPrompt;
use App\Mcp\GenerateWelcomeMessage;
use App\Mcp\GetArticleContent;
use App\Mcp\GetAppVersion;
use PhpMcp\Laravel\Facades\Mcp;
use Illuminate\Support\Facades\Auth;

Mcp::tool('welcome_message', GenerateWelcomeMessage::class);

Mcp::resource('app://version', GetAppVersion::class)
    ->name('laravel_app_version')
    ->mimeType('text/plain');

Mcp::tool('get_me', function () {
    return Auth::user();
});

Mcp::resourceTemplate('content://articles/{articleId}', GetArticleContent::class)
    ->name('article_content')
    ->mimeType('application/json');

Mcp::prompt('seo_keywords_generator', GenerateSeoKeywordsPrompt::class);
