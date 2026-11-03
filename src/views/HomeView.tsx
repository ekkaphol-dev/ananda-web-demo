// Server Component: ทั้งหน้าอยู่ใน HTML ให้ Google และ AI อ่านได้
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowIcon } from "@/components/Icons";
import { C } from "@/services/data";
import { projectByZone } from "@/services/knowledge";
import { fmt } from "@/utils/format";
import { projectImg, yieldOf } from "@/utils/project";

export function HomeView() {
  return (
    <>
      <section className="wrap hero">
        <div className="eyebrow">ANANDA URBAN MATCH</div>
        <h1 style={{ marginTop: 8 }}>
          ห้องที่ใช่ ใกล้ที่ทำงาน
          <br />
          <b>ผู้เช่าเจอห้อง เจ้าของห้องเจอผู้เช่า</b>
        </h1>
        <p className="lead">เว็บเดียวสำหรับ 4 โครงการพร้อมอยู่ของอนันดา ผู้เช่าบอกโจทย์แล้วได้ห้องที่ตรงที่สุด เจ้าของห้องเห็นคิวผู้เช่าและค่าเช่าตลาดก่อนตัดสินใจซื้อ</p>
        <div className="entry">
          <Link className="t" href="/tenant">
            <span className="tag">สำหรับผู้เช่า</span>
            <h2>หาห้องเช่าใกล้ที่ทำงาน</h2>
            <p>บอกงบ ทำเล วันย้ายเข้า ระบบเรียงห้องที่ตรงที่สุดพร้อมเหตุผล เลือกห้องที่ชอบแล้วลงทะเบียนนัดดู</p>
            <span className="go">เริ่มหาห้อง <ArrowIcon /></span>
          </Link>
          <Link className="i" href="/investor">
            <span className="tag">สำหรับเจ้าของห้อง</span>
            <h2>ซื้อห้องที่มีคนรอเช่า</h2>
            <p>ดูคิวผู้เช่าที่รออยู่ ค่าเช่าตลาด และ yield ประมาณการรายแบบห้อง เลือกแบบที่สนใจแล้วให้เซลส์ติดต่อกลับ</p>
            <span className="go">ดู Demand Board <ArrowIcon /></span>
          </Link>
        </div>
      </section>
      <section className="wrap section">
        <div className="sec-head">
          <div className="row"><h2>4 โครงการในแคมเปญ</h2><span className="pill real">ข้อมูลโครงการจริง</span></div>
        </div>
        <div className="projects">
          {C.ZONE_IDS.map((z) => {
            const p = C.PROJECTS[z];
            const s = p.stations[0];
            return (
              <Link className="proj" key={z} href={`/projects/${projectByZone(z).slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                <div className="ph"><img src={projectImg(z)} alt={`ภาพอาคาร ${p.name}`} loading="lazy" /></div>
                <div className="bd">
                  <b>{p.name}</b>
                  <span>{s ? `${s.name} ${fmt(s.m)} ม.` : ""} · {fmt(p.unitCount)} ยูนิต</span>
                  <span>Gross yield {yieldOf(z)} <span className="pill mock" style={{ fontSize: ".66rem" }}>ประมาณการ</span></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="sec-head"><h2>ทำงานอย่างไร</h2></div>
        <div className="how">
          <div className="card"><span className="step-n">1</span><div><h3>บอกโจทย์</h3><p className="small muted">ผู้เช่าบอกงบ ทำเล วันเข้าอยู่ · เจ้าของห้องเลือกโครงการและแบบห้อง</p></div></div>
          <div className="card"><span className="step-n">2</span><div><h3>เลือกห้องที่สนใจ</h3><p className="small muted">ระบบให้คะแนนความเหมาะสมพร้อมเหตุผล เลือกได้หลายห้อง แล้วกรอกชื่อ เบอร์ อีเมล</p></div></div>
          <div className="card"><span className="step-n">3</span><div><h3>เซลส์ติดต่อกลับ</h3><p className="small muted">ลีดเข้าทีมเช่าหรือทีมขายเจ้าของห้องทันที แอดมินยืนยันคู่ Match และติดตามจนปิดการขาย</p></div></div>
        </div>
      </section>
    </>
  );
}
