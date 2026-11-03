"use client";

import { createContext, useCallback, useRef, useState, type ReactNode } from "react";

export const ToastContext = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useCallback((m: string) => {
    setMsg(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2600);
  }, []);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div id="toast-root" aria-live="polite">
        {msg && <div id="toast" role="status">{msg}</div>}
      </div>
    </ToastContext.Provider>
  );
}
