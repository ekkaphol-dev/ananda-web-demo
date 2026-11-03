"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { DemoBar } from "@/components/DemoBar";
import { TopBar } from "@/components/TopBar";
import { AppProvider } from "@/contexts/AppContext";
import { ToastProvider } from "@/contexts/ToastContext";

function ScrollTop() {
  const path = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);
  return null;
}

// โครงหน้าหลัก: แถบ DEMO + แถบเมนู + เนื้อหา (ทุกหน้าใช้ร่วมกัน)
export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AppProvider>
        <ScrollTop />
        <DemoBar />
        <TopBar />
        <main id="view" tabIndex={-1}>{children}</main>
      </AppProvider>
    </ToastProvider>
  );
}
