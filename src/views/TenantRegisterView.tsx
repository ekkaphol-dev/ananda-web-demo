"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { EmptyState } from "@/components/EmptyState";
import { useApp } from "@/hooks/useApp";
import { C, M } from "@/services/data";
import { trackLead } from "@/services/analytics";
import { addLead } from "@/store/umStore";
import { getAttribution } from "@/utils/attribution";
import { fmt, thDate } from "@/utils/format";
import { roomImg } from "@/utils/project";

export function TenantRegisterView() {
  const { state, ui, setUi, mutate } = useApp();
  const router = useRouter();
  const q = ui.tq;

  if (!ui.selRooms.length)
    return <EmptyState title="ยังไม่ได้เลือกห้อง" text="เลือกห้องที่สนใจอย่างน้อย 1 ห้องก่อนลงทะเบียน" href="/tenant" cta="กลับไปเลือกห้อง" />;

  const items = ui.selRooms.map((id) => state.rooms.find((r) => r.id === id)!).filter(Boolean);

  return (
    <section className="wrap section">
      <div className="sec-head">
        <div className="eyebrow">ขั้นสุดท้าย</div>
        <h1>ลงทะเบียนนัดดูห้อง</h1>
        <p className="muted">กรอกข้อมูลติดต่อ ทีมเช่าจะโทรยืนยันนัดภายใน 1 วันทำการ</p>
      </div>
      <div className="reg">
        <ContactForm
          submitLabel="ส่งข้อมูลลงทะเบียน"
          extra={
            <label className="f">หมายเหตุถึงทีมเช่า <small>ไม่บังคับ</small>
              <textarea className="in" name="note" rows={2} placeholder="เช่น อยากดูห้องวันเสาร์ช่วงบ่าย" />
            </label>
          }
          onSubmit={(v, form) => {
            const note = String(new FormData(form).get("note") ?? "").trim();
            const lead = mutate((s) =>
              addLead(s, "rent", {
                name: v.name, phone: v.phone, email: v.email, contactTime: v.contactTime, attribution: getAttribution(), note,
                items: ui.selRooms.slice(),
                profile: { ...q, types: q.types.slice(), zones: q.zones.slice(), lifestyle: q.lifestyle.slice() },
              }),
            );
            trackLead("rent", lead.ref, ui.selRooms.length);
            setUi({ lastLead: lead, selRooms: [] });
            router.push("/tenant/done");
          }}
        />
        <aside className="card stack">
          <h3>ห้องที่คุณเลือก ({items.length})</h3>
          <div className="picked">
            {items.map((r) => (
              <div className="it" key={r.id}>
                <img src={roomImg(r)} alt="" />
                <div className="grow">
                  <b>{C.PROJECTS[r.zone as keyof typeof C.PROJECTS].name}</b>
                  <span>{C.getUnit(r.zone, r.unitId).label} · {fmt(r.price)} บาท · คะแนน {M.match(q, r).score}</span>
                </div>
                <button type="button" className="xbtn" aria-label="เอาออก" onClick={() => setUi((u) => ({ selRooms: u.selRooms.filter((x) => x !== r.id) }))}>✕</button>
              </div>
            ))}
          </div>
          <p className="small muted">งบ {fmt(q.budgetMin)}–{fmt(q.budgetMax)} บาท · ย้ายเข้า {thDate(q.moveIn)}</p>
          <Link className="btn ghost sm" href="/tenant">เลือกห้องเพิ่ม</Link>
        </aside>
      </div>
    </section>
  );
}
