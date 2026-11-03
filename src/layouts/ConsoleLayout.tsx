"use client";

import type { ReactNode } from "react";
import { ROLE_LABEL } from "@/store/constants";
import type { User } from "@/store/types";

type Props = {
  me: User;
  tabs: [string, string][];
  active: string;
  badge: number;
  onTab: (k: string) => void;
  onLogout: () => void;
  children: ReactNode;
};

// โครงหน้าคอนโซลทีมงาน: แถบเมนูซ้ายตามสิทธิ์ + พื้นที่เนื้อหา
export function ConsoleLayout({ me, tabs, active, badge, onTab, onLogout, children }: Props) {
  return (
    <div className="console">
      <nav className="sidebar" role="tablist" aria-label="เมนูคอนโซล">
        <div className="role">
          <b style={{ color: "var(--ink)" }}>{me.name}</b>
          <br />
          {ROLE_LABEL[me.role]}
        </div>
        {tabs.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={active === k} onClick={() => onTab(k)}>
            {l}
            {(k === "myleads" || k === "leads") && badge > 0 && <span className="pill warn">{badge}</span>}
          </button>
        ))}
        <button style={{ marginTop: "auto" }} onClick={onLogout}>ออกจากระบบ</button>
      </nav>
      <div className="cmain">{children}</div>
    </div>
  );
}
