export type PitchPreset = {
  id: string;
  name: string;
  category: string;
  targetMarket: string;
  pitch: string;
};

export const defaultPitchPreset: PitchPreset = {
  id: "doggo",
  name: "Doggo",
  category: "Consumer marketplace",
  targetMarket: "Urban dog owners and independent pet-care providers",
  pitch:
    "Doggo is a trusted marketplace that helps urban dog owners find vetted, available walkers in minutes. Owners get consistent care, live walk updates, and simple recurring bookings; independent walkers get predictable local demand and tools to run their business. We start neighborhood by neighborhood, charge a fee on each booking, and build trust through verified identities, service history, and transparent quality signals.",
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
