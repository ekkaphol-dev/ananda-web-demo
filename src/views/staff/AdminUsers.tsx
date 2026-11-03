"use client";

import { useState, type FormEvent } from "react";
import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { ROLE_LABEL } from "@/store/constants";
import type { Role } from "@/store/types";
import { MAIL_RE } from "@/utils/validation";

const PERM = [
  ["ดูลีดผู้เช่า", "✓ ทั้งหมด", "–", "✓ ที่ได้รับมอบหมาย"],
  ["ดูลีดเจ้าของห้อง", "✓ ทั้งหมด", "✓ ที่ได้รับมอบหมาย", "–"],
  ["เห็นเบอร์/อีเมลลูกค้า", "✓", "เฉพาะลีดของตัวเอง", "เฉพาะลีดของตัวเอง"],
  ["อัปเดตสถานะลีด", "✓", "✓", "✓"],
  ["มอบหมาย/ย้ายลีด", "✓", "–", "–"],
  ["ยืนยัน Match", "✓", "–", "–"],
  ["จัดการผู้ใช้", "✓", "–", "–"],
];

export function AdminUsers() {
  const { state, mutate } = useApp();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("sale_rent");
  const [err, setErr] = useState("");
  const U = state.users;

  function add(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const m = email.trim();
    if (n.length < 2 || !MAIL_RE.test(m)) return setErr("กรอกชื่อและอีเมลให้ครบ");
    if (U.some((u) => u.email.toLowerCase() === m.toLowerCase())) return setErr("อีเมลนี้มีในระบบแล้ว");
    mutate((s) => { s.users.push({ id: "u_" + Date.now().toString(36), name: n, email: m, role, active: true }); });
    setName(""); setEmail(""); setErr("");
    toast("เพิ่มผู้ใช้แล้ว");
  }

  return (
    <>
      <div><div className="eyebrow">USERS &amp; ROLES</div><h2>ผู้ใช้และสิทธิ์</h2></div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>ชื่อ</th><th>อีเมล</th><th>สิทธิ์</th><th>ลีดที่ถือ</th><th>สถานะ</th></tr></thead>
          <tbody>
            {U.map((u) => (
              <tr key={u.id}>
                <td><b>{u.name}</b></td>
                <td className="small">{u.email}</td>
                <td>
                  <select className="in" value={u.role} disabled={u.id === "u_admin"} style={{ padding: "5px 8px" }}
                    onChange={(e) => {
                      const r = e.target.value as Role;
                      mutate((s) => { s.users.find((x) => x.id === u.id)!.role = r; });
                      toast(`เปลี่ยนสิทธิ์ ${u.name} เป็น ${ROLE_LABEL[r]}`);
                    }}>
                    {(Object.keys(ROLE_LABEL) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                  </select>
                </td>
                <td className="num">{state.leads.filter((l) => l.assignee === u.id && !["won", "lost"].includes(l.status)).length}</td>
                <td>
                  {u.id === "u_admin" ? (
                    <span className="pill ok">ใช้งาน</span>
                  ) : (
                    <button className="chip" aria-pressed={u.active} onClick={() => mutate((s) => { const x = s.users.find((y) => y.id === u.id)!; x.active = !x.active; })}>
                      {u.active ? "ใช้งาน" : "ปิดใช้งาน"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="card stack" onSubmit={add} noValidate>
        <h3>เพิ่มผู้ใช้</h3>
        <div className="grid2">
          <label className="f">ชื่อ<input className="in" value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="f">อีเมลบริษัท<input className="in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        </div>
        <label className="f">สิทธิ์
          <select className="in" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="sale_rent">{ROLE_LABEL.sale_rent}</option>
            <option value="sale_invest">{ROLE_LABEL.sale_invest}</option>
            <option value="admin">{ROLE_LABEL.admin}</option>
          </select>
        </label>
        <span className="ferr">{err}</span>
        <button className="btn" type="submit">เพิ่มผู้ใช้</button>
      </form>
      <div className="card stack">
        <h3>สิทธิ์แต่ละบทบาท</h3>
        <div className="tbl-wrap" style={{ border: 0 }}>
          <table>
            <thead><tr><th>สิ่งที่ทำได้</th><th>แอดมิน</th><th>Sale เจ้าของห้อง</th><th>Sale ผู้เช่า</th></tr></thead>
            <tbody>
              {PERM.map((r) => (
                <tr key={r[0]}>{r.map((c, i) => <td key={i} className={i ? "small" : undefined}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
