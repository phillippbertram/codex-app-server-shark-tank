import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";

export function SceneCanvas({
  children,
  glow = "emerald",
}: {
  children: ReactNode;
  glow?: "emerald" | "amber" | "mixed" | "red" | "sky";
}) {
  const glowColor =
    glow === "amber"
      ? "rgba(251,191,36,0.14)"
      : glow === "red"
        ? "rgba(248,113,113,0.13)"
        : glow === "sky"
          ? "rgba(56,189,248,0.13)"
          : glow === "mixed"
            ? "rgba(167,139,250,0.12)"
            : "rgba(52,211,153,0.14)";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080d16",
        color: "#e2e8f0",
        fontFamily:
          "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle at 22% 18%, ${glowColor}, transparent 34%), radial-gradient(circle at 84% 76%, rgba(56,189,248,0.08), transparent 32%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 82%)",
        }}
      />
      {children}
    </AbsoluteFill>
  );
}
