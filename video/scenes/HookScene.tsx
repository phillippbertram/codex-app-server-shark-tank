import type { LucideIcon } from "lucide-react";
import { Bot, FileCheck2, MessageSquareQuote, Rocket } from "lucide-react";
import {
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SceneCanvas } from "../components/SceneCanvas";

export function HookScene() {
  const frame = useCurrentFrame();
  const journeySteps: Array<[LucideIcon, string]> = [
    [Rocket, "Pitch"],
    [Bot, "Independent analysis"],
    [MessageSquareQuote, "Founder input"],
    [FileCheck2, "Auditable verdict"],
  ];

  return (
    <SceneCanvas glow="emerald">
      <Interactive.Div
        name="Brand lockup"
        style={{
          position: "absolute",
          top: 196,
          left: 142,
          width: 430,
          height: 430,
          opacity: interpolate(frame, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 20], [0.78, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
            output: "perceptual-scale",
          }),
          rotate: interpolate(frame, [0, 24], ["-4deg", "0deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 180 }),
          }),
        }}
      >
        <CanvasImage
          name="Startup Shark Tank logo"
          src={staticFile("remotion/startup-shark-tank-logo.png")}
          width={640}
          height={640}
          fit="contain"
          style={{ width: "100%", height: "100%" }}
        />
      </Interactive.Div>

      <Interactive.Div
        name="Opening copy"
        style={{
          position: "absolute",
          top: 212,
          left: 682,
          width: 1080,
          opacity: interpolate(frame, [8, 24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [8, 26], ["48px 0px", "0px 0px"], {
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
            gap: 12,
            border: "1px solid rgba(52,211,153,0.24)",
            borderRadius: 999,
            backgroundColor: "rgba(52,211,153,0.09)",
            padding: "11px 18px",
            color: "#6ee7b7",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <Bot size={21} /> Codex App Server workflow
        </div>
        <h1
          style={{
            margin: "30px 0 0",
            color: "#f8fafc",
            fontSize: 92,
            fontWeight: 820,
            letterSpacing: "-0.055em",
            lineHeight: 0.99,
          }}
        >
          From startup pitch to
          <span
            style={{
              display: "block",
              color: "#6ee7b7",
            }}
          >
            investment decision.
          </span>
        </h1>
        <p
          style={{
            width: 850,
            margin: "30px 0 0",
            color: "#aab7c9",
            fontSize: 32,
            fontWeight: 450,
            lineHeight: 1.45,
          }}
        >
          A visible, human-guided committee of specialized Codex agents.
        </p>
      </Interactive.Div>

      <Interactive.Div
        name="Journey steps"
        style={{
          position: "absolute",
          right: 142,
          bottom: 108,
          left: 142,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: interpolate(frame, [28, 44], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [28, 48], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
          }),
        }}
      >
        {journeySteps.map(([Icon, label], index) => (
          <div key={String(label)} style={{ display: "contents" }}>
            <div
              style={{
                display: "flex",
                minWidth: 280,
                alignItems: "center",
                gap: 15,
                border: "1px solid rgba(255,255,255,0.11)",
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.045)",
                padding: "18px 22px",
                color: "#dbe4ef",
                fontSize: 21,
                fontWeight: 700,
              }}
            >
              <Icon color={index === 2 ? "#fde68a" : "#6ee7b7"} size={24} />
              {String(label)}
            </div>
            {index < 3 ? (
              <div
                style={{
                  width: 84,
                  height: 2,
                  overflow: "hidden",
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#34d399",
                    transformOrigin: "left center",
                    scale: `${interpolate(frame, [38 + index * 6, 52 + index * 6], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })} 1`,
                  }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </Interactive.Div>
    </SceneCanvas>
  );
}
