import { ShieldCheck, TerminalSquare } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Button, Dialog } from "./ui";

export function ApprovalModal() {
  const approval = useAppStore((state) => state.approvals[0]);

  const respond = async (decision: "accept" | "acceptForSession" | "decline") => {
    if (!approval) return;
    await window.sharkTank.respondToApproval(approval.id, decision);
  };

  return (
    <Dialog
      open={Boolean(approval)}
      onOpenChange={(open) => !open && void respond("decline")}
      title={approval?.title ?? "Codex approval"}
      description="A running agent requested permission before it can continue."
      className="max-w-xl"
    >
      <div className="p-7">
        <div className="flex gap-4 rounded-2xl border border-amber-300/15 bg-amber-300/[0.045] p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200">
            {approval?.kind === "command" ? (
              <TerminalSquare className="size-5" />
            ) : (
              <ShieldCheck className="size-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-200/70">
              {approval?.kind} · {approval?.nodeId}
            </p>
            <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-6 text-slate-300">
              {approval?.detail}
            </pre>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => void respond("decline")}>
            Decline
          </Button>
          <Button variant="secondary" onClick={() => void respond("acceptForSession")}>
            Allow for run
          </Button>
          <Button onClick={() => void respond("accept")}>Allow once</Button>
        </div>
      </div>
    </Dialog>
  );
}
