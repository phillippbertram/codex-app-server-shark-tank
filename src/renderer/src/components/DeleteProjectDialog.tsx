import type { ProjectSummary } from "@shared/types";
import { AlertTriangle, FolderOpen, Trash2 } from "lucide-react";
import { formatProjectDate } from "../lib";
import { useAppStore } from "../store/useAppStore";
import { Button, Dialog } from "./ui";

export function DeleteProjectDialog({
  project,
  onClose,
}: {
  project?: ProjectSummary;
  onClose: () => void;
}) {
  const deleteProject = useAppStore((state) => state.deleteProject);
  const selectProject = useAppStore((state) => state.selectProject);
  const busy = useAppStore((state) => state.busy);
  const running = project?.runStatus === "running";

  const moveToTrash = async () => {
    if (!project) return;
    if (await deleteProject(project.id)) onClose();
  };

  const openPitch = async () => {
    if (!project) return;
    await selectProject(project.id);
    onClose();
  };

  return (
    <Dialog
      open={Boolean(project)}
      onOpenChange={(open) => !open && onClose()}
      title={running ? "Stop this pitch first" : `Move ${project?.name ?? "pitch"} to Trash?`}
      description={
        running
          ? "A running Codex turn must finish stopping before its project can be removed."
          : "The complete pitch project and its decision history will leave this app."
      }
      className="max-w-lg"
    >
      <div className="p-7">
        {running ? (
          <div className="flex gap-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">The workflow is still running</p>
              <p className="mt-2 text-xs leading-6 text-slate-300">
                Open the pitch, choose Stop, and wait until its running agents are interrupted. You
                can then move the project to Trash.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
              <Trash2 className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-100">{project?.name}</p>
              <p className="mt-1 text-xs text-slate-400">
                Created {project ? formatProjectDate(project.createdAt) : ""}
              </p>
              <p className="mt-3 text-xs leading-6 text-slate-300">
                The project folder, artifacts, workflow state, and Inspector history will be moved
                to the macOS Trash.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          {running ? (
            <Button variant="secondary" disabled={busy} onClick={() => void openPitch()}>
              <FolderOpen className="size-4" /> Open pitch
            </Button>
          ) : (
            <Button variant="danger" disabled={busy} onClick={() => void moveToTrash()}>
              <Trash2 className="size-4" /> Move to Trash
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
