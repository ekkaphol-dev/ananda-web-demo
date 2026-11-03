"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { EmptyState } from "@/components/EmptyState";
import { useApp } from "@/hooks/useApp";
import { C } from "@/services/data";
import { INVEST_BUDGETS, INVEST_PURPOSES } from "@/store/constants";
import { trackLead } from "@/services/analytics";
import { addLead } from "@/store/umStore";
import { getAttribution } from "@/utils/attribution";
import { demandFor, projectImg, ZN } from "@/utils/project";

export function InvestorRegisterView() {
  const { state, ui, setUi, mutate } = useApp();
  const router = useRouter();

  if (!ui.selUnits.length)
    return <EmptyState title="ยังไม่ได้เลือกแบบห้อง" text="เลือกแบบห้องที่สนใจอย่างน้อย 1 แบบ" href="/investor" cta="กลับไป Demand Board" />;

  const items = ui.selUnits.map((k) => {
    const [zone, unitId] = k.split("|");
    return { zone, unitId };
  });

  return (
    <section className="wrap section">
      <div className="sec-head">
        <div className="eyebrow">ขั้นสุดท้าย</div>
        <h1>ให้เซลส์ติดต่อกลับ</h1>
        <p className="muted">กรอกข้อมูลติดต่อ เซลส์จะส่ง Unit Report ของแบบห้องที่คุณเลือกและนัดชมโครงการ</p>
      </div>
      <div className="reg">
        <ContactForm
          submitLabel="ส่งข้อมูล"
          extra={
            <div className="grid2">
              <label className="f">งบประมาณ
                <select className="in" name="budget" defaultValue={INVEST_BUDGETS[1]}>
                  {INVEST_BUDGETS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </label>
              <label className="f">วัตถุประสงค์
                <select className="in" name="purpose">
                  {INVEST_PURPOSES.map((b) => <option key={b}>{b}</option>)}
                </select>
              </label>
            </div>
          }
          onSubmit={(v, form) => {
            const fd = new FormData(form);
            const lead = mutate((s) =>
              addLead(s, "invest", {
                name: v.name, phone: v.phone, email: v.email, contactTime: v.contactTime, attribution: getAttribution(),
                budget: String(fd.get("budget")), purpose: String(fd.get("purpose")), items,
              }),
            );
            trackLead("invest", lead.ref, items.length);
            setUi({ lastLead: lead, selUnits: [] });
            router.push("/investor/done");
          }}
        />
        <aside className="card stack">
          <h3>แบบห้องที่คุณสนใจ ({items.length})</h3>
          <div className="picked">
            {items.map((it) => {
              const u = C.getUnit(it.zone, it.unitId);
              const d = demandFor(state, it.zone, u);
              const key = `${it.zone}|${it.unitId}`;
              return (
                <div className="it" key={key}>
                  <img src={projectImg(it.zone)} alt="" style={{ objectFit: "contain", background: "#fff" }} />
                  <div className="grow"><b>{ZN[it.zone]}</b><span>{u.label} · คิวผู้เช่า {d.q} คน</span></div>
                  <button type="button" className="xbtn" aria-label="เอาออก" onClick={() => setUi((x) => ({ selUnits: x.selUnits.filter((k) => k !== key) }))}>✕</button>
                </div>
              );
            })}
          </div>
          <Link className="btn ghost sm" href="/investor">เลือกเพิ่ม</Link>
        </aside>
      </div>
    </section>
  );
}
