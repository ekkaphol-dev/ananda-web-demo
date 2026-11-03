// ที่เก็บสถานะกลางของเดโม (อ่านผ่าน useSyncExternalStore ใน AppContext)
// ฝั่ง server ไม่มี localStorage จึงคืน null แล้วให้เบราว์เซอร์โหลดเอง
import { clearState, loadState, saveState } from "@/services/storage";
import { buildState } from "./umStore";
import type { AppState } from "./types";

let state: AppState | null = null;
const listeners = new Set<() => void>();

function ensure(): AppState {
  if (!state) {
    state = loadState();
    if (!state) {
      state = buildState();
      saveState(state);
    }
  }
  return state;
}

export const appStore = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  getSnapshot: (): AppState | null => ensure(),
  getServerSnapshot: (): AppState | null => null,

  /** แก้สถานะบนสำเนา แล้วบันทึกและแจ้งทุกหน้าจอ · คืนค่าที่ fn คืน */
  mutate<T>(fn: (draft: AppState) => T): T {
    const draft = structuredClone(ensure());
    const out = fn(draft);
    state = draft;
    saveState(draft);
    listeners.forEach((l) => l());
    return out;
  },

  /** สร้างข้อมูลตัวอย่างใหม่ โดยคงการ login ไว้ */
  reset() {
    const session = state?.session ?? null;
    clearState();
    state = buildState();
    state.session = session;
    saveState(state);
    listeners.forEach((l) => l());
  },
};
