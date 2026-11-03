import { STATUS_TH, type Status } from "@/services/knowledge";

// ป้ายสถานะข้อมูล: ข้อมูลยืนยันแล้วไม่ต้องติดป้าย ส่วนค่าประมาณ/บทวิเคราะห์ติดป้ายให้คนและ AI เห็นชัด
export function DataStatus({ status }: { status: Status }) {
  if (status === "verified" || status === "not_found") return null;
  return <span className="pill mock" style={{ fontSize: ".66rem" }}>{STATUS_TH[status]}</span>;
}
