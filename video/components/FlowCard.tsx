import type { LucideIcon } from "lucide-react";

export function FlowCard({
  icon: Icon,
  label,
  eyebrow,
  tone,
  width = 250,
}: {
  icon: LucideIcon;
  label: string;
  eyebrow: string;
  tone: "amber" | "emerald" | "red" | "sky" | "violet";
  width?: number;
}) {
  const colors =
    tone === "amber"
      ? { border: "rgba(251,191,36,0.34)", bg: "rgba(251,191,36,0.08)", text: "#fde68a" }
      : tone === "red"
        ? { border: "rgba(248,113,113,0.34)", bg: "rgba(248,113,113,0.08)", text: "#fca5a5" }
        : tone === "violet"
          ? { border: "rgba(167,139,250,0.34)", bg: "rgba(167,139,250,0.08)", text: "#c4b5fd" }
          : tone === "sky"
            ? { border: "rgba(56,189,248,0.34)", bg: "rgba(56,189,248,0.08)", text: "#7dd3fc" }
            : { border: "rgba(52,211,153,0.34)", bg: "rgba(52,211,153,0.08)", text: "#6ee7b7" };

  return (
    <div
      style={{
        display: "flex",
        width,
        minHeight: 126,
        alignItems: "center",
        gap: 18,
        border: `1px solid ${colors.border}`,
        borderRadius: 22,
        backgroundColor: colors.bg,
        padding: "22px 24px",
        boxShadow: "0 18px 48px rgba(0,0,0,0.24)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 52,
          height: 52,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.06)",
          color: colors.text,
        }}
      >
        <Icon size={25} strokeWidth={2.2} />
      </div>
      <div>
        <div
          style={{
            color: colors.text,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 8,
            color: "#f8fafc",
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.12,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
