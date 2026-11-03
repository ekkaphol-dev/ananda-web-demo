import type { Metadata } from "next";
import { ClientReady } from "@/components/ClientReady";
import { pageMeta } from "@/utils/site";
import { InvestorRegisterView } from "@/views/InvestorRegisterView";

// หน้าทั้งหมดเรนเดอร์ฝั่งเบราว์เซอร์บางส่วน (ข้อมูลอยู่ใน localStorage) จึงไม่ตรวจ instant navigation
export const instant = false;

export const metadata: Metadata = pageMeta({ title: "ให้เซลส์ติดต่อกลับ", path: "/investor/register", noindex: true });

export default function Page() {
  return (
    <ClientReady>
      <InvestorRegisterView />
    </ClientReady>
  );
}
