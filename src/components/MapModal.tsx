import { compactPrice, type Listing } from "../data/listings";
import Modal from "./Modal";

const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  Douala: { x: 22, y: 58 },
  Yaoundé: { x: 56, y: 40 },
  Kribi: { x: 16, y: 84 },
};

type Props = {
  listings: Listing[];
  onClose: () => void;
  onOpen: (listingId: string) => void;
};

export default function MapModal({ listings, onClose, onOpen }: Props) {
  return (
    <Modal onClose={onClose} label="Carte des biens" panelClassName="w-[1000px] max-w-[92vw]">
      <div className="p-6 pr-16">
        <p className="font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
          Les biens sur la carte
        </p>
        <p className="mt-1 text-[12px] text-[#637084]">
          {listings.length} bien{listings.length > 1 ? "s" : ""} affiché
          {listings.length > 1 ? "s" : ""} · Cliquez sur un prix pour ouvrir l’annonce.
        </p>
      </div>

      <div
        className="relative mx-6 mb-6 h-[440px] overflow-hidden rounded-[8px] border border-[#cfe0c7]"
        style={{
          backgroundColor: "#eaf1e6",
          backgroundImage:
            "linear-gradient(#dbe7d3 1px, transparent 1px), linear-gradient(90deg, #dbe7d3 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      >
        <div className="absolute left-[-6%] top-[46%] h-[26px] w-[120%] -rotate-[8deg] rounded-full bg-[#cfe1ef]" />
        <div className="absolute left-[38%] top-[-10%] h-[130%] w-[18px] rotate-[14deg] rounded-full bg-white/80" />
        <div className="absolute left-[8%] top-[-10%] h-[130%] w-[10px] rotate-[-20deg] rounded-full bg-white/60" />
        <div className="absolute bottom-6 left-6 rounded-[6px] bg-white/85 px-3 py-2 text-[11px] text-[#637084]">
          Carte de démonstration · positions indicatives
        </div>

        {["Douala", "Yaoundé", "Kribi"].map((city) => {
          const position = CITY_POSITIONS[city];
          return (
            <div
              key={city}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              className="absolute -translate-x-1/2 translate-y-[34px] font-['Inter:Semi_Bold'] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6c7a67]"
            >
              {city}
            </div>
          );
        })}

        {listings.map((listing, index) => {
          const anchor = CITY_POSITIONS[listing.city] ?? { x: 50, y: 50 };
          const offsetX = ((index % 4) - 1.5) * 34;
          const offsetY = (Math.floor(index / 4) % 3) * 30;
          return (
            <button
              key={listing.id}
              type="button"
              onClick={() => onOpen(listing.id)}
              style={{
                left: `calc(${anchor.x}% + ${offsetX}px)`,
                top: `calc(${anchor.y}% + ${offsetY}px)`,
              }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-1 rounded-full border-2 border-white bg-[#071f49] px-[10px] py-[5px] font-['Inter:Semi_Bold'] text-[11px] font-semibold text-white shadow-[0_6px_16px_rgb(7_31_73/30%)] transition-transform hover:scale-105 hover:bg-[#0d3268]"
              title={`${listing.title} — ${listing.neighborhood}, ${listing.city}`}
            >
              {compactPrice(listing.price)}
              <span className="text-[9px] font-normal text-[#c7d4e6]">
                {listing.transaction === "location" ? "/mois" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
