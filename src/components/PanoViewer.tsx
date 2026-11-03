"use client";

import { useEffect, useRef, useState } from "react";
import { install } from "@/utils/pano";

type Viewer = { destroy: () => void };
type PanoApi = { createViewer: (host: HTMLElement, name: string, onStatus: (s: string) => void) => Viewer };

let pano: PanoApi | null = null;
function getPano(): PanoApi {
  if (!pano) {
    const root: { PANO?: PanoApi } = {};
    install(root);
    pano = root.PANO!;
  }
  return pano;
}

export function PanoViewer({ name }: { name: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const v = getPano().createViewer(host.current!, name, setStatus);
    return () => v.destroy();
  }, [name]);
  const note = status === "loading" ? "กำลังโหลดภาพ 360° · ลากเพื่อหมุน" : status === "error" ? "โหลดภาพ 360° ไม่สำเร็จ" : "ภาพตัวอย่าง 360° · ลากเพื่อหมุน";
  return (
    <div className="pano-box" ref={host}>
      <span className="pano-note">{note}</span>
    </div>
  );
}
