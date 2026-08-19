import { ArrowRight, PencilLine, Rocket, Sparkles } from "lucide-react";
import { Easing, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AppScreenshot } from "../components/AppScreenshot";
import { SceneCanvas } from "../components/SceneCanvas";

export function PitchScene() {
  const frame = useCurrentFrame();

  return (
    <SceneCanvas glow="emerald">
      <Interactive.Div
        name="Pitch scene copy"
        style={{
          position: "absolute",
          top: 168,
          left: 116,
          width: 490,
          opacity: interpolate(frame, [2, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [2, 20], ["-36px 0px", "0px 0px"], {
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
            color: "#6ee7b7",
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <Rocket size={22} /> 01 · Founder pitch
        </div>
        <h2
          style={{
            margin: "28px 0 0",
            color: "#f8fafc",
            fontSize: 82,
            fontWeight: 820,
            letterSpacing: "-0.052em",
            lineHeight: 1.02,
          }}
        >
          Submit the pitch.
        </h2>
        <p
          style={{
            margin: "28px 0 0",
            color: "#aab7c9",
            fontSize: 31,
            lineHeight: 1.48,
          }}
        >
          Start from an example or edit every field. The workflow runs locally.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 42 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#cbd5e1",
              fontSize: 22,
              fontWeight: 650,
            }}
          >
            <PencilLine color="#6ee7b7" size={24} /> Editable startup context
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#cbd5e1",
              fontSize: 22,
              fontWeight: 650,
            }}
          >
            <Sparkles color="#7dd3fc" size={24} /> Editable example pitch
          </div>
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="New pitch app screen"
        style={{
          position: "absolute",
          top: 136,
          left: 650,
          width: 1154,
          height: 753,
          opacity: interpolate(frame, [4, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [4, 112], [0.91, 1.02], {
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
          name="New pitch screenshot"
          src={staticFile("remotion/new-pitch.png")}
          width={1154}
          height={753}
        />
        <div
          style={{
            position: "absolute",
            top: 70,
            right: 39,
            width: 390,
            height: 636,
            border: "2px solid rgba(52,211,153,0.82)",
            borderRadius: 20,
            boxShadow: `0 0 ${interpolate(frame, [26, 48, 72], [16, 42, 16], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px rgba(52,211,153,0.25)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 68,
            bottom: 79,
            display: "flex",
            alignItems: "center",
            gap: 11,
            borderRadius: 999,
            backgroundColor: "#34d399",
            padding: "13px 19px",
            color: "#04120d",
            fontSize: 17,
            fontWeight: 850,
            opacity: interpolate(frame, [32, 46], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [32, 52], [0.82, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 170 }),
              output: "perceptual-scale",
            }),
          }}
        >
          Start investment review <ArrowRight size={19} />
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Local workflow note"
        style={{
          position: "absolute",
          bottom: 92,
          left: 116,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "#7dd3fc",
          fontSize: 19,
          fontWeight: 700,
          opacity: interpolate(frame, [54, 72], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            backgroundColor: "#34d399",
            boxShadow: "0 0 18px rgba(52,211,153,0.75)",
          }}
        />
        App Server connected · agent tools stay offline
      </Interactive.Div>
    </SceneCanvas>
  );
}
