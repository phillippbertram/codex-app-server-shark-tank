import { MessageSquareQuote, ShieldCheck, SkipForward } from "lucide-react";
import { Easing, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AppScreenshot } from "../components/AppScreenshot";
import { SceneCanvas } from "../components/SceneCanvas";

export function FounderInputScene() {
  const frame = useCurrentFrame();

  return (
    <SceneCanvas glow="amber">
      <Interactive.Div
        name="Founder input copy"
        style={{
          position: "absolute",
          top: 160,
          left: 104,
          width: 430,
          opacity: interpolate(frame, [0, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [0, 20], ["-38px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "#fde68a",
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <MessageSquareQuote size={23} /> 03 · Human judgment
        </div>
        <h2
          style={{
            margin: "28px 0 0",
            color: "#f8fafc",
            fontSize: 74,
            fontWeight: 820,
            letterSpacing: "-0.052em",
            lineHeight: 1.02,
          }}
        >
          The committee pauses for you.
        </h2>
        <p
          style={{
            margin: "28px 0 0",
            color: "#b5c0cf",
            fontSize: 29,
            lineHeight: 1.5,
          }}
        >
          Questions surface the evidence that could change the decision.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 17, marginTop: 38 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#d6deea",
              fontSize: 21,
              fontWeight: 680,
            }}
          >
            <ShieldCheck color="#fde68a" size={25} /> Two deliberate founder gates
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#d6deea",
              fontSize: 21,
              fontWeight: 680,
            }}
          >
            <SkipForward color="#94a3b8" size={25} /> Answer or skip explicitly
          </div>
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Founder Q and A app screen"
        style={{
          position: "absolute",
          top: 132,
          left: 574,
          width: 1246,
          height: 813,
          opacity: interpolate(frame, [4, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [4, 112], [0.92, 1.015], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
          translate: interpolate(frame, [4, 24], ["44px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <AppScreenshot
          name="Workflow Q and A screenshot"
          src={staticFile("remotion/workflow-q-and-a.png")}
          width={1246}
          height={813}
        />
        <div
          style={{
            position: "absolute",
            top: 246,
            left: 340,
            width: 770,
            height: 492,
            border: "2px solid rgba(251,191,36,0.88)",
            borderRadius: 20,
            boxShadow: `0 0 ${interpolate(frame, [24, 50, 78], [16, 48, 18], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px rgba(251,191,36,0.24)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 218,
            left: 372,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid rgba(251,191,36,0.42)",
            borderRadius: 999,
            backgroundColor: "#2b2512",
            padding: "11px 17px",
            color: "#fde68a",
            fontSize: 16,
            fontWeight: 850,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: interpolate(frame, [28, 42], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [28, 48], [0.82, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 170 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <MessageSquareQuote size={18} /> Founder Q&amp;A
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Founder input outcome"
        style={{
          position: "absolute",
          bottom: 71,
          left: 695,
          display: "flex",
          alignItems: "center",
          gap: 13,
          border: "1px solid rgba(251,191,36,0.24)",
          borderRadius: 999,
          backgroundColor: "rgba(251,191,36,0.08)",
          padding: "13px 21px",
          color: "#fef3c7",
          fontSize: 18,
          fontWeight: 750,
          opacity: interpolate(frame, [62, 82], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [62, 86], ["0px 24px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 190 }),
          }),
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            backgroundColor: "#fbbf24",
            boxShadow: "0 0 16px rgba(251,191,36,0.7)",
          }}
        />
        Your answers become evidence for both VC perspectives
      </Interactive.Div>
    </SceneCanvas>
  );
}
