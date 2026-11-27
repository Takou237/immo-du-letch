import { useRef, type ChangeEvent } from "react";
import { CloseIcon } from "./icons";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  compact?: boolean;
};

function readAndCompressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire le fichier."));
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) {
        reject(new Error("Fichier vide."));
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        const maxSide = 1200;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 6,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    event.target.value = "";
    if (files.length === 0) return;

    const remaining = Math.max(0, maxImages - images.length);
    const slice = files.slice(0, remaining);
    if (slice.length === 0) return;

    const encoded = await Promise.all(slice.map(readAndCompressImage));
    onChange([...images, ...encoded]);
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
          Photos du bien
        </span>
        <span className="text-[11px] text-[#637084]">
          {images.length} / {maxImages}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <button
        type="button"
        disabled={images.length >= maxImages}
        onClick={() => inputRef.current?.click()}
        className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] text-center transition-colors hover:border-[#f3ad19] hover:bg-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-50 ${
          compact ? "px-3 py-3" : "px-4 py-5"
        }`}
      >
        <span className="font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49]">
          + Importer des images
        </span>
        <span className="mt-0.5 text-[11px] text-[#637084]">
          JPG, PNG ou WebP · jusqu'à {maxImages} photos
        </span>
      </button>

      {images.length > 0 ? (
        <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {images.map((src, index) => (
            <div
              key={`${index}-${src.slice(0, 24)}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-[7px] border border-[#dce2e9] bg-[#f8fafc]"
            >
              <img
                src={src}
                alt={`Aperçu ${index + 1}`}
                className="size-full object-cover"
              />
              {index === 0 ? (
                <span className="absolute bottom-1 left-1 rounded bg-[#071f49]/85 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                  Principale
                </span>
              ) : null}
              <button
                type="button"
                aria-label={`Supprimer la photo ${index + 1}`}
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 flex size-[22px] cursor-pointer items-center justify-center rounded-full border-0 bg-white/90 text-[#071f49] shadow hover:bg-[#fef2f2] hover:text-[#dc2626]"
              >
                <CloseIcon className="size-[10px]" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
