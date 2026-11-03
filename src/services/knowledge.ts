// ข้อมูลโครงการ "ที่เป็นข้อมูลจริง" สำหรับ SEO / AI (หน้าโครงการ, FAQ, JSON-LD, llms.txt)
// ดึงจาก 01_DATA (market-data) เท่านั้น — ไม่ใช้ห้อง ผู้เช่า หรือลีดจำลอง
// ทุกตัวเลขพกสถานะ verified / estimate / analysis ไปด้วย เพื่อไม่ให้ AI หยิบค่าประมาณไปตอบเหมือนข้อเท็จจริง
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PROJECT_SLUGS } from "@/utils/site";
import { MK } from "./data";

export type Status = "verified" | "estimate" | "analysis" | "not_found";
export type Fact = { label: string; value: string; status: Status; note?: string; src: string[] };
export type Source = { id: string; name: string; url?: string; accessed?: string };

export const STATUS_TH: Record<Status, string> = {
  verified: "ยืนยันจากแหล่งอ้างอิง",
  estimate: "ประมาณการ",
  analysis: "บทวิเคราะห์",
  not_found: "ไม่พบข้อมูล",
};

export type ProjectKnowledge = {
  zone: string;
  slug: string;
  name: string;
  officialUrl: string;
  area: string;
  summary: string;
  address?: string;
  units?: number;
  transit: { station: string; distance: string; status: Status }[];
  facts: Fact[];
  compare: Fact[];
  highlights: { text: string; status: Status }[];
  sellingPoints: { text: string; status: Status }[];
  investorFit?: string;
  personas: { name: string; occupation?: string; budget?: string }[];
};

const ZONE_ORDER = ["thonglor", "chula", "phrakhanong", "rama9"];
const str = (v: unknown) => (v == null ? "" : typeof v === "number" ? v.toLocaleString("en-US") : String(v));

function project(z: any): ProjectKnowledge {
  const p = z.project;
  const facts: Fact[] = (p.facts || [])
    .filter((f: any) => f.status !== "not_found" && f.value != null)
    .map((f: any) => ({ label: f.label, value: `${str(f.value)}${f.unit ? ` ${f.unit}` : ""}`, status: f.status, note: f.note, src: f.src || [] }));
  const compare: Fact[] = MK.comparison.rows
    .map((r: any) => ({ r, v: r.values[z.id] }))
    .filter(({ v }: any) => v && v.status !== "not_found" && v.value != null)
    .map(({ r, v }: any) => ({ label: r.label, value: str(v.value), status: v.status, note: v.method || v.note, src: v.src || [] }));
  const get = (k: string) => (p.facts || []).find((f: any) => f.key === k)?.value;
  return {
    zone: z.id,
    slug: p.slug,
    name: p.name,
    officialUrl: p.official_url,
    area: z.zone_name_th || z.zone_name_en,
    summary: z.summary,
    address: get("address"),
    units: typeof get("units") === "number" ? get("units") : undefined,
    transit: (z.transit || []).map((t: any) => ({ station: t.station, distance: t.value, status: t.status })),
    facts,
    compare,
    highlights: (p.highlights || []).map((h: any) => ({ text: h.text, status: h.status })),
    sellingPoints: (z.top_selling_points || []).map((h: any) => ({ text: h.text, status: h.status })),
    investorFit: z.investor_fit,
    personas: (z.personas || []).map((x: any) => ({
      name: x.name_th,
      occupation: x.occupation,
      budget: x.rent_budget_thb ? `${str(x.rent_budget_thb.min)}–${str(x.rent_budget_thb.max)} บาท/เดือน` : undefined,
    })),
  };
}

export const PROJECTS_K: ProjectKnowledge[] = ZONE_ORDER.map((id) => project(MK.zones.find((z: any) => z.id === id)));
if (PROJECTS_K.map((p) => p.slug).join() !== PROJECT_SLUGS.join()) {
  throw new Error(`PROJECT_SLUGS ใน utils/site.ts ไม่ตรงกับข้อมูลโครงการ: ${PROJECTS_K.map((p) => p.slug).join(", ")}`);
}

export const projectBySlug = (slug: string) => PROJECTS_K.find((p) => p.slug === slug);
export const projectByZone = (zone: string) => PROJECTS_K.find((p) => p.zone === zone)!;

export const SOURCES: Source[] = (MK.sources || []).map((s: any) => ({ id: s.id, name: s.name, url: s.url, accessed: s.accessed }));
export const sourcesFor = (ids: string[]) => SOURCES.filter((s) => ids.includes(s.id));

export const DATA_DATE: string = MK.meta?.prepared_date ?? "";

const row = (key: string, zone: string) => {
  const v = MK.comparison.rows.find((r: any) => r.key === key)?.values?.[zone];
  return v && v.status !== "not_found" ? str(v.value) : "";
};

// ---------- คำถามที่พบบ่อย (คำตอบสร้างจากข้อมูลจริงเท่านั้น)
export type QA = { q: string; a: string };

export function faq(): QA[] {
  const P = PROJECTS_K;
  const list = (fn: (p: ProjectKnowledge) => string) => P.map((p) => `${p.name}: ${fn(p)}`).filter((x) => !x.endsWith(": ")).join(" · ");
  return [
    {
      q: "Ananda Urban Match คืออะไร",
      a: "เว็บจับคู่ผู้เช่ากับเจ้าของห้องสำหรับ 4 โครงการคอนโดพร้อมอยู่ของอนันดา ดีเวลลอปเม้นท์ ผู้เช่าบอกงบ ทำเล และวันย้ายเข้า แล้วระบบเรียงห้องที่ตรงที่สุดพร้อมเหตุผล ส่วนผู้ที่สนใจซื้อเพื่อปล่อยเช่าดูคิวผู้เช่า ค่าเช่าตลาด และ yield ประมาณการรายแบบห้องได้ก่อนตัดสินใจ (เว็บนี้เป็นต้นแบบเพื่อนำเสนอ)",
    },
    { q: "มีโครงการไหนบ้าง และอยู่ใกล้รถไฟฟ้าแค่ไหน", a: list((p) => row("transit", p.zone)) },
    { q: "ราคาเริ่มต้นของแต่ละโครงการเท่าไร", a: `${list((p) => row("price_from", p.zone))} (ราคาจากเว็บไซต์อนันดา ณ ${DATA_DATE} เงื่อนไขเป็นไปตามที่บริษัทกำหนด)` },
    {
      q: "ค่าเช่าคอนโดในโครงการเหล่านี้ประมาณเท่าไร",
      a: `ค่าเช่า 1 ห้องนอนโดยประมาณ ${list((p) => row("rent_1br", p.zone))} บาท/เดือน (ประมาณการจากประกาศเช่าจริงบนพอร์ทัลอสังหาฯ ไม่ใช่ราคาที่รับประกัน)`,
    },
    {
      q: "ซื้อคอนโดปล่อยเช่าในโครงการเหล่านี้ได้ผลตอบแทน (yield) เท่าไร",
      a: `Gross yield ประมาณการ ${list((p) => row("gross_yield", p.zone))} และหลังหักค่าส่วนกลาง ${list((p) => row("net_yield", p.zone))} คำนวณจากค่าเช่าประกาศเทียบราคาขายมือสองต่อ ตร.ม. ยังไม่หักช่วงห้องว่าง ค่านายหน้า ภาษี และค่าดูแล จึงไม่ใช่การรับประกันผลตอบแทน`,
    },
    { q: "ค่าส่วนกลางเท่าไร", a: `${list((p) => row("common_fee", p.zone))} บาท/ตร.ม./เดือน` },
    { q: "ผู้เช่ากลุ่มหลักของแต่ละโครงการเป็นใคร", a: list((p) => row("main_tenants", p.zone)) },
    { q: "เลี้ยงสัตว์ได้ไหม", a: "ไม่ได้ ทั้ง 4 โครงการในแคมเปญไม่อนุญาตให้เลี้ยงสัตว์" },
    {
      q: "ลงทะเบียนนัดดูห้องหรือให้เซลส์ติดต่อกลับอย่างไร",
      a: "ผู้เช่า: ไปที่หน้าหาห้องเช่า บอกโจทย์ เลือกห้องที่สนใจ แล้วกรอกชื่อ เบอร์ อีเมล ทีมเช่าจะโทรยืนยันนัดภายใน 1 วันทำการ · ผู้สนใจซื้อ: ไปที่หน้าเจ้าของห้อง เลือกแบบห้อง แล้วกรอกข้อมูลให้เซลส์ส่ง Unit Report และนัดชมโครงการ",
    },
  ].filter((x) => x.a && !x.a.startsWith(" "));
}
