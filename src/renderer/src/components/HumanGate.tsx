import type { ArtifactContent, ProjectSnapshot, WorkflowNodeDefinition } from "@shared/types";
import { MessageSquareQuote, Send, SkipForward, Swords } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { Button, Card } from "./ui";

export function HumanGate({
  snapshot,
  node,
}: {
  snapshot: ProjectSnapshot;
  node: WorkflowNodeDefinition;
}) {
  if (node.form?.kind === "question-set") {
    return <QuestionGate snapshot={snapshot} node={node} />;
  }
  return <RebuttalGate snapshot={snapshot} node={node} />;
}

function QuestionGate({
  snapshot,
  node,
}: {
  snapshot: ProjectSnapshot;
  node: WorkflowNodeDefinition;
}) {
  const submitHuman = useAppStore((state) => state.submitHuman);
  const busy = useAppStore((state) => state.busy);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void submitHuman({ nodeId: node.id, answers });
  };

  return (
    <Card className="mx-auto max-w-4xl overflow-hidden border-amber-300/15 bg-amber-300/[0.035]">
      <header className="flex gap-4 border-b border-white/[0.07] px-7 py-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
          <MessageSquareQuote className="size-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200/70">
            Committee paused · Founder input
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Three questions could change the decision
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Your answers become a shared artifact for both VC perspectives.
          </p>
        </div>
      </header>
      <form className="space-y-7 p-7" onSubmit={submit}>
        {snapshot.questions.map((question, index) => (
          <label className="block" key={question.id}>
            <div className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-bold text-slate-300">
                {index + 1}
              </span>
              <div>
                <span className="block text-sm font-semibold leading-6 text-slate-100">
                  {question.question}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {question.reason}
                </span>
              </div>
            </div>
            <textarea
              className="mt-3 min-h-24 resize-y"
              placeholder="Give the committee a concrete answer…"
              value={answers[question.id] ?? ""}
              onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
              required
            />
          </label>
        ))}
        <div className="flex justify-end">
          <Button disabled={busy} type="submit">
            Submit all answers <Send className="size-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}

function RebuttalGate({
  snapshot,
  node,
}: {
  snapshot: ProjectSnapshot;
  node: WorkflowNodeDefinition;
}) {
  const submitHuman = useAppStore((state) => state.submitHuman);
  const busy = useAppStore((state) => state.busy);
  const [text, setText] = useState("");
  const [cases, setCases] = useState<Record<string, ArtifactContent>>({});

  useEffect(() => {
    let active = true;
    void Promise.all(
      ["artifacts/bullish.md", "artifacts/bearish.md"].map((path) =>
        window.sharkTank.readArtifact(snapshot.project.id, path),
      ),
    ).then(([bullish, bearish]) => {
      if (active && bullish && bearish) setCases({ bullish, bearish });
    });
    return () => {
      active = false;
    };
  }, [snapshot.project.id]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
          <Swords className="size-5" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-white">
          The VCs disagree. Your last word?
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Address the strongest claim below, or let the committee decide on the existing record.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CaseCard title="Bull case" tone="bull" artifact={cases.bullish} />
        <CaseCard title="Bear case" tone="bear" artifact={cases.bearish} />
      </div>
      <Card className="mt-4 p-6">
        <label className="field-label" htmlFor="rebuttal">
          Founder rebuttal
        </label>
        <textarea
          id="rebuttal"
          className="mt-2 min-h-32 resize-y"
          placeholder="Clarify an assumption, counter a risk, or add evidence…"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => void submitHuman({ nodeId: node.id, skipped: true })}
          >
            <SkipForward className="size-4" /> Skip rebuttal
          </Button>
          <Button
            disabled={busy || !text.trim()}
            onClick={() => void submitHuman({ nodeId: node.id, text })}
          >
            Continue to verdict <Send className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function CaseCard({
  title,
  tone,
  artifact,
}: {
  title: string;
  tone: "bull" | "bear";
  artifact?: ArtifactContent;
}) {
  return (
    <Card
      className={
        tone === "bull"
          ? "border-emerald-400/15 bg-emerald-400/[0.035] p-6"
          : "border-red-400/15 bg-red-400/[0.035] p-6"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-bold ${tone === "bull" ? "text-emerald-300" : "text-red-300"}`}>
          {title}
        </p>
        <span className="text-2xl font-semibold tabular-nums text-white">
          {artifact ? String(artifact.frontmatter.score ?? "—") : "—"}
        </span>
      </div>
      <p className="mt-4 line-clamp-6 whitespace-pre-line text-xs leading-6 text-slate-400">
        {artifact?.content.replace(/^#.*\n/, "").slice(0, 700) ?? "Loading the argument…"}
      </p>
    </Card>
  );
}
