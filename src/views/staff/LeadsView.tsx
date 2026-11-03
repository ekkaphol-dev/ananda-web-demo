"use client";

import { StatusPill } from "@/components/StatusPill";
import { useApp } from "@/hooks/useApp";
import { INVEST_STATUS, RENT_STATUS } from "@/store/constants";
import type { Side } from "@/store/types";
import { findUser } from "@/store/umStore";
import { rel } from "@/utils/format";
import { itemsText } from "@/utils/project";
import { LeadDetail } from "./LeadDetail";

const ALL_STATUS = [
  { id: "new", label: "ใหม่" }, { id: "contacted", label: "ติดต่อแล้ว" }, { id: "walk", label: "นัดดู/นัดชม" }, { id: "won", label: "ปิดได้" }, { id: "lost", label: "ไม่สำเร็จ" },
];

export function LeadsView({ side }: { side: Side | "all" }) {
  const { state, me, ui, setUi } = useApp();
  const isAdmin = me!.role === "admin";

  let L = state.leads.filter((l) => side === "all" || l.side === side);
  if (isAdmin && ui.sideFilter !== "all") L = L.filter((l) => l.side === ui.sideFilter);
  if (!isAdmin && ui.assignFilter === "mine") L = L.filter((l) => l.assignee === me!.id);
  const stList = side === "rent" ? RENT_STATUS : side === "invest" ? INVEST_STATUS : ALL_STATUS;
  const count = (id: string) => L.filter((l) => l.status === id).length;
  const shown = L.filter((l) => ui.filter === "all" || l.status === ui.filter).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // จอกว้างเลือกลีดแรกให้อัตโนมัติ จอแคบให้ผู้ใช้แตะเลือกเอง
  const wide = typeof window !== "undefined" && window.innerWidth > 1100;
  const leadId = ui.leadId && shown.some((l) => l.id === ui.leadId) ? ui.leadId : wide && shown[0] ? shown[0].id : null;
  const selected = leadId ? state.leads.find((l) => l.id === leadId) : null;

  const kp = (lab: string, v: number, dark?: boolean) => <div className={`kpi ${dark ? "dark" : ""}`}><span>{lab}</span><b>{v}</b></div>;
  const sideLab = side === "rent" ? "ผู้เช่า" : side === "invest" ? "เจ้าของห้อง" : "ทั้งหมด";
  const open = (id: string) => {
    setUi({ leadId: id });
    if (window.innerWidth <= 1100) setTimeout(() => document.getElementById("detail")?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  return (
    <>
      <div className="row">
        <div className="grow">
          <div className="eyebrow">{isAdmin ? "ALL LEADS" : "MY LEADS"}</div>
          <h2>ลีด{sideLab}{isAdmin ? "" : "ของฉัน"}</h2>
        </div>
        {isAdmin ? (
          <div className="chips">
            {[["all", "ทุกฝั่ง"], ["rent", "ผู้เช่า"], ["invest", "เจ้าของห้อง"]].map(([k, l]) => (
              <button key={k} className="chip" aria-pressed={ui.sideFilter === k} onClick={() => setUi({ sideFilter: k, filter: "all" })}>{l}</button>
            ))}
          </div>
        ) : (
          <div className="chips">
            {[["mine", "ของฉัน"], ["team", "ทั้งทีม"]].map(([k, l]) => (
              <button key={k} className="chip" aria-pressed={ui.assignFilter === k} onClick={() => setUi({ assignFilter: k })}>{l}</button>
            ))}
          </div>
        )}
      </div>
      <div className="kpis">
        {kp("ลีดทั้งหมด", L.length)}
        {kp("ใหม่ รอติดต่อ", count("new"))}
        {kp(side === "rent" ? "นัดดูห้อง" : "นัดชม/จอง", L.filter((l) => ["walk", "booked"].includes(l.status)).length)}
        {kp(side === "rent" ? "ทำสัญญาแล้ว" : "ขายได้", count("won"), true)}
      </div>
      <div className="chips">
        <button className="chip" aria-pressed={ui.filter === "all"} onClick={() => setUi({ filter: "all" })}>ทั้งหมด {L.length}</button>
        {stList.map((s) => (
          <button key={s.id} className="chip" aria-pressed={ui.filter === s.id} onClick={() => setUi({ filter: s.id })}>{s.label} {count(s.id)}</button>
        ))}
      </div>
      <div className="ld">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>ลีด</th><th>สนใจ</th><th>สถานะ</th>{isAdmin && <th>เซลส์</th>}<th>เข้ามา</th></tr></thead>
            <tbody>
              {shown.length ? shown.map((l) => {
                const it = itemsText(state, l);
                return (
                  <tr key={l.id} className={`click ${l.id === leadId ? "on" : ""}`} tabIndex={0} onClick={() => open(l.id)} onKeyDown={(e) => e.key === "Enter" && open(l.id)}>
                    <td><b>{l.name}</b>{l.isNew && <> <span className="pill warn">ใหม่</span></>}<div className="small muted num">{l.ref}</div></td>
                    <td className="small">{it[0]}{l.items.length > 1 && <> <span className="muted">+{l.items.length - 1}</span></>}</td>
                    <td><StatusPill lead={l} /></td>
                    {isAdmin && <td className="small">{l.assignee ? findUser(state, l.assignee)?.name : <span className="pill warn">ยังไม่มอบหมาย</span>}</td>}
                    <td className="small muted">{rel(l.createdAt)}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={5} className="empty">ไม่มีลีดในสถานะนี้</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div id="detail" className="detail">
          {selected ? <LeadDetail key={selected.id + selected.history.length} lead={selected} /> : <div className="card empty small">เลือกลีดเพื่อดูรายละเอียดและอัปเดตสถานะ</div>}
        </div>
      </div>
    </>
  );
}
