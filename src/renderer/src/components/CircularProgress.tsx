import { cn } from "../lib";

export function CircularProgress({
  value,
  tone,
  label,
}: {
  value?: number;
  tone: "positive" | "negative";
  label: string;
}) {
  const normalized =
    value === undefined || !Number.isFinite(value)
      ? undefined
      : Math.min(100, Math.max(0, Math.round(value)));
  const progress = normalized ?? 0;

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative flex size-40 items-center justify-center rounded-full bg-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.22)]",
          tone === "positive" ? "text-emerald-300" : "text-red-300",
        )}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalized}
        aria-valuetext={normalized === undefined ? `${label} is loading` : `${normalized} of 100`}
      >
        <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 160 160" aria-hidden>
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="9"
          />
          <circle
            className="transition-[stroke-dashoffset] duration-700 ease-out"
            cx="80"
            cy="80"
            r="68"
            fill="none"
            pathLength="100"
            stroke="currentColor"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            strokeLinecap="round"
            strokeWidth="9"
          />
        </svg>
        <div className="relative flex items-baseline gap-1">
          <span className="text-4xl font-semibold tabular-nums text-white">
            {normalized ?? "—"}
          </span>
          <span className="text-xs font-semibold text-slate-300">/ 100</span>
        </div>
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">{label}</p>
    </div>
  );
}
