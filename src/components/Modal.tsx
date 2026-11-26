import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./icons";

type Props = {
  onClose: () => void;
  children: ReactNode;
  label: string;
  align?: "center" | "drawer";
  panelClassName?: string;
};

export default function Modal({
  onClose,
  children,
  label,
  align = "center",
  panelClassName = "",
}: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-[100] flex bg-[#071f49]/50 backdrop-blur-[2px] ${
        align === "drawer" ? "justify-end" : "items-center justify-center p-6"
      }`}
    >
      <div
        onMouseDown={(event) => event.stopPropagation()}
        className={`relative max-h-[92vh] overflow-auto bg-white shadow-[0_24px_80px_rgb(7_31_73/35%)] ${
          align === "drawer" ? "h-full w-[440px] max-w-[92vw]" : "rounded-[12px]"
        } ${panelClassName}`}
      >
        <button
          type="button"
          aria-label="Fermer"
          onClick={onClose}
          className="absolute right-[14px] top-[14px] z-10 flex size-[34px] cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-white text-[#071f49] transition-colors hover:bg-[#f4f6f8]"
        >
          <CloseIcon className="size-[16px]" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
