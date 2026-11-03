"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { C, M } from "@/services/data";
import type { Room, TenantProfile } from "@/store/types";
import { fmt, thDate } from "@/utils/format";
import { roomPhoto, roomVisual, zoneOf } from "@/utils/project";
import { Modal } from "./Modal";
import { PanoViewer } from "./PanoViewer";

type Props = { room: Room; q: TenantProfile; selected: boolean; onToggle: () => void; onClose: () => void };

export function RoomDetailModal({ room, q, selected, onToggle, onClose }: Props) {
  const [show360, setShow360] = useState(false);
  const unit = C.getUnit(room.zone, room.unitId);
  const p = C.PROJECTS[room.zone as keyof typeof C.PROJECTS];
  const vis = roomVisual(room)!;
  const b = C.rentBand(room.zone, unit);
  const m = M.match(q, room);
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - b.low) / (b.high - b.low || 1)) * 100));
  const hl: { text: string }[] = zoneOf(room.zone).project.highlights.slice(0, 3);

  return (
    <Modal onClose={onClose}>
      <div className="mh">
        <div className="grow">
          <b>{p.name} · {unit.label}</b>
          <div className="small muted">ห้อง {room.id} · ชั้น {room.floor} · {room.sqm} ตร.ม.</div>
        </div>
        <button className="xbtn" aria-label="ปิด" onClick={onClose}>✕</button>
      </div>
      <div id="media">
        {show360 ? (
          <PanoViewer name={vis.pano} />
        ) : (
          <div className="gal">
            <img src={roomPhoto(vis.imgs[0])} alt="ภาพตัวอย่าง" />
            <div className="side-g">
              {vis.imgs.slice(1, 3).map((n) => <img key={n} src={roomPhoto(n)} alt="ภาพตัวอย่าง" />)}
            </div>
          </div>
        )}
      </div>
      <div className="stack" style={{ padding: "4px 18px 20px" }}>
        <div className="row">
          <button className="btn ghost sm" onClick={() => setShow360((x) => !x)}>{show360 ? "กลับไปดูภาพ" : "ดูแบบ 360°"}</button>
          <span className="pill mock">ภาพห้องเป็นภาพตัวอย่างที่สร้างขึ้น</span>
        </div>
        <div className="facts">
          <div className="fact"><span>ค่าเช่า</span><b>{fmt(room.price)}</b></div>
          <div className="fact"><span>ว่างตั้งแต่</span><b>{thDate(room.availableFrom)}</b></div>
          <div className="fact"><span>เฟอร์นิเจอร์</span><b style={{ fontFamily: "var(--f-body)" }}>{room.furniture === "full" ? "แต่งครบ" : "บางส่วน"}</b></div>
          <div className="fact"><span>สัญญาขั้นต่ำ</span><b>{room.minLease} เดือน</b></div>
        </div>
        <div>
          <div className="row small">
            <b className="grow">ค่าเช่าเทียบช่วงประกาศของแบบห้องนี้</b>
            <span className="pill real">ข้อมูลตลาดจริง · ราคาประกาศ</span>
          </div>
          <div className="band" style={{ marginTop: 10 }}>
            <i style={{ left: 0, right: 0 }} />
            <em style={{ left: `${pct(room.price)}%` }} />
          </div>
          <div className="band-l"><span>{fmt(b.low)}</span><span>{fmt(b.high)}</span></div>
        </div>
        <div>
          <b className="small">ทำไมเหมาะกับคุณ · คะแนน {m.score}</b>
          <ul className="why" style={{ marginTop: 6 }}>
            {m.pos.map((t) => <li key={t}>{t}</li>)}
            {m.neg.map((t) => <li key={t} className="neg">{t}</li>)}
          </ul>
        </div>
        <div>
          <b className="small">จุดเด่นโครงการ</b>
          <ul className="small muted" style={{ margin: "6px 0 0", paddingLeft: 18 }}>
            {hl.map((h) => <li key={h.text}>{h.text}</li>)}
          </ul>
        </div>
        <button className="btn block" onClick={onToggle}>{selected ? "✓ เลือกห้องนี้แล้ว" : "+ สนใจห้องนี้"}</button>
      </div>
    </Modal>
  );
}
