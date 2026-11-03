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

## ก่อนใช้จริง

- เปลี่ยน login เดโมเป็น Google Workspace SSO และตรวจสิทธิ์ที่เซิร์ฟเวอร์
- แก้ `src/services/storage.ts` ให้เก็บลีดในฐานข้อมูลกลาง (Google Sheets + Apps Script หรือ Firebase) แทน localStorage
- ต่อ LINE Messaging API เพื่อแจ้งเตือนเซลส์และส่งนัด/Unit Report ให้ลูกค้า
- ใส่ห้องจริงจากทีม BU/AG แทนห้องจำลอง และใช้ภาพห้องจริง
