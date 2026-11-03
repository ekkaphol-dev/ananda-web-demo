import type { Metadata, Viewport } from "next";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { GoogleTag } from "@/components/analytics/GoogleTag";
import { SiteFooter } from "@/components/SiteFooter";
import { MainLayout } from "@/layouts/MainLayout";
import { SITE } from "@/utils/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · หาห้องเช่าและคอนโดลงทุน 4 โครงการอนันดา`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  publisher: "Ananda Development",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: "/",
    title: `${SITE.name} · หาห้องเช่าและคอนโดลงทุน 4 โครงการอนันดา`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
  // ให้ AI รู้ว่ามีไฟล์สรุปสำหรับ LLM
  other: { "llms-txt": "/llms.txt" },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B1A44",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body>
        <MainLayout>{children}</MainLayout>
        <SiteFooter />
        <ConsentBanner />
        <GoogleTag />
        <noscript>เว็บนี้ต้องเปิด JavaScript</noscript>
      </body>
    </html>
  );
}
