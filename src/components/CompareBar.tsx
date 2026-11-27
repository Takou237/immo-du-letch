import { compactPrice } from "../data/listings";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";
import { CloseIcon, ScaleIcon } from "./icons";

export default function CompareBar() {
  const { compareList, allListings, removeFromCompare, clearCompare, openCompare } = useApp();
  const t = useT();

  if (compareList.length === 0) return null;

  const items = compareList
    .map((id) => allListings.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div
      role="region"
      aria-label="Comparateur de biens"
      className="animate-slide-up fixed bottom-4 left-1/2 z-[90] flex w-[min(94vw,760px)] -translate-x-1/2 items-center justify-between gap-3 rounded-[12px] border border-[#dce2e9] bg-white px-4 py-3 shadow-[0_18px_48px_rgb(7_31_73/22%)]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
        <div className="flex shrink-0 items-center gap-2 text-[#071f49]">
          <ScaleIcon className="size-[18px] text-[#f3ad19]" />
          <span className="font-['Inter:Bold'] text-[13px] font-bold whitespace-nowrap">
            {t.modals.comparator} ({items.length}/3)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] py-1 pl-1.5 pr-2"
            >
              <img
                src={item.image}
                alt={item.title}
                className="size-[34px] shrink-0 rounded-[5px] object-cover"
              />
              <div className="max-w-[110px]">
                <p className="truncate font-['Inter:Semi_Bold'] text-[11px] font-semibold text-[#071f49]">
                  {item.title}
                </p>
                <p className="font-['Inter:Bold'] text-[10px] font-bold text-[#637084]">
                  {compactPrice(item.price)} FCFA{item.transaction === "location" ? " / mois" : ""}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Retirer ${item.title} du comparateur`}
                onClick={() => removeFromCompare(item.id)}
                className="flex size-[20px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-[#637084] hover:text-[#e11d48]"
              >
                <CloseIcon className="size-[10px]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={clearCompare}
          className="cursor-pointer border-0 bg-transparent px-2 py-1 font-['Inter:Medium'] text-[12px] text-[#637084] hover:text-[#071f49]"
        >
          {t.modals.clear}
        </button>
        <button
          type="button"
          disabled={items.length < 2}
          onClick={openCompare}
          className="h-[38px] cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] px-4 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] transition-colors hover:bg-[#ffbe33] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.modals.compareBtn(items.length)}
        </button>
      </div>
    </div>
  );
}
