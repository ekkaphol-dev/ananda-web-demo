import Link from "next/link";
import { PROJECTS_K } from "@/services/knowledge";

// ท้ายเว็บ: ลิงก์ไปทุกหน้าโครงการ ช่วยให้ crawler เดินถึงทุกหน้า
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <nav aria-label="โครงการ" className="row" style={{ flexWrap: "wrap", gap: "6px 18px" }}>
          {PROJECTS_K.map((p) => <Link key={p.slug} href={`/projects/${p.slug}`}>{p.name}</Link>)}
          <Link href="/tenant">หาห้องเช่า</Link>
          <Link href="/investor">เจ้าของห้อง / นักลงทุน</Link>
        </nav>
        <p className="small muted" style={{ margin: "10px 0 0" }}>
          © อนันดา ดีเวลลอปเม้นท์ · ต้นแบบเพื่อนำเสนอ ข้อมูลตลาดเป็นข้อมูลจริง ส่วนห้อง ผู้เช่า และลีดเป็นข้อมูลจำลอง ·{" "}
          <a href="https://www.ananda.co.th" target="_blank" rel="noopener">ananda.co.th</a>
        </p>
      </div>
    </footer>
  );
}
