"use client";

import { C, type MatchResult } from "@/services/data";
import type { Room } from "@/store/types";
import { fmt, thDate } from "@/utils/format";
import { roomImg } from "@/utils/project";

type Props = { room: Room; m: MatchResult; selected: boolean; onToggle: () => void; onDetail: () => void };

export function RoomCard({ room, m, selected, onToggle, onDetail }: Props) {
  const unit = C.getUnit(room.zone, room.unitId);
  const col = m.score >= 85 ? "var(--green)" : m.score >= 70 ? "var(--blue)" : "var(--warn)";
  return (
    <article className={`room ${selected ? "sel" : ""}`}>
      <div className="img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={roomImg(room)} alt={`ภาพตัวอย่างห้อง ${unit.label}`} loading="lazy" />
        <span className="tagx">ภาพตัวอย่าง</span>
      </div>
      <div className="bd">
        <div className="top">
          <div className="grow">
            <b>{C.PROJECTS[room.zone as keyof typeof C.PROJECTS].name}</b>
            <div className="small muted">{unit.label} · {room.sqm} ตร.ม. · ชั้น {room.floor} · ห้อง {room.id}</div>
            <div className="price">{fmt(room.price)} <small>บาท/เดือน · ว่าง {thDate(room.availableFrom)}</small></div>
          </div>
          <div className="ring" style={{ "--p": m.score, "--c": col } as React.CSSProperties} title="คะแนนความเหมาะสม">
            <span>{m.score}</span>
          </div>
        </div>
        <ul className="why">
          {m.pos.slice(0, 3).map((t) => <li key={t}>{t}</li>)}
          {m.neg.slice(0, 1).map((t) => <li key={t} className="neg">{t}</li>)}
        </ul>
        <div className="act">
          <button type="button" className="btn ghost sm" onClick={onDetail}>ดูรายละเอียด / 360°</button>
          <button type="button" className="btn ghost sm sel-toggle" aria-pressed={selected} onClick={onToggle}>
            {selected ? "✓ เลือกแล้ว" : "+ สนใจห้องนี้"}
          </button>
        </div>
      </div>
    </article>
  );
}
