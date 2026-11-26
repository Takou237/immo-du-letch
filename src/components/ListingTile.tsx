import type { Listing } from "../data/listings";
import { badgeLabel, formatPrice, metaLine, priceLabel } from "../data/listings";
import { useApp } from "../store/AppStore";
import PriceScale from "./PriceScale";
import { EyeIcon, HeartIcon, PinIcon, ScaleIcon, TrendDownIcon } from "./icons";

type Props = {
  listing: Listing;
  left: number;
  top: number;
  showNew?: boolean;
};

export default function ListingTile({ listing, left, top, showNew = true }: Props) {
  const { openListing, isFavorite, toggleFavorite, isInCompare, toggleCompare } = useApp();
  const favorite = isFavorite(listing.id);
  const comparing = isInCompare(listing.id);

  return (
    <div
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
      style={{ left, top }}
      className="absolute bg-white border border-[#dce2e9] border-solid h-[428px] cursor-pointer overflow-clip rounded-[8px] text-left w-[400px] transition-transform duration-200 hover:-translate-y-[2px] hover:border-[#f3ad19] hover:shadow-[0_12px_28px_rgb(7_31_73/12%)]"
    >
      <div className="absolute h-[216px] left-[-1px] top-[-1px] w-[400px]">
        <img
          alt={listing.title}
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={listing.image}
        />
      </div>

      <span className="absolute bg-white h-[28px] left-[15px] rounded-[4px] top-[15px] px-[12px] font-['Inter:Semi_Bold'] font-semibold leading-[28px] text-[#071f49] text-[12px]">
        {badgeLabel(listing)}
      </span>
      {showNew && listing.isNew ? (
        <span className="absolute bg-[#e7f6ec] h-[28px] left-[104px] rounded-[4px] top-[15px] px-[10px] font-['Inter:Semi_Bold'] font-semibold leading-[28px] text-[#1f7a3d] text-[11px]">
          Nouveau
        </span>
      ) : null}
      {listing.priceDropped ? (
        <span className="absolute left-[15px] top-[178px] inline-flex h-[24px] items-center gap-1 rounded-[4px] bg-[#fef2f2] px-[8px] font-['Inter:Semi_Bold'] text-[11px] font-semibold text-[#dc2626]">
          <TrendDownIcon className="size-[12px]" /> Prix baissé
        </span>
      ) : null}

      <button
        type="button"
        aria-label={comparing ? "Retirer du comparateur" : "Comparer ce bien"}
        onClick={(event) => {
          event.stopPropagation();
          toggleCompare(listing.id);
        }}
        className={`absolute left-[295px] top-[13px] flex size-[40px] cursor-pointer items-center justify-center rounded-[20px] border-0 transition-transform hover:scale-105 ${
          comparing ? "bg-[#f3ad19] text-[#071f49]" : "bg-white text-[#071f49]"
        }`}
      >
        <ScaleIcon className="size-[18px]" />
      </button>

      <button
        type="button"
        aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        onClick={(event) => {
          event.stopPropagation();
          toggleFavorite(listing.id);
        }}
        className="absolute bg-white left-[343px] cursor-pointer overflow-clip rounded-[20px] size-[40px] top-[13px] border-0 transition-transform hover:scale-105"
      >
        <HeartIcon className="absolute left-[10px] size-[20px] top-[10px]" filled={favorite} />
      </button>

      <div className="absolute left-[19px] top-[230px] flex w-[360px] items-center justify-between gap-2">
        <p className="font-['Inter:Bold'] font-bold leading-[1.35] text-[#071f49] text-[21px]">
          {priceLabel(listing)}
        </p>
        <PriceScale listing={listing} compact />
      </div>

      {listing.priceDropped && listing.originalPrice ? (
        <p className="absolute left-[19px] top-[260px] font-['Inter:Regular'] text-[11px] text-[#8a95a5] line-through">
          {formatPrice(listing.originalPrice)} FCFA
        </p>
      ) : null}

      <p className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[19px] line-clamp-1 text-[#172b45] text-[16px] top-[282px] w-[360px]">
        {listing.title}
      </p>
      <span className="absolute left-[19px] size-[16px] top-[318px] text-[#637084]">
        <PinIcon className="size-full" />
      </span>
      <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[43px] text-[#637084] text-[13px] top-[314px] whitespace-nowrap">
        {listing.neighborhood}, {listing.city}
      </p>
      <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[19px] text-[#172b45] text-[13px] top-[350px] w-[360px] whitespace-pre-wrap">
        {metaLine(listing)}
      </p>
      <div className="absolute bg-[#dce2e9] h-px left-[19px] top-[386px] w-[360px]" />
      <div className="absolute left-[19px] top-[396px] flex w-[360px] items-center justify-between text-[#637084] text-[11px]">
        <span className="font-['Inter:Regular']">
          {listing.seller} · ★ {listing.sellerRating.toFixed(1)}
        </span>
        <span className="inline-flex items-center gap-1">
          <EyeIcon className="size-[13px]" /> {listing.views} vues
        </span>
      </div>
    </div>
  );
}
