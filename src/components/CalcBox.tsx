"use client";

import { C } from "@/services/data";
import type { Unit } from "@/store/types";
import { fmt } from "@/utils/format";
import { calcNums, type CalcState } from "@/utils/project";

type Props = { zone: string; unit: Unit; c: CalcState; onChange: (c: CalcState) => void };

// เครื่องคำนวณผลตอบแทนคร่าวๆ ต่อแบบห้อง (เลื่อนราคาห้อง / ค่าเช่า)
export function CalcBox({ zone, unit, c, onChange }: Props) {
  const n = calcNums(zone, unit, c);
  const fee = C.PROJECTS[zone as keyof typeof C.PROJECTS].commonFee;
  return (
    <div className="calc">
      <b className="small">คำนวณผลตอบแทนคร่าวๆ</b>
      <label className="crow">
        <span className="grow">ราคาห้อง ~{unit.sqm} ตร.ม.</span>
        <b className="num">฿{fmt(c.price)}</b>
      </label>
      <input type="range" className="rng" min={c.pMin} max={c.pMax} step={10000} value={c.price} aria-label="ราคาห้อง"
        onChange={(e) => onChange({ ...c, price: Number(e.target.value) })} />
      <label className="crow">
        <span className="grow">ค่าเช่าที่ผู้เช่าในคิวรับได้</span>
        <b className="num">฿{fmt(c.rent)}/เดือน</b>
      </label>
      <input type="range" className="rng" min={c.rMin} max={c.rMax} step={500} value={c.rent} aria-label="ค่าเช่าต่อเดือน"
        onChange={(e) => onChange({ ...c, rent: Number(e.target.value) })} />
      <div className="crow small"><span className="grow">รายได้ค่าเช่าต่อปี</span><b className="num">฿{fmt(n.annual)}</b></div>
      <div className="crow small"><span className="grow" title={`${fee} บาท/ตร.ม./เดือน`}>ค่าส่วนกลางต่อปี</span><b className="num">−฿{fmt(n.fee)}</b></div>
      <div className="crow cy">
        <span className="grow">Gross yield<small className="muted">หลังหักค่าส่วนกลาง <b className="num">{n.net.toFixed(1)}%</b></small></span>
        <b className="num big">{n.gross.toFixed(1)}%</b>
      </div>
    </div>
  );
}
