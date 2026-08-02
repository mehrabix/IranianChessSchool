# User Preferences
- Prefers planning before execution — wants a written plan reviewed before any code is written. Confidence: 0.95
- Prefers markdown documents for tracking remaining tasks and implementation plans. Confidence: 0.95
- Prefers phased/incremental execution — one phase at a time, not all tasks in one massive batch. Confidence: 0.90
- Prefers to see a full audit/status of remaining work before planning begins. Confidence: 0.85
- Prefers deployment verification between phases: push → check build/typecheck/tests → wait for CI deploy (Vercel via `gh` CLI) → confirm no errors → then proceed to next step. Confidence: 0.85
- Uses a proxy (127.0.0.1:7890) on PowerShell for general work. For git/GitHub/Vercel/`gh` CLI operations, the proxy must be temporarily unset (clear `HTTP_PROXY`, `HTTPS_PROXY`, `http_proxy`, `https_proxy` env vars) — otherwise connections fail. Confidence: 0.85
- When fixing a bug, prefers a comprehensive sweep of the entire codebase for all similar occurrences rather than spot-fixing only the reported instance. E.g., if one arrow icon is broken in RTL, fix every ArrowLeft/ArrowRight/ChevronLeft/ChevronRight across all files. Confidence: 0.85
- Requires full RTL (right-to-left) support as a first-class concern — directional icons must use `rtl:rotate-180`, physical CSS classes (`ml-*`/`mr-*`/`border-l`/`border-r`) should be replaced with logical properties (`ms-*`/`me-*`/`border-s`/`border-e`), and Sheet/drawer components must open from the correct side based on `dir`. Confidence: 0.85
- When a plan is already approved and saved to a markdown file: skip plan mode entirely — read the plan file directly, implement step by step, and refer back to the plan as you work. Do NOT enter plan mode or re-present the plan. Confidence: 0.90
