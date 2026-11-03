"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { ActionBar } from "@/components/ActionBar";
import { RoomCard } from "@/components/RoomCard";
import { RoomDetailModal } from "@/components/RoomDetailModal";
import { useApp } from "@/hooks/useApp";
import { C, M } from "@/services/data";
import { ZN } from "@/utils/project";

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function TenantView() {
  const { state, ui, setUi } = useApp();
  const q = ui.tq;
  const [detail, setDetail] = useState<string | null>(null);
  const resRef = useRef<HTMLDivElement>(null);

  // ตัวเลือก chips อัปเดตทันที แต่ผลลัพธ์คำนวณจากโจทย์ที่ "ค้นหา" แล้วเท่านั้น (เหมือนต้นฉบับ)
  const [draft, setDraft] = useState(q);
  const [form, setForm] = useState({ bmin: String(q.budgetMin), bmax: String(q.budgetMax), moveIn: q.moveIn, commute: q.commute });

  const list = useMemo(
    () =>
      state.rooms
        .map((room) => ({ room, m: M.match(q, room) }))
        .sort((a, b) => b.m.score - a.m.score || a.room.price - b.room.price)
        .filter((x) => x.m.score >= 45)
        .slice(0, 10),
    [state.rooms, q],
  );

  const toggleRoom = (id: string) => setUi((u) => ({ selRooms: toggle(u.selRooms, id) }));
  const chip = (key: "zones" | "types" | "lifestyle", v: string) => setDraft((d) => ({ ...d, [key]: toggle(d[key], v), persona: null }));

  function search(e: FormEvent) {
    e.preventDefault();
    const budgetMin = Math.max(0, Number(form.bmin) || 0);
    const budgetMax = Math.max(budgetMin, Number(form.bmax) || budgetMin);
    setUi({ tq: { ...draft, budgetMin, budgetMax, moveIn: form.moveIn || draft.moveIn, commute: form.commute }, searched: true });
    resRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const detailRoom = detail ? state.rooms.find((r) => r.id === detail) : null;

  return (
    <>
      <section className="wrap section">
        <div className="sec-head">
          <div className="eyebrow">สำหรับผู้เช่า</div>
          <h1>บอกโจทย์ แล้วได้ห้องที่ตรงที่สุด</h1>
          <p className="muted">เลือกห้องที่สนใจได้หลายห้อง แล้วกดลงทะเบียนนัดดู ทีมเช่าจะติดต่อกลับ</p>
        </div>
        <div className="split">
          <form className="card side stack" onSubmit={search} noValidate>
            <h3>ความต้องการของคุณ</h3>
            <div className="grid2">
              <label className="f">งบต่ำสุด/เดือน
                <input className="in num" type="number" inputMode="numeric" step={500} value={form.bmin} onChange={(e) => setForm({ ...form, bmin: e.target.value })} />
              </label>
              <label className="f">งบสูงสุด/เดือน
                <input className="in num" type="number" inputMode="numeric" step={500} value={form.bmax} onChange={(e) => setForm({ ...form, bmax: e.target.value })} />
              </label>
            </div>
            <div className="stack" style={{ gap: 6 }}>
              <span className="small"><b>โครงการ</b> <span className="muted">ไม่เลือก = ทุกโครงการ</span></span>
              <div className="chips">
                {C.ZONE_IDS.map((z) => (
                  <button key={z} type="button" className="chip" aria-pressed={draft.zones.includes(z)} onClick={() => chip("zones", z)}>{ZN[z]}</button>
                ))}
              </div>
            </div>
            <div className="stack" style={{ gap: 6 }}>
              <span className="small"><b>ประเภทห้อง</b></span>
              <div className="chips">
                {Object.entries(C.TYPE_LABEL).map(([t, l]) => (
                  <button key={t} type="button" className="chip" aria-pressed={draft.types.includes(t)} onClick={() => chip("types", t)}>{l}</button>
                ))}
              </div>
            </div>
            <div className="grid2">
              <label className="f">วันที่อยากย้ายเข้า
                <input className="in" type="date" value={form.moveIn} onChange={(e) => setForm({ ...form, moveIn: e.target.value })} />
              </label>
              <label className="f">เดินทางด้วย
                <select className="in" value={form.commute} onChange={(e) => setForm({ ...form, commute: e.target.value })}>
                  <option value="any">BTS หรือ MRT</option>
                  <option value="BTS">BTS</option>
                  <option value="MRT">MRT</option>
                  <option value="none">ไม่เน้นรถไฟฟ้า</option>
                </select>
              </label>
            </div>
            <div className="stack" style={{ gap: 6 }}>
              <span className="small"><b>ไลฟ์สไตล์</b></span>
              <div className="chips">
                {C.LIFESTYLES.filter((l) => l.id !== "pet").map((l) => (
                  <button key={l.id} type="button" className="chip" aria-pressed={draft.lifestyle.includes(l.id)} onClick={() => chip("lifestyle", l.id)}>{l.label}</button>
                ))}
              </div>
            </div>
            <p className="note-box small" style={{ margin: 0 }}><b>หมายเหตุ:</b> ทั้ง 4 โครงการไม่อนุญาตให้เลี้ยงสัตว์</p>
            <button className="btn block" type="submit">ค้นหาห้องที่ตรง</button>
          </form>

          <div className="stack" ref={resRef}>
            {list.length === 0 ? (
              <div className="card empty"><h3>ยังไม่มีห้องที่ตรง</h3><p className="small">ลองขยายงบหรือเลือกโครงการเพิ่ม</p></div>
            ) : (
              <>
                <div className="row">
                  <h3 className="grow">ห้องที่ตรงที่สุด {list.length} ห้อง</h3>
                  <span className="pill mock">ห้องและภาพตัวอย่าง · ข้อมูลจำลอง</span>
                </div>
                <div className="results">
                  {list.map(({ room, m }) => (
                    <RoomCard key={room.id} room={room} m={m} selected={ui.selRooms.includes(room.id)} onToggle={() => toggleRoom(room.id)} onDetail={() => setDetail(room.id)} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <ActionBar count={ui.selRooms.length} prefix="เลือกแล้ว" unit="ห้อง" href="/tenant/register" cta="ลงทะเบียนนัดดูห้อง" />
      {detailRoom && (
        <RoomDetailModal room={detailRoom} q={q} selected={ui.selRooms.includes(detailRoom.id)} onToggle={() => toggleRoom(detailRoom.id)} onClose={() => setDetail(null)} />
      )}
    </>
  );
}
