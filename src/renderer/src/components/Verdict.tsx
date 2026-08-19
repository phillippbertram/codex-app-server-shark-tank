import type { ArtifactContent, ArtifactSummary, ProjectSnapshot } from "@shared/types";
import {
  Braces,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderOpen,
  ShieldAlert,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatProjectDate } from "../lib";
import { ArtifactDialog } from "./ArtifactDialog";
import { CircularProgress } from "./CircularProgress";
import { Inspector } from "./Inspector";
import { Button, Card } from "./ui";

export function Verdict({ snapshot }: { snapshot: ProjectSnapshot }) {
  const [memo, setMemo] = useState<ArtifactContent>();
  const [artifact, setArtifact] = useState<ArtifactSummary>();
  const [inspector, setInspector] = useState(false);

  useEffect(() => {
    void window.sharkTank.readArtifact(snapshot.project.id, "investment-memo.md").then(setMemo);
  }, [snapshot.project.id]);

  const verdict = String(memo?.frontmatter.verdict ?? "DECIDING").toUpperCase();
  const rawScore = memo ? Number(memo.frontmatter.score) : undefined;
  const score = rawScore !== undefined && Number.isFinite(rawScore) ? rawScore : undefined;
  const invest = verdict === "INVEST";

  return (
    <div className="flex min-w-0 flex-1 overflow-hidden">
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="relative overflow-hidden border-b border-white/[0.07] px-10 py-14">
          <div
            className={`pointer-events-none absolute inset-0 ${invest ? "bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.15),transparent_48%)]" : "bg-[radial-gradient(circle_at_50%_0%,rgba(248,113,113,0.13),transparent_48%)]"}`}
          />
          <div className="relative mx-auto max-w-5xl text-center">
            <div
              className={`mx-auto flex size-14 items-center justify-center rounded-2xl ${invest ? "bg-emerald-400/10 text-emerald-300" : "bg-red-400/10 text-red-300"}`}
            >
              {invest ? <Trophy className="size-6" /> : <ShieldAlert className="size-6" />}
            </div>
            <p className="eyebrow mt-5">Final committee decision</p>
            <h1
              className={`mt-3 text-7xl font-black tracking-[-0.06em] ${invest ? "text-emerald-300" : "text-red-300"}`}
            >
              {verdict}
            </h1>
            <p className="mt-3 text-xl font-semibold text-white">{snapshot.project.name}</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <CalendarDays className="size-3.5" />
              {formatProjectDate(snapshot.project.createdAt)}
            </p>
            <div className="mt-7 flex justify-center">
              <CircularProgress
                value={score}
                tone={invest ? "positive" : "negative"}
                label="Conviction"
              />
            </div>
            {memo?.frontmatter.proposedTerms ? (
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300">
                <span className="font-semibold text-slate-200">Proposed terms:</span>{" "}
                {String(memo.frontmatter.proposedTerms)}
              </p>
            ) : null}
            <div className="mt-7 flex justify-center gap-2">
              <Button
                variant="secondary"
                onClick={() => void window.sharkTank.revealProject(snapshot.project.id)}
              >
                <FolderOpen className="size-4" /> Reveal project
              </Button>
              <Button variant="ghost" onClick={() => setInspector(!inspector)}>
                <Braces className="size-4" /> Inspector
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 px-8 py-9 lg:grid-cols-[1fr_280px]">
          <Card className="p-8">
            <div className="mb-7 flex items-center gap-3 border-b border-white/[0.07] pb-5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.055] text-slate-300">
                <FileText className="size-4" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Investment memo</h2>
                <p className="text-xs text-slate-400">
                  Synthesized from the complete decision record
                </p>
              </div>
            </div>
            {memo ? (
              <article className="prose-shark">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{memo.content}</ReactMarkdown>
              </article>
            ) : (
              <p className="text-sm text-slate-400">Loading final memo…</p>
            )}
          </Card>

          <aside>
            <p className="eyebrow mb-3">Decision record</p>
            <div className="space-y-2">
              {snapshot.artifacts
                .filter(
                  (entry) =>
                    entry.exists &&
                    entry.path !== "investment-memo.md" &&
                    !entry.path.endsWith(".json"),
                )
                .map((entry) => (
                  <button
                    type="button"
                    key={entry.path}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/[0.11] bg-white/[0.045] px-3 py-3 text-left transition hover:border-white/[0.17] hover:bg-white/[0.08]"
                    onClick={() => setArtifact(entry)}
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400/70" />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-slate-200">
                        {entry.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] text-slate-400">
                        {entry.path}
                      </span>
                    </span>
                  </button>
                ))}
            </div>
          </aside>
        </div>
      </main>
      {inspector ? (
        <Inspector events={snapshot.events} onClose={() => setInspector(false)} />
      ) : null}
      <ArtifactDialog
        projectId={snapshot.project.id}
        artifact={artifact ? { path: artifact.path, label: artifact.label } : undefined}
        onClose={() => setArtifact(undefined)}
      />
    </div>
  );
}
