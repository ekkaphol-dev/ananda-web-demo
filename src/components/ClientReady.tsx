"use client";

import type { ReactNode } from "react";
import { useAppMaybe } from "@/hooks/useApp";

// แสดง children เมื่อโหลดข้อมูลจาก localStorage แล้ว (ฝั่ง server แสดง fallback)
export function ClientReady({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return useAppMaybe() ? children : fallback;
}
