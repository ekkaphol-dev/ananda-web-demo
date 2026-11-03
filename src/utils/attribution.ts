// เก็บที่มาของผู้เข้าชม (gclid / UTM) ตอนเข้าเว็บครั้งแรกในแท็บนั้น แล้วแนบไปกับลีด
// ใช้ดูว่าลีดมาจากแคมเปญไหน และใช้ทำ Offline Conversion Import กลับเข้า Google Ads เมื่อปิดการขายได้

export type Attribution = Partial<Record<(typeof KEYS)[number], string>> & { landing?: string; referrer?: string; at?: string };

const KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const STORE = "um.attribution.v1";

/** เรียกครั้งเดียวตอนเปิดเว็บ · ถ้า URL มีพารามิเตอร์โฆษณาใหม่ จะทับค่าเดิม (last-click) */
export function captureAttribution() {
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    KEYS.forEach((k) => {
      const v = q.get(k);
      if (v) found[k] = v.slice(0, 200);
    });
    const hasNew = Object.keys(found).length > 0;
    if (!hasNew && sessionStorage.getItem(STORE)) return;
    const data: Attribution = {
      ...found,
      landing: window.location.pathname,
      referrer: document.referrer ? new URL(document.referrer).hostname : undefined,
      at: new Date().toISOString(),
    };
    sessionStorage.setItem(STORE, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function getAttribution(): Attribution | undefined {
  try {
    const raw = sessionStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Attribution) : undefined;
  } catch {
    return undefined;
  }
}

/** ข้อความสั้นสำหรับแสดงในคอนโซลทีมงาน */
export function attributionLabel(a?: Attribution) {
  if (!a) return "ไม่ทราบที่มา";
  if (a.gclid || a.gbraid || a.wbraid) return `Google Ads${a.utm_campaign ? ` · ${a.utm_campaign}` : ""}`;
  if (a.utm_source) return [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ");
  if (a.referrer) return `อ้างอิงจาก ${a.referrer}`;
  return "เข้าเว็บโดยตรง";
}
