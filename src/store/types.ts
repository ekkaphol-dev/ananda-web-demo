export type Side = "rent" | "invest";
export type Role = "admin" | "sale_invest" | "sale_rent";

export type Unit = { id: string; label: string; type: "studio" | "one_bed" | "two_bed"; sqm: number };

export type Room = {
  id: string;
  zone: string;
  unitId: string;
  type: "studio" | "one_bed" | "two_bed";
  sqm: number;
  floor: number;
  price: number;
  availableFrom: string;
  furniture: string;
  minLease: number;
  pets?: boolean;
};

export type TenantProfile = {
  budgetMin: number;
  budgetMax: number;
  types: string[];
  zones: string[];
  commute: string;
  lifestyle: string[];
  moveIn: string;
  lease: number;
  persona: string | null;
};

export type Tenant = TenantProfile & { id: string; name: string };

export type User = { id: string; name: string; email: string; role: Role; active: boolean };

export type HistoryItem = { at: string; by: string; text: string };

type LeadBase = {
  id: string;
  ref: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  assignee: string | null;
  createdAt: string;
  contactTime: string;
  consentAt?: string;
  /** ที่มาของลีด (gclid / UTM) ใช้วัดผลแคมเปญ */
  attribution?: import("@/utils/attribution").Attribution;
  note: string;
  reason: string;
  matchConfirmed?: boolean;
  isNew?: boolean;
  history: HistoryItem[];
};

export type RentLead = LeadBase & { side: "rent"; profile: TenantProfile; items: string[] };
export type InvestItem = { zone: string; unitId: string };
export type InvestLead = LeadBase & { side: "invest"; items: InvestItem[]; budget: string; purpose: string };
export type Lead = RentLead | InvestLead;

export type AppState = {
  version: 1;
  rooms: Room[];
  tenants: Tenant[];
  owners: unknown[];
  users: User[];
  leads: Lead[];
  session: { userId: string; at: string } | null;
  rr: Record<Side, number>;
  seededAt: string;
};

export type StatusDef = { id: string; label: string; cls: string };
