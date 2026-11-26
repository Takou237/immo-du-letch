import type { Listing } from "../data/listings";
import { badgeLabel, metaLine, priceLabel } from "../data/listings";
import { useApp } from "../store/AppStore";
import { HeartIcon, PinIcon, ScaleIcon, TrendDownIcon } from "./icons";

export default function MobileListingCard({ listing }: { listing: Listing }) {
  const { openListing, isFavorite, toggleFavorite, isInCompare, toggleCompare } = useApp();
  const favorite = isFavorite(listing.id);
  const comparing = isInCompare(listing.id);

  return (
    <article
      role="button"
      tabIndex={0}
      data-listing-id={listing.id}
      onClick={() => openListing(listing.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openListing(listing.id);
        }
      }}
      className="flex cursor-pointer gap-3 rounded-[12px] border border-[#dce2e9] bg-white p-2.5 text-left transition-colors active:border-[#f3ad19]"
    >
      <div className="relative size-[104px] shrink-0 overflow-hidden rounded-[8px] bg-[#eef2f6]">
        <img src={listing.image} alt={listing.title} className="size-full object-cover" />
        <span className="absolute left-1 top-1 rounded-[4px] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#071f49]">
          {badgeLabel(listing)}
        </span>
        {listing.priceDropped ? (
          <span className="absolute bottom-1 left-1 inline-flex items-center gap-0.5 rounded-[4px] bg-[#fef2f2] px-1 py-0.5 text-[9px] font-semibold text-[#dc2626]">
            <TrendDownIcon className="size-[9px]" /> Baisse
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-1">
          <h3 className="line-clamp-2 flex-1 text-[13px] font-bold leading-snug text-[#071f49]">
            {listing.title}
          </h3>
          <button
            type="button"
            aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            onClick={(event) => {
              event.stopPropagation();
              toggleFavorite(listing.id);
            }}
            className={`flex size-[28px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] ${
              favorite ? "bg-[#fff7e6] text-[#f3ad19]" : "bg-white text-[#637084]"
            }`}
          >
            <HeartIcon className="size-[14px]" filled={favorite} />
          </button>
        </div>

        <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-[#637084]">
          <PinIcon className="size-[11px] shrink-0" /> {listing.neighborhood}, {listing.city}
        </p>
        <p className="truncate text-[11px] text-[#8a95a5]">{metaLine(listing)}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <p className="text-[13px] font-bold text-[#071f49]">{priceLabel(listing)}</p>
          <button
            type="button"
            aria-label={comparing ? "Retirer du comparateur" : "Comparer ce bien"}
            onClick={(event) => {
              event.stopPropagation();
              toggleCompare(listing.id);
            }}
            className={`flex size-[28px] shrink-0 cursor-pointer items-center justify-center rounded-full border ${
              comparing
                ? "border-[#f3ad19] bg-[#f3ad19] text-[#071f49]"
                : "border-[#dce2e9] bg-white text-[#637084]"
            }`}
          >
            <ScaleIcon className="size-[13px]" />
          </button>
        </div>
      </div>
    </article>
  );
}
