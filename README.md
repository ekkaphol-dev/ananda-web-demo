# Ananda Urban Match · Next.js (เดโม)

พอร์ตจาก `03_WEBAPP_FINAL` (HTML/JS ล้วน) มาเป็น Next.js 16 + React 19 + TypeScript
หน้าตา ข้อมูล และตรรกะเหมือนต้นฉบับทุกหน้า ข้อมูลลีดยังเก็บใน localStorage ของเบราว์เซอร์ (ยังไม่เชื่อมระบบจริง)

## วิธีรัน

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

บัญชีทีมงานเดโม (รหัสผ่าน `demo1234`): `admin@urbanmatch.demo`, `invest1@urbanmatch.demo`, `rent1@urbanmatch.demo`
ก่อนโชว์ทุกครั้งกด "รีเซ็ตข้อมูลตัวอย่าง" มุมขวาบน

## หน้า (routes)

| URL | หน้า |
|---|---|
| `/` | หน้าหลัก |
| `/tenant` → `/tenant/register` → `/tenant/done` | ผู้เช่า: หาห้อง → ลงทะเบียน → ได้เลขอ้างอิง |
| `/investor` → `/investor/register` → `/investor/done` | เจ้าของห้อง: Demand Board → ให้เซลส์ติดต่อ → ได้เลขอ้างอิง |
| `/projects/[slug]` | หน้าข้อมูลโครงการ 4 หน้า (SSG) |
| `/staff` | คอนโซลทีมงาน (แอดมิน / Sale เจ้าของห้อง / Sale ผู้เช่า) |

## โครงสร้างโฟลเดอร์

```
public/assets/        ภาพโครงการ ภาพห้อง ภาพ 360°
src/
├─ app/               Next.js routes (ไฟล์บาง ๆ เรียก view จาก src/views)
├─ assets/            ไฟล์ static ที่ bundle ไปกับโค้ด (ฟอนต์ Prompt)
├─ components/        UI ที่ใช้ซ้ำ: TopBar, Modal, RoomCard, ContactForm, CalcBox, PanoViewer ...
├─ contexts/          AppContext (ข้อมูล + สถานะหน้าเว็บ), ToastContext
├─ hooks/             useApp, useToast, useEscape
├─ layouts/           MainLayout (แถบ DEMO + เมนู), ConsoleLayout (เมนูซ้ายของทีมงาน)
├─ views/             หน้าจอแต่ละหน้า (เทียบกับ "pages" ใน React+Vite)
│  └─ staff/          หน้าจอคอนโซลทีมงาน
├─ services/
│  ├─ data/           ข้อมูลตลาดจริง + ตรรกะจับคู่ (คัดลอกจากต้นฉบับ แก้แค่ตัวห่อ export)
│  └─ storage.ts      อ่าน/เขียน localStorage ← จุดที่เปลี่ยนเป็น API ตอนใช้จริง
├─ store/             สถานะกลาง: appStore, umStore (ลีด/ผู้ใช้/login), constants, types
├─ styles/            globals.css (CSS เดิมของต้นฉบับ)
└─ utils/             format, validation, project helpers, pano (ตัวดู 360° WebGL)
```

> ใช้ `src/views` แทน `src/pages` เพราะ Next.js สงวนชื่อ `pages` ไว้สำหรับ Pages Router

## SEO

- หน้า `/` `/tenant` `/investor` เรนเดอร์หัวข้อและเนื้อหาหลักฝั่ง server ให้ Google อ่านได้ ส่วนที่ใช้ข้อมูลห้อง/ลีดโหลดต่อในเบราว์เซอร์ (`<ClientReady>`)
- title / description / canonical / Open Graph ต่อหน้า: [src/utils/site.ts](src/utils/site.ts) และ `export const metadata` ใน `src/app/**/page.tsx`
- หน้าฟอร์ม หน้าขอบคุณ และ `/staff` ตั้ง `noindex`
- `robots.txt`, `sitemap.xml`, ภาพแชร์ลิงก์ (`opengraph-image.tsx`), favicon (`icon.svg`), JSON-LD (Organization + WebSite + 4 โครงการ) ที่หน้าแรก

## AI มองเห็น (GEO)

AI crawler ส่วนใหญ่ (GPTBot, ClaudeBot, PerplexityBot) ไม่รัน JavaScript จึงทำให้ข้อมูลสำคัญอยู่ใน HTML ตั้งแต่ build

| ทำอะไร | ที่ไหน |
| --- | --- |
| หน้าโครงการ 4 หน้า สร้างเป็น HTML static (SSG ด้วย `generateStaticParams`) + `generateMetadata` | `src/app/projects/[slug]`, `src/views/ProjectView.tsx` |
| ตารางเปรียบเทียบ 4 โครงการ + คำถามที่พบบ่อยบนหน้าแรก (Server Component) | `src/components/seo/` |
| JSON-LD: Organization, WebSite, ApartmentComplex, FAQPage, BreadcrumbList | `src/components/seo/JsonLd.tsx`, `FaqSection.tsx` |
| `/llms.txt` และ `/llms-full.txt` (มาตรฐาน llmstxt.org) | `src/app/llms*.txt/route.ts`, `src/services/llms.ts` |
| robots.txt เปิดให้ AI crawler ชัดเจน | `src/app/robots.ts` |
| 404 จริงสำหรับ slug ที่ไม่มี | `src/proxy.ts` |

ข้อมูลทั้งหมดมาจาก `src/services/knowledge.ts` ซึ่งใช้เฉพาะข้อมูลตลาดจริงจาก 01_DATA พร้อมสถานะ ยืนยัน / ประมาณการ / บทวิเคราะห์ และแหล่งอ้างอิง ไม่ใช้ห้อง ผู้เช่า หรือลีดจำลอง

## Google Ads / Analytics

ตั้ง environment variables ตาม [.env.example](.env.example) แล้ว deploy ใหม่ (ค่า `NEXT_PUBLIC_*` ฝังตอน build)

- โหลด gtag.js ครั้งเดียวสำหรับ Google Ads + GA4 ([src/components/analytics/GoogleTag.tsx](src/components/analytics/GoogleTag.tsx))
- **Consent Mode v2 + แบนเนอร์คุกกี้ (PDPA)**: เริ่มต้น denied จนผู้ใช้กดยอมรับ
- **Conversion**: ส่งตอนลูกค้าส่งฟอร์มสำเร็จ แยก label ผู้เช่า / เจ้าของห้อง ใช้เลขอ้างอิงลีดเป็น `transaction_id` กันนับซ้ำ ([src/services/analytics.ts](src/services/analytics.ts))
- GA4 events: `search`, `select_item`, `generate_lead`
- **ที่มาของลีด**: เก็บ `gclid` / `gbraid` / `wbraid` / `utm_*` ตอนเข้าเว็บ แนบไปกับลีด และแสดงในคอนโซลทีมงาน ใช้ทำ Offline Conversion Import เมื่อปิดการขายได้

ตั้ง Final URL ของโฆษณาเป็น `/tenant` (ผู้เช่า) หรือ `/investor` (นักลงทุน) และเปิด auto-tagging ใน Google Ads

## ก่อนใช้จริง

- เปลี่ยน login เดโมเป็น Google Workspace SSO และตรวจสิทธิ์ที่เซิร์ฟเวอร์
- แก้ `src/services/storage.ts` ให้เก็บลีดในฐานข้อมูลกลาง (Google Sheets + Apps Script หรือ Firebase) แทน localStorage
- ต่อ LINE Messaging API เพื่อแจ้งเตือนเซลส์และส่งนัด/Unit Report ให้ลูกค้า
- ใส่ห้องจริงจากทีม BU/AG แทนห้องจำลอง และใช้ภาพห้องจริง
