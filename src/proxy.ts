import { NextResponse, type NextRequest } from "next/server";
import { PROJECT_SLUGS } from "@/utils/site";

// หน้าโครงการเป็น SSG และ shell ถูกส่งออกไปก่อน ทำให้ notFound() ได้สถานะ 200 (soft 404)
// จึงตรวจ slug ที่นี่ก่อน แล้วตอบ 404 จริงให้ Google / AI crawler
export function proxy(req: NextRequest) {
  const slug = req.nextUrl.pathname.split("/")[2];
  if (!(PROJECT_SLUGS as readonly string[]).includes(slug)) {
    return NextResponse.rewrite(new URL("/_not-found", req.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: "/projects/:slug" };
