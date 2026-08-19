import type { InspectorEvent, WorkflowNodeDefinition, WorkflowNodeState } from "@shared/types";
import { Braces, ChevronDown, CircleDot } from "lucide-react";
import { useMemo, useState } from "react";
import { formatDuration } from "../lib";
import { Badge, Button } from "./ui";

export function Inspector({
  node,
  state,
  events,
  onClose,
}: {
  node?: WorkflowNodeDefinition;
  state?: WorkflowNodeState;
  events: InspectorEvent[];
  onClose: () => void;
}) {
  const filtered = useMemo(
    () => (node ? events.filter((event) => event.nodeId === node.id) : events),
    [events, node],
  );

  return (
    <aside className="flex w-[390px] shrink-0 flex-col border-l border-white/[0.07] bg-[#070c14]">
      <header className="border-b border-white/[0.07] px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              <Braces className="size-4" /> Developer Inspector
            </div>
            <h3 className="mt-3 font-semibold text-white">{node?.label ?? "Run timeline"}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        {state ? (
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
            <Meta label="Thread" value={state.threadId?.slice(0, 12) ?? "—"} />
            <Meta label="Turn" value={state.turnId?.slice(0, 12) ?? "—"} />
            <Meta label="Attempt" value={String(state.attempt)} />
            <Meta label="Runtime" value={formatDuration(state.durationMs)} />
          </div>
        ) : null}
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center text-xs leading-5 text-slate-500">
            Select a node to inspect its App Server lifecycle.
          </div>
        ) : (
          <div className="relative space-y-2 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-white/[0.08]">
            {filtered.map((event) => (
              <InspectorRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function InspectorRow({ event }: { event: InspectorEvent }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative rounded-xl border border-white/[0.06] bg-[#0b121e] p-3 pl-8">
      <CircleDot className="absolute left-[9px] top-[14px] z-10 size-3.5 rounded-full bg-[#0b121e] text-emerald-400" />
      <div className="flex items-center justify-between gap-2">
        <Badge
          className={
            event.direction === "client"
              ? "border-sky-400/15 bg-sky-400/10 text-sky-300"
              : event.direction === "workflow"
                ? "border-violet-400/15 bg-violet-400/10 text-violet-300"
                : "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
          }
        >
          {event.direction}
        </Badge>
        <span className="text-[10px] tabular-nums text-slate-600">
          {new Date(event.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
      <code className="mt-2 block text-[11px] font-semibold text-slate-300">{event.method}</code>
      <p className="mt-1 text-[11px] leading-5 text-slate-500">{event.summary}</p>
      {event.data !== undefined ? (
        <button
          type="button"
          className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-300"
          onClick={() => setOpen(!open)}
        >
          <ChevronDown className={`size-3 transition ${open ? "rotate-180" : ""}`} />
          JSON
        </button>
      ) : null}
      {open ? (
        <pre className="mt-2 max-h-52 overflow-auto rounded-lg bg-black/30 p-2 text-[9px] leading-4 text-slate-500">
          {JSON.stringify(event.data, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.035] px-2.5 py-2">
      <span>{label}</span>
      <code className="mt-0.5 block truncate text-slate-300">{value}</code>
    </div>
  );
}
