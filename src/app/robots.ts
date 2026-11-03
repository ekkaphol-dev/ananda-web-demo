import type { MetadataRoute } from "next";
import { SITE } from "@/utils/site";

// AI crawler ที่เปิดให้เข้าอ่าน (ใช้ตอบคำถามผู้ใช้และค้นหา)
// ถ้าไม่อยากให้นำข้อมูลไปเทรนโมเดล ย้าย GPTBot / ClaudeBot / Google-Extended / Applebot-Extended / CCBot ไปไว้ในกลุ่ม disallow
const AI_BOTS = [
  "OAI-SearchBot", "ChatGPT-User", "GPTBot", // OpenAI
  "Claude-SearchBot", "Claude-User", "ClaudeBot", // Anthropic
  "PerplexityBot", "Perplexity-User", // Perplexity
  "Google-Extended", "Applebot-Extended", "Applebot", "Bingbot", "meta-externalagent", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ไม่ใช้ disallow กับหน้าฟอร์ม/คอนโซล เพราะหน้าเหล่านั้นมี <meta robots="noindex"> อยู่แล้ว
      // ถ้า disallow Google จะอ่าน noindex ไม่ได้ และอาจยังโชว์ URL ในผลค้นหา
      { userAgent: "*", allow: "/" },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
