import sharkTankLogo from "@assets/startup-shark-tank-logo.png";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Bot, Braces, GitBranch, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";
import { defaultPitchPreset, type PitchPreset, pitchPresets } from "../data/pitchPresets";
import { useAppStore } from "../store/useAppStore";
import { Badge, Button, Card } from "./ui";

export function CreatePitch() {
  const { createAndStart, busy, codex } = useAppStore();
  const [selectedPresetId, setSelectedPresetId] = useState(defaultPitchPreset.id);
  const [name, setName] = useState(defaultPitchPreset.name);
  const [targetMarket, setTargetMarket] = useState(defaultPitchPreset.targetMarket);
  const [pitch, setPitch] = useState(defaultPitchPreset.pitch);

  const selectPreset = (preset: PitchPreset) => {
    setSelectedPresetId(preset.id);
    setName(preset.name);
    setTargetMarket(preset.targetMarket);
    setPitch(preset.pitch);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void createAndStart({ name, targetMarket, pitch });
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
              The workflow runs locally. Agent tools have no network access.
            </p>
          </form>
        </Card>
      </div>
    </main>
  );
}
