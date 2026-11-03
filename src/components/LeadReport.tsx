import { C } from "@/services/data";
import type { AppState } from "@/store/types";
import { leadDims, ZN } from "@/utils/project";

// รายงานลีดแยกตามโครงการ / ประเภทห้อง · ลีดที่เลือกหลายกลุ่มนับในทุกกลุ่มที่เลือก
export function LeadReport({ state, dim }: { state: AppState; dim: "zone" | "type" }) {
  const keys: string[] = dim === "zone" ? C.ZONE_IDS : Object.keys(C.TYPE_LABEL);
  const lab = (k: string) => (dim === "zone" ? ZN[k] : C.TYPE_LABEL[k as keyof typeof C.TYPE_LABEL]);
  const D = state.leads.map((l) => ({ l, d: leadDims(state, l)[dim] }));
  const rows = keys.map((k) => {
    const L = D.filter((x) => x.d.has(k)).map((x) => x.l);
    const rent = L.filter((l) => l.side === "rent");
    const inv = L.filter((l) => l.side === "invest");
    return {
      k,
      rent: rent.length,
      inv: inv.length,
      total: L.length,
      walk: L.filter((l) => ["walk", "booked", "won"].includes(l.status)).length,
      rentWon: rent.filter((l) => l.status === "won").length,
      invWon: inv.filter((l) => l.status === "won").length,
    };
  });
  const max = Math.max(1, ...rows.map((r) => r.total));
  const sum = (f: "rent" | "inv" | "walk" | "rentWon" | "invWon") => rows.reduce((a, r) => a + r[f], 0);
  const title = dim === "zone" ? "โครงการ" : "ประเภทห้อง";

  return (
    <div className="card stack">
      <div className="row">
        <h3 className="grow">ลีดแยกตาม{title}</h3>
        <span className="small muted"><span className="lg rent" />ผู้เช่า <span className="lg inv" />เจ้าของห้อง</span>
      </div>
      <div className="tbl-wrap" style={{ border: 0 }}>
        <table className="rep">
          <thead>
            <tr><th>{title}</th><th style={{ width: "34%" }}>สัดส่วนลีด</th><th className="r">ผู้เช่า</th><th className="r">เจ้าของห้อง</th><th className="r">นัดดู/นัดชม</th><th className="r">ทำสัญญาเช่า</th><th className="r">ขายได้</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k}>
                <td><b>{lab(r.k)}</b></td>
                <td><div className="sbar"><i className="rent" style={{ width: `${(r.rent / max) * 100}%` }} /><i className="inv" style={{ width: `${(r.inv / max) * 100}%` }} /></div></td>
                <td className="r num">{r.rent}</td><td className="r num">{r.inv}</td><td className="r num">{r.walk}</td><td className="r num">{r.rentWon}</td><td className="r num">{r.invWon}</td>
              </tr>
            ))}
            <tr className="tot">
              <td>รวม</td><td></td>
              <td className="r num">{sum("rent")}</td><td className="r num">{sum("inv")}</td><td className="r num">{sum("walk")}</td><td className="r num">{sum("rentWon")}</td><td className="r num">{sum("invWon")}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="small muted">ลีดที่เลือกหลาย{title} นับในทุกกลุ่มที่เลือก ยอดรวมจึงอาจมากกว่าจำนวนลีดจริง</p>
    </div>
  );
}
