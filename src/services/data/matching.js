// ตรรกะจับคู่ผู้เช่ากับห้อง ไม่แตะหน้าจอ เพื่อให้ทดสอบแยกได้
// น้ำหนัก: งบ 35 · ประเภทห้อง 20 · ย่าน 15 · วันเข้าอยู่ 10 · รถไฟฟ้า 10 · ไลฟ์สไตล์ 10
// ด้านที่ผู้เช่าไม่ได้ระบุจะไม่นำมาคิด แล้วปรับฐานคะแนนเป็น 100
export function install(root) {
  const C = root.CATALOG;
  const WEIGHTS = { budget: 35, type: 20, zone: 15, date: 10, commute: 10, lifestyle: 10 };
  const MATCH_MIN = 70; // ตั้งแต่ค่านี้นับเป็น "ผู้เช่าที่ match"
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const dayDiff = (a, b) => Math.round((new Date(a + 'T00:00:00') - new Date(b + 'T00:00:00')) / 86400000);

  function scoreBudget(t, room, out) {
    const over = (room.price - t.budgetMax) / t.budgetMax;
    if (over <= 0) {
      out.pos.push(room.price < t.budgetMin ? `ต่ำกว่างบที่ตั้งไว้ (${fmt(room.price)} บาท)` : `ตรงงบ (${fmt(room.price)} บาท/เดือน)`);
      return 1;
    }
    const pct = Math.ceil(over * 100);
    if (over <= 0.05) { out.neg.push(`เกินงบเล็กน้อย ${pct}%`); return 0.7; }
    if (over <= 0.15) { out.neg.push(`เกินงบ ${pct}%`); return 0.35; }
    if (over <= 0.25) { out.neg.push(`เกินงบ ${pct}%`); return 0.1; }
    out.neg.push(`เกินงบมาก (${pct}%)`);
    out.blockers.push({ code: 'budget', text: 'ค่าเช่าเกินงบเกิน 25%', cap: 45 });
    return 0;
  }

  function scoreCommute(t, project, out) {
    if (!t.commute || t.commute === 'none') return null;
    const list = project.stations.filter((s) => t.commute === 'any' || s.line === t.commute);
    if (!list.length) {
      const other = project.stations[0];
      out.neg.push(`ไม่มี ${t.commute} ใกล้โครงการ (ใกล้สุดคือ ${other.name})`);
      return 0.25;
    }
    const s = list.slice().sort((a, b) => a.m - b.m)[0];
    const min = C.walkMin(s.m);
    out.pos.push(`เดินถึง ${s.name} ~${min} นาที (${fmt(s.m)} ม.)`);
    return s.m <= 300 ? 1 : s.m <= 400 ? 0.9 : 0.7;
  }

  function scoreLifestyle(t, room, project, unit, out) {
    const tags = (t.lifestyle || []).filter((x) => x !== 'pet');
    const hasPet = (t.lifestyle || []).includes('pet');
    if (hasPet) {
      if (project.petsBanned) {
        out.neg.push('โครงการนี้ไม่อนุญาตสัตว์เลี้ยง');
        out.blockers.push({ code: 'pet', text: 'โครงการไม่อนุญาตสัตว์เลี้ยง', cap: 30 });
      } else if (!room.pets) {
        out.neg.push('เจ้าของห้องไม่รับสัตว์เลี้ยง');
        out.blockers.push({ code: 'pet', text: 'เจ้าของห้องไม่รับสัตว์เลี้ยง', cap: 30 });
      } else {
        out.pos.push('เจ้าของรับสัตว์เลี้ยง (ต้องยืนยันข้อบังคับนิติบุคคล)');
      }
    }
    if (!tags.length && !hasPet) return null;
    if (!tags.length) return out.blockers.some((b) => b.code === 'pet') ? 0 : 1;
    let got = 0;
    tags.forEach((tag) => {
      if (tag === 'furnished') {
        if (room.furniture === 'full') { got += 1; out.pos.push('แต่งครบ พร้อมเข้าอยู่'); } else out.neg.push(room.furniture === 'partial' ? 'แต่งบางส่วน' : 'เป็นห้องเปล่า');
        return;
      }
      if (tag === 'quiet') {
        if (room.floor >= 20) { got += 1; out.pos.push(`ชั้น ${room.floor} อยู่สูงจากถนน`); } else { got += 0.4; }
        out.notes.push(C.QUIET_NOTE[project.id]);
        return;
      }
      if (tag === 'wfh' && unit.workroom) { got += 1; out.pos.push('มีห้องอเนกประสงค์ใช้เป็นห้องทำงาน'); return; }
      const v = project.traits[tag];
      if (v) {
        got += (C.TRAIT_PARTIAL[project.id] || {})[tag] ? 0.5 : 1;
        out.pos.push(v);
      } else {
        const lab = C.LIFESTYLES.find((l) => l.id === tag).label;
        out.neg.push(`ไม่มีข้อมูลยืนยันเรื่อง${lab}`);
      }
    });
    return got / tags.length;
  }

  function match(t, room) {
    const project = C.PROJECTS[room.zone];
    const unit = C.getUnit(room.zone, room.unitId);
    const out = { pos: [], neg: [], notes: [], blockers: [] };
    const parts = {};

    parts.budget = scoreBudget(t, room, out);
    // เรียกก่อนด้านอื่น เพื่อให้เหตุผลเรื่องเวลาเดินขึ้นบนการ์ดเสมอ
    const cm = scoreCommute(t, project, out);
    if (cm !== null) parts.commute = cm;

    if (t.types && t.types.length) {
      if (t.types.includes(room.type)) { parts.type = 1; out.pos.push(`ประเภทห้องตรง (${C.TYPE_LABEL[room.type]})`); }
      else { parts.type = 0; out.neg.push(`เป็นห้อง${C.TYPE_LABEL[room.type]} ไม่ตรงที่ต้องการ`); out.blockers.push({ code: 'type', text: 'ประเภทห้องไม่ตรง', cap: 60 }); }
    }
    if (t.zones && t.zones.length) {
      if (t.zones.includes(room.zone)) { parts.zone = 1; out.pos.push(`อยู่ในย่านที่ต้องการ (${project.zoneName.split(' ')[0]})`); }
      else { parts.zone = 0; out.neg.push('อยู่นอกย่านที่เลือก'); out.blockers.push({ code: 'zone', text: 'อยู่นอกย่านที่เลือก', cap: 65 }); }
    }
    if (t.moveIn) {
      const late = dayDiff(room.availableFrom, t.moveIn);
      if (late <= 0) { parts.date = 1; out.pos.push('ห้องว่างทันวันย้ายเข้า'); }
      else if (late <= 14) { parts.date = 0.6; out.neg.push(`ห้องว่างช้ากว่าวันย้ายเข้า ${late} วัน`); }
      else if (late <= 30) { parts.date = 0.25; out.neg.push(`ห้องว่างช้ากว่าวันย้ายเข้า ${late} วัน`); }
      else { parts.date = 0; out.neg.push(`ห้องว่างช้ากว่าวันย้ายเข้า ${late} วัน`); }
    }
    const ls = scoreLifestyle(t, room, project, unit, out);
    if (ls !== null) parts.lifestyle = ls;

    if (t.lease && room.minLease > t.lease) {
      out.neg.push(`เจ้าของต้องการสัญญาอย่างน้อย ${room.minLease} เดือน`);
      parts.lifestyle = (parts.lifestyle === undefined ? 1 : parts.lifestyle) * 0.5;
    }

    let earned = 0, total = 0;
    Object.keys(parts).forEach((k) => { earned += parts[k] * WEIGHTS[k]; total += WEIGHTS[k]; });
    let score = total ? Math.round((earned / total) * 100) : 0;
    out.blockers.forEach((b) => { score = Math.min(score, b.cap); });
    return { score, pos: out.pos, neg: out.neg, notes: out.notes, blockers: out.blockers, isMatch: score >= MATCH_MIN };
  }

  const label = (s) => (s >= 85 ? 'เหมาะมาก' : s >= MATCH_MIN ? 'เหมาะ' : s >= 50 ? 'พอไปได้' : 'ไม่ค่อยตรง');

  root.MATCHING = { match, label, MATCH_MIN, WEIGHTS, dayDiff };
}
