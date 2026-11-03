"use client";

import { useApp } from "@/hooks/useApp";
import { C, M } from "@/services/data";
import { fmt, thDate } from "@/utils/format";
import { demandFor, yieldOf, ZN } from "@/utils/project";

export function SalesDemand() {
  const { state } = useApp();
  const rows = C.ZONE_IDS.flatMap((z) => C.PROJECTS[z].units.map((u) => ({ z, u, d: demandFor(state, z, u) }))).sort((a, b) => b.d.ratio - a.d.ratio);
  return (
    <>
      <div>
        <div className="eyebrow">DEMAND BOARD</div>
        <h2>แบบห้องไหนมีผู้เช่ารอมากที่สุด</h2>
        <p className="small muted">ใช้เลือกแบบห้องที่จะเสนอเจ้าของห้อง · คิวผู้เช่าเป็นข้อมูลจำลอง ค่าเช่าเป็นข้อมูลตลาดจริง (ราคาประกาศ)</p>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>โครงการ · แบบห้อง</th><th>คิวผู้เช่า</th><th>ห้องว่างในระบบ</th><th>คิว/ห้อง</th><th>ค่าเช่าตลาด</th><th>Gross yield</th></tr></thead>
          <tbody>
            {rows.map(({ z, u, d }) => (
              <tr key={z + u.id}>
                <td><b>{ZN[z]}</b><div className="small muted">{u.label}</div></td>
                <td className="num"><b>{d.q}</b></td>
                <td className="num">{d.supply}</td>
                <td><span className={`pill ${d.ratio >= 1.5 ? "ok" : d.ratio >= 0.8 ? "blue" : "warn"} num`}>{d.ratio.toFixed(1)}x</span></td>
                <td className="num small">{fmt(d.band.low)}–{fmt(d.band.high)}</td>
                <td className="small">{yieldOf(z)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function SalesRooms() {
  const { state } = useApp();
  const rows = state.rooms.map((r) => ({ r, n: state.tenants.filter((t) => M.match(t, r).isMatch).length })).sort((a, b) => b.n - a.n);
  return (
    <>
      <div>
        <div className="eyebrow">ROOMS</div>
        <h2>ห้องปล่อยเช่าในระบบ {state.rooms.length} ห้อง</h2>
        <p className="small muted">จำนวนผู้เช่าที่คะแนน 70 ขึ้นไปต่อห้อง ใช้เลือกห้องเสนอลูกค้า · ข้อมูลจำลอง</p>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>ห้อง</th><th>แบบ</th><th>ค่าเช่า</th><th>ว่าง</th><th>ผู้เช่าที่ match</th></tr></thead>
          <tbody>
            {rows.map(({ r, n }) => (
              <tr key={r.id}>
                <td><b>{r.id}</b><div className="small muted">{ZN[r.zone]}</div></td>
                <td className="small">{C.getUnit(r.zone, r.unitId).label} · {r.sqm} ตร.ม.</td>
                <td className="num">{fmt(r.price)}</td>
                <td className="small">{thDate(r.availableFrom)}</td>
                <td><b className="num">{n}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
