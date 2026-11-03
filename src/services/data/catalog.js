// ข้อมูลโครงการสำหรับแอป ตัวเลขดึงจาก window.MARKET (01_DATA) ไม่พิมพ์ซ้ำ ยกเว้นที่มาจากช่อง method ของไฟล์ ซึ่งระบุไว้ในคอมเมนต์
export function install(root) {
  const M = root.MARKET;
  const zones = {};
  M.zones.forEach((z) => { zones[z.id] = z; });
  const ZONE_IDS = ['thonglor', 'chula', 'phrakhanong', 'rama9'];
  const TYPE_LABEL = { studio: 'สตูดิโอ/ห้องเล็ก', one_bed: '1 ห้องนอน', two_bed: '2 ห้องนอน' };

  const fact = (z, key) => zones[z].project.facts.find((f) => f.key === key);

  // แบบห้องต่อโครงการ psm = ค่าเช่าต่อ ตร.ม. จากช่อง method/value ของ rent.project
  // sample = ช่วงขนาดห้องในตัวอย่างประกาศ ใช้เตือนเมื่อขนาดอยู่นอกตัวอย่าง
  const UNITS = {
    thonglor: [
      { id: 'th_studio', label: 'Studio', type: 'studio', sqm: 26, sample: [24, 33], psm: 932 },
      { id: 'th_hybrid', label: 'Studio Hybrid (เพดานสูง)', type: 'studio', sqm: 27.5, sample: [24, 33], psm: 932 },
      { id: 'th_1br', label: '1 Bedroom', type: 'one_bed', sqm: 32, sample: [30, 45], psm: 932 },
      { id: 'th_2br', label: '2 Bedroom', type: 'two_bed', sqm: 51, sample: [51, 69.5], psm: 932 },
    ],
    chula: [
      { id: 'ch_1br', label: '1 Bedroom (Loft)', type: 'one_bed', sqm: 38, sample: [36, 42], psm: 921 },
      { id: 'ch_1plus', label: '1 Bedroom Plus (Loft)', type: 'one_bed', sqm: 42, sample: [36, 42], psm: 921 },
      { id: 'ch_2br', label: '2 Bedroom (Duplex)', type: 'two_bed', sqm: 60, sample: [56, 68], psm: 991 },
    ],
    phrakhanong: [
      // 1 Bed New Series ถูกประกาศเป็น 1BR/สตูดิโอ ไฟล์ข้อมูลจัดไว้ในกลุ่ม studio (ห้อง 29.5–31 ตร.ม.)
      { id: 'pk_ns', label: '1 Bed New Series (เพดานสูง 2.9 ม.)', type: 'studio', sqm: 29.5, sample: [29.5, 31], psm: 669 },
      // ค่าจาก method ของ rent.project.one_bed: 1BR ~35 ตร.ม. เฉลี่ย 26,750 (25,000–30,000)
      { id: 'pk_1br', label: '1 Bed', type: 'one_bed', sqm: 35, sample: [34, 36], psm: 764, low: 25000, high: 30000, avg: 26750, n: 4 },
      // ค่าจาก method ของ rent.project.one_bed: 1 Bed Plus 44–45 ตร.ม. เฉลี่ย 30,500 (23,000–38,000) → 30,500 ÷ 44.5 ≈ 685
      { id: 'pk_plus', label: '1 Bed Plus (มีห้องอเนกประสงค์)', type: 'one_bed', sqm: 44.5, sample: [44, 45], psm: 685, low: 23000, high: 38000, avg: 30500, n: 6, workroom: true },
      { id: 'pk_2br', label: '2 Bed', type: 'two_bed', sqm: 60, sample: [60, 76], psm: 833 },
    ],
    rama9: [
      { id: 'r9_studio', label: 'Studio', type: 'studio', sqm: 26, sample: [26, 32], psm: 647 },
      { id: 'r9_1br', label: '1 Bedroom Hybrid', type: 'one_bed', sqm: 34, sample: [26, 39], psm: 752 },
      { id: 'r9_2br', label: '2 Bedroom', type: 'two_bed', sqm: 52, sample: [52, 72], psm: 684 },
      { id: 'r9_2hy', label: '2 Bedroom Hybrid', type: 'two_bed', sqm: 71.46, sample: [52, 72], psm: 684 },
      { id: 'r9_2hyl', label: '2 Bedroom Hybrid ใหญ่', type: 'two_bed', sqm: 90.5, sample: [52, 72], psm: 684 },
    ],
  };
  const SAMPLE_N = { thonglor: { studio: 46, two_bed: 3 }, chula: { one_bed: 16, two_bed: 6 }, phrakhanong: { studio: 6, two_bed: 12 }, rama9: { studio: 8, one_bed: 11, two_bed: 7 } };

  // แผนที่: พิกัดประมาณจากตำแหน่งสถานีและระยะที่ไฟล์ข้อมูลระบุ ไม่ใช่พิกัดสำรวจ
  const GEO = { thonglor: [13.7250, 100.5807], chula: [13.7305, 100.5330], phrakhanong: [13.7130, 100.5892], rama9: [13.7562, 100.5615] };

  // สิ่งที่แต่ละโครงการตอบไลฟ์สไตล์ได้ ข้อความมาจาก highlights/amenities/education ของไฟล์ ค่า null = ไฟล์ไม่มีข้อมูล จึงไม่ให้คะแนน
  const TRAITS = {
    thonglor: { wfh: 'Co-working 24 ชม. ในอาคาร', service: 'บริการแบบโรงแรมโดย Ascott', near_uni: null, near_hospital: 'รพ.คามิลเลียน ~1.5 กม.', fitness: null, airport: null },
    chula: { wfh: 'Co-working 24 ชม. ในอาคาร', service: 'บริการแบบโรงแรมโดย Ascott', near_uni: 'จุฬาฯ 400–850 ม.', near_hospital: 'รพ.จุฬาฯ 170–460 ม.', fitness: 'Sky Fitness', airport: null },
    phrakhanong: { wfh: 'Co-creative space ในอาคาร', service: null, near_uni: 'ม.กรุงเทพ กล้วยน้ำไท ~800 ม.', near_hospital: 'รพ.กล้วยน้ำไท ~350 ม.', fitness: 'ฟิตเนส 24 ชม.', airport: null },
    rama9: { wfh: 'Hybrid Space: co-working 2 ชั้น', service: null, near_uni: null, near_hospital: 'ใกล้ รพ.พระราม 9 (ไม่มีข้อมูลระยะ)', fitness: 'ENERGYM ฟิตเนส', airport: 'Airport Rail Link มักกะสัน 1 สถานี' },
  };
  const TRAIT_PARTIAL = { thonglor: { near_hospital: true }, rama9: { near_hospital: true } };
  const QUIET_NOTE = { thonglor: 'บางซอยมีเสียงสถานบันเทิงศุกร์–เสาร์', chula: 'ถนนพระราม 4 รถติดและเสียงดัง', phrakhanong: 'ถนนพระราม 4 รถติดและเสียงรถ', rama9: 'อาคาร 1,222 ยูนิต คนพลุกพล่าน' };

  const LIFESTYLES = [
    { id: 'wfh', label: 'ทำงานที่บ้าน' },
    { id: 'pet', label: 'มีสัตว์เลี้ยง' },
    { id: 'furnished', label: 'ต้องการแต่งครบ' },
    { id: 'service', label: 'อยากได้บริการแบบโรงแรม' },
    { id: 'near_uni', label: 'ใกล้มหาวิทยาลัย' },
    { id: 'near_hospital', label: 'ใกล้โรงพยาบาล' },
    { id: 'fitness', label: 'ใช้ฟิตเนสประจำ' },
    { id: 'airport', label: 'เดินทางไปสนามบินบ่อย' },
    { id: 'quiet', label: 'ต้องการห้องเงียบ' },
  ];

  // ภาพตัวอย่าง: scene + โทนสีต่อโครงการ
  const VISUAL = {
    thonglor: { studio: { pano: 'studio_walnut', imgs: ['studio_walnut_b', 'studio_walnut_a', 'studio_walnut_c', 'bath_walnut_a'] }, one_bed: { pano: 'living1_walnut', imgs: ['living1_walnut_a', 'living1_walnut_b', 'bedroom_walnut_a', 'bath_walnut_a'] }, two_bed: { pano: 'living1_walnut', imgs: ['living1_walnut_b', 'living1_walnut_a', 'bedroom_walnut_a', 'bath_walnut_a'] } },
    chula: { one_bed: { pano: 'loft_oak', imgs: ['loft_oak_a', 'loft_oak_b', 'loft_oak_c', 'bath_nordic_a'] }, two_bed: { pano: 'living2_oak', imgs: ['living2_oak_a', 'living2_oak_b', 'bedroom_oak_a', 'bath_nordic_a'] } },
    phrakhanong: { studio: { pano: 'studio_green', imgs: ['studio_green_b', 'studio_green_a', 'bath_nordic_a'] }, one_bed: { pano: 'living1_green', imgs: ['living1_green_a', 'living1_green_b', 'bedroom_green_a', 'bath_nordic_a'] }, two_bed: { pano: 'living2_nordic', imgs: ['living2_nordic_a', 'living2_nordic_b', 'bedroom_green_a', 'bath_nordic_a'] } },
    rama9: { studio: { pano: 'studio_nordic', imgs: ['studio_nordic_b', 'studio_nordic_a', 'bath_nordic_a'] }, one_bed: { pano: 'living1_nordic', imgs: ['living1_nordic_a', 'living1_nordic_b', 'bedroom_nordic_a', 'bath_nordic_a'] }, two_bed: { pano: 'living2_nordic', imgs: ['living2_nordic_b', 'living2_nordic_a', 'bedroom_nordic_a', 'bath_nordic_a'] } },
  };

  const PROJECTS = {};
  ZONE_IDS.forEach((id) => {
    const z = zones[id];
    const unitsFact = fact(id, 'units');
    const floors = parseInt(/(\d+)\s*ชั้น/.exec(unitsFact.unit)[1], 10);
    const stations = z.transit
      .filter((t) => /^(BTS|MRT)/.test(t.station) && t.distance_m && t.distance_m <= 1000)
      .map((t) => ({ name: t.station, m: t.distance_m, line: t.station.slice(0, 3), status: t.status }));
    PROJECTS[id] = {
      id, name: z.project.name, zoneName: z.zone_name_th, zone: z, floors, stations,
      units: UNITS[id], unitCount: unitsFact.value,
      commonFee: fact(id, 'common_fee').value,
      commonFeeStatus: fact(id, 'common_fee').status,
      petsBanned: !!fact(id, 'pets'),
      minLeaseFloor: id === 'rama9' ? 12 : 1, // investor_insights: IDEO Rama 9-Asoke สัญญาเช่าอย่างน้อย 1 ปี
      geo: GEO[id], traits: TRAITS[id],
      hasStudio: z.rent.project.studio.status !== 'not_found',
      priceFrom: fact(id, 'price_from').value,
    };
  });

  function getUnit(zoneId, unitId) { return UNITS[zoneId].find((u) => u.id === unitId); }

  // ช่วงค่าเช่าของแบบห้อง จาก rent.project (หรือแถบย่อยที่ระบุใน UNITS)
  function rentBand(zoneId, unit) {
    const r = zones[zoneId].rent.project[unit.type];
    const low = unit.low !== undefined ? unit.low : r.low;
    const high = unit.high !== undefined ? unit.high : r.high;
    const avg = unit.avg !== undefined ? unit.avg : r.avg;
    const n = unit.n !== undefined ? unit.n : (SAMPLE_N[zoneId][unit.type] || null);
    return { low, high, avg, n, status: r.status, method: r.method, src: r.src };
  }

  const round500 = (v) => Math.round(v / 500) * 500;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // ราคาแนะนำ = ค่าเช่าต่อ ตร.ม. ของแบบห้อง × ขนาด แล้วตรึงอยู่ในช่วงประกาศจริง ช่วงแนะนำ ±5% เป็นค่าออกแบบของเดโม
  function suggestRent(zoneId, unitId, sqm) {
    const unit = getUnit(zoneId, unitId);
    const b = rentBand(zoneId, unit);
    const raw = unit.psm * sqm;
    const mid = clamp(round500(raw), b.low, b.high);
    const notes = [];
    if (raw > b.high) notes.push('ขนาดนี้คำนวณได้สูงกว่าราคาประกาศสูงสุดที่พบ จึงใช้เพดานของช่วงแทน');
    if (raw < b.low) notes.push('ขนาดนี้คำนวณได้ต่ำกว่าราคาประกาศต่ำสุดที่พบ จึงใช้ขอบล่างของช่วงแทน');
    const outOfSample = sqm < unit.sample[0] || sqm > unit.sample[1];
    if (outOfSample) notes.push(`ขนาดอยู่นอกตัวอย่างประกาศ (${unit.sample[0]}–${unit.sample[1]} ตร.ม.) ตัวเลขนี้ใช้อ้างอิงคร่าวๆ เท่านั้น`);
    if (b.avg === null || b.avg === undefined) notes.push('ไฟล์ข้อมูลไม่มีค่าเฉลี่ยของแบบห้องนี้ จึงคำนวณจากค่าเช่าต่อ ตร.ม.');
    if (b.n !== null && b.n <= 6) notes.push(`ตัวอย่างประกาศน้อย (${b.n} ประกาศ)`);
    return {
      suggested: mid, bandLow: clamp(round500(mid * 0.95), b.low, b.high), bandHigh: clamp(round500(mid * 1.05), b.low, b.high),
      low: b.low, high: b.high, avg: b.avg, n: b.n, psm: unit.psm, notes, status: b.status, method: b.method, src: b.src,
    };
  }

  // ค่าเช่าที่คาดว่าจะได้: ใช้ราคาที่เจ้าของตั้ง แต่ไม่เกินราคาประกาศสูงสุดของแบบห้องนั้น
  function expectedRent(room) {
    const b = rentBand(room.zone, getUnit(room.zone, room.unitId));
    return { value: Math.min(room.price, b.high), low: b.low, high: b.high, over: room.price > b.high, under: room.price < b.low };
  }

  function zoneRentNote(zoneId, type) {
    const r = zones[zoneId].rent.zone;
    const v = r[type];
    if (v && v.value) return `ค่าเฉลี่ยระดับย่าน ${v.value.toLocaleString('en-US')} บาท/เดือน`;
    if (v && v.low) return `ระดับย่าน ${v.low.toLocaleString('en-US')}–${v.high.toLocaleString('en-US')} บาท/เดือน`;
    if (r.per_sqm && r.per_sqm.value) return `มัธยฐานย่าน ${r.per_sqm.value} บาท/ตร.ม./เดือน`;
    return 'ไม่มีข้อมูลค่าเช่าระดับย่านของแบบห้องนี้';
  }

  const walkMin = (m) => Math.ceil(m / 80); // สมมติเดิน 80 ม./นาที

  root.CATALOG = { ZONE_IDS, PROJECTS, TYPE_LABEL, LIFESTYLES, VISUAL, TRAIT_PARTIAL, QUIET_NOTE, getUnit, rentBand, suggestRent, expectedRent, zoneRentNote, walkMin, clamp, round500 };
}
