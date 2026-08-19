import { CanvasImage } from "remotion";

export function AppScreenshot({
  src,
  name,
  width,
  height,
}: {
  src: string;
  name: string;
  width: number;
  height: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: 24,
        backgroundColor: "#0b1220",
        boxShadow: "0 34px 90px rgba(0,0,0,0.48), 0 0 0 1px rgba(56,189,248,0.05)",
      }}
    >
      <CanvasImage
        name={name}
        src={src}
        width={1177}
        height={768}
        fit="cover"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
