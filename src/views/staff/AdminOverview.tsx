"use client";

import { Funnel } from "@/components/Funnel";
import { LeadReport } from "@/components/LeadReport";
import { StatusPill } from "@/components/StatusPill";
import { useApp } from "@/hooks/useApp";
import { findUser } from "@/store/umStore";
import { rel } from "@/utils/format";

export function AdminOverview({ onGoto }: { onGoto: (tab: string) => void }) {
  const { state } = useApp();
  const L = state.leads;
  const pend = L.filter((l) => l.side === "rent" && !l.matchConfirmed && l.status !== "lost").length;
  const unassigned = L.filter((l) => !l.assignee).length;
  const recent = L.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <>
      <div className="row">
        <div className="grow"><div className="eyebrow">OVERVIEW</div><h2>ภาพรวมแคมเปญ</h2></div>
        <span className="pill mock">ข้อมูลจำลองในเดโม</span>
      </div>
      <div className="kpis">
        <div className="kpi"><span>ลีดผู้เช่า</span><b>{L.filter((l) => l.side === "rent").length}</b></div>
        <div className="kpi"><span>ลีดเจ้าของห้อง</span><b>{L.filter((l) => l.side === "invest").length}</b></div>
        <div className="kpi"><span>รอยืนยัน Match</span><b>{pend}</b></div>
        <div className="kpi dark"><span>ขายได้ (เจ้าของห้อง)</span><b>{L.filter((l) => l.side === "invest" && l.status === "won").length}</b></div>
      </div>
      {unassigned > 0 && (
        <div className="card row" style={{ borderColor: "var(--warn)" }}>
          <b className="grow">{unassigned} ลีดยังไม่มีเซลส์รับผิดชอบ</b>
          <button className="btn sm" onClick={() => onGoto("leads")}>มอบหมาย</button>
        </div>
      )}
      <div className="ld"><Funnel leads={L} side="rent" /><Funnel leads={L} side="invest" /></div>
      <LeadReport state={state} dim="zone" />
      <LeadReport state={state} dim="type" />
      <div className="card stack">
        <h3>ลีดล่าสุด</h3>
        <div className="tbl-wrap" style={{ border: 0 }}>
          <table>
            <thead><tr><th>เลขที่</th><th>ชื่อ</th><th>ฝั่ง</th><th>สถานะ</th><th>เซลส์</th><th>เข้ามา</th></tr></thead>
            <tbody>
              {recent.map((l) => (
                <tr key={l.id}>
                  <td className="num">{l.ref}</td>
                  <td>{l.name}</td>
                  <td>{l.side === "rent" ? "ผู้เช่า" : "เจ้าของห้อง"}</td>
                  <td><StatusPill lead={l} /></td>
                  <td>{l.assignee ? findUser(state, l.assignee)?.name : <span className="pill warn">ยังไม่มอบหมาย</span>}</td>
                  <td className="small muted">{rel(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
