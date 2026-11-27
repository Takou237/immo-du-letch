import {
  MARKET_AVERAGE,
  PRICE_RATING_CONFIG,
  formatPrice,
  getPriceRating,
  marketPricePerM2,
  type Listing,
  type PriceRating,
} from "../data/listings";
import { useT } from "../i18n/translations";

const LEVELS: PriceRating[] = ["excellent", "tres_bon", "bon", "marche", "eleve"];

type Props = {
  listing: Listing;
  compact?: boolean;
};

export default function PriceScale({ listing, compact = false }: Props) {
  const t = useT();
  const rating = getPriceRating(listing);
  if (!rating) return null;

  const config = PRICE_RATING_CONFIG[rating];
  const ratingText = t.priceRatings[rating];
  const perM2 = marketPricePerM2(listing);
  const average = MARKET_AVERAGE[listing.city];

  if (compact) {
    return (
      <span
        style={{ backgroundColor: config.bg, color: config.color }}
        className="inline-flex h-[24px] items-center gap-1.5 rounded-[4px] px-[8px] font-['Inter:Semi_Bold'] text-[11px] font-semibold whitespace-nowrap"
      >
        <span
          style={{ backgroundColor: config.color }}
          className="inline-block size-[6px] rounded-full"
        />
        {ratingText.label}
      </span>
    );
  }

  return (
    <div className="rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] p-4">
      <div className="flex items-center justify-between gap-2">
        <span
          style={{ backgroundColor: config.bg, color: config.color }}
          className="inline-flex h-[26px] items-center gap-1.5 rounded-full px-3 font-['Inter:Semi_Bold'] text-[12px] font-semibold"
        >
          <span
            style={{ backgroundColor: config.color }}
            className="inline-block size-[7px] rounded-full"
          />
          {ratingText.label}
        </span>
        {perM2 && average ? (
          <span className="font-['Inter:Regular'] text-[11px] text-[#637084]">
            {formatPrice(perM2)} FCFA/m² ({listing.city} : {formatPrice(average)} FCFA/m²)
          </span>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-5 gap-1">
        {LEVELS.map((level) => {
          const item = PRICE_RATING_CONFIG[level];
          const itemText = t.priceRatings[level];
          const isCurrent = level === rating;
          return (
            <div key={level} className="flex flex-col items-center gap-1">
              <div
                style={{
                  backgroundColor: item.color,
                  opacity: isCurrent ? 1 : 0.25,
                  height: isCurrent ? "8px" : "5px",
                }}
                className="w-full rounded-full transition-all"
              />
              <span
                className={`text-[9px] leading-tight ${
                  isCurrent ? "font-['Inter:Bold'] font-bold text-[#071f49]" : "text-[#8a95a5]"
                }`}
              >
                {itemText.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
