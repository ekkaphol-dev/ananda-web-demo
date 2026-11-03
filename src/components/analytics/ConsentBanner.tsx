"use client";

import { useEffect, useState } from "react";
import { gtagEnabled, readConsent, setConsent } from "@/services/analytics";
import { captureAttribution } from "@/utils/attribution";

// แบนเนอร์ขอความยินยอมคุกกี้ (PDPA) + เก็บที่มาของผู้เข้าชมตอนเปิดเว็บ
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    captureAttribution();
    if (!gtagEnabled || readConsent()) return;
    // แสดงหลัง mount เท่านั้น (localStorage อ่านได้เฉพาะฝั่งเบราว์เซอร์)
    const t = setTimeout(() => setOpen(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;
  const choose = (c: "granted" | "denied") => {
    setConsent(c);
    setOpen(false);
  };
  return (
    <div className="consent" role="dialog" aria-label="การใช้คุกกี้">
      <div className="card row">
        <p className="small grow" style={{ margin: 0 }}>
          เราใช้คุกกี้เพื่อวัดผลและปรับปรุงโฆษณาให้ตรงกับคุณ (Google Ads / Google Analytics) คุณเลือกได้ว่าจะยอมรับหรือไม่ การปฏิเสธไม่กระทบการใช้งานเว็บ
        </p>
        <div className="row" style={{ gap: 8 }}>
          <button type="button" className="btn ghost sm" onClick={() => choose("denied")}>ปฏิเสธ</button>
          <button type="button" className="btn sm" onClick={() => choose("granted")}>ยอมรับ</button>
        </div>
      </div>
    </div>
  );
}
