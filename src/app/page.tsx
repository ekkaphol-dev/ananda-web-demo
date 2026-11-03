import type { Metadata } from "next";
import { CompareTable } from "@/components/seo/CompareTable";
import { FaqSection } from "@/components/seo/FaqSection";
import { HomeJsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/utils/site";
import { HomeView } from "@/views/HomeView";

// หน้าทั้งหมดเรนเดอร์ฝั่งเบราว์เซอร์บางส่วน (ข้อมูลอยู่ใน localStorage) จึงไม่ตรวจ instant navigation
export const instant = false;

export const metadata: Metadata = pageMeta({ path: "/" });

export default function Page() {
  return (
    <>
      <HomeJsonLd />
      <HomeView />
      <CompareTable />
      <FaqSection />
    </>
  );
}
