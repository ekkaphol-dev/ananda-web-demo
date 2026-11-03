"use client";

import { createContext, useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { SEED } from "@/services/data";
import { appStore } from "@/store/appStore";
import { currentUser } from "@/store/umStore";
import type { AppState, Lead, TenantProfile, User } from "@/store/types";
import type { CalcState } from "@/utils/project";

// สถานะหน้าเว็บ (ไม่บันทึก) ใช้ข้ามหน้า เช่น ห้องที่เลือกไว้ก่อนไปหน้าลงทะเบียน
export type UiState = {
  tq: TenantProfile;
  searched: boolean;
  selRooms: string[];
  invZone: string;
  selUnits: string[];
  lastLead: Lead | null;
  calc: Record<string, CalcState>;
  tab: string | null;
  leadId: string | null;
  filter: string;
  sideFilter: string;
  assignFilter: string;
};

const initialUi = (): UiState => ({
  tq: { budgetMin: 18000, budgetMax: 30000, zones: [], types: [], commute: "any", lifestyle: [], moveIn: SEED.addDays(14), lease: 12, persona: null },
  searched: false,
  selRooms: [],
  invZone: "chula",
  selUnits: [],
  lastLead: null,
  calc: {},
  tab: null,
  leadId: null,
  filter: "all",
  sideFilter: "all",
  assignFilter: "mine",
});

type AppContextValue = {
  state: AppState;
  me: User | null;
  /** แก้สถานะแบบ draft แล้วบันทึกลง localStorage · คืนค่าที่ fn คืน */
  mutate: <T>(fn: (draft: AppState) => T) => T;
  ui: UiState;
  setUi: (patch: Partial<UiState> | ((u: UiState) => Partial<UiState>)) => void;
  reset: () => void;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // ฝั่ง server ได้ null (ไม่มี localStorage) · เบราว์เซอร์ได้ข้อมูลจริงหลัง hydrate
  const state = useSyncExternalStore(appStore.subscribe, appStore.getSnapshot, appStore.getServerSnapshot);
  const [uiState, setUiState] = useState<UiState | null>(null);
  const ui = state ? (uiState ?? initialUi()) : null;

  const setUi = useCallback((patch: Partial<UiState> | ((u: UiState) => Partial<UiState>)) => {
    setUiState((prev) => {
      const u = prev ?? initialUi();
      return { ...u, ...(typeof patch === "function" ? patch(u) : patch) };
    });
  }, []);

  const reset = useCallback(() => {
    appStore.reset();
    setUiState((u) => (u ? { ...u, selRooms: [], selUnits: [], lastLead: null } : u));
  }, []);

  const value = useMemo(
    () => (state && ui ? { state, me: currentUser(state), mutate: appStore.mutate, ui, setUi, reset } : null),
    [state, ui, setUi, reset],
  );

  // ไม่ซ่อน children ระหว่างรอข้อมูล เพื่อให้เนื้อหาที่ไม่ต้องใช้ข้อมูล (หน้าหลัก หัวข้อหน้า) ถูกเรนเดอร์ฝั่ง server ให้ Google อ่านได้
  // ส่วนที่ต้องใช้ข้อมูลห่อด้วย <ClientReady> แทน
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
