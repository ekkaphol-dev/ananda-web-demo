import Link from "next/link";

export function EmptyState({ title, text, href, cta }: { title: string; text: string; href: string; cta: string }) {
  return (
    <section className="wrap section">
      <div className="card empty">
        <h3>{title}</h3>
        <p className="small">{text}</p>
        <p style={{ marginTop: 12 }}>
          <Link className="btn" href={href}>{cta}</Link>
        </p>
      </div>
    </section>
  );
}
