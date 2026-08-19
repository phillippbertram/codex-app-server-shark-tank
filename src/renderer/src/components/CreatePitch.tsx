import sharkTankLogo from "@assets/startup-shark-tank-logo.png";
import type { WebSearchMode } from "@shared/types";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Bot, Braces, GitBranch, Globe2, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";
import { defaultPitchPreset, type PitchPreset, pitchPresets } from "../data/pitchPresets";
import { useAppStore } from "../store/useAppStore";
import { Badge, Button, Card } from "./ui";

export function CreatePitch() {
  const { createAndStart, busy, codex, workflow } = useAppStore();
  const researchAgents =
    workflow?.nodes.filter((node) => node.type === "agent" && node.webSearch?.allowed) ?? [];
  const [selectedPresetId, setSelectedPresetId] = useState(defaultPitchPreset.id);
  const [name, setName] = useState(defaultPitchPreset.name);
  const [targetMarket, setTargetMarket] = useState(defaultPitchPreset.targetMarket);
  const [pitch, setPitch] = useState(defaultPitchPreset.pitch);
  const [webSearchMode, setWebSearchMode] = useState<WebSearchMode>(
    workflow?.defaults.webSearchMode ?? "cached",
  );
  const [webSearchAgentIds, setWebSearchAgentIds] = useState<string[]>(() =>
    researchAgents.filter((node) => node.webSearch?.defaultEnabled).map((node) => node.id),
  );

  const selectPreset = (preset: PitchPreset) => {
    setSelectedPresetId(preset.id);
    setName(preset.name);
    setTargetMarket(preset.targetMarket);
    setPitch(preset.pitch);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void createAndStart({
      name,
      targetMarket,
      pitch,
      webSearch: { mode: webSearchMode, agentIds: webSearchAgentIds },
    });
  };

  const toggleResearchAgent = (agentId: string) => {
    setWebSearchAgentIds((current) =>
      current.includes(agentId)
        ? current.filter((candidate) => candidate !== agentId)
        : [...current, agentId],
    );
  };

  const features: Array<[LucideIcon, string, string]> = [
    [GitBranch, "Visible orchestration", "Parallel specialists, one file-based shared state"],
    [Bot, "Real Codex turns", "Ephemeral threads stream live through one App Server"],
    [ShieldCheck, "Human judgment", "Two deliberate gates keep the founder in control"],
    [Braces, "Inspectable protocol", "Curated JSON-RPC events explain what happened"],
  ];

  return (
    <main className="relative flex min-h-full flex-1 overflow-auto">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.09),transparent_34%),radial-gradient(circle_at_78%_32%,rgba(56,189,248,0.07),transparent_30%)]" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-12 py-20 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
        <section>
          <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            Codex App Server demo
          </Badge>
          <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-white xl:text-6xl">
            Put your startup in front of an AI investment committee.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Specialized Codex threads research the pitch, challenge one another, pause for your
            answers, and produce one auditable investment memo.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {features.map(([Icon, title, text]) => (
              <div
                key={String(title)}
                className="flex gap-3 rounded-2xl border border-white/[0.11] bg-white/[0.025] p-4"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                <div>
                  <div className="text-sm font-semibold text-slate-100">{String(title)}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{String(text)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Card className="relative overflow-hidden p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                New pitch
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Meet the sharks</h2>
            </div>
            <img
              src={sharkTankLogo}
              alt=""
              aria-hidden="true"
              className="size-16 object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.18)]"
            />
          </div>
          <form className="space-y-5" onSubmit={submit}>
            <fieldset>
              <legend className="field-label">Example pitch</legend>
              <p className="mb-3 mt-1 text-xs leading-5 text-slate-400">
                Choose a starting point. You can edit every field.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pitchPresets.map((preset) => {
                  const selected = preset.id === selectedPresetId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      aria-pressed={selected}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        selected
                          ? "border-emerald-300/45 bg-emerald-300/10 text-white"
                          : "border-white/[0.12] bg-white/[0.035] text-slate-300 hover:border-white/25 hover:bg-white/[0.07]"
                      }`}
                      onClick={() => selectPreset(preset)}
                    >
                      <span className="block text-sm font-semibold">{preset.name}</span>
                      <span
                        className={`mt-1 block text-[11px] ${selected ? "text-emerald-200" : "text-slate-400"}`}
                      >
                        {preset.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className="block">
              <span className="field-label">Startup name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            <label className="block">
              <span className="field-label">Target market</span>
              <input
                value={targetMarket}
                onChange={(event) => setTargetMarket(event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="field-label">The pitch</span>
              <textarea
                className="min-h-44 resize-none"
                value={pitch}
                onChange={(event) => setPitch(event.target.value)}
                required
              />
            </label>
            <details className="group rounded-2xl border border-white/[0.11] bg-white/[0.025]">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                  <Globe2 className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-100">Web research</span>
                  <span className="mt-0.5 block text-[11px] text-slate-400">
                    {webSearchAgentIds.length
                      ? `${webSearchAgentIds.length} research agent${webSearchAgentIds.length === 1 ? "" : "s"} · ${webSearchMode}`
                      : "Disabled for this pitch"}
                  </span>
                </span>
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 group-open:hidden">
                  Configure
                </span>
                <span className="ml-auto hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 group-open:inline">
                  Done
                </span>
              </summary>
              <div className="space-y-4 border-t border-white/[0.09] px-4 py-4">
                <div>
                  <span className="field-label">Search mode</span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["cached", "live"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        aria-pressed={webSearchMode === mode}
                        onClick={() => setWebSearchMode(mode)}
                        className={`rounded-xl border px-3 py-2.5 text-left transition ${
                          webSearchMode === mode
                            ? "border-sky-300/45 bg-sky-300/10 text-white"
                            : "border-white/[0.1] bg-white/[0.03] text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <span className="block text-xs font-semibold capitalize">{mode}</span>
                        <span className="mt-1 block text-[10px] leading-4 text-slate-400">
                          {mode === "cached"
                            ? "OpenAI-maintained search index"
                            : "Most recent public web results"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Research agents</span>
                  <div className="mt-2 space-y-2">
                    {researchAgents.map((agent) => {
                      const enabled = webSearchAgentIds.includes(agent.id);
                      return (
                        <button
                          key={agent.id}
                          type="button"
                          role="switch"
                          aria-checked={enabled}
                          onClick={() => toggleResearchAgent(agent.id)}
                          className="flex w-full items-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2.5 text-left transition hover:border-white/20 hover:bg-white/[0.055]"
                        >
                          <span
                            className={`relative h-5 w-9 rounded-full transition ${enabled ? "bg-sky-400" : "bg-slate-700"}`}
                          >
                            <span
                              className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition ${enabled ? "left-[18px]" : "left-0.5"}`}
                            />
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {agent.label}
                          </span>
                          {agent.webSearch?.defaultEnabled ? (
                            <span className="ml-auto text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-300">
                              Recommended
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.06] px-3 py-2.5 text-[10px] leading-4 text-amber-100/80">
                  Web results are untrusted research input. Agents must ignore instructions found in
                  retrieved content and never include private project data in queries.
                </p>
              </div>
            </details>
            <Button
              className="w-full"
              size="lg"
              disabled={busy || codex.state !== "ready"}
              type="submit"
            >
              {busy ? "Opening the committee…" : "Start investment review"}
              <ArrowRight className="size-4" />
            </Button>
            <p className="text-center text-xs leading-5 text-slate-400">
              Selected research agents can use Codex Web Search. Shell and file tools remain
              network-isolated.
            </p>
          </form>
        </Card>
      </div>
    </main>
  );
}
