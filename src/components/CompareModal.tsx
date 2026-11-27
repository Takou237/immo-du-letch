import {
  CONDITION_LABELS,
  TYPE_SINGULAR,
  formatPrice,
  getPriceRating,
  PRICE_RATING_CONFIG,
  priceLabel,
} from "../data/listings";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";
import Modal from "./Modal";
import { CloseIcon, PinIcon } from "./icons";

export default function CompareModal() {
  const {
    compareOpen,
    closeCompare,
    compareList,
    allListings,
    removeFromCompare,
    clearCompare,
    openListing,
  } = useApp();
  const t = useT();

  if (!compareOpen) return null;

  const items = compareList
    .map((id) => allListings.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  if (items.length === 0) return null;

  const sameTransaction = items.every((l) => l.transaction === items[0].transaction);
  const minPrice = sameTransaction ? Math.min(...items.map((l) => l.price)) : Number.NaN;
  const maxSurface = Math.max(...items.map((l) => l.surface));

  return (
    <Modal
      onClose={closeCompare}
      label="Comparateur de biens immobiliers"
      panelClassName="w-[960px] max-w-[95vw]"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pr-10">
          <div>
            <p className="font-['Inter:Bold'] text-[22px] font-bold text-[#071f49]">
              {t.compare.title}
            </p>
            <p className="mt-1 text-[13px] text-[#637084]">
              {t.compare.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={clearCompare}
            className="cursor-pointer rounded-[6px] border border-[#dce2e9] bg-white px-3 py-2 font-['Inter:Semi_Bold'] text-[12px] font-semibold text-[#637084] hover:border-[#071f49] hover:text-[#071f49]"
          >
            {t.compare.clearAll}
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#dce2e9]">
                <th className="w-[170px] py-3 pr-4 align-top font-['Inter:Semi_Bold'] text-[12px] font-semibold text-[#637084]">
                  {t.compare.criteria}
                </th>
                {items.map((item) => (
                  <th key={item.id} className="w-[240px] px-3 pb-4 align-top">
                    <div className="relative overflow-hidden rounded-[8px] border border-[#dce2e9]">
                      <button
                        type="button"
                        aria-label={`Retirer ${item.title}`}
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute right-2 top-2 z-10 flex size-[24px] cursor-pointer items-center justify-center rounded-full border-0 bg-white/90 text-[#637084] hover:text-[#e11d48]"
                      >
                        <CloseIcon className="size-[12px]" />
                      </button>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-[120px] w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="line-clamp-2 font-['Inter:Bold'] text-[14px] font-bold leading-snug text-[#071f49]">
                          {item.title}
                        </p>
                        <p className="mt-1 flex items-center gap-1 font-['Inter:Regular'] text-[11px] text-[#637084]">
                          <PinIcon className="size-[12px]" /> {item.neighborhood}, {item.city}
                        </p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2f6] text-[13px]">
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">Prix</td>
                {items.map((item) => {
                  const isBest = items.length > 1 && item.price === minPrice;
                  return (
                    <td key={item.id} className="px-3 py-3">
                      <span
                        className={`font-['Inter:Bold'] font-bold ${
                          isBest ? "text-[#1f7a3d]" : "text-[#071f49]"
                        }`}
                      >
                        {priceLabel(item)}
                      </span>
                      {isBest ? (
                        <span className="ml-2 rounded-full bg-[#e7f6ec] px-2 py-0.5 text-[10px] font-semibold text-[#1f7a3d]">
                          Meilleur prix
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">Évaluation marché</td>
                {items.map((item) => {
                  const rating = getPriceRating(item);
                  const cfg = rating ? PRICE_RATING_CONFIG[rating] : null;
                  return (
                    <td key={item.id} className="px-3 py-3">
                      {cfg ? (
                        <span
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          className="inline-flex rounded-[4px] px-2 py-0.5 text-[11px] font-semibold"
                        >
                          {cfg.label}
                        </span>
                      ) : (
                        <span className="text-[#8a95a5]">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">Type de bien</td>
                {items.map((item) => (
                  <td key={item.id} className="px-3 py-3 font-medium text-[#172b45]">
                    {TYPE_SINGULAR[item.type]} ({item.transaction === "vente" ? "Vente" : "Location"})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">Surface</td>
                {items.map((item) => {
                  const isBest = items.length > 1 && item.surface === maxSurface;
                  return (
                    <td
                      key={item.id}
                      className={`px-3 py-3 font-semibold ${
                        isBest ? "text-[#1f7a3d]" : "text-[#172b45]"
                      }`}
                    >
                      {formatPrice(item.surface)} m²
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">Pièces / Chambres</td>
                {items.map((item) => (
                  <td key={item.id} className="px-3 py-3 text-[#172b45]">
                    {item.rooms ? `${item.rooms} pièces / ${item.bedrooms} ch.` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">Terrain</td>
                {items.map((item) => (
                  <td key={item.id} className="px-3 py-3 text-[#172b45]">
                    {item.land ? `${formatPrice(item.land)} m²` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">État</td>
                {items.map((item) => (
                  <td key={item.id} className="px-3 py-3 text-[#172b45]">
                    {CONDITION_LABELS[item.condition]}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">Documents</td>
                {items.map((item) => (
                  <td key={item.id} className="px-3 py-3 text-[12px] text-[#172b45]">
                    {item.documents.length > 0 ? item.documents.join(", ") : "Non renseigné"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">Équipements</td>
                {items.map((item) => (
                  <td key={item.id} className="px-3 py-3 text-[12px] text-[#172b45]">
                    {item.features.slice(0, 4).join(", ") || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-['Inter:Medium'] text-[#637084]">Annonceur</td>
                {items.map((item) => (
                  <td key={item.id} className="px-3 py-3 text-[#172b45]">
                    <span className="font-semibold">{item.seller}</span>{" "}
                    <span className="text-[11px] text-[#a26b00]">★ {item.sellerRating.toFixed(1)}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 pr-4" />
                {items.map((item) => (
                  <td key={item.id} className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => openListing(item.id)}
                      className="h-[40px] w-full cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] transition-colors hover:bg-[#ffbe33]"
                    >
                      Voir la fiche
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
