"use client";

import { useEffect } from "react";

// نافذة منبثقة: تُغلق بالنقر على الخلفية أو زر الإغلاق أو مفتاح Escape.
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="animate-pop w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="h-9 w-9 rounded-full bg-pink-100 text-ink text-xl leading-none hover:bg-pink-200"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
