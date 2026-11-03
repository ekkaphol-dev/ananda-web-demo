import type { Metadata, Viewport } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Ananda Urban Match",
  description: "เว็บแอปจับคู่ผู้เช่ากับเจ้าของห้อง 4 โครงการพร้อมอยู่ของอนันดา · เดโม",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body>
        <MainLayout>{children}</MainLayout>
        <noscript>เว็บนี้ต้องเปิด JavaScript</noscript>
      </body>
    </html>
  );
}
