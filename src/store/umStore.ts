// Urban Match · สถานะเดโม (ห้อง ผู้เช่ารอ ลีด ผู้ใช้ทีมงาน)
// ฟังก์ชันในไฟล์นี้เป็น reducer แบบ "แก้ draft" — AppContext โคลน state ก่อนเรียกทุกครั้ง
import { SEED } from "@/services/data";
import { DEMO_PASSWORD, USERS } from "./constants";
import type { AppState, InvestItem, InvestLead, Lead, RentLead, Room, Side, Tenant, TenantProfile } from "./types";

const ago = (d: number, h?: number) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h || 10, 15, 0, 0);
  return t.toISOString();
};

function seedLeads(rooms: Room[], tenants: Tenant[]): Lead[] {
  const roomOf = (zone: string, i: number) => rooms.filter((r) => r.zone === zone)[i].id;
  const tp = (id: string): TenantProfile => {
    const t = tenants.find((x) => x.id === id)!;
    return { budgetMin: t.budgetMin, budgetMax: t.budgetMax, types: t.types, zones: t.zones, commute: t.commute, lifestyle: t.lifestyle, moveIn: t.moveIn, lease: t.lease, persona: t.persona };
  };
  const L: Lead[] = [];
  let r = 1;
  let v = 1;
  const created = (at: string) => [{ at, by: "ระบบ", text: "ลงทะเบียนผ่านเว็บ · มอบหมายอัตโนมัติ" }];
  const rent = (name: string, phone: string, email: string, tid: string, items: string[], status: string, assignee: string, d: number, extra: Partial<RentLead> = {}) =>
    L.push({ id: "R" + r, ref: "UM-R-" + String(1000 + r++), side: "rent", name, phone, email, profile: tp(tid), items, status, assignee, createdAt: ago(d, 9 + d), contactTime: "เย็น 17:00–20:00", matchConfirmed: status === "walk" || status === "won", note: "", reason: "", history: created(ago(d, 9 + d)), ...extra });
  const inv = (name: string, phone: string, email: string, items: InvestItem[], status: string, assignee: string, d: number, extra: Partial<InvestLead> = {}) =>
    L.push({ id: "I" + v, ref: "UM-I-" + String(1000 + v++), side: "invest", name, phone, email, items, status, assignee, createdAt: ago(d, 11 + d), budget: "5–8 ล้านบาท", purpose: "ซื้อเพื่อปล่อยเช่า", contactTime: "กลางวัน 10:00–17:00", note: "", reason: "", history: created(ago(d, 11 + d)), ...extra });

  rent("หมอเจ (นามสมมติ)", "0812345671", "drj@example.com", "t_chula_medical", [roomOf("chula", 1), roomOf("chula", 0)], "walk", "u_rent1", 2, { note: "สะดวกดูห้องหลังเลิกเวร 17:00" });
  rent("แบม (นามสมมติ)", "0812345672", "bam@example.com", "t_phrakhanong_first_jobber", [roomOf("phrakhanong", 1)], "new", "u_rent2", 0);
  rent("คุณนัท (นามสมมติ)", "0812345673", "nat@example.com", "t_rama9_cbd_worker", [roomOf("rama9", 0), roomOf("rama9", 1)], "contacted", "u_rent1", 1);
  rent("พลอย (นามสมมติ)", "0812345674", "ploy@example.com", "t_thonglor_thai_creative", [roomOf("thonglor", 0)], "won", "u_rent2", 9, { matchConfirmed: true });
  rent("Mr. Li (นามสมมติ)", "0812345675", "li@example.com", "t_rama9_chinese_professional", [roomOf("rama9", 3)], "new", "u_rent1", 0);
  rent("คุณเอ็ม (นามสมมติ)", "0812345676", "m@example.com", "t_chula_silom_worker", [roomOf("chula", 2)], "lost", "u_rent2", 6, { reason: "ได้ห้อง/โครงการอื่นแล้ว" });

  inv("คุณธนา (นามสมมติ)", "0898765431", "thana@example.com", [{ zone: "chula", unitId: "ch_1br" }], "walk", "u_inv1", 3, { note: "สนใจห้อง Loft ใกล้ รพ.จุฬาฯ ขอดูคิวผู้เช่าจริง" });
  inv("คุณมาลี (นามสมมติ)", "0898765432", "malee@example.com", [{ zone: "phrakhanong", unitId: "pk_ns" }, { zone: "phrakhanong", unitId: "pk_plus" }], "new", "u_inv2", 0, { budget: "4–6 ล้านบาท" });
  inv("คุณภาคิน (นามสมมติ)", "0898765433", "pakin@example.com", [{ zone: "thonglor", unitId: "th_hybrid" }], "booked", "u_inv1", 7, { budget: "มากกว่า 8 ล้านบาท" });
  inv("คุณวรินทร์ (นามสมมติ)", "0898765434", "warin@example.com", [{ zone: "rama9", unitId: "r9_1br" }], "contacted", "u_inv2", 2, { budget: "ไม่เกิน 4 ล้านบาท" });
  inv("คุณศิริพร (นามสมมติ)", "0898765435", "siri@example.com", [{ zone: "chula", unitId: "ch_2br" }], "won", "u_inv1", 12, { budget: "มากกว่า 8 ล้านบาท" });
  inv("คุณกิตติ (นามสมมติ)", "0898765436", "kitti@example.com", [{ zone: "rama9", unitId: "r9_studio" }], "lost", "u_inv2", 8, { reason: "ยังไม่รีบตัดสินใจ" });
  return L;
}

// ทุกโครงการในแคมเปญไม่อนุญาตเลี้ยงสัตว์ จึงตัดข้อมูลสัตว์เลี้ยงออกจากห้องและผู้เช่าตัวอย่าง
function noPets(b: { rooms: Room[]; tenants: Tenant[]; owners: unknown[] }) {
  b.rooms.forEach((r) => { r.pets = false; });
  b.tenants.forEach((t) => {
    t.lifestyle = (t.lifestyle || []).filter((x) => x !== "pet");
    t.name = t.name.replace(/\s*\+\s*(สุนัข|แมว)\s*\d*\s*ตัว/, "");
  });
  return b;
}

export function buildState(): AppState {
  const b = noPets(SEED.build());
  return { version: 1, rooms: b.rooms, tenants: b.tenants, owners: b.owners, users: USERS.map((u) => ({ ...u })), leads: seedLeads(b.rooms, b.tenants), session: null, rr: { rent: 0, invest: 0 }, seededAt: new Date().toISOString() };
}

export const findUser = (s: AppState, id: string | null) => s.users.find((u) => u.id === id);
export const currentUser = (s: AppState) => (s.session ? findUser(s, s.session.userId) ?? null : null);

// มอบหมายลีดแบบวนรอบให้เซลส์ของฝั่งนั้นที่ยังเปิดใช้งาน
function nextAssignee(s: AppState, side: Side) {
  const role = side === "rent" ? "sale_rent" : "sale_invest";
  const pool = s.users.filter((u) => u.role === role && u.active);
  if (!pool.length) return null;
  const k = s.rr[side] % pool.length;
  s.rr[side]++;
  return pool[k].id;
}

export type NewRentLead = Pick<RentLead, "name" | "phone" | "email" | "contactTime" | "note" | "items" | "profile">;
export type NewInvestLead = Pick<InvestLead, "name" | "phone" | "email" | "contactTime" | "items" | "budget" | "purpose">;

export function addLead(s: AppState, side: "rent", data: NewRentLead): Lead;
export function addLead(s: AppState, side: "invest", data: NewInvestLead): Lead;
export function addLead(s: AppState, side: Side, data: NewRentLead | NewInvestLead): Lead {
  const n = s.leads.filter((l) => l.side === side).length + 1;
  const assignee = nextAssignee(s, side);
  const now = new Date().toISOString();
  const lead = {
    note: "",
    ...data,
    id: (side === "rent" ? "R" : "I") + Date.now().toString(36),
    ref: (side === "rent" ? "UM-R-" : "UM-I-") + String(1000 + n),
    side,
    status: "new",
    assignee,
    createdAt: now,
    consentAt: now,
    reason: "",
    matchConfirmed: false,
    isNew: true,
    history: [{ at: now, by: "ระบบ", text: "ลงทะเบียนผ่านเว็บ · มอบหมายให้ " + (assignee ? findUser(s, assignee)!.name : "ยังไม่มีเซลส์") }],
  } as Lead;
  s.leads.unshift(lead);
  return lead;
}

export function updateLead(s: AppState, id: string, patch: Partial<Lead>, by: string, text?: string) {
  const l = s.leads.find((x) => x.id === id);
  if (!l) return;
  Object.assign(l, patch);
  l.isNew = false;
  if (text) l.history.unshift({ at: new Date().toISOString(), by, text });
}

export function login(s: AppState, email: string, pw: string) {
  const u = s.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  if (!u || pw !== DEMO_PASSWORD) return { ok: false as const, msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  if (!u.active) return { ok: false as const, msg: "บัญชีนี้ถูกปิดใช้งาน ติดต่อแอดมิน" };
  s.session = { userId: u.id, at: new Date().toISOString() };
  return { ok: true as const, user: u };
}
