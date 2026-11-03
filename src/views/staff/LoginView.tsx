"use client";

import { useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/Icons";
import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { DEMO_PASSWORD, ROLE_LABEL } from "@/store/constants";
import { login } from "@/store/umStore";

export function LoginView() {
  const { state, mutate, setUi } = useApp();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const r = mutate((s) => login(s, email, pw));
    if (!r.ok) return setErr(r.msg);
    toast("ยินดีต้อนรับ " + r.user.name);
    setUi({ tab: null });
  }

  return (
    <section className="wrap">
      <div className="login card stack">
        <div className="eyebrow">STAFF LOGIN</div>
        <h2>เข้าสู่คอนโซลทีมงาน</h2>
        <p className="small muted">แยกสิทธิ์ 3 แบบ: แอดมิน · Sale เจ้าของห้อง · Sale ผู้เช่า แต่ละคนเห็นเฉพาะข้อมูลที่ต้องใช้</p>
        <form className="stack" onSubmit={submit} noValidate>
          <label className="f">อีเมล<input className="in" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="f">รหัสผ่าน<input className="in" id="l-pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} /></label>
          <span className="ferr" role="alert">{err}</span>
          <button className="btn block" type="submit">เข้าสู่ระบบ</button>
        </form>
        <div className="stack" style={{ gap: 6 }}>
          <span className="small muted">บัญชีเดโม (รหัสผ่าน <b className="num">{DEMO_PASSWORD}</b>) · แตะเพื่อกรอกให้</span>
          <div className="demo-acc">
            {state.users.filter((u) => ["u_admin", "u_inv1", "u_rent1"].includes(u.id)).map((u) => (
              <button key={u.id} type="button" onClick={() => { setEmail(u.email); setPw(DEMO_PASSWORD); document.getElementById("l-pw")?.focus(); }}>
                <span><b>{ROLE_LABEL[u.role]}</b><br /><span className="small muted">{u.email}</span></span>
                <ArrowIcon />
              </button>
            ))}
          </div>
        </div>
        <p className="small muted">ระบบจริงใช้ Google Workspace SSO ของบริษัท และตรวจสิทธิ์ที่เซิร์ฟเวอร์ ไม่ใช้รหัสผ่านร่วม</p>
      </div>
    </section>
  );
}
