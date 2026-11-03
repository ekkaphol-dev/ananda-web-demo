"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppMaybe } from "@/hooks/useApp";
import { MarkIcon } from "./Icons";

const ITEMS: [string, string, string][] = [
  ["/", "หน้าหลัก", "hide-m"],
  ["/tenant", "หาห้องเช่า", ""],
  ["/investor", "เจ้าของห้อง", ""],
];

export function TopBar() {
  const path = usePathname();
  const me = useAppMaybe()?.me;
  const on = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <header id="topbar">
      <div className="wrap">
        <Link className="brand" href="/">
          <span className="brand-mark"><MarkIcon /></span>
          <span>
            <b>URBAN MATCH</b>
            <small>ANANDA · INVESTOR &amp; RENTAL</small>
          </span>
        </Link>
        <nav id="nav" aria-label="เมนูหลัก">
          {ITEMS.map(([h, l, c]) => (
            <Link key={h} href={h} className={`${c} ${on(h) ? "on" : ""}`}>{l}</Link>
          ))}
          <Link href="/staff" className={on("/staff") ? "on" : ""}>{me ? "คอนโซลทีมงาน" : "ทีมงาน"}</Link>
        </nav>
      </div>
    </header>
  );
}
