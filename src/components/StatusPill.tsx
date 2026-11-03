import type { Lead } from "@/store/types";
import { statusList } from "@/utils/project";

export function StatusPill({ lead }: { lead: Lead }) {
  const s = statusList(lead.side).find((x) => x.id === lead.status)!;
  return <span className={`pill ${s.cls}`}>{s.label}</span>;
}
