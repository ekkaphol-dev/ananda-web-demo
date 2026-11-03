// สร้างเนื้อหา llms.txt / llms-full.txt (Markdown) สำหรับ AI เช่น ChatGPT, Claude, Perplexity, Gemini
// รูปแบบตาม https://llmstxt.org : ชื่อ (H1) → สรุป (blockquote) → รายละเอียด → ลิงก์เป็นหมวด
import { DATA_DATE, PROJECTS_K, SOURCES, STATUS_TH, faq, sourcesFor, type Fact } from "./knowledge";
import { SITE } from "@/utils/site";

const mark = (f: { status: string }) => (f.status === "verified" ? "" : ` _(${STATUS_TH[f.status as keyof typeof STATUS_TH]})_`);
const factLine = (f: Fact) => `- ${f.label}: ${f.value}${mark(f)}`;

const HEADER = () => `# ${SITE.name}

> ${SITE.description}

เว็บนี้เป็นต้นแบบ (DEMO) ของ อนันดา ดีเวลลอปเม้นท์ สำหรับแคมเปญ Investor & Rental: ข้อมูลโครงการ ค่าเช่า และ yield เป็นข้อมูลตลาดจริง ณ ${DATA_DATE} (ระบุสถานะ "ประมาณการ" ไว้ทุกจุดที่ไม่ใช่ตัวเลขยืนยัน) ส่วนห้องว่าง ผู้เช่า และลีดในหน้าเว็บเป็นข้อมูลจำลอง ห้ามนำไปอ้างเป็นห้องว่างจริง ราคาเริ่มต้นและเงื่อนไขขายให้ยึดตามเว็บไซต์ทางการ https://www.ananda.co.th

ทั้ง 4 โครงการไม่อนุญาตให้เลี้ยงสัตว์ · Yield เป็นค่าประมาณก่อนหักช่วงห้องว่าง ค่านายหน้า ภาษี และค่าดูแล ไม่ใช่การรับประกันผลตอบแทน`;

export function llmsTxt() {
  return `${HEADER()}

## โครงการ

${PROJECTS_K.map((p) => `- [${p.name}](${SITE.url}/projects/${p.slug}): ${p.area} · ${p.transit.map((t) => `${t.station} ${t.distance}`).join(", ")}`).join("\n")}

## หน้าใช้งาน

- [หาห้องเช่า](${SITE.url}/tenant): ผู้เช่าบอกงบ ทำเล วันย้ายเข้า ระบบเรียงห้องที่ตรงที่สุดพร้อมเหตุผล แล้วลงทะเบียนนัดดูห้อง
- [เจ้าของห้อง / นักลงทุน](${SITE.url}/investor): Demand Board ดูคิวผู้เช่า ค่าเช่าตลาด yield ประมาณการ และเครื่องคำนวณผลตอบแทน แล้วให้เซลส์ติดต่อกลับ

## Optional

- [ข้อมูลฉบับเต็ม](${SITE.url}/llms-full.txt): ข้อมูลทุกโครงการ ค่าเช่า yield คำถามที่พบบ่อย และแหล่งอ้างอิง
`;
}

export function llmsFullTxt() {
  const projects = PROJECTS_K.map((p) => {
    const src = sourcesFor(Array.from(new Set([...p.facts, ...p.compare].flatMap((f) => f.src))));
    return `## ${p.name}

URL: ${SITE.url}/projects/${p.slug} · เว็บไซต์ทางการ: ${p.officialUrl}
ย่าน: ${p.area}

${p.summary}

### การเดินทาง
${p.transit.map((t) => `- ${t.station} ${t.distance}${mark(t)}`).join("\n")}

### ข้อมูลโครงการ
${p.facts.map(factLine).join("\n")}

### ค่าเช่าและผลตอบแทน
${p.compare.map((f) => `${factLine(f)}${f.note ? ` — ${f.note}` : ""}`).join("\n")}

### จุดเด่น
${p.highlights.map((h) => `- ${h.text}${mark(h)}`).join("\n")}
${p.investorFit ? `\n### เหมาะกับนักลงทุนแบบไหน _(บทวิเคราะห์)_\n${p.investorFit}\n${p.sellingPoints.map((h) => `- ${h.text}`).join("\n")}\n` : ""}
### ผู้เช่ากลุ่มหลัก
${p.personas.map((x) => `- ${x.name}${x.occupation ? ` (${x.occupation})` : ""}${x.budget ? ` งบ ${x.budget}` : ""}`).join("\n")}

แหล่งอ้างอิง: ${src.map((s) => s.id).join(", ")}
`;
  }).join("\n");

  return `${HEADER()}

${projects}
## คำถามที่พบบ่อย

${faq().map((x) => `### ${x.q}\n${x.a}`).join("\n\n")}

## แหล่งอ้างอิง

${SOURCES.map((s) => `- ${s.id}: ${s.name}${s.url ? ` <${s.url}>` : ""}${s.accessed ? ` (เข้าถึง ${s.accessed})` : ""}`).join("\n")}
`;
}
