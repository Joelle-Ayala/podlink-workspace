# Design Decisions Log

Format per entry: date · decision · context · alternatives · rationale · affected surfaces ·
reversibility. Newest first.

## D-002 · 2026-09-20 · PR #2 adjudication: adopt-with-amendments
- **APPROVED by Joelle (L4) 09-21; EXECUTED 09-21:** DESIGN.md v2 written as the merge
  resolution of `design/podlink-operating-system` into main (real git merge, so PR #2
  closes as MERGED with the Codex commits credited in history); skill cherry-picked via the
  same merge with amendments (precedence clause, claims/voice pointers, review ladder,
  Vercel-sha rule) applied in the merge commit.
- **Decision (as recommended):** do not merge `design/podlink-operating-system` as-is; produce
  DESIGN.md v2 = PR #2 spine + v1 operational layer; cherry-pick the design skill with
  amendments; close PR #2 as adopted-via-reconciliation, credited to the Codex side.
- **Context:** PR #2 and main both created web/DESIGN.md on 09-18 (merge conflict); one real
  philosophy conflict (fixed band rhythm vs page grammars); PR precedence line too broad.
- **Alternatives:** merge PR and resolve conflicts in-branch (loses v1's operational law in
  review noise); reject PR (discards genuinely strong constitution work).
- **Rationale + rulings:** see AUDIT-2026-09-design-org.md §E (band rhythm = default grammar,
  deviation requires named grammar + L3 review; precedence = product truth → BRAND.md values
  → DESIGN.md → skill → external; tokens/components win retained).
- **Affected:** web/DESIGN.md, .agents/skills/podlink-design/, all future UI work.
- **Reversibility:** high (docs only), but constitution churn is costly — hence L4.

## D-001 · 2026-09-20 · Design documentation lives in web/docs/design/
- **Decision:** seed DECISIONS.md + PAPERCUTS.md now; REFERENCES.md and DESIGN-REVIEWS/ on
  first real use; COMPONENT-INVENTORY.md deferred to the services-convergence brief.
- **Context:** charter §6; avoiding empty-file bureaucracy.
- **Rationale:** repo as institutional memory; every file must earn its existence.
- **Reversibility:** trivial.
