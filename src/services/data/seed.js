// ข้อมูลจำลองเริ่มต้น ทุกห้องตั้งค่าเช่าอยู่ในช่วงของ 01_DATA และผู้เช่าทุกคนใช้งบ/ประเภทห้องจาก persona ในไฟล์เดียวกัน
// tools/test_logic.js ตรวจเงื่อนไขนี้ทุกครั้ง
export function install(root) {
  const C = root.CATALOG;
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (n) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return iso(d); };

  const OWNERS = [
    { id: 'o1', name: 'คุณศิริพร ว.', note: 'นักลงทุน 5 ห้อง ใน 4 โครงการ' },
    { id: 'o2', name: 'คุณธนา ก.', note: 'นักลงทุน' },
    { id: 'o3', name: 'คุณมาลี ส.', note: 'นักลงทุน' },
    { id: 'o4', name: 'คุณภาคิน ร.', note: 'นักลงทุน' },
    { id: 'o5', name: 'คุณวรินทร์ ท.', note: 'นักลงทุน' },
  ];

  // zone, unitId, ชั้น, ตร.ม., เฟอร์นิเจอร์, ค่าเช่า, ว่างอีกกี่วัน, สัตว์เลี้ยง, สัญญาขั้นต่ำ, เจ้าของ
  const R = [
    ['thonglor', 'th_studio', 12, 26, 'full', 23000, 5, false, 12, 'o1'],
    ['thonglor', 'th_hybrid', 28, 27.5, 'full', 26000, 14, false, 12, 'o2'],
    ['thonglor', 'th_studio', 8, 26, 'full', 21000, 0, false, 6, 'o3'],
    ['thonglor', 'th_1br', 18, 32, 'full', 29000, 10, true, 12, 'o4'],
    ['thonglor', 'th_1br', 31, 32, 'full', 32000, 30, false, 12, 'o5'],
    ['thonglor', 'th_2br', 22, 51, 'full', 48000, 20, false, 12, 'o2'],
    ['thonglor', 'th_2br', 34, 69, 'full', 72000, 45, true, 12, 'o5'],
    ['chula', 'ch_1br', 9, 36, 'full', 33000, 0, false, 10, 'o3'],
    ['chula', 'ch_1br', 15, 38, 'full', 35000, 7, false, 12, 'o1'],
    ['chula', 'ch_1br', 24, 40, 'full', 37000, 21, false, 12, 'o2'],
    ['chula', 'ch_1plus', 27, 42, 'full', 39000, 14, false, 12, 'o4'],
    ['chula', 'ch_1br', 6, 36, 'partial', 30000, 40, false, 10, 'o5'],
    ['chula', 'ch_2br', 20, 56, 'full', 55000, 10, false, 12, 'o4'],
    ['chula', 'ch_2br', 29, 60, 'full', 60000, 30, false, 12, 'o3'],
    ['phrakhanong', 'pk_ns', 7, 29.5, 'full', 18500, 3, false, 12, 'o2'],
    ['phrakhanong', 'pk_ns', 14, 29.5, 'full', 20000, 0, false, 12, 'o1'],
    ['phrakhanong', 'pk_ns', 23, 30, 'full', 22000, 18, false, 12, 'o5'],
    ['phrakhanong', 'pk_1br', 11, 35, 'full', 26000, 12, true, 12, 'o3'],
    ['phrakhanong', 'pk_plus', 19, 44.5, 'full', 30000, 7, true, 12, 'o1'],
    ['phrakhanong', 'pk_plus', 26, 44.5, 'partial', 33000, 25, false, 12, 'o4'],
    ['phrakhanong', 'pk_2br', 16, 60, 'full', 50000, 15, false, 12, 'o2'],
    ['phrakhanong', 'pk_2br', 29, 65, 'full', 54000, 35, true, 12, 'o5'],
    ['rama9', 'r9_studio', 10, 26, 'full', 16000, 0, false, 12, 'o5'],
    ['rama9', 'r9_studio', 21, 28, 'full', 18000, 9, false, 12, 'o1'],
    ['rama9', 'r9_studio', 30, 32, 'full', 21000, 20, false, 12, 'o3'],
    ['rama9', 'r9_1br', 13, 34, 'full', 24000, 5, false, 12, 'o2'],
    ['rama9', 'r9_1br', 25, 34, 'full', 26000, 16, false, 12, 'o4'],
    ['rama9', 'r9_1br', 33, 39, 'partial', 29000, 28, false, 12, 'o3'],
    ['rama9', 'r9_2br', 17, 52, 'full', 36000, 12, false, 12, 'o2'],
    ['rama9', 'r9_2br', 28, 60, 'full', 41000, 24, false, 12, 'o5'],
  ];

  // persona จากไฟล์ + ความต้องการเพิ่มเติมที่แอปใช้จับคู่ (ย่าน รถไฟฟ้า ไลฟ์สไตล์ สรุปจาก who/room/lease ของ persona)
  const P = [
    ['thonglor_jp_expat', ['thonglor'], 'BTS', ['furnished', 'service'], 12, 21],
    ['thonglor_remote_worker', ['thonglor', 'phrakhanong'], 'BTS', ['wfh', 'furnished'], 6, 10],
    ['thonglor_thai_creative', ['thonglor'], 'BTS', ['wfh'], 12, 14],
    ['chula_student', ['chula'], 'any', ['near_uni', 'furnished'], 10, 30],
    ['chula_medical', ['chula'], 'none', ['near_hospital', 'quiet'], 12, 21],
    ['chula_silom_worker', ['chula'], 'any', ['wfh'], 12, 18],
    ['phrakhanong_expat_upgrade', ['phrakhanong', 'thonglor'], 'BTS', ['furnished'], 12, 28],
    ['phrakhanong_first_jobber', ['phrakhanong'], 'BTS', ['furnished'], 12, 14],
    ['phrakhanong_tech_couple', ['phrakhanong'], 'BTS', ['wfh'], 12, 21],
    ['rama9_cbd_worker', ['rama9'], 'MRT', ['furnished'], 12, 10],
    ['rama9_chinese_professional', ['rama9'], 'MRT', ['furnished', 'airport'], 12, 14],
    ['rama9_couple_2br', ['rama9'], 'MRT', ['fitness'], 12, 30],
  ];
  // ผู้เช่าเพิ่มเติมในกลุ่ม persona เดิม งบอยู่ในช่วงของ persona นั้น
  const EXTRA = [
    { id: 't_kaito', name: 'คุณไคโตะ', persona: 'thonglor_jp_expat', budgetMin: 32000, budgetMax: 42000, types: ['one_bed'], zones: ['thonglor'], commute: 'BTS', lifestyle: ['furnished'], lease: 12, moveIn: 12 },
    { id: 't_lena', name: 'Lena', persona: 'thonglor_remote_worker', budgetMin: 22000, budgetMax: 30000, types: ['studio'], zones: ['thonglor'], commute: 'BTS', lifestyle: ['wfh', 'service'], lease: 6, moveIn: 7 },
    { id: 't_fah', name: 'น้องฟ้า', persona: 'chula_student', budgetMin: 28000, budgetMax: 36000, types: ['one_bed'], zones: ['chula'], commute: 'any', lifestyle: ['near_uni'], lease: 10, moveIn: 45 },
    { id: 't_noah', name: 'Noah + สุนัข 1 ตัว', persona: 'phrakhanong_expat_upgrade', budgetMin: 30000, budgetMax: 53000, types: ['one_bed', 'two_bed'], zones: ['phrakhanong', 'thonglor'], commute: 'BTS', lifestyle: ['pet'], lease: 12, moveIn: 30 },
    { id: 't_bee', name: 'คุณบี', persona: 'phrakhanong_first_jobber', budgetMin: 18000, budgetMax: 22000, types: ['studio'], zones: ['phrakhanong'], commute: 'BTS', lifestyle: [], lease: 12, moveIn: 7 },
    { id: 't_kan', name: 'คู่คุณกานต์ + แมว 1 ตัว', persona: 'rama9_couple_2br', budgetMin: 33000, budgetMax: 48000, types: ['two_bed'], zones: ['rama9'], commute: 'MRT', lifestyle: ['pet'], lease: 12, moveIn: 30 },
  ];

  function personas() {
    const out = {};
    root.MARKET.zones.forEach((z) => z.personas.forEach((p) => { out[p.id] = Object.assign({ zone: z.id }, p); }));
    return out;
  }

  function build() {
    const PS = personas();
    const counters = {};
    const rooms = R.map((r) => {
      const [zone, unitId, floor, sqm, furniture, price, inDays, pets, minLease, ownerId] = r;
      const unit = C.getUnit(zone, unitId);
      const prefix = { thonglor: 'CT', chula: 'CC', phrakhanong: 'IS', rama9: 'IR' }[zone];
      counters[zone] = (counters[zone] || 0) + 1;
      return { id: `${prefix}-${floor}${String(counters[zone]).padStart(2, '0')}`, zone, unitId, type: unit.type, floor, sqm, furniture, price, availableFrom: addDays(inDays), pets, minLease, ownerId, photos: [], note: '', createdAt: addDays(-Math.floor(inDays / 3) - 3) };
    });
    const tenants = P.map((p) => {
      const [id, zones, commute, lifestyle, lease, moveIn] = p;
      const ps = PS[id];
      return { id: 't_' + id, name: ps.name_th, persona: id, budgetMin: ps.rent_budget_thb.min, budgetMax: ps.rent_budget_thb.max, types: ps.room_types.slice(), zones, commute, lifestyle, lease, moveIn: addDays(moveIn) };
    }).concat(EXTRA.map((e) => Object.assign({}, e, { moveIn: addDays(e.moveIn) })));

    const interests = [];
    const addInterest = (tid, rid, ago) => interests.push({ tenantId: tid, roomId: rid, at: addDays(-ago) });
    // ผู้เช่าที่กดสนใจตามคะแนน: แต่ละห้องรับคนที่คะแนนสูงสุดส่วนหนึ่ง จำนวนต่างกันตามลำดับห้อง
    rooms.forEach((room, i) => {
      const ranked = tenants.map((t) => ({ t, s: root.MATCHING.match(t, room).score })).filter((x) => x.s >= 55).sort((a, b) => b.s - a.s);
      ranked.slice(0, 1 + (i % 4)).forEach((x, k) => addInterest(x.t.id, room.id, 1 + ((i + k) % 6)));
    });

    const byZoneFirst = (ownerId, zone) => rooms.find((r) => r.ownerId === ownerId && r.zone === zone);
    const req = (id, room, tenantId, days, slot, status, note, ago) => {
      const t = tenants.find((x) => x.id === tenantId);
      return { id, roomId: room.id, tenantId, name: t.name, phone: '08x-xxx-xxxx', date: addDays(days), slot, note, status, createdAt: addDays(-ago) };
    };
    const requests = [
      req('rq1', byZoneFirst('o1', 'thonglor'), 't_thonglor_thai_creative', 2, '10:00–12:00', 'pending', 'สนใจดู Live Studio ของอาคารด้วย', 0),
      req('rq2', byZoneFirst('o1', 'chula'), 't_chula_medical', 3, '17:00–19:00', 'pending', 'ขอดูหลังเลิกเวร', 1),
      req('rq3', byZoneFirst('o1', 'phrakhanong'), 't_phrakhanong_first_jobber', 1, '13:00–15:00', 'confirmed', '', 2),
      req('rq4', byZoneFirst('o2', 'rama9'), 't_rama9_cbd_worker', 4, '10:00–12:00', 'pending', '', 1),
      req('rq5', byZoneFirst('o5', 'rama9'), 't_rama9_couple_2br', 5, '13:00–15:00', 'confirmed', '', 3),
    ];
    return { version: 1, rooms, tenants, interests, requests, owners: OWNERS, currentTenantId: null, ownerId: 'o1', seededAt: new Date().toISOString() };
  }

  root.SEED = { build, addDays, iso, personas, OWNERS };
}
