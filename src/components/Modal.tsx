"use client";

import type { ReactNode } from "react";
import { useEscape } from "@/hooks/useEscape";

export function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEscape(onClose);
  return (
    <div id="modal-root">
      <div className="bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal" role="dialog" aria-modal="true">{children}</div>
      </div>
    </div>
  );
}
