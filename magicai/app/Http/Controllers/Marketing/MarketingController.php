<?php

declare(strict_types=1);

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;

/**
 * Podlink marketing pages (podlink.ai).
 *
 * These are hardcoded routes + Blade views rather than rows in MagicAI's
 * `pages` table. The built-in CMS (App\Http\Controllers\PageController +
 * App\Models\Page) can only render a single WYSIWYG `content` blob into
 * resources/views/default/page/index.blade.php — it has no concept of a hero,
 * an alternating feature block or a FAQ accordion, and its output is not in
 * version control. Marketing layout work belongs in git.
 *
 * Every action feeds the shared marketing layout
 * (resources/views/default/marketing/layout.blade.php), which extends the
 * stock site layout so the DB-driven header/footer come along unchanged.
 *
 * All copy comes from config/marketing.php; nothing here touches the database
 * except Auth::check() for CTA targeting.
 */
class MarketingController extends Controller
{
    /**
     * GET /features — the features index.
     */
    public function features(): View
    {
        return view('marketing.features.index', [
            'metaTitle'       => 'Podcast growth tools: analytics, AI show notes, clips & newsletters | Podlink',
            'metaDescription' => 'Podlink turns every episode into show notes, clips, a newsletter and social posts — with honest OP3 download analytics and a podlink.fm page for your show. Keep your podcast host.',
            'groups'          => config('marketing.groups', []),
            'primaryCta'      => $this->primaryCta(),
            'secondaryCta'    => ['label' => 'See pricing', 'url' => route('marketing.pricing')],
        ]);
    }

    /**
     * GET /pricing — plans and the feature comparison table.
     *
     * NOTE: no Stripe, no `plans` rows, no checkout. Every tier CTA points at
     * registration exactly like the rest of the marketing site. Tier content
     * is placeholder until the plan rows are decided — see the `pricing` block
     * in config/marketing.php.
     */
    public function pricing(): View
    {
        $pricing = config('marketing.pricing', []);

        return view('marketing.pricing.index', [
            'metaTitle'       => 'Pricing — free to start, ' . ($pricing['currency'] ?? '$') . '19 a month to go all in | Podlink',
            'metaDescription' => 'Simple podcast growth pricing. Start free, upgrade when the show does. Annual billing gives you two months free. Keep your podcast host on every plan.',
            // While the tier content is placeholder the page must not be
            // indexed. `follow` stays on so the links still pass through.
            'metaRobots'      => ! empty($pricing['draft']) ? 'noindex, follow' : null,
            'currency'        => $pricing['currency'] ?? '$',
            'billing'         => $pricing['billing'] ?? [],
            'tiers'           => $this->tiers($pricing),
            'comparison'      => $pricing['comparison'] ?? [],
            'faq'             => $pricing['faq'] ?? [],
            'cta'             => $pricing['cta'] ?? [],
            'primaryCta'      => $this->primaryCta(),
            'secondaryCta'    => ['label' => 'Browse the features', 'url' => route('marketing.features')],
        ]);
    }

    /**
     * Normalise the configured tiers for the view.
     *
     * Annual price is DERIVED (monthly x annual_multiplier, default 10) so the
     * "2 months free" claim can never drift out of sync with the monthly
     * price. A tier may still pin `price_annual` explicitly to override.
     *
     * @param  array<string, mixed>  $pricing
     * @return list<array<string, mixed>>
     */
    protected function tiers(array $pricing): array
    {
        $multiplier = (int) ($pricing['annual_multiplier'] ?? 10);
        $ctaUrl = $this->primaryCta()['url'];

        return array_map(static function (array $tier) use ($multiplier, $ctaUrl): array {
            $monthly = (float) ($tier['price_monthly'] ?? 0);

            $tier['price_monthly'] = $monthly;
            $tier['price_annual'] = isset($tier['price_annual'])
                ? (float) $tier['price_annual']
                : $monthly * $multiplier;

            // Free tiers get the same destination but never a "trial" label.
            $tier['cta_url'] = $ctaUrl;

            return $tier;
        }, array_values($pricing['tiers'] ?? []));
    }

    /**
     * The main call to action, pointed at the dashboard for signed-in users so
     * we never send an existing customer to a guest-only /register route.
     *
     * @return array{label: string, url: string}
     */
    protected function primaryCta(): array
    {
        if (Auth::check()) {
            return ['label' => 'Open your dashboard', 'url' => route('dashboard.index')];
        }

        return ['label' => 'Start free', 'url' => route('register')];
    }
}
