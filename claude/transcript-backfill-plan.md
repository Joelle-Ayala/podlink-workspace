# Transcript segment backfill plan (future work — NOT sprint 1)

Context: from 2026-09-16 (`transcript_segments` table), new transcriptions keep
Whisper verbose_json segment timing. Transcripts completed before that date have
plain text only. Nothing backfills automatically — re-transcribing costs real
Whisper credits, so backfill is a deliberate, owner-approved action.

## Approach (when wanted)

1. Candidates: `episode_transcripts` completed with zero `transcript_segments`
   rows. Expose a count per show first; don't surprise anyone with cost.
2. Consent + metering: backfill re-runs TranscribeEpisodeJob per episode, which
   already meters credits identically to a fresh transcription. It should be a
   per-episode "Re-transcribe with timestamps" button (owner clicks, sees cost
   note), and optionally a bulk action ONLY behind an explicit confirmation
   showing episode count. Never scheduled, never automatic.
3. Cheaper alternative to evaluate first: for episodes whose RSS feed carries
   `<podcast:transcript>` (SRT/VTT/JSON variants), parse THAT into
   transcript_segments — zero Whisper cost. Requires the (also future) RSS
   transcript-ingestion path from the V3 audit §12. If built, offer it as the
   default backfill and reserve re-transcription for shows without feed
   transcripts.
4. Body consistency: when a backfill re-transcribes, the new body replaces the
   old (Whisper output can differ run-to-run). When feed-transcript parsing is
   used, keep the existing body and store segments only if the texts roughly
   align; otherwise store both and mark provider.
5. Rollout: dogfood on the founder's own show first; verify segment quality on
   long episodes (near the 90-min cap) before offering widely.

Non-goals: speaker labels, word-level timing, embeddings — separate decisions.
