import {
  Bot,
  BriefcaseBusiness,
  FileStack,
  HelpCircle,
  PackageSearch,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { EvidenceChip } from "../components/EvidenceChip";
import { FlowCard } from "../components/FlowCard";
import { SceneCanvas } from "../components/SceneCanvas";

export function AnalysisScene() {
  const frame = useCurrentFrame();

  return (
    <SceneCanvas glow="sky">
      <Interactive.Div
        name="Analysis heading"
        style={{
          position: "absolute",
          top: 76,
          right: 110,
          left: 110,
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [0, 18], ["0px -24px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 210 }),
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 11,
            color: "#7dd3fc",
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <Bot size={23} /> 02 · Independent analysis
        </div>
        <h2
          style={{
            margin: "24px auto 0",
            color: "#f8fafc",
            fontSize: 80,
            fontWeight: 820,
            letterSpacing: "-0.052em",
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          Fresh Codex threads. Shared evidence.
        </h2>
        <p
          style={{
            margin: "22px auto 0",
            color: "#94a3b8",
            fontSize: 27,
            textAlign: "center",
          }}
        >
          Specialists work independently, then hand conclusions forward through files.
        </p>
      </Interactive.Div>

      <Interactive.Svg
        name="Workflow connectors"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <Interactive.Path
          name="Market to parallel analysis"
          d="M 347 590 C 420 590, 440 475, 510 475 M 347 590 C 420 590, 440 700, 510 700"
          fill="none"
          pathLength={1}
          stroke="rgba(56,189,248,0.72)"
          strokeDasharray={1}
          strokeDashoffset={interpolate(frame, [18, 42], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          strokeLinecap="round"
          strokeWidth={4}
        />
        <Interactive.Path
          name="Parallel analysis to risk"
          d="M 790 475 C 865 475, 875 590, 946 590 M 790 700 C 865 700, 875 590, 946 590"
          fill="none"
          pathLength={1}
          stroke="rgba(52,211,153,0.72)"
          strokeDasharray={1}
          strokeDashoffset={interpolate(frame, [42, 68], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          strokeLinecap="round"
          strokeWidth={4}
        />
        <Interactive.Path
          name="Risk to questions"
          d="M 1216 590 L 1322 590"
          fill="none"
          pathLength={1}
          stroke="rgba(56,189,248,0.72)"
          strokeDasharray={1}
          strokeDashoffset={interpolate(frame, [67, 82], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          strokeLinecap="round"
          strokeWidth={4}
        />
        <Interactive.Path
          name="Questions to evidence"
          d="M 1572 590 L 1658 590"
          fill="none"
          pathLength={1}
          stroke="rgba(167,139,250,0.72)"
          strokeDasharray={1}
          strokeDashoffset={interpolate(frame, [83, 98], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          strokeLinecap="round"
          strokeWidth={4}
        />
      </Interactive.Svg>

      <Interactive.Div
        name="Market Scout card"
        style={{
          position: "absolute",
          top: 527,
          left: 98,
          opacity: interpolate(frame, [8, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [8, 27], [0.78, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <FlowCard icon={SearchCheck} label="Market Scout" eyebrow="Research" tone="sky" />
      </Interactive.Div>

      <Interactive.Div
        name="Business Model Analyst card"
        style={{
          position: "absolute",
          top: 412,
          left: 510,
          opacity: interpolate(frame, [24, 38], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [24, 43], [0.78, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <FlowCard
          icon={BriefcaseBusiness}
          label="Business Model"
          eyebrow="Codex thread A"
          tone="emerald"
          width={280}
        />
      </Interactive.Div>

      <Interactive.Div
        name="Product Strategist card"
        style={{
          position: "absolute",
          top: 637,
          left: 510,
          opacity: interpolate(frame, [28, 42], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [28, 47], [0.78, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <FlowCard
          icon={PackageSearch}
          label="Product Strategy"
          eyebrow="Codex thread B"
          tone="emerald"
          width={280}
        />
      </Interactive.Div>

      <Interactive.Div
        name="Risk and Diligence card"
        style={{
          position: "absolute",
          top: 527,
          left: 946,
          opacity: interpolate(frame, [52, 67], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [52, 72], [0.78, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <FlowCard
          icon={ShieldCheck}
          label="Risk & Diligence"
          eyebrow="Challenge"
          tone="sky"
          width={270}
        />
      </Interactive.Div>

      <Interactive.Div
        name="Committee Questions card"
        style={{
          position: "absolute",
          top: 527,
          left: 1322,
          opacity: interpolate(frame, [72, 87], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [72, 92], [0.78, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <FlowCard
          icon={HelpCircle}
          label="Committee Questions"
          eyebrow="Synthesis"
          tone="violet"
          width={250}
        />
      </Interactive.Div>

      <Interactive.Div
        name="Evidence stack"
        style={{
          position: "absolute",
          top: 438,
          right: 72,
          width: 208,
          opacity: interpolate(frame, [92, 108], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [92, 112], ["36px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 190 }),
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
            color: "#c4b5fd",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
          }}
        >
          <FileStack size={19} /> Shared record
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <EvidenceChip label="market.md" />
          <EvidenceChip label="business.md" />
          <EvidenceChip label="product.md" />
          <EvidenceChip label="risks.md" />
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Parallel work badge"
        style={{
          position: "absolute",
          bottom: 90,
          left: 640,
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1px solid rgba(52,211,153,0.2)",
          borderRadius: 999,
          backgroundColor: "rgba(52,211,153,0.07)",
          padding: "13px 20px",
          color: "#a7f3d0",
          fontSize: 18,
          fontWeight: 750,
          opacity: interpolate(frame, [112, 130], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [112, 136], [0.86, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            backgroundColor: "#34d399",
            boxShadow: "0 0 16px rgba(52,211,153,0.7)",
          }}
        />
        Two specialists can run in parallel
      </Interactive.Div>
    </SceneCanvas>
  );
}
