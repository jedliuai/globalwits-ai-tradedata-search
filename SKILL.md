---
name: globalwits-ai-tradedata-search
description: Automate authenticated trade-data searches in Globalwits GTIS with Microsoft Edge, strictly screen product records, normalize prices and units, and deliver auditable Excel and text results. Use when a user asks to query 环球慧思/Globalwits trade records; do not use for unrelated web research or unsupported account access.
---

# 环球慧思贸易数据 AI 智能查询

Use this skill to turn a user's product and pricing request into a traceable result set from `https://g6.globalwits.cn/tradesearch/index`.

## Non-negotiable constraints

- Launch only Microsoft Edge for browser work. Never launch Chrome on this machine.
- Keep authentication interactive. Never ask for, record, export, or commit cookies, tokens, QR codes, passwords, or browser profiles.
- Default to excluding uncertain records. A record must contain affirmative evidence for every requested product qualifier; an explicit negation overrides a keyword hit.
- Preserve source wording and provenance. Do not silently relabel a generic site price as FOB unless the source or the user's stated convention supports that basis.
- Do not bypass access controls, quotas, CAPTCHA, MFA, or paid export limits.

## Required workflow

1. Read [references/user-checkpoints.md](references/user-checkpoints.md) before opening the site. It defines exactly when the user must act.
2. Read [references/workflow.md](references/workflow.md) for query planning, Edge automation, pagination, extraction, and delivery.
3. Read [references/screening-rules.md](references/screening-rules.md) before accepting or rejecting records.
4. Read [references/field-map.md](references/field-map.md) when mapping GTIS columns, prices, quantities, and units.
5. Use the local `playwright` skill when available, but override its browser choice to `msedge` and use a persistent profile inside the task's `work/` directory.
6. When an Excel deliverable is requested, use the local spreadsheet skill. Keep exchange rate and tax factor in labeled input cells, calculate dependent prices with formulas, cite the Globalwits URL inside the workbook, and verify formulas plus visual layout.

## Deterministic filtering and pricing

For exported or browser-extracted JSON rows, prefer `scripts/filter_and_price.mjs` to apply required keyword groups, explicit exclusions, kilogram-unit checks, exchange-rate conversion, and tax-inclusive pricing. Run `node scripts/filter_and_price.mjs --help` for its input contract.

The script is an aid, not a substitute for reviewing full product descriptions. Review every included record and any near-match rejected only for wording ambiguity.

## Completion contract

Deliver:

- the exact query period, query terms, source URL, inclusion rule, exclusion rule, exchange rate, tax factor, and price-basis interpretation;
- a deduplicated Excel workbook with source fields and formula-driven conversions when requested;
- concise text lines in the user's requested format;
- a brief count of searched, included, and excluded records, including any material data limitations.

Close the automated Edge session after successful extraction unless the user asks to keep it open.
