import type { Metadata } from "next";

// ค่ากลางสำหรับ SEO · ตั้ง NEXT_PUBLIC_SITE_URL เป็นโดเมนจริงเมื่อย้ายโดเมน
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://ananda-web-demo.vercel.app").replace(/\/$/, ""),
  name: "Ananda Urban Match",
  shortName: "Urban Match",
  description:
    "หาห้องเช่าคอนโดใกล้ที่ทำงาน หรือซื้อคอนโดที่มีผู้เช่ารออยู่ ใน 4 โครงการพร้อมอยู่ของอนันดา Culture Thonglor, Culture Chula, IDEO Sukhumvit - Rama 4 และ IDEO Rama 9 - Asoke ระบบจับคู่ห้องตามงบ ทำเล และวันย้ายเข้า",
  keywords: [
    "คอนโดให้เช่า", "ห้องเช่าใกล้รถไฟฟ้า", "คอนโดใกล้ BTS", "คอนโดใกล้ MRT", "ซื้อคอนโดปล่อยเช่า", "คอนโดลงทุน", "yield คอนโด",
    "อนันดา", "Ananda Development", "Culture Thonglor", "Culture Chula", "IDEO Sukhumvit Rama 4", "IDEO Rama 9 Asoke",
  ],
  locale: "th_TH",
};

/** metadata ต่อหน้า: title, description, canonical, Open Graph · noindex สำหรับหน้าฟอร์ม/หน้าทีมงาน */
export function pageMeta(opts: { title?: string; description?: string; path: string; noindex?: boolean }): Metadata {
  const description = opts.description ?? SITE.description;
  return {
    ...(opts.title ? { title: opts.title } : {}),
    description,
    alternates: { canonical: opts.path },
    // openGraph ของหน้าลูกจะแทนที่ของ layout ทั้งก้อน จึงต้องใส่ภาพ/siteName/locale ซ้ำทุกหน้า
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE.name }],
      ...(opts.title ? { title: opts.title } : {}),
      description,
      url: opts.path,
    },
    twitter: { ...(opts.title ? { title: opts.title } : {}), description },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** หน้าที่ให้ Google เก็บ (ใช้ใน sitemap) */
export const INDEXABLE = [
  { path: "/", priority: 1 },
  { path: "/tenant", priority: 0.9 },
  { path: "/investor", priority: 0.9 },
];

/** slug หน้าโครงการ (ใช้ใน proxy.ts ซึ่งไม่ควร import ข้อมูลตลาดทั้งก้อน) · knowledge.ts ตรวจตอน build ว่าตรงกับข้อมูลจริง */
export const PROJECT_SLUGS = ["culture-thonglor", "culture-chula", "ideo-sukhumvit-rama4", "ideo-rama9-asoke"] as const;
