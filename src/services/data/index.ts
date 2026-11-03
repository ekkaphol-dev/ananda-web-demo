// รวมข้อมูลตลาดจริง (01_DATA) + ตรรกะจับคู่จากเดโม RentMatch
// ไฟล์ .js ในโฟลเดอร์นี้คัดลอกจาก 03_WEBAPP_FINAL โดยเปลี่ยนแค่ตัวห่อ (IIFE → export function install)
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MARKET } from "./market-data";
import { install as installCatalog } from "./catalog";
import { install as installMatching } from "./matching";
import { install as installSeed } from "./seed";
import type { Room, Tenant, Unit } from "@/store/types";

const root: any = { MARKET };
installCatalog(root);
installMatching(root);
installSeed(root);

export type ZoneId = "thonglor" | "chula" | "phrakhanong" | "rama9";
export type RoomType = "studio" | "one_bed" | "two_bed";
export type RentBand = { low: number; high: number; avg?: number };
export type MatchResult = { score: number; pos: string[]; neg: string[]; isMatch: boolean };

export type Project = {
  name: string;
  stations: { name: string; m: number }[];
  unitCount: number;
  units: Unit[];
  priceFrom: string;
  commonFee: number;
};

export const MK: any = MARKET;

export const C = root.CATALOG as {
  ZONE_IDS: ZoneId[];
  PROJECTS: Record<ZoneId, Project>;
  TYPE_LABEL: Record<RoomType, string>;
  LIFESTYLES: { id: string; label: string }[];
  VISUAL: Record<ZoneId, Partial<Record<RoomType, { imgs: string[]; pano: string }>>>;
  getUnit: (zone: string, unitId: string) => Unit;
  rentBand: (zone: string, unit: Unit) => RentBand;
};

export const M = root.MATCHING as {
  match: (q: any, room: Room) => MatchResult;
};

export const SEED = root.SEED as {
  build: () => { rooms: Room[]; tenants: Tenant[]; owners: unknown[] };
  addDays: (n: number) => string;
};
