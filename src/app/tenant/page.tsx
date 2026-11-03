import type { Metadata } from "next";
import { pageMeta } from "@/utils/site";
import { TenantView } from "@/views/TenantView";

// หน้าทั้งหมดเรนเดอร์ฝั่งเบราว์เซอร์บางส่วน (ข้อมูลอยู่ใน localStorage) จึงไม่ตรวจ instant navigation
export const instant = false;

export const metadata: Metadata = pageMeta({
  title: "หาห้องเช่าคอนโดใกล้ที่ทำงาน ใกล้รถไฟฟ้า",
  description: "บอกงบ ทำเล วันย้ายเข้า ระบบเรียงห้องเช่าที่ตรงที่สุดพร้อมเหตุผล ใน 4 โครงการพร้อมอยู่ของอนันดา ทองหล่อ สามย่าน พระโขนง พระราม 9 ดูภาพห้อง 360° แล้วลงทะเบียนนัดดูห้องได้ทันที",
  path: "/tenant",
});

export default function Page() {
  return <TenantView />;
}
