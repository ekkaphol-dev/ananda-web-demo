import Link from "next/link";
import { ArrowIcon } from "./Icons";

export function ActionBar({ count, prefix, unit, href, cta }: { count: number; prefix: string; unit: string; href: string; cta: string }) {
  if (!count) return null;
  return (
    <div className="actionbar">
      <div className="wrap">
        <span className="cnt grow">{prefix} <span className="num">{count}</span> {unit}</span>
        <Link className="btn" href={href}>{cta} <ArrowIcon /></Link>
      </div>
    </div>
  );
}
