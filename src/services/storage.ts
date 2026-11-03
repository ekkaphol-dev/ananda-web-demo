// เก็บสถานะเดโมใน localStorage ของเบราว์เซอร์
// ระบบจริง: เปลี่ยนไฟล์นี้ให้เรียก API ฐานข้อมูลกลาง (Google Sheets + Apps Script / Firebase) และตรวจสิทธิ์ที่เซิร์ฟเวอร์
import type { AppState } from "@/store/types";

const KEY = "urbanmatch.final.v2";

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.version === 1 && s.leads ? (s as AppState) : null;
  } catch {
    return null;
  }
}

export function saveState(s: AppState): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* memory only */
  }
}
