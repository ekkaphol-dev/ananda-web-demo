import type { Lead, Side } from "@/store/types";

export function Funnel({ leads, side }: { leads: Lead[]; side: Side }) {
  const L = leads.filter((l) => l.side === side);
  const n = L.length || 1;
  const walk = L.filter((l) => ["walk", "booked", "won"].includes(l.status)).length;
  const won = L.filter((l) => l.status === "won").length;
  const bar = (lab: string, v: number, c: string) => (
    <div className={`fbar ${c}`}>
      <span>{lab}</span>
      <div className="tr"><i style={{ width: `${(v / n) * 100}%` }} /></div>
      <b className="num">{v}</b>
    </div>
  );
  return (
    <div className="card stack">
      <div className="row">
        <h3 className="grow">{side === "rent" ? "ฝั่งผู้เช่า" : "ฝั่งเจ้าของห้อง"}</h3>
        <span className="small muted">Lead → Walk → {side === "rent" ? "สัญญาเช่า" : "Sold"}</span>
      </div>
      <div className="funnel">
        {bar("Lead", L.length, "")}
        {bar(side === "rent" ? "นัดดูห้อง" : "นัดชม", walk, "walk")}
        {bar(side === "rent" ? "ทำสัญญา" : "ขายได้", won, "sold")}
      </div>
    </div>
  );
}
