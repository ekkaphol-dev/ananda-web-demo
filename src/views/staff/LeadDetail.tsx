"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { C, M } from "@/services/data";
import { LOST_REASONS } from "@/store/constants";
import type { Lead } from "@/store/types";
import { findUser, updateLead } from "@/store/umStore";
import { attributionLabel } from "@/utils/attribution";
import { fmt, maskPhone, rel, thDate } from "@/utils/format";
import { demandFor, projectImg, roomImg, statusList, yieldOf, ZN } from "@/utils/project";

export function LeadDetail({ lead: l }: { lead: Lead }) {
  const { state, me, mutate } = useApp();
  const toast = useToast();
  const isAdmin = me!.role === "admin";
  const mine = isAdmin || l.assignee === me!.id;
  const st = statusList(l.side);
  const sales = state.users.filter((u) => u.role === (l.side === "rent" ? "sale_rent" : "sale_invest") && u.active);

  const [status, setStatus] = useState(l.status);
  const [reason, setReason] = useState(l.reason);
  const [assignee, setAssignee] = useState(l.assignee ?? "");
  const [note, setNote] = useState(l.note);
  const [err, setErr] = useState("");

  const copy = (t: string) =>
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("คัดลอกแล้ว"), () => toast(t));

  function save() {
    const r = status === "lost" ? reason : "";
    if (status === "lost" && !r) return setErr("เลือกเหตุผลที่ไม่สำเร็จ เพื่อใช้ปรับแคมเปญรอบถัดไป");
    const patch: Partial<Lead> = { status, reason: r, note: note.trim() };
    const changes: string[] = [];
    if (status !== l.status) changes.push("สถานะ → " + st.find((s) => s.id === status)!.label + (r ? ` (${r})` : ""));
    if (isAdmin) {
      const a = assignee || null;
      if (a !== l.assignee) {
        patch.assignee = a;
        changes.push("มอบหมายให้ " + (a ? findUser(state, a)!.name : "ไม่มี"));
      }
    }
    if (patch.note !== l.note) changes.push("อัปเดตโน้ต");
    mutate((s) => updateLead(s, l.id, patch, me!.name, changes.join(" · ") || "บันทึก"));
    toast("บันทึกแล้ว");
  }

  return (
    <div className="card stack">
      <div className="row">
        <div className="grow">
          <span className={`pill ${l.side === "rent" ? "blue" : "navy"}`}>{l.side === "rent" ? "ผู้เช่า" : "เจ้าของห้อง"}</span>
          <h3 style={{ marginTop: 6 }}>{l.name}</h3>
          <span className="small muted num">{l.ref} · {rel(l.createdAt)}</span>
        </div>
        <StatusPill lead={l} />
      </div>

      <div className="note-box stack" style={{ gap: 4 }}>
        <div className="row">
          <span className="grow">โทร <b className="num">{mine ? l.phone : maskPhone(l.phone)}</b></span>
          {mine && <button className="copy" onClick={() => copy(l.phone)}>คัดลอก</button>}
        </div>
        <div className="row">
          <span className="grow" style={{ wordBreak: "break-all" }}>อีเมล {mine ? l.email : "แสดงเฉพาะเซลส์ที่รับผิดชอบ"}</span>
          {mine && <button className="copy" onClick={() => copy(l.email)}>คัดลอก</button>}
        </div>
        <span className="small muted">
          สะดวก {l.contactTime || "-"}
          {l.side === "invest" ? ` · งบ ${l.budget} · ${l.purpose}` : ` · งบ ${fmt(l.profile.budgetMin)}–${fmt(l.profile.budgetMax)} · ย้ายเข้า ${thDate(l.profile.moveIn)}`}
        </span>
        {l.attribution && (
          <span className="small muted" title={l.attribution.gclid ? `gclid: ${l.attribution.gclid}` : undefined}>
            ที่มา: {attributionLabel(l.attribution)}{l.attribution.landing ? ` · เข้าหน้า ${l.attribution.landing}` : ""}
          </span>
        )}
      </div>

      <div className="stack" style={{ gap: 6 }}>
        <b className="small">{l.side === "rent" ? "ห้องที่เลือก" : "แบบห้องที่สนใจ · ใช้คุยกับลูกค้า"}</b>
        <div className="picked">
          {l.side === "rent"
            ? l.items.map((rid) => {
                const r = state.rooms.find((x) => x.id === rid);
                if (!r) return null;
                return (
                  <div className="it" key={rid}>
                    <img src={roomImg(r)} alt="" />
                    <div className="grow"><b>{ZN[r.zone]} · {r.id}</b><span>{C.getUnit(r.zone, r.unitId).label} · {fmt(r.price)} บาท · คะแนน {M.match(l.profile, r).score}</span></div>
                  </div>
                );
              })
            : l.items.map((it) => {
                const u = C.getUnit(it.zone, it.unitId);
                const d = demandFor(state, it.zone, u);
                return (
                  <div className="it" key={it.zone + it.unitId}>
                    <img src={projectImg(it.zone)} alt="" style={{ objectFit: "contain", background: "#fff" }} />
                    <div className="grow"><b>{ZN[it.zone]} · {u.label}</b><span>คิวผู้เช่า {d.q} คน · ค่าเช่า {fmt(d.band.low)}–{fmt(d.band.high)} · yield {yieldOf(it.zone)}</span></div>
                  </div>
                );
              })}
        </div>
        {l.side === "rent" && (
          <span className="small">
            {l.matchConfirmed ? <span className="pill ok">แอดมินยืนยัน Match แล้ว</span> : <span className="pill warn">รอแอดมินยืนยัน Match</span>}
          </span>
        )}
      </div>

      {mine ? (
        <>
          <div className="grid2">
            <label className="f">สถานะ
              <select className="in" value={status} onChange={(e) => setStatus(e.target.value)}>
                {st.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            {status === "lost" && (
              <label className="f">เหตุผล
                <select className="in" value={reason} onChange={(e) => setReason(e.target.value)}>
                  <option value="">เลือกเหตุผล</option>
                  {LOST_REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
            )}
          </div>
          {isAdmin && (
            <label className="f">เซลส์ที่รับผิดชอบ
              <select className="in" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                <option value="">ยังไม่มอบหมาย</option>
                {sales.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </label>
          )}
          <label className="f">โน้ตจากเซลส์
            <textarea className="in" rows={2} placeholder="เช่น ลูกค้าขอดูห้องวันเสาร์" value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <span className="ferr">{err}</span>
          <div className="row">
            <button className="btn" onClick={save}>บันทึก</button>
            {l.side === "rent" && (
              <button className="btn ghost" onClick={() => {
                mutate((s) => updateLead(s, l.id, {}, me!.name, "ส่งนัดดูห้องเข้า LINE ลูกค้า"));
                toast("เดโม: ระบบจริงจะส่งข้อความผ่าน LINE OA");
              }}>ส่งนัดเข้า LINE ลูกค้า</button>
            )}
          </div>
        </>
      ) : (
        <p className="small muted">ลีดนี้อยู่กับ {l.assignee ? findUser(state, l.assignee)?.name : "ยังไม่มีเซลส์"} ดูได้อย่างเดียว</p>
      )}

      <div className="stack" style={{ gap: 6 }}>
        <b className="small">ประวัติ</b>
        <ul className="hist">
          {l.history.slice(0, 6).map((h, i) => <li key={i}><b>{h.by}</b> · {h.text} · {rel(h.at)}</li>)}
        </ul>
      </div>
    </div>
  );
}
