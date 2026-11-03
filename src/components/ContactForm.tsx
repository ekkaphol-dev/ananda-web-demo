"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CONTACT_TIMES } from "@/store/constants";
import { normalizePhone, validateContact, type ContactErrors, type ContactValues } from "@/utils/validation";

type Props = {
  /** ช่องเพิ่มเติมของแต่ละฝั่ง (วางระหว่างอีเมลกับช่วงเวลาติดต่อ) */
  extra?: ReactNode;
  submitLabel: string;
  onSubmit: (v: ContactValues, form: HTMLFormElement) => void;
};

// ฟอร์มติดต่อที่ใช้ร่วมกันทั้งฝั่งผู้เช่าและเจ้าของห้อง (ชื่อ เบอร์ อีเมล ช่วงเวลา + PDPA)
export function ContactForm({ extra, submitLabel, onSubmit }: Props) {
  const [errs, setErrs] = useState<ContactErrors>({});

  function handle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const fd = new FormData(f);
    const v: ContactValues = {
      name: String(fd.get("name") ?? "").trim(),
      phone: normalizePhone(String(fd.get("phone") ?? "")),
      email: String(fd.get("email") ?? "").trim(),
      contactTime: String(fd.get("contactTime") ?? ""),
      pdpa: fd.get("pdpa") === "on",
    };
    const errors = validateContact(v);
    setErrs(errors);
    const bad = (Object.keys(errors) as (keyof ContactErrors)[])[0];
    if (bad) {
      (f.elements.namedItem(bad) as HTMLElement | null)?.focus();
      return;
    }
    onSubmit(v, f);
  }

  return (
    <form className="card stack" onSubmit={handle} noValidate>
      <div className="grid2">
        <label className="f">
          ชื่อ–นามสกุล
          <input className={`in ${errs.name ? "err" : ""}`} name="name" autoComplete="name" required />
          <span className="ferr">{errs.name}</span>
        </label>
        <label className="f">
          เบอร์โทรศัพท์
          <input className={`in num ${errs.phone ? "err" : ""}`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxx" required />
          <span className="ferr">{errs.phone}</span>
        </label>
      </div>
      <label className="f">
        อีเมล
        <input className={`in ${errs.email ? "err" : ""}`} name="email" type="email" autoComplete="email" placeholder="name@email.com" required />
        <span className="ferr">{errs.email}</span>
      </label>
      {extra}
      <label className="f">
        ช่วงเวลาที่สะดวกให้ติดต่อ
        <select className="in" name="contactTime">
          {CONTACT_TIMES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="check">
        <input type="checkbox" name="pdpa" />
        <span>ยินยอมให้ อนันดา ดีเวลลอปเม้นท์ ใช้ข้อมูลเพื่อติดต่อกลับและจับคู่ห้องตามนโยบายความเป็นส่วนตัว ข้อมูลของคุณจะไม่ถูกเปิดเผยต่อผู้เช่าหรือเจ้าของห้องอีกฝั่ง</span>
      </label>
      <span className="ferr">{errs.pdpa}</span>
      <button className="btn block" type="submit">{submitLabel}</button>
    </form>
  );
}
