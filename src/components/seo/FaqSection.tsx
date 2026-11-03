import { faq } from "@/services/knowledge";
import { JsonLd } from "./JsonLd";

// คำถามที่พบบ่อย: แสดงบนหน้าเว็บ (ฝั่ง server) + FAQPage schema ให้ Google / AI ดึงคำตอบไปใช้
export function FaqSection() {
  const items = faq();
  return (
    <section className="wrap section" style={{ paddingTop: 0 }} aria-labelledby="faq-h">
      <div className="sec-head"><h2 id="faq-h">คำถามที่พบบ่อย</h2></div>
      <div className="stack">
        {items.map((x) => (
          <details key={x.q} className="card faq">
            <summary><b>{x.q}</b></summary>
            <p className="small muted" style={{ margin: "8px 0 0" }}>{x.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
        }}
      />
    </section>
  );
}
