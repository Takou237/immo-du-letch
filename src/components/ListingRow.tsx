import type { Listing } from "../data/listings";
import { badgeLabel, formatPrice, metaLine, priceLabel } from "../data/listings";
import { useApp } from "../store/AppStore";
import PriceScale from "./PriceScale";
import { EyeIcon, HeartIcon, PinIcon, ScaleIcon, TrendDownIcon } from "./icons";

type Props = {
  listing: Listing;
  top: number;
};

export default function ListingRow({ listing, top }: Props) {
  const { openListing, isFavorite, toggleFavorite, isInCompare, toggleCompare } = useApp();
  const favorite = isFavorite(listing.id);
  const comparing = isInCompare(listing.id);
  const extras = [
    listing.land ? `Terrain de ${listing.land} m²` : null,
    ...listing.features.slice(0, 2),
  ]
    .filter(Boolean)
    .join(" · ");

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
      style={{ top }}
      className="absolute bg-white border border-[#dce2e9] border-solid h-[290px] left-[434px] cursor-pointer overflow-clip rounded-[8px] text-left transition-transform duration-200 w-[906px] hover:-translate-y-[2px] hover:border-[#f3ad19] hover:shadow-[0_12px_28px_rgb(7_31_73/12%)]"
    >
      <div className="absolute h-[290px] left-[-1px] top-[-1px] w-[310px]">
        <img
          alt={listing.title}
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={listing.image}
        />
      </div>

      <span className="absolute bg-white h-[28px] left-[15px] rounded-[4px] top-[15px] px-[12px] font-['Inter:Semi_Bold'] font-semibold leading-[28px] text-[#071f49] text-[12px]">
        {badgeLabel(listing)}
      </span>
      {listing.isNew ? (
        <span className="absolute bg-[#e7f6ec] h-[28px] left-[104px] rounded-[4px] top-[15px] px-[10px] font-['Inter:Semi_Bold'] font-semibold leading-[28px] text-[#1f7a3d] text-[11px]">
          Nouveau
        </span>
      ) : null}
      {listing.priceDropped ? (
        <span className="absolute left-[15px] top-[248px] inline-flex h-[24px] items-center gap-1 rounded-[4px] bg-[#fef2f2] px-[8px] font-['Inter:Semi_Bold'] text-[11px] font-semibold text-[#dc2626]">
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
        className={`absolute left-[789px] top-[17px] flex size-[42px] cursor-pointer items-center justify-center rounded-[21px] border border-[#dce2e9] transition-transform hover:scale-105 ${
          comparing ? "border-[#f3ad19] bg-[#f3ad19] text-[#071f49]" : "bg-white text-[#071f49]"
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
        className="absolute bg-white border border-[#dce2e9] border-solid left-[841px] cursor-pointer overflow-clip rounded-[21px] size-[42px] top-[17px] transition-transform hover:scale-105"
      >
        <HeartIcon className="absolute left-[10px] size-[20px] top-[10px]" filled={favorite} />
      </button>

      <p className="absolute font-['Inter:Bold'] font-bold leading-[1.45] left-[333px] line-clamp-1 text-[#071f49] text-[19px] top-[19px] w-[440px]">
        {listing.title}
      </p>
      <span className="absolute left-[333px] size-[16px] top-[60px] text-[#637084]">
        <PinIcon className="size-full" />
      </span>
      <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[357px] text-[#637084] text-[13px] top-[56px] whitespace-nowrap">
        {listing.neighborhood}, {listing.city}
      </p>

      <div className="absolute left-[333px] top-[88px] flex items-center gap-3">
        <p className="font-['Inter:Bold'] font-bold leading-[1.45] text-[#071f49] text-[25px]">
          {priceLabel(listing)}
        </p>
        {listing.priceDropped && listing.originalPrice ? (
          <span className="font-['Inter:Regular'] text-[13px] text-[#8a95a5] line-through">
            {formatPrice(listing.originalPrice)} FCFA
          </span>
        ) : null}
        <PriceScale listing={listing} compact />
      </div>

      <p className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[333px] text-[#172b45] text-[14px] top-[137px] whitespace-pre">
        {metaLine(listing)}
      </p>
      <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[333px] text-[#637084] text-[13px] top-[168px] whitespace-nowrap">
        {extras}
      </p>
      <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[333px] line-clamp-2 text-[#637084] text-[13px] top-[200px] w-[540px]">
        {listing.description}
      </p>
      <div className="absolute bg-[#dce2e9] h-px left-[333px] top-[251px] w-[550px]" />
      <div className="absolute left-[333px] top-[262px] flex w-[550px] items-center justify-between text-[#637084] text-[11px]">
        <span className="font-['Inter:Medium'] font-medium">
          {listing.seller} · <span className="text-[#a26b00]">★ {listing.sellerRating.toFixed(1)}</span> ({listing.sellerReviews} avis)
        </span>
        <span className="inline-flex items-center gap-1">
          <EyeIcon className="size-[13px]" /> {listing.views} vues
        </span>
      </div>
    </div>
  );
}
