# Startup Shark Tank

Startup Shark Tank is a local macOS portfolio demo that makes a multi-agent Codex workflow visible. A founder submits a pitch, independent investment specialists create a file-based decision record, the founder answers two deliberate human gates, and an investment committee produces a final memo.

The application uses the [Codex App Server](https://learn.chatgpt.com/docs/app-server) directly over JSONL/JSON-RPC. It does not use the Codex SDK, an orchestration framework, a database, or a cloud service.

## What the demo shows

- one long-lived `codex app-server --stdio` process owned by Electron Main;
- mandatory `initialize` / `initialized` negotiation and existing Codex account status;
- ephemeral threads and streamed turns for every specialist;
- two genuinely parallel workflow phases through the same App Server process;
- item, command, and file-change events in a compact Developer Inspector;
- real command and file-change approvals when Codex requests them;
- structured output for the three committee questions and their editable demo answers;
- interruption, persisted state, retry, and resume after an app restart;
- project-scoped workspace write access with agent network access disabled;
- filesystem artifacts as human-readable shared state.

Web search and Codex's internal subagent feature are disabled for the App Server process. The visible workflow is entirely orchestrated by this application.

## Run locally

Requirements:

- macOS
- Node.js `>=24 <25`
- pnpm `11.15.1`
- the `codex` CLI on `PATH`
- an existing Codex login (`codex login`)

```bash
pnpm install
pnpm dev
```

The first screen contains two ready-to-run, fully editable pitches: Doggo, a consumer marketplace, and LedgerLift, a B2B cash-flow product. Submit either example, watch the specialists build their artifacts, use or edit the generated founder-answer drafts, skip a human gate when desired, and inspect the final verdict.

## Decision flow

```text
Market Scout
    ├── Business Model Analyst ──┐
    └── Product Strategist ──────┴── Risk & Diligence
                                        │
                                Committee Questions
                                        │
                            Founder Answers or Skip
                                        │
                              ┌─────────┴─────────┐
                           Bullish VC          Bearish VC
                              └─────────┬─────────┘
                                  Founder Rebuttal
                                        │
                               Investment Committee
```

The generic engine only knows `agent` and `human-input` nodes. The Shark Tank itself is described by [`workflows/shark-tank.yaml`](workflows/shark-tank.yaml), with specialist behavior in [`agents/shark-tank`](agents/shark-tank).

## Workflow and model configuration

The workflow defines a default model and concurrency limit:

```yaml
defaults:
  model: gpt-5.6-terra
  maxParallelAgents: 2
```

An agent can override the workflow model through frontmatter in its Markdown definition:

```yaml
---
model: gpt-5.6-sol
---
```

Omit the frontmatter to inherit the workflow default. The application exposes the workflow, effective model selection, available local Codex models, dependencies, outputs, and complete agent instructions in the read-only Configuration dialog.

## Project output

Each pitch is stored under `projects/<slug>/`:

```text
project.json
pitch.md
artifacts/*.md
committee/questions.json
committee/questions.md
human/*.md
investment-memo.md
.sharktank/workflow-state.json
.sharktank/runs/<runId>/events.jsonl
```

`workflow-state.json` is written atomically. Event logs are redacted before persistence and renderer delivery. The Renderer cannot access Node.js or arbitrary filesystem paths; every operation crosses a narrow, validated preload bridge.

## App Server protocol

The checked-in files under `src/main/codex/generated/` come from the installed CLI:

```bash
pnpm codex:generate
```

Those generated bindings are the source of truth for method parameters and enum values. Handwritten protocol names are isolated in the small App Server adapter.

## Manual verification

This portfolio MVP intentionally contains no automated tests, test framework, mocks, fixtures, or test configuration. The local quality gate is:

```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

For the full acceptance path, verify both pitch presets and complete a LedgerLift run using the generated founder-answer drafts. Confirm that both parallel phases overlap in the Inspector, restart at the first human gate, verify that skipping it still produces the founder-answer artifact, and exercise Stop followed by Resume during a running node.

## Scope

This is a development demo, not a signed or distributable Electron product. It intentionally has no database, authentication UI, cloud queue, generic form builder, protocol playground, synthetic approval probe, or automated test suite.
