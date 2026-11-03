"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TickIcon } from "@/components/Icons";
import { useApp } from "@/hooks/useApp";
import type { Side } from "@/store/types";

const NEXT: Record<Side, string[]> = {
  rent: ["ทีมเช่าโทรยืนยันห้องและนัดเวลาดูห้อง", "ถ้าห้องที่เลือกไม่ว่าง ทีมจะเสนอห้องคะแนนใกล้เคียง", "ติดตามสถานะต่อได้ทาง LINE OA อนันดา"],
  invest: ["เซลส์ส่ง Unit Report: คิวผู้เช่า ค่าเช่าตลาด และ yield ประมาณการ", "นัดชมห้องตัวอย่างและห้องจริง", "เมื่อซื้อแล้ว ทีมเช่าช่วยหาผู้เช่าจากคิวที่ลงทะเบียนไว้"],
};

export function DoneView({ side }: { side: Side }) {
  const { ui } = useApp();
  const router = useRouter();
  const l = ui.lastLead;
  useEffect(() => {
    if (!l) router.replace(side === "rent" ? "/tenant" : "/investor");
  }, [l, router, side]);
  if (!l) return null;

  const team = side === "rent" ? "ทีมเช่า" : "ทีมขายเจ้าของห้อง";
  return (
    <section className="wrap">
      <div className="done">
        <div className="tick"><TickIcon /></div>
        <h1>ได้รับข้อมูลแล้ว</h1>
        <p className="muted">ขอบคุณคุณ{l.name} {team}จะติดต่อกลับที่ {l.phone} ภายใน 1 วันทำการ</p>
        <span className="ref">{l.ref}</span>
        <p className="small muted">เก็บหมายเลขนี้ไว้อ้างอิง · เราส่งสรุปไปที่ {l.email} ด้วย (ในระบบจริง)</p>
        <div className="card stack" style={{ textAlign: "left", width: "100%" }}>
          <b>{side === "rent" ? "สิ่งที่จะเกิดต่อจากนี้" : "สิ่งที่คุณจะได้รับ"}</b>
          <ul className="why">{NEXT[side].map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link className="btn ghost" href="/">กลับหน้าหลัก</Link>
          <Link className="btn" href="/staff">ดูลีดนี้ในคอนโซลทีมงาน</Link>
        </div>
      </div>
    </section>
  );
}
