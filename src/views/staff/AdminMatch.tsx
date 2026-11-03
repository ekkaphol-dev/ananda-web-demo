"use client";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { M } from "@/services/data";
import type { RentLead } from "@/store/types";
import { updateLead } from "@/store/umStore";
import { fmt } from "@/utils/format";
import { ZN } from "@/utils/project";

export function AdminMatch() {
  const { state, me, mutate } = useApp();
  const toast = useToast();
  const rows = state.leads
    .filter((l): l is RentLead => l.side === "rent" && l.status !== "lost")
    .map((l) => {
      const best = l.items
        .map((id) => state.rooms.find((r) => r.id === id))
        .filter((r) => !!r)
        .map((r) => ({ r, m: M.match(l.profile, r) }))
        .sort((a, b) => b.m.score - a.m.score)[0];
      return { l, best };
    })
    .filter((x) => x.best);

  return (
    <>
      <div>
        <div className="eyebrow">MATCH QUEUE</div>
        <h2>คู่ที่ระบบเสนอ รอทีม Rental ยืนยัน</h2>
        <p className="small muted">ยืนยันแล้วระบบแจ้งเซลส์ทีมเช่าให้นัดดูห้อง และแจ้งเจ้าของห้องว่ามีผู้เช่าตรง</p>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>ผู้เช่า (ไม่ระบุตัวตน)</th><th>งบ</th><th>ห้องที่ตรงที่สุด</th><th>คะแนน</th><th>เหตุผลหลัก</th><th></th></tr></thead>
          <tbody>
            {rows.map(({ l, best }) => (
              <tr key={l.id}>
                <td>{l.ref}<div className="small muted">{l.profile.persona ? state.tenants.find((t) => t.id === l.profile.persona)?.name ?? "" : ""}</div></td>
                <td className="num">{fmt(l.profile.budgetMin)}–{fmt(l.profile.budgetMax)}</td>
                <td>{ZN[best.r.zone]}<div className="small muted">{best.r.id} · {fmt(best.r.price)} บาท</div></td>
                <td><b className="num">{best.m.score}</b></td>
                <td className="small">{best.m.pos.slice(0, 2).join(" · ")}</td>
                <td>
                  {l.matchConfirmed ? (
                    <span className="pill ok">ยืนยันแล้ว</span>
                  ) : (
                    <button className="btn sm" onClick={() => {
                      mutate((s) => updateLead(s, l.id, { matchConfirmed: true }, me!.name, "แอดมินยืนยัน Match"));
                      toast("ยืนยัน Match แล้ว · แจ้งเซลส์ทีมเช่า");
                    }}>ยืนยัน Match</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
