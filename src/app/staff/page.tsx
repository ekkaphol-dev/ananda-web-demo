import type { Metadata } from "next";
import { ClientReady } from "@/components/ClientReady";
import { pageMeta } from "@/utils/site";
import { StaffView } from "@/views/staff/StaffView";

// หน้าทั้งหมดเรนเดอร์ฝั่งเบราว์เซอร์บางส่วน (ข้อมูลอยู่ใน localStorage) จึงไม่ตรวจ instant navigation
export const instant = false;

export const metadata: Metadata = pageMeta({ title: "คอนโซลทีมงาน", path: "/staff", noindex: true });

export default function Page() {
  return (
    <ClientReady>
      <StaffView />
    </ClientReady>
  );
}
