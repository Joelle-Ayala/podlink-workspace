<?php

/**
 * Podlink-specific knobs (transcript pipeline v1).
 * Everything here is env-driven so ops changes never need a code change.
 */
return [

    /*
    | Hard duration cap for episode transcription, in seconds. Spec
    | recommendation: 90 minutes (cost control on the Whisper path).
    */
    'transcribe_max_seconds' => (int) env('PODLINK_TRANSCRIBE_MAX_SECONDS', 5400),

    /*
    | Auto-transcribe newly synced episodes. DEFAULT OFF: transcription
    | bills the show owner's credits, so turning this on is a product
    | decision (spec: backfill is never automatic; new-episode auto is
    | opt-in). When off, transcription is user-triggered per episode.
    */
    'auto_transcribe_new' => (bool) env('PODLINK_AUTO_TRANSCRIBE_NEW', false),

];
