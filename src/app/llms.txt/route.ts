import { llmsTxt } from "@/services/llms";

// /llms.txt สำหรับ AI (มาตรฐาน llmstxt.org) · สร้างเป็นไฟล์ static ตอน build
export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
