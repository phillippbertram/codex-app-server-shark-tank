import { Check, FileText } from "lucide-react";

export function EvidenceChip({ label, complete = false }: { label: string; complete?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        height: 54,
        alignItems: "center",
        gap: 12,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 15,
        backgroundColor: "rgba(255,255,255,0.055)",
        padding: "0 17px",
        color: "#cbd5e1",
        fontSize: 17,
        fontWeight: 650,
      }}
    >
      {complete ? <Check color="#34d399" size={19} /> : <FileText color="#7dd3fc" size={19} />}
      {label}
    </div>
  );
}
