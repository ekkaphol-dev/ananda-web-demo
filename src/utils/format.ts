export const fmt = (n: number) => Number(n).toLocaleString("en-US");

export const thDate = (iso: string) =>
  new Date(iso.length === 10 ? iso + "T12:00:00" : iso).toLocaleDateString("th-TH", { day: "numeric", month: "short" });

export const rel = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${Math.max(m, 1)} นาทีที่แล้ว`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ชม.ที่แล้ว`;
  return `${Math.round(h / 24)} วันที่แล้ว`;
};

export const maskPhone = (p: string) => p.slice(0, 3) + "-xxx-" + p.slice(-4);

export const r10k = (v: number) => Math.round(v / 10000) * 10000;
export const r500 = (v: number) => Math.round(v / 500) * 500;
