export interface WasteReport {
  id: number;
  address: string;
  sectionNumber: string;
  usageNumber: string;
  responsible: string;
  caseHandler: string;
  totalWaste: number;
  buildingYear: number;
  deliveredDate: string;
  applicationPurpose: string;
  status: "Godkjent" | "Avslått" | "Under behandling";
  bra: number;
}
