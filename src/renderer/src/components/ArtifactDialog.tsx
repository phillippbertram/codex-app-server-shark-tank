import type { ArtifactContent } from "@shared/types";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { errorMessage } from "../lib";
import { Badge, Dialog } from "./ui";

export function ArtifactDialog({
  projectId,
  artifact,
  onClose,
}: {
  projectId: string;
  artifact?: { path: string; label: string };
  onClose: () => void;
}) {
  const [content, setContent] = useState<ArtifactContent>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    setContent(undefined);
    setError(undefined);
    if (!artifact) return;
    void window.sharkTank
      .readArtifact(projectId, artifact.path)
      .then(setContent)
      .catch((cause) => setError(errorMessage(cause)));
  }, [artifact, projectId]);

  return (
    <Dialog
      open={Boolean(artifact)}
      onOpenChange={(open) => !open && onClose()}
      title={artifact?.label ?? "Artifact"}
      description={artifact?.path}
    >
      <div className="max-h-[calc(88vh-100px)] overflow-y-auto px-8 py-7">
        {!content && !error ? (
          <div className="flex h-48 items-center justify-center text-sm text-slate-400">
            Loading artifact…
          </div>
        ) : null}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {content ? (
          <>
            {Object.keys(content.frontmatter).length ? (
              <div className="mb-7 flex flex-wrap gap-2">
                {Object.entries(content.frontmatter).map(([key, value]) => (
                  <Badge key={key} className="normal-case tracking-normal text-slate-300">
                    {key}: {String(value)}
                  </Badge>
                ))}
              </div>
            ) : null}
            <article className="prose-shark">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ children, href }) => (
                    <span className="text-emerald-300" title={href}>
                      {children}
                    </span>
                  ),
                }}
              >
                {content.content}
              </ReactMarkdown>
            </article>
          </>
        ) : null}
      </div>
    </Dialog>
  );
}
