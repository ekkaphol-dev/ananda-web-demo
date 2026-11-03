export const PHONE_RE = /^0[689]\d{8}$/;
export const MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactValues = { name: string; phone: string; email: string; contactTime: string; pdpa: boolean };
export type ContactErrors = Partial<Record<"name" | "phone" | "email" | "pdpa", string>>;

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (v.name.trim().length < 2) e.name = "กรอกชื่อ–นามสกุล";
  if (!PHONE_RE.test(v.phone)) e.phone = "กรอกเบอร์มือถือ 10 หลัก เช่น 0812345678";
  if (!MAIL_RE.test(v.email.trim())) e.email = "กรอกอีเมลให้ครบ เช่น name@email.com";
  if (!v.pdpa) e.pdpa = "กรุณากดยินยอมก่อนส่งข้อมูล";
  return e;
}

export const normalizePhone = (p: string) => p.replace(/[\s-]/g, "");
