"use client";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";

export function DemoBar() {
  const { reset } = useApp();
  const toast = useToast();
  return (
    <div id="demo-bar" role="status">
      <div className="wrap">
        <span className="demo-pill">DEMO</span>
        <span className="note">ต้นแบบเพื่อนำเสนอ · ข้อมูลตลาดจริง ส่วนห้อง ผู้เช่า และลีดเป็นข้อมูลจำลอง</span>
        <button
          id="reset-btn"
          type="button"
          onClick={() => {
            reset();
            toast("รีเซ็ตข้อมูลตัวอย่างแล้ว");
          }}
        >
          รีเซ็ตข้อมูลตัวอย่าง
        </button>
      </div>
    </div>
  );
}
