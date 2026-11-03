"use client";

/* eslint-disable @next/next/no-img-element */
import { ActionBar } from "@/components/ActionBar";
import { CalcBox } from "@/components/CalcBox";
import { useApp } from "@/hooks/useApp";
import { C } from "@/services/data";
import { fmt } from "@/utils/format";
import { calcInit, demandFor, netYieldOf, projectImg, yieldOf, ZN, zoneOf } from "@/utils/project";

type Persona = { name_th: string; occupation?: string; rent_budget_thb: { min: number; max: number } };

export function InvestorView() {
  const { state, ui, setUi } = useApp();
  const z = ui.invZone as keyof typeof C.PROJECTS;
  const p = C.PROJECTS[z];
  const zd = zoneOf(z);
  const st = p.stations[0];

  return (
    <>
      <section className="wrap section">
        <div className="sec-head">
          <div className="eyebrow">สำหรับเจ้าของห้อง · Demand Board</div>
          <h1>เห็นคิวผู้เช่าจริง ก่อนตัดสินใจซื้อ</h1>
          <p className="muted">เลือกโครงการและแบบห้องที่สนใจได้หลายแบบ แล้วกรอกข้อมูลให้เซลส์ส่ง Unit Report และนัดชม</p>
        </div>
        <div className="tabs" role="tablist">
          {C.ZONE_IDS.map((id) => (
            <button key={id} className="tab" role="tab" aria-selected={id === z} onClick={() => setUi({ invZone: id })}>{ZN[id]}</button>
          ))}
        </div>
        <div className="card stack" style={{ marginTop: 14 }}>
          <div className="proj-head">
            <img src={projectImg(z)} alt={`ภาพอาคาร ${p.name}`} />
            <div className="stack">
              <div className="row"><h2 className="grow">{p.name}</h2><span className="pill real">ข้อมูลตลาดจริง</span></div>
              <p className="small muted">{zd.summary}</p>
              <div className="facts">
                <div className="fact"><span>ราคาเริ่มต้น</span><b style={{ fontSize: ".85rem", fontFamily: "var(--f-body)" }}>{String(p.priceFrom).split("·")[0]}</b></div>
                <div className="fact"><span>Gross yield (ประมาณการ)</span><b>{yieldOf(z)}</b></div>
                <div className="fact"><span>หลังหักค่าส่วนกลาง</span><b>{netYieldOf(z)}</b></div>
                <div className="fact"><span>รถไฟฟ้า</span><b style={{ fontSize: ".85rem", fontFamily: "var(--f-body)" }}>{st ? `${st.name} ${fmt(st.m)} ม.` : "-"}</b></div>
              </div>
            </div>
          </div>
        </div>

        <div className="sec-head" style={{ marginTop: 22 }}>
          <div className="row"><h2 className="grow">แบบห้องและคิวผู้เช่า</h2><span className="pill mock">คิวผู้เช่า · ข้อมูลจำลอง</span></div>
        </div>
        <div className="units">
          {p.units.map((u) => {
            const d = demandFor(state, z, u);
            const key = `${z}|${u.id}`;
            const sel = ui.selUnits.includes(key);
            const lvl = d.ratio >= 1.5 ? ["ok", "ดีมานด์สูง"] : d.ratio >= 0.8 ? ["blue", "ดีมานด์พอดี"] : ["warn", "ผู้เช่าน้อยกว่าห้อง"];
            const c = ui.calc[key] ?? calcInit(z, u);
            return (
              <article key={key} className={`unit ${sel ? "sel" : ""}`}>
                <div className="row"><b className="grow">{u.label}</b><span className={`pill ${lvl[0]}`}>{lvl[1]}</span></div>
                <span className="small muted">{C.TYPE_LABEL[u.type]} · ~{u.sqm} ตร.ม.</span>
                <div className="queue">
                  <b>{d.q}</b>
                  <span>ผู้เช่าที่ตรงแบบห้องนี้รออยู่<br />เทียบห้องว่างในระบบ {d.supply} ห้อง</span>
                </div>
                <div>
                  <div className="row small"><span className="grow">ค่าเช่าตลาด (ราคาประกาศ)</span><b className="num">{fmt(d.band.low)}–{fmt(d.band.high)}</b></div>
                  <div className="band">
                    <i style={{ left: 0, right: 0 }} />
                    {d.band.avg ? <em style={{ left: `${((d.band.avg - d.band.low) / (d.band.high - d.band.low || 1)) * 100}%` }} /> : null}
                  </div>
                  {d.band.avg ? <div className="band-l"><span></span><span>เฉลี่ย {fmt(d.band.avg)}</span></div> : null}
                </div>
                <CalcBox zone={z} unit={u} c={c} onChange={(nc) => setUi((x) => ({ calc: { ...x.calc, [key]: nc } }))} />
                <button type="button" className="btn ghost sm sel-toggle" aria-pressed={sel}
                  onClick={() => setUi((x) => ({ selUnits: sel ? x.selUnits.filter((k) => k !== key) : [...x.selUnits, key] }))}>
                  {sel ? "✓ สนใจแบบนี้แล้ว" : "+ สนใจแบบห้องนี้"}
                </button>
              </article>
            );
          })}
        </div>

        <div className="sec-head" style={{ marginTop: 22 }}><h2>ผู้เช่ากลุ่มหลักของย่านนี้</h2></div>
        <div className="personas-mini">
          {(zd.personas as Persona[]).map((x) => (
            <div className="pm" key={x.name_th}>
              <b>{x.name_th}</b>
              <span className="small muted">{x.occupation || ""}</span>
              <span className="small">งบ <b className="num">{fmt(x.rent_budget_thb.min)}–{fmt(x.rent_budget_thb.max)}</b> บาท/เดือน</span>
            </div>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 14 }}>
          ราคาห้องเริ่มต้นในเครื่องคำนวณมาจากราคาขายมือสองแบบประกาศต่อ ตร.ม. ของโครงการ ไม่ใช่ราคาขายจริงของอนันดา เลื่อนปรับได้ · Yield เป็นค่าประมาณ ยังไม่หักช่วงห้องว่าง ค่านายหน้า ภาษี และค่าดูแล ไม่ใช่การรับประกันผลตอบแทน
        </p>
      </section>
      <ActionBar count={ui.selUnits.length} prefix="สนใจ" unit="แบบห้อง" href="/investor/register" cta="ให้เซลส์ติดต่อกลับ" />
    </>
  );
}
