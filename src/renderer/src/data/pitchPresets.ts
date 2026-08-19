export type PitchPreset = {
  id: string;
  name: string;
  category: string;
  targetMarket: string;
  pitch: string;
};

export const defaultPitchPreset: PitchPreset = {
  id: "civicray",
  name: "CivicRay",
  category: "Vertical SaaS",
  targetMarket:
    "Residential solar installers completing 100–2,000 projects per year in fragmented U.S. permitting markets",
  pitch:
    "CivicRay is the permit operations platform for residential solar installers. It turns system designs and address data into jurisdiction-specific checklists and submission-ready permit packages, then learns from verified reviewer corrections to keep local requirements current. Over the last nine months, 24 paying installers processed 6,800 permits through CivicRay; 93% were accepted on the first submission versus 61% before adoption, and median preparation time fell from 110 to 18 minutes. CivicRay has $42k in monthly recurring revenue, 88% gross margin, 124% six-month net revenue retention, and 4.5-month customer acquisition payback. It charges a platform subscription plus a per-project fee and expands from permitting into inspections and utility interconnection.",
};

export const pitchPresets: PitchPreset[] = [
  defaultPitchPreset,
  {
    id: "ledgerlift",
    name: "LedgerLift",
    category: "B2B SaaS",
    targetMarket: "Small service businesses and agencies with 5–50 employees",
    pitch:
      "LedgerLift is an AI-assisted cash-flow workspace for small agencies and service businesses. It turns invoices, bank activity, and the project pipeline into a rolling 13-week forecast, flags upcoming cash gaps, and creates a prioritized collection plan for overdue invoices. Owners can model hiring and spending decisions without maintaining spreadsheets. LedgerLift starts with accounting integrations, charges a monthly subscription, and grows through partnerships with accountants and fractional CFOs.",
  },
];
