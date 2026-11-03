import type { Metadata } from "next";
import { pageMeta } from "@/utils/site";
import { InvestorView } from "@/views/InvestorView";

// หน้าทั้งหมดเรนเดอร์ฝั่งเบราว์เซอร์บางส่วน (ข้อมูลอยู่ใน localStorage) จึงไม่ตรวจ instant navigation
export const instant = false;

export const metadata: Metadata = pageMeta({
  title: "ซื้อคอนโดปล่อยเช่า เห็นคิวผู้เช่าก่อนซื้อ",
  description: "Demand Board สำหรับนักลงทุน ดูคิวผู้เช่าที่รออยู่ ค่าเช่าตลาด และ yield ประมาณการรายแบบห้อง ใน 4 โครงการพร้อมอยู่ของอนันดา พร้อมเครื่องคำนวณผลตอบแทน",
  path: "/investor",
});

export default function Page() {
  return <InvestorView />;
}
