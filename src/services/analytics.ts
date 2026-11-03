// Google tag (gtag.js) สำหรับ Google Ads + GA4
// ตั้งค่าผ่าน environment variables (ดู .env.example) · ถ้าไม่ตั้ง จะไม่โหลดสคริปต์และฟังก์ชันในไฟล์นี้ไม่ทำอะไร
import type { Side } from "@/store/types";

export const GTAG = {
  adsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "", // AW-XXXXXXXXX
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "", // G-XXXXXXXXXX
  labels: {
    rent: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_RENT || "", // conversion label: ลีดผู้เช่า
    invest: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_INVEST || "", // conversion label: ลีดเจ้าของห้อง
  } satisfies Record<Side, string>,
};

export const gtagEnabled = Boolean(GTAG.adsId || GTAG.ga4Id);

type Gtag = (...args: unknown[]) => void;
const gtag: Gtag = (...args) => {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.(...args);
};

// ---------- Consent Mode v2 (PDPA) · ค่าเริ่มต้น "ไม่ยินยอม" จนกว่าผู้ใช้กดยอมรับ
export type ConsentChoice = "granted" | "denied";
export const CONSENT_KEY = "um.consent.v1";

export function readConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* ignore */
  }
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
}

// ---------- Events
/** ลีดใหม่: ส่ง Google Ads conversion (ใช้เลขอ้างอิงกันนับซ้ำ) + GA4 generate_lead */
export function trackLead(side: Side, ref: string, itemCount: number) {
  const label = GTAG.labels[side];
  if (GTAG.adsId && label) {
    gtag("event", "conversion", { send_to: `${GTAG.adsId}/${label}`, transaction_id: ref });
  }
  if (GTAG.ga4Id) {
    gtag("event", "generate_lead", { lead_type: side === "rent" ? "tenant" : "investor", lead_ref: ref, items: itemCount });
  }
}

/** event ระหว่างทาง ใช้ทำ audience / ดู funnel ใน GA4 (เช่น ค้นหาห้อง เลือกห้อง) */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (gtagEnabled) gtag("event", name, params);
}
