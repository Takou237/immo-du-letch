import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon, CloseIcon } from "./icons";

type Props = {
  images: string[];
  index: number;
  title: string;
  onChange: (index: number) => void;
  onClose: () => void;
};

export default function Lightbox({ images, index, title, onChange, onClose }: Props) {
  const total = images.length;
  const current = ((index % total) + total) % total;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange(current + 1);
      if (event.key === "ArrowLeft") onChange(current - 1);
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [current, onChange, onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photos de ${title}`}
      className="fixed inset-0 z-[110] flex flex-col bg-[#04101f]/95"
    >
      <div className="flex items-center justify-between px-6 py-5 text-white">
        <div>
          <p className="font-['Inter:Semi_Bold'] text-[15px] font-semibold">{title}</p>
          <p className="mt-1 text-[12px] text-[#b9c6da]">
            Photo {current + 1} sur {total}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fermer la galerie"
          onClick={onClose}
          className="flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
        >
          <CloseIcon className="size-[18px]" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-16 pb-4">
        <button
          type="button"
          aria-label="Photo précédente"
          onClick={() => onChange(current - 1)}
          className="absolute left-5 flex size-[46px] cursor-pointer items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
        >
          <ArrowIcon className="size-[20px] rotate-180" />
        </button>
        <img
          key={current}
          alt={`${title} — photo ${current + 1}`}
          src={images[current]}
          className="max-h-full max-w-full rounded-[8px] object-contain shadow-[0_20px_60px_rgb(0_0_0/45%)]"
        />
        <button
          type="button"
          aria-label="Photo suivante"
          onClick={() => onChange(current + 1)}
          className="absolute right-5 flex size-[46px] cursor-pointer items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
        >
          <ArrowIcon className="size-[20px]" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 px-6 pb-6">
        {images.map((image, imageIndex) => (
          <button
            key={`${image}-${imageIndex}`}
            type="button"
            aria-label={`Voir la photo ${imageIndex + 1}`}
            onClick={() => onChange(imageIndex)}
            className={`h-[58px] w-[86px] cursor-pointer overflow-hidden rounded-[5px] border-2 transition-opacity ${
              imageIndex === current
                ? "border-[#f3ad19] opacity-100"
                : "border-transparent opacity-60 hover:opacity-90"
            }`}
          >
            <img alt="" src={image} className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
