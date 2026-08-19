import {
  AlertTriangle,
  CheckCircle2,
  Landmark,
  MessageSquareText,
  Scale,
  Swords,
} from "lucide-react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { SceneCanvas } from "../components/SceneCanvas";

export function DebateScene() {
  const frame = useCurrentFrame();

  return (
    <SceneCanvas glow="mixed">
      <Interactive.Div
        name="Debate heading"
        style={{
          position: "absolute",
          top: 70,
          right: 110,
          left: 110,
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [0, 20], ["0px -22px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 11,
            color: "#c4b5fd",
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <Swords size={23} /> 04 · Structured challenge
        </div>
        <h2
          style={{
            margin: "23px auto 0",
            color: "#f8fafc",
            fontSize: 78,
            fontWeight: 820,
            letterSpacing: "-0.052em",
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          Bull and bear cases challenge the record.
        </h2>
      </Interactive.Div>

      <Interactive.Svg
        name="Debate merge lines"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <Interactive.Path
          name="Bull case to founder rebuttal"
          d="M 525 638 C 525 706, 724 706, 800 759"
          fill="none"
          pathLength={1}
          stroke="rgba(52,211,153,0.7)"
          strokeDasharray={1}
          strokeDashoffset={interpolate(frame, [45, 68], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          strokeLinecap="round"
          strokeWidth={4}
        />
        <Interactive.Path
          name="Bear case to founder rebuttal"
          d="M 1395 638 C 1395 706, 1196 706, 1120 759"
          fill="none"
          pathLength={1}
          stroke="rgba(248,113,113,0.7)"
          strokeDasharray={1}
          strokeDashoffset={interpolate(frame, [45, 68], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          strokeLinecap="round"
          strokeWidth={4}
        />
        <Interactive.Path
          name="Founder rebuttal to committee"
          d="M 960 846 L 960 892"
          fill="none"
          pathLength={1}
          stroke="rgba(167,139,250,0.75)"
          strokeDasharray={1}
          strokeDashoffset={interpolate(frame, [78, 92], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          strokeLinecap="round"
          strokeWidth={4}
        />
      </Interactive.Svg>

      <Interactive.Div
        name="Bull case"
        style={{
          position: "absolute",
          top: 324,
          left: 184,
          width: 682,
          height: 314,
          border: "1px solid rgba(52,211,153,0.3)",
          borderRadius: 26,
          backgroundColor: "rgba(52,211,153,0.065)",
          boxShadow: "0 28px 74px rgba(0,0,0,0.3)",
          padding: "32px 36px",
          opacity: interpolate(frame, [8, 24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [8, 28], ["-90px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 190 }),
          }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 54,
                height: 54,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                backgroundColor: "rgba(52,211,153,0.12)",
                color: "#6ee7b7",
              }}
            >
              <Landmark size={27} />
            </div>
            <div>
              <div
                style={{
                  color: "#6ee7b7",
                  fontSize: 16,
                  fontWeight: 850,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Bullish VC
              </div>
              <div
                style={{
                  marginTop: 6,
                  color: "#f8fafc",
                  fontSize: 31,
                  fontWeight: 780,
                }}
              >
                The upside case
              </div>
            </div>
          </div>
          <CheckCircle2 color="#34d399" size={32} />
        </div>
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 15 }}>
          {[
            "Compounding workflow data",
            "Clear recurring revenue wedge",
            "Accountant-led distribution",
          ].map((text) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                color: "#cbd5e1",
                fontSize: 21,
                fontWeight: 600,
              }}
            >
              <span
                style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: "#34d399" }}
              />
              {text}
            </div>
          ))}
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Bear case"
        style={{
          position: "absolute",
          top: 324,
          right: 184,
          width: 682,
          height: 314,
          border: "1px solid rgba(248,113,113,0.3)",
          borderRadius: 26,
          backgroundColor: "rgba(248,113,113,0.06)",
          boxShadow: "0 28px 74px rgba(0,0,0,0.3)",
          padding: "32px 36px",
          opacity: interpolate(frame, [8, 24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [8, 28], ["90px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 190 }),
          }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 54,
                height: 54,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                backgroundColor: "rgba(248,113,113,0.12)",
                color: "#fca5a5",
              }}
            >
              <AlertTriangle size={27} />
            </div>
            <div>
              <div
                style={{
                  color: "#fca5a5",
                  fontSize: 16,
                  fontWeight: 850,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Bearish VC
              </div>
              <div
                style={{
                  marginTop: 6,
                  color: "#f8fafc",
                  fontSize: 31,
                  fontWeight: 780,
                }}
              >
                The downside case
              </div>
            </div>
          </div>
          <Scale color="#f87171" size={32} />
        </div>
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 15 }}>
          {[
            "Forecast accuracy is unproven",
            "Integration risk is material",
            "Retention evidence is early",
          ].map((text) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                color: "#cbd5e1",
                fontSize: 21,
                fontWeight: 600,
              }}
            >
              <span
                style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: "#f87171" }}
              />
              {text}
            </div>
          ))}
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Founder rebuttal"
        style={{
          position: "absolute",
          top: 740,
          left: 690,
          display: "flex",
          width: 540,
          height: 108,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          border: "1px solid rgba(251,191,36,0.34)",
          borderRadius: 22,
          backgroundColor: "#17150e",
          color: "#fef3c7",
          fontSize: 27,
          fontWeight: 780,
          opacity: interpolate(frame, [58, 73], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [58, 78], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <MessageSquareText color="#fde68a" size={29} /> Founder rebuttal
      </Interactive.Div>

      <Interactive.Div
        name="Investment committee merge"
        style={{
          position: "absolute",
          top: 892,
          left: 724,
          display: "flex",
          width: 472,
          height: 92,
          alignItems: "center",
          justifyContent: "center",
          gap: 15,
          border: "1px solid rgba(167,139,250,0.38)",
          borderRadius: 999,
          backgroundColor: "rgba(167,139,250,0.09)",
          color: "#ddd6fe",
          fontSize: 25,
          fontWeight: 800,
          opacity: interpolate(frame, [82, 98], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [82, 103], [0.82, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <Scale size={27} /> Investment Committee
      </Interactive.Div>
    </SceneCanvas>
  );
}
