// components/ui/BottomSheet.tsx
"use client";

import { useEffect, useId, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  titleId?: string;
  children: React.ReactNode;
  className?: string;
  maxHeightClassName?: string; // e.g. "max-h-[90vh]"
};

export default function BottomSheet({
  open,
  onClose,
  titleId,
  children,
  className = "",
  maxHeightClassName = "max-h-[90vh]",
}: Props) {
  const fallbackTitleId = useId();
  const labelledBy = titleId ?? fallbackTitleId;

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
      return;
    }

    // close animation
    setVisible(false);
    const t = window.setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "";
    }, 250);

    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className={[
          "absolute inset-0 w-full h-full",
          "bg-black/50 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={[
          "absolute bottom-0 left-0 right-0",
          "bg-white rounded-t-3xl shadow-2xl",
          "transform transition-transform duration-200 ease-out",
          visible ? "translate-y-0" : "translate-y-full",
          maxHeightClassName,
          "overflow-hidden",
          className,
        ].join(" ")}
      >
        {!titleId ? (
          <div id={fallbackTitleId} className="sr-only">
            Bottom sheet
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
