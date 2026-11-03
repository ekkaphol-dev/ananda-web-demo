import { StaffView } from "@/views/staff/StaffView";

// หน้าทั้งหมดเรนเดอร์ฝั่งเบราว์เซอร์ (ข้อมูลอยู่ใน localStorage) จึงไม่ตรวจ instant navigation
export const instant = false;

export default function Page() {
  return <StaffView />;
}
