/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowIcon } from "@/components/Icons";
import { ProjectJsonLd } from "@/components/seo/JsonLd";
import { DataStatus } from "@/components/seo/StatusPill";
import { DATA_DATE, sourcesFor, type ProjectKnowledge } from "@/services/knowledge";
import { projectImg } from "@/utils/project";

// หน้าข้อมูลโครงการ (Server Component ล้วน) · ทุกข้อความอยู่ใน HTML ให้ Google และ AI อ่านได้โดยไม่ต้องรัน JavaScript
export function ProjectView({ p }: { p: ProjectKnowledge }) {
  const srcIds = Array.from(new Set([...p.facts, ...p.compare].flatMap((f) => f.src)));
  const sources = sourcesFor(srcIds);
  return (
    <article>
      <ProjectJsonLd p={p} />
      <section className="wrap section">
        <nav className="small muted" aria-label="breadcrumb"><Link href="/">หน้าหลัก</Link> › {p.name}</nav>
        <div className="proj-head" style={{ marginTop: 12 }}>
          <img src={projectImg(p.zone)} alt={`ภาพอาคาร ${p.name}`} />
          <div className="stack">
            <div className="eyebrow">{p.area}</div>
            <h1>{p.name}</h1>
            <p className="muted">{p.summary}</p>
            {p.address && <p className="small"><b>ที่ตั้ง:</b> {p.address}</p>}
            <div className="row" style={{ flexWrap: "wrap" }}>
              <Link className="btn sm" href="/tenant">หาห้องเช่าในโครงการนี้ <ArrowIcon /></Link>
              <Link className="btn ghost sm" href="/investor">ดูคิวผู้เช่า / yield</Link>
              <a className="btn ghost sm" href={p.officialUrl} target="_blank" rel="noopener">เว็บไซต์ทางการ</a>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="sec-head"><h2>การเดินทาง</h2></div>
        <ul className="why">
          {p.transit.map((t) => <li key={t.station}>{t.station} {t.distance} <DataStatus status={t.status} /></li>)}
        </ul>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="sec-head"><h2>ข้อมูลโครงการ</h2></div>
        <div className="tbl-wrap">
          <table>
            <tbody>
              {p.facts.map((f) => (
                <tr key={f.label}><th scope="row" className="small" style={{ width: "32%" }}>{f.label}</th><td className="small">{f.value} <DataStatus status={f.status} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="sec-head">
          <div className="row"><h2>ค่าเช่าและผลตอบแทน</h2><span className="pill real">ข้อมูลตลาดจริง</span></div>
          <p className="small muted">ข้อมูล ณ {DATA_DATE} · ค่าประมาณการคำนวณจากประกาศเช่า/ขายจริงบนพอร์ทัล ยังไม่หักช่วงห้องว่าง ค่านายหน้า ภาษี และค่าดูแล ไม่ใช่การรับประกันผลตอบแทน</p>
        </div>
        <div className="tbl-wrap">
          <table>
            <tbody>
              {p.compare.map((f) => (
                <tr key={f.label}>
                  <th scope="row" className="small" style={{ width: "32%" }}>{f.label}</th>
                  <td className="small">{f.value} <DataStatus status={f.status} />{f.note && <div className="muted">{f.note}</div>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="sec-head"><h2>จุดเด่นโครงการ</h2></div>
        <ul className="why">{p.highlights.map((h) => <li key={h.text}>{h.text} <DataStatus status={h.status} /></li>)}</ul>
      </section>

      {(p.sellingPoints.length > 0 || p.investorFit) && (
        <section className="wrap section" style={{ paddingTop: 0 }}>
          <div className="sec-head"><h2>เหมาะกับนักลงทุนแบบไหน</h2></div>
          {p.investorFit && <p className="muted">{p.investorFit} <DataStatus status="analysis" /></p>}
          <ul className="why">{p.sellingPoints.map((h) => <li key={h.text}>{h.text} <DataStatus status={h.status} /></li>)}</ul>
        </section>
      )}

      {p.personas.length > 0 && (
        <section className="wrap section" style={{ paddingTop: 0 }}>
          <div className="sec-head"><h2>ผู้เช่ากลุ่มหลักของย่านนี้</h2></div>
          <div className="personas-mini">
            {p.personas.map((x) => (
              <div className="pm" key={x.name}>
                <b>{x.name}</b>
                {x.occupation && <span className="small muted">{x.occupation}</span>}
                {x.budget && <span className="small">งบ <b className="num">{x.budget}</b></span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {sources.length > 0 && (
        <section className="wrap section" style={{ paddingTop: 0 }}>
          <details className="card faq">
            <summary><b>แหล่งข้อมูล ({sources.length})</b></summary>
            <ol className="small muted" style={{ margin: "8px 0 0", paddingLeft: 20 }}>
              {sources.map((s) => (
                <li key={s.id}>{s.url ? <a href={s.url} target="_blank" rel="noopener nofollow">{s.name}</a> : s.name}{s.accessed ? ` (เข้าถึง ${s.accessed})` : ""}</li>
              ))}
            </ol>
          </details>
        </section>
      )}
    </article>
  );
}
