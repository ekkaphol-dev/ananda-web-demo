"use client";

import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { ConsoleLayout } from "@/layouts/ConsoleLayout";
import type { Role } from "@/store/types";
import { AdminMatch } from "./AdminMatch";
import { AdminOverview } from "./AdminOverview";
import { AdminUsers } from "./AdminUsers";
import { LeadsView } from "./LeadsView";
import { LoginView } from "./LoginView";
import { SalesDemand, SalesRooms } from "./SalesViews";

const TABS: Record<Role, [string, string][]> = {
  admin: [["overview", "ภาพรวม"], ["match", "ยืนยัน Match"], ["leads", "ลีดทั้งหมด"], ["users", "ผู้ใช้ & สิทธิ์"]],
  sale_invest: [["myleads", "ลีดเจ้าของห้อง"], ["demand", "Demand Board"]],
  sale_rent: [["myleads", "ลีดผู้เช่า"], ["rooms", "ห้องในระบบ"]],
};

export function StaffView() {
  const { state, me, ui, setUi, mutate } = useApp();
  const toast = useToast();
  if (!me) return <LoginView />;

  const tabs = TABS[me.role];
  const tab = tabs.some((t) => t[0] === ui.tab) ? ui.tab! : tabs[0][0];
  const side = me.role === "sale_rent" ? "rent" : "invest";
  const myNew = state.leads.filter((l) => l.status === "new" && (me.role === "admin" || (l.side === side && l.assignee === me.id))).length;
  const go = (k: string) => setUi({ tab: k, leadId: null });

  return (
    <ConsoleLayout
      me={me}
      tabs={tabs}
      active={tab}
      badge={myNew}
      onTab={go}
      onLogout={() => {
        mutate((s) => { s.session = null; });
        setUi({ tab: null });
        toast("ออกจากระบบแล้ว");
      }}
    >
      {tab === "overview" && <AdminOverview onGoto={go} />}
      {tab === "match" && <AdminMatch />}
      {tab === "leads" && <LeadsView side="all" />}
      {tab === "users" && <AdminUsers />}
      {tab === "myleads" && <LeadsView side={side} />}
      {tab === "demand" && <SalesDemand />}
      {tab === "rooms" && <SalesRooms />}
    </ConsoleLayout>
  );
}
