import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// ภาพตัวอย่างตอนแชร์ลิงก์ (Facebook / LINE / Google Ads) · ข้อความภาษาอังกฤษเพราะ ImageResponse ไม่รองรับฟอนต์ woff2 ภาษาไทย
export const alt = "Ananda Urban Match · Rent near work, invest with tenants waiting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BUILDINGS = ["thonglor", "chula", "rama4", "rama9"];
// สัดส่วนกว้าง/สูงของภาพ src/assets/og/*.png (สูง 420px) ใช้กำหนดความกว้างให้ satori ไม่ให้ภาพล้นทับข้อความ
const RATIO = [203 / 420, 156 / 420, 246 / 420, 182 / 420];
const IMG_H = [230, 280, 250, 300];
const NAMES = ["Culture Thonglor", "Culture Chula", "IDEO Sukhumvit - Rama 4", "IDEO Rama 9 - Asoke"];

// อ่านภาพตอน build (สร้างภาพครั้งเดียวเป็นไฟล์ static)
const imgs = await Promise.all(
  BUILDINGS.map(async (b) => `data:image/png;base64,${(await readFile(join(process.cwd(), "src/assets/og", `${b}.png`))).toString("base64")}`),
);

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0B1A44", color: "#fff", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "#0032C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20V10l8-6 8 6v10" />
                <path d="M9 20v-5h6v5" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>URBAN MATCH</span>
              <span style={{ fontSize: 18, opacity: 0.7, letterSpacing: 2 }}>ANANDA · INVESTOR &amp; RENTAL</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>Rent near work.</span>
            <span style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1, color: "#7FA4FF" }}>Invest with tenants waiting.</span>
            <span style={{ fontSize: 24, opacity: 0.75, marginTop: 8 }}>4 ready-to-move-in Ananda condominiums near BTS &amp; MRT</span>
          </div>
          <span style={{ fontSize: 20, opacity: 0.6 }}>{NAMES.join("  ·  ")}</span>
        </div>
        <div style={{ display: "flex", width: 480, marginLeft: "auto", alignItems: "flex-end", justifyContent: "flex-end", gap: 2 }}>
          {imgs.map((src, i) => (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img key={i} src={src} height={IMG_H[i]} width={Math.round(IMG_H[i] * RATIO[i])} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
