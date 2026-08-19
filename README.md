<p align="center">
  <img src="resources/startup-shark-tank-logo.png" alt="Startup Shark Tank logo with three shark investors reviewing a startup" width="280">
</p>

<h1 align="center">Startup Shark Tank</h1>

<p align="center">
  <strong>A visible multi-agent investment workflow powered by the Codex App Server.</strong>
</p>

<p align="center">
  <img alt="Electron 43" src="https://img.shields.io/badge/Electron-43-47848F?logo=electron&logoColor=white">
  <img alt="Optimized for macOS" src="https://img.shields.io/badge/Optimized_for-macOS-000000?logo=apple&logoColor=white">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0B1020">
  <img alt="TypeScript 5.9" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white">
  <img alt="Codex App Server" src="https://img.shields.io/badge/Codex-App_Server-10A37F">
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/License-MIT-f5c518"></a>
</p>

Turn a startup pitch into an inspectable **INVEST** or **PASS** decision. Independent Codex agents analyze the opportunity, challenge each other through shared files, pause for founder input, and produce one auditable investment memo.

![LedgerLift workflow paused for founder questions](docs/images/workflow-q-and-a.png)

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/images/new-pitch.png" alt="LedgerLift example selected in the editable New Pitch form">
      <br><sub><strong>Start with an editable example pitch</strong></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/images/final-verdict.png" alt="LedgerLift PASS verdict with a circular conviction score and investment memo">
      <br><sub><strong>Finish with a complete decision record</strong></sub>
    </td>
  </tr>
</table>

## Quick start

> [!NOTE]
> Startup Shark Tank is currently optimized for local development on macOS. Other platforms are not supported or verified yet.

**Requires:** macOS, Node.js `>=24 <25`, pnpm `11.15.1`, and the [`codex`](https://learn.chatgpt.com/docs) CLI on `PATH`.

```bash
pnpm install
codex login # skip when already signed in
pnpm dev
```

Choose **Doggo** or **LedgerLift**, edit the pitch if desired, and start the investment review.

## Product journey

```mermaid
flowchart LR
    pitch["1 · Founder pitch"] --> analysis["2 · Independent analysis"]
    analysis --> questions{{"3 · Founder Q&A"}}
    questions --> debate["4 · Bull vs. bear"]
    debate --> rebuttal{{"5 · Founder rebuttal"}}
    rebuttal --> verdict["6 · INVEST or PASS"]

    classDef agent fill:#102033,stroke:#38bdf8,color:#e2e8f0
    classDef human fill:#2b2512,stroke:#fbbf24,color:#fef3c7
    classDef outcome fill:#0d2b22,stroke:#34d399,color:#d1fae5
    class pitch,analysis,debate agent
    class questions,rebuttal human
    class verdict outcome
```

The app is a workflow dashboard, not a group chat. Every specialist gets a fresh Codex thread; Markdown and JSON artifacts carry evidence between stages.

## Workflow

Ten nodes form eight connected stages. The two analyst pairs run in parallel, while the human gates can be answered or skipped.

```mermaid
flowchart LR
    market["Market Scout"]
    business["Business Model<br/>Analyst"]
    product["Product<br/>Strategist"]
    risk["Risk & Diligence<br/>Lead"]
    committee["Committee<br/>Questions"]
    answers{{"Founder Q&A<br/>optional skip"}}
    bullish["Bullish VC"]
    bearish["Bearish VC"]
    rebuttal{{"Founder Rebuttal<br/>optional skip"}}
    verdict["Investment<br/>Committee"]

    market --> business
    market --> product
    business --> risk
    product --> risk
    risk --> committee --> answers
    answers --> bullish
    answers --> bearish
    bullish --> rebuttal
    bearish --> rebuttal
    rebuttal --> verdict

    classDef agent fill:#102033,stroke:#38bdf8,color:#e2e8f0
    classDef human fill:#2b2512,stroke:#fbbf24,color:#fef3c7
    classDef outcome fill:#0d2b22,stroke:#34d399,color:#d1fae5
    class market,business,product,risk,committee,bullish,bearish agent
    class answers,rebuttal human
    class verdict outcome
```

The generic engine only knows `agent` and `human-input` nodes. The graph lives in [`workflows/shark-tank.yaml`](workflows/shark-tank.yaml); specialist instructions live in [`agents/shark-tank`](agents/shark-tank).

## Architecture

```mermaid
flowchart TB
    subgraph desktop[Electron desktop app]
        renderer["React renderer"]
        preload["Narrow preload bridge"]
        main["Electron Main"]
        engine["Workflow engine"]
        store["Project store"]
        adapter["App Server adapter"]

        renderer <-->|"validated IPC + AppEvents"| preload
        preload <--> main
        main --> engine
        engine <--> store
        engine <--> adapter
    end

    server["codex app-server --stdio"]
    codex["Codex"]
    files[("projects/&lt;slug&gt;<br/>Markdown · JSON · JSONL")]

    adapter <-->|"JSON-RPC 2.0 over JSONL"| server
    server <--> codex
    store <--> files
    server -->|"project-scoped writes"| files

    classDef app fill:#102033,stroke:#38bdf8,color:#e2e8f0
    classDef protocol fill:#1e1633,stroke:#a78bfa,color:#ede9fe
    classDef data fill:#0d2b22,stroke:#34d399,color:#d1fae5
    class renderer,preload,main,engine,store,adapter app
    class server,codex protocol
    class files data
```

The Renderer has no Node.js or arbitrary filesystem access. Electron Main owns the canonical workflow state, validates all paths, and runs one long-lived App Server process for every specialist.

## Why Codex App Server?

The [Codex App Server](https://learn.chatgpt.com/docs/app-server) is the interface Codex uses for rich clients. It exposes authentication, threads, turns, approvals, interrupts, and streamed agent events through bidirectional JSON-RPC; the default stdio transport is newline-delimited JSON.

That makes it a better fit here than a background job abstraction: the desktop app needs to show live work, route real approvals to the founder, stop active turns, and explain every step in its Developer Inspector. For CI and unattended automation, OpenAI recommends the Codex SDK instead.

<details>
<summary><strong>Follow one agent turn</strong></summary>

```mermaid
sequenceDiagram
    autonumber
    participant UI as React renderer
    participant Engine as Workflow engine
    participant Server as Codex App Server
    participant Files as Project files

    Engine->>Server: initialize (once per connection)
    Server-->>Engine: capabilities
    Engine->>Server: initialized
    Engine->>Server: thread/start
    Server-->>Engine: thread/started
    Engine->>Server: turn/start

    loop streamed work
        Server-->>Engine: item/started · deltas · item/completed
        Engine-->>UI: curated AppEvent
    end

    opt approval requested
        Server->>Engine: command or file-change approval
        Engine->>UI: approval modal
        UI->>Engine: founder decision
        Engine->>Server: approval response
    end

    Server->>Files: create Markdown or JSON artifacts
    Server-->>Engine: turn/completed
    Engine->>Files: validate outputs and persist state
```

The checked-in TypeScript bindings under `src/main/codex/generated/` are generated by the installed CLI and match its protocol version:

```bash
pnpm codex:generate
```

</details>

<details>
<summary><strong>Workflow and model configuration</strong></summary>

The workflow sets a default model and concurrency limit:

```yaml
defaults:
  model: gpt-5.6-terra
  maxParallelAgents: 2
```

An agent can override the model in its Markdown frontmatter:

```yaml
---
model: gpt-5.6-sol
---
```

The read-only **Configuration** dialog shows the workflow, dependencies, effective model for every agent, available Codex models, expected outputs, and complete agent instructions.

</details>

<details>
<summary><strong>Files, persistence, and recovery</strong></summary>

```text
projects/<slug>/
├── project.json
├── pitch.md
├── artifacts/*.md
├── committee/questions.json
├── committee/questions.md
├── human/*.md
├── investment-memo.md
└── .sharktank/
    ├── workflow-state.json
    └── runs/<runId>/events.jsonl
```

- State changes are atomic; persisted events are redacted.
- Completed nodes and human input survive an app restart. Previously running nodes become resumable interruptions.
- Agent tools can write only inside the pitch project and cannot access the network.
- Web search and Codex internal subagents are disabled so the visible orchestration belongs entirely to this app.
- Stopped, waiting, failed, and completed pitches can be moved to the macOS Trash. Active runs must be stopped first.

</details>

<details>
<summary><strong>Manual verification and intentional limits</strong></summary>

This demo intentionally contains no automated test framework, mocks, fixtures, or test configuration. Its local quality gate is:

```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

For a full walkthrough, complete a LedgerLift run, use or edit a generated founder-answer draft, exercise Stop and Resume, inspect both parallel phases, and confirm the final memo and score in the sidebar.

This is a local macOS development demo, not a signed distribution. It intentionally has no database, cloud queue, custom login flow, generic form builder, protocol playground, or synthetic approval probe.

</details>

## Support

Enjoying Startup Shark Tank or finding it useful? If you would like to support future experiments around Codex and agent workflows, a coffee is always appreciated. Thank you! ☕

<a href="https://buymeacoffee.com/phillippbertram">   <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="45"> </a>

## License

Released under the [MIT License](LICENSE).

Official references: [Codex documentation](https://learn.chatgpt.com/docs) · [Codex App Server](https://learn.chatgpt.com/docs/app-server)
