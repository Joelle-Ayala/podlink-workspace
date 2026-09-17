<?php

declare(strict_types=1);

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;

/**
 * PodLink scheduled tasks, loaded through the upstream Kernel's
 * CustomScheduler extension point (no vendor Kernel edits needed).
 * Runs on the podlink-worker service's scheduler loop.
 */
class CustomScheduler
{
    public static function scheduleTasks(Schedule $schedule): void
    {
        // Sprint D: daily analytics history. Quiet hour (UTC), one attempt;
        // per-show failures are logged inside the command, never fatal.
        $schedule->command('podlink:snapshot-analytics')
            ->dailyAt('04:10')
            ->withoutOverlapping();
    }
}
