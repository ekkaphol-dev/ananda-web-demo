import type { Metadata } from "next";
import { ClientReady } from "@/components/ClientReady";
import { pageMeta } from "@/utils/site";
import { DoneView } from "@/views/DoneView";

// หน้าทั้งหมดเรนเดอร์ฝั่งเบราว์เซอร์บางส่วน (ข้อมูลอยู่ใน localStorage) จึงไม่ตรวจ instant navigation
export const instant = false;

export const metadata: Metadata = pageMeta({ title: "ส่งข้อมูลสำเร็จ", path: "/investor/done", noindex: true });

export default function Page() {
  return (
    <ClientReady>
      <DoneView side="invest" />
    </ClientReady>
  );
}
