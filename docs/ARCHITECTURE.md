# Architecture

See [MVP_SPEC.md](./MVP_SPEC.md) for product requirements.

## Flow

Landing → read Spanish passage → record (MediaRecorder) → `POST /api/analyze` (multipart: audio + passageId) → Whisper + LLM feedback → drills → retry passage.

## Layout

`src/app` (routes + API), `src/components/{landing,recorder,feedback,drill,ui}`, `src/hooks`, `src/lib`, `src/data`, `src/types`, `src/prompts`.

## Constraints

No DB/accounts; audio transient server-side; localStorage for light client persistence only.
