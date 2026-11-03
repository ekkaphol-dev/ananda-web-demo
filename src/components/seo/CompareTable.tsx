import Link from "next/link";
import { DATA_DATE, PROJECTS_K } from "@/services/knowledge";
import { DataStatus } from "./StatusPill";

// ตารางเปรียบเทียบ 4 โครงการ (ข้อมูลจริงจาก 01_DATA) · เรนเดอร์ฝั่ง server ให้ Google และ AI อ่านได้
export function CompareTable() {
  const labels = PROJECTS_K[0].compare.map((f) => f.label);
  const allLabels = Array.from(new Set(PROJECTS_K.flatMap((p) => p.compare.map((f) => f.label))));
  const rows = [...labels, ...allLabels.filter((l) => !labels.includes(l))];
  return (
    <section className="wrap section" style={{ paddingTop: 0 }} aria-labelledby="cmp-h">
      <div className="sec-head">
        <div className="row"><h2 id="cmp-h">เปรียบเทียบ 4 โครงการ</h2><span className="pill real">ข้อมูลตลาดจริง</span></div>
        <p className="small muted">ข้อมูล ณ {DATA_DATE} · ค่าที่มีป้าย &ldquo;ประมาณการ&rdquo; คำนวณจากประกาศเช่า/ขายบนพอร์ทัลอสังหาฯ ไม่ใช่ราคาที่รับประกัน</p>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>หัวข้อ</th>
              {PROJECTS_K.map((p) => <th key={p.zone}><Link href={`/projects/${p.slug}`}>{p.name}</Link></th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((label) => (
              <tr key={label}>
                <td className="small"><b>{label}</b></td>
                {PROJECTS_K.map((p) => {
                  const f = p.compare.find((x) => x.label === label);
                  return <td key={p.zone} className="small">{f ? <>{f.value} <DataStatus status={f.status} /></> : "–"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
