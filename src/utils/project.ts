// ตัวช่วยเกี่ยวกับโครงการ/ห้อง/ลีด ที่หลายหน้าใช้ร่วมกัน
import { C, MK } from "@/services/data";
import { INVEST_STATUS, RENT_STATUS } from "@/store/constants";
import type { AppState, Lead, Room, Side, Unit } from "@/store/types";
import { r10k, r500 } from "./format";

export const ZN: Record<string, string> = {
  thonglor: "Culture Thonglor",
  chula: "Culture Chula",
  phrakhanong: "IDEO Sukhumvit - Rama 4",
  rama9: "IDEO Rama 9 - Asoke",
};
const PIMG: Record<string, string> = { thonglor: "thonglor", chula: "chula", phrakhanong: "rama4", rama9: "rama9" };

export const projectImg = (zone: string) => `/assets/projects/${PIMG[zone]}.webp`;
export const roomPhoto = (name: string) => `/assets/rooms/${name}.jpg`;

const compRow = (key: string, z: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MK.comparison.rows.find((r: any) => r.key === key).values[z].value;
export const yieldOf = (z: string) => compRow("gross_yield", z);
export const netYieldOf = (z: string) => compRow("net_yield", z);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const zoneOf = (z: string): any => MK.zones.find((x: { id: string }) => x.id === z);

export const roomVisual = (room: Room) => (C.VISUAL as Record<string, Record<string, { imgs: string[]; pano: string }>>)[room.zone]?.[room.type];
export const roomImg = (room: Room) => {
  const v = roomVisual(room);
  return v ? roomPhoto(v.imgs[0]) : "";
};

export const statusList = (side: Side) => (side === "rent" ? RENT_STATUS : INVEST_STATUS);

export const itemsText = (s: AppState, l: Lead) =>
  l.side === "rent"
    ? l.items.map((id) => {
        const r = s.rooms.find((x) => x.id === id);
        return r ? `${ZN[r.zone]} ${id}` : id;
      })
    : l.items.map((it) => `${ZN[it.zone]} · ${C.getUnit(it.zone, it.unitId).label}`);

// คิวผู้เช่า = ผู้เช่าตัวอย่าง + ลีดผู้เช่าที่ยังเปิดอยู่ ที่งบ/ทำเล/ประเภทตรงแบบห้อง
export function demandFor(s: AppState, zone: string, unit: Unit) {
  const b = C.rentBand(zone, unit);
  const pool = s.tenants
    .map((t) => ({ zones: t.zones, types: t.types, budgetMin: t.budgetMin, budgetMax: t.budgetMax }))
    .concat(s.leads.filter((l) => l.side === "rent" && l.status !== "won" && l.status !== "lost").map((l) => (l.side === "rent" ? l.profile : null)!));
  const q = pool.filter((t) => (!t.zones.length || t.zones.includes(zone)) && (!t.types.length || t.types.includes(unit.type)) && t.budgetMax >= b.low && t.budgetMin <= b.high).length;
  const supply = s.rooms.filter((r) => r.zone === zone && r.type === unit.type).length;
  return { q, supply, ratio: supply ? q / supply : q, band: b };
}

// รายงานลีดแยกตามโครงการ / ประเภทห้อง · ลีดที่เลือกหลายโครงการหรือหลายแบบ นับในทุกกลุ่มที่เลือก
export function leadDims(s: AppState, l: Lead) {
  const zone = new Set<string>();
  const type = new Set<string>();
  if (l.side === "rent")
    l.items.forEach((id) => {
      const r = s.rooms.find((x) => x.id === id);
      if (r) { zone.add(r.zone); type.add(r.type); }
    });
  else
    l.items.forEach((it) => {
      zone.add(it.zone);
      const u = C.getUnit(it.zone, it.unitId);
      if (u) type.add(u.type);
    });
  return { zone, type };
}

// ---------- คำนวณผลตอบแทนคร่าวๆ: ราคาเริ่มจากราคาขายมือสอง (ประกาศ) ต่อ ตร.ม. × ขนาด, ค่าเช่าเริ่มจากค่าเฉลี่ยประกาศของแบบห้อง
export type CalcState = { price: number; pMin: number; pMax: number; rent: number; rMin: number; rMax: number };

function salePsm(zone: string): { avg: number; low: number; high: number } {
  return (zoneOf(zone).sale_price || []).find((x: { label: string; avg?: number }) => /มือสอง/.test(x.label) && x.avg);
}
export function calcInit(zone: string, unit: Unit): CalcState {
  const s = salePsm(zone);
  const b = C.rentBand(zone, unit);
  return {
    price: r10k(s.avg * unit.sqm),
    pMin: r10k(s.low * unit.sqm * 0.9),
    pMax: r10k(s.high * unit.sqm * 1.1),
    rent: r500(b.avg || (b.low + b.high) / 2),
    rMin: b.low,
    rMax: b.high,
  };
}
export function calcNums(zone: string, unit: Unit, c: CalcState) {
  const annual = c.rent * 12;
  const fee = (C.PROJECTS[zone as keyof typeof C.PROJECTS].commonFee || 0) * unit.sqm * 12;
  return { annual, fee, gross: (annual / c.price) * 100, net: ((annual - fee) / c.price) * 100 };
}
