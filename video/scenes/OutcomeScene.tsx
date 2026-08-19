import { CheckCircle2, FileCheck2, FileText, SearchCheck, ShieldCheck } from "lucide-react";
import {
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { EvidenceChip } from "../components/EvidenceChip";
import { SceneCanvas } from "../components/SceneCanvas";

export function OutcomeScene() {
  const frame = useCurrentFrame();

  return (
    <SceneCanvas glow="mixed">
      <Interactive.Div
        name="Outcome copy"
        style={{
          position: "absolute",
          top: 122,
          left: 128,
          width: 790,
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [0, 22], ["-42px 0px", "0px 0px"], {
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
            color: "#c4b5fd",
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <FileCheck2 size={23} /> 05 · Final committee decision
        </div>
        <h2
          style={{
            margin: "28px 0 0",
            color: "#f8fafc",
            fontSize: 86,
            fontWeight: 840,
            letterSpacing: "-0.055em",
            lineHeight: 1.01,
          }}
        >
          One auditable
          <span style={{ display: "block", color: "#ddd6fe" }}>investment memo.</span>
        </h2>
        <p
          style={{
            width: 680,
            margin: "28px 0 0",
            color: "#aab7c9",
            fontSize: 29,
            lineHeight: 1.46,
          }}
        >
          Every conclusion remains linked to the complete decision record.
        </p>
      </Interactive.Div>

      <Interactive.Div
        name="Neutral verdict"
        style={{
          position: "absolute",
          top: 610,
          left: 126,
          display: "flex",
          width: 790,
          alignItems: "center",
          gap: 26,
          opacity: interpolate(frame, [30, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            border: "1px solid rgba(52,211,153,0.32)",
            borderRadius: 24,
            backgroundColor: "rgba(52,211,153,0.08)",
            padding: "30px 35px",
            color: "#6ee7b7",
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: "-0.045em",
            scale: interpolate(frame, [30, 56], [0.76, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 170 }),
              output: "perceptual-scale",
            }),
            translate: interpolate(frame, [30, 54], ["-50px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 180 }),
            }),
          }}
        >
          INVEST
        </div>
        <div
          style={{
            color: "#64748b",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          or
        </div>
        <div
          style={{
            border: "1px solid rgba(248,113,113,0.32)",
            borderRadius: 24,
            backgroundColor: "rgba(248,113,113,0.08)",
            padding: "30px 35px",
            color: "#fca5a5",
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: "-0.045em",
            scale: interpolate(frame, [34, 60], [0.76, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 170 }),
              output: "perceptual-scale",
            }),
            translate: interpolate(frame, [34, 58], ["50px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 180 }),
            }),
          }}
        >
          PASS
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Investment memo card"
        style={{
          position: "absolute",
          top: 96,
          right: 122,
          width: 744,
          height: 820,
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 30,
          backgroundColor: "rgba(13,20,33,0.94)",
          boxShadow: "0 38px 100px rgba(0,0,0,0.46)",
          padding: "38px 42px",
          opacity: interpolate(frame, [8, 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [8, 34], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 190 }),
            output: "perceptual-scale",
          }),
          translate: interpolate(frame, [8, 30], ["45px 0px", "0px 0px"], {
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
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.09)",
            paddingBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                width: 58,
                height: 58,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 17,
                backgroundColor: "rgba(167,139,250,0.12)",
                color: "#c4b5fd",
              }}
            >
              <FileText size={29} />
            </div>
            <div>
              <div style={{ color: "#f8fafc", fontSize: 31, fontWeight: 800 }}>Investment memo</div>
              <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 18 }}>
                Synthesized from the complete record
              </div>
            </div>
          </div>
          <CheckCircle2 color="#34d399" size={34} />
        </div>

        <div
          style={{
            marginTop: 29,
            color: "#94a3b8",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Decision record
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          {[
            "Founder pitch",
            "Market analysis",
            "Business model",
            "Product strategy",
            "Risk & diligence",
            "Founder Q&A",
            "Bull case",
            "Bear case",
          ].map((label, index) => (
            <div
              key={label}
              style={{
                opacity: interpolate(frame, [32 + index * 4, 44 + index * 4], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: interpolate(
                  frame,
                  [32 + index * 4, 48 + index * 4],
                  ["0px 16px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({ damping: 190 }),
                  },
                ),
              }}
            >
              <EvidenceChip label={label} complete />
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 28,
            border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: 20,
            backgroundColor: "rgba(52,211,153,0.06)",
            padding: "20px 22px",
            color: "#d1fae5",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          <SearchCheck color="#34d399" size={26} /> Inspect every artifact and agent event
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Final brand line"
        style={{
          position: "absolute",
          right: 122,
          bottom: 46,
          left: 128,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.09)",
          paddingTop: 21,
          opacity: interpolate(frame, [92, 112], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 13,
            color: "#cbd5e1",
            fontSize: 21,
            fontWeight: 700,
          }}
        >
          <ShieldCheck color="#6ee7b7" size={25} /> Visible orchestration. Human judgment.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <CanvasImage
            name="Small Startup Shark Tank logo"
            src={staticFile("remotion/startup-shark-tank-logo.png")}
            width={640}
            height={640}
            fit="contain"
            style={{ width: 52, height: 52 }}
          />
          <div>
            <div style={{ color: "#f8fafc", fontSize: 21, fontWeight: 820 }}>
              Startup Shark Tank
            </div>
            <div
              style={{
                marginTop: 4,
                color: "#64748b",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
              }}
            >
              Powered by Codex App Server
            </div>
          </div>
        </div>
      </Interactive.Div>
    </SceneCanvas>
  );
}
