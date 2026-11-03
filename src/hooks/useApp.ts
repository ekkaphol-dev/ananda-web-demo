"use client";

import { useContext } from "react";
import { AppContext } from "@/contexts/AppContext";

/** ใช้ในคอมโพเนนต์ที่อยู่ใต้ <ClientReady> เท่านั้น (ข้อมูลโหลดแล้วแน่นอน) */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <ClientReady>");
  return ctx;
}

/** ใช้ได้ทุกที่ คืน null ระหว่างเรนเดอร์ฝั่ง server / ก่อนโหลดข้อมูล */
export const useAppMaybe = () => useContext(AppContext);
