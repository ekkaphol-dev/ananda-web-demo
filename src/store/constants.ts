import type { Role, StatusDef, User } from "./types";

export const DEMO_PASSWORD = "demo1234";

export const USERS: User[] = [
  { id: "u_admin", name: "แอดมิน · ทีม Digital", email: "admin@urbanmatch.demo", role: "admin", active: true },
  { id: "u_inv1", name: "คุณมายด์", email: "invest1@urbanmatch.demo", role: "sale_invest", active: true },
  { id: "u_inv2", name: "คุณโอ๊ต", email: "invest2@urbanmatch.demo", role: "sale_invest", active: true },
  { id: "u_rent1", name: "คุณแพร", email: "rent1@urbanmatch.demo", role: "sale_rent", active: true },
  { id: "u_rent2", name: "คุณบอส", email: "rent2@urbanmatch.demo", role: "sale_rent", active: true },
];

export const RENT_STATUS: StatusDef[] = [
  { id: "new", label: "ใหม่", cls: "warn" },
  { id: "contacted", label: "ติดต่อแล้ว", cls: "blue" },
  { id: "walk", label: "นัดดูห้อง", cls: "navy" },
  { id: "won", label: "ทำสัญญาเช่า", cls: "ok" },
  { id: "lost", label: "ไม่สำเร็จ", cls: "bad" },
];

export const INVEST_STATUS: StatusDef[] = [
  { id: "new", label: "ใหม่", cls: "warn" },
  { id: "contacted", label: "ติดต่อแล้ว", cls: "blue" },
  { id: "walk", label: "นัดชมโครงการ", cls: "navy" },
  { id: "booked", label: "จองแล้ว", cls: "navy" },
  { id: "won", label: "ขายได้", cls: "ok" },
  { id: "lost", label: "ไม่สนใจ", cls: "bad" },
];

export const LOST_REASONS = ["งบไม่พอ", "ยังไม่รีบตัดสินใจ", "ได้ห้อง/โครงการอื่นแล้ว", "ทำเลไม่ตรง", "ติดต่อไม่ได้", "อื่นๆ"];

export const ROLE_LABEL: Record<Role, string> = {
  admin: "แอดมิน",
  sale_invest: "Sale ลูกค้าเจ้าของห้อง",
  sale_rent: "Sale ลูกค้าเช่า",
};

export const CONTACT_TIMES = ["กลางวัน 10:00–17:00", "เย็น 17:00–20:00", "เสาร์–อาทิตย์"];
export const INVEST_BUDGETS = ["ไม่เกิน 4 ล้านบาท", "4–6 ล้านบาท", "6–8 ล้านบาท", "มากกว่า 8 ล้านบาท"];
export const INVEST_PURPOSES = ["ซื้อเพื่อปล่อยเช่า", "ซื้ออยู่เองบางช่วง + ปล่อยเช่า", "ยังไม่แน่ใจ ขอข้อมูลก่อน"];
