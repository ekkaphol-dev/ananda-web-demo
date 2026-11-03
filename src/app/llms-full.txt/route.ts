import { llmsFullTxt } from "@/services/llms";

// /llms-full.txt สำหรับ AI (มาตรฐาน llmstxt.org) · สร้างเป็นไฟล์ static ตอน build
export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
