import { useEffect, useState } from "react";
import MobileListingCard from "../components/MobileListingCard";
import MobileNav from "../components/MobileNav";
import { ChevronIcon, CloseIcon, SearchIcon } from "../components/icons";
import {
  CITY_OPTIONS,
  DOCUMENT_OPTIONS,
  FEATURE_OPTIONS,
  SORT_LABELS,
  TYPE_LABELS,
  compactPrice,
  type PropertyType,
  type SortKey,
} from "../data/listings";
import { useApp } from "../store/AppStore";

const PAGE_SIZE = 6;

export default function MobileResultsPage() {
  const { filters, updateFilters, resetFilters, results, sort, setSort, saveCurrentSearch } = useApp();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const title = `${filters.type ? TYPE_LABELS[filters.type] : "Biens"} ${
    filters.transaction === "location" ? "à louer" : "à vendre"
  }${filters.city ? ` à ${filters.city}` : ""}`;

  const activeCount =
    (filters.city ? 1 : 0) +
    (filters.type ? 1 : 0) +
    (filters.priceMin !== null || filters.priceMax !== null ? 1 : 0) +
    (filters.surfaceMin !== null || filters.surfaceMax !== null ? 1 : 0) +
    (filters.bedroomsMin !== null ? 1 : 0) +
    filters.features.length +
    filters.documents.length;

  const toggleFeature = (feature: string) =>
    updateFilters({
      features: filters.features.includes(feature)
        ? filters.features.filter((item) => item !== feature)
        : [...filters.features, feature],
    });

  const toggleDocument = (document: string) =>
    updateFilters({
      documents: filters.documents.includes(document)
        ? filters.documents.filter((item) => item !== document)
        : [...filters.documents, document],
    });

  const chipClass =
    "inline-flex items-center gap-1 rounded-full border border-[#dce2e9] bg-white px-2.5 py-1 text-[11px] font-medium text-[#071f49]";

  return (
    <div className="min-h-dvh bg-[#f8fafc] pb-24 font-['Inter:Regular'] text-[#071f49]">
      <MobileNav />

      <div className="sticky top-[58px] z-40 border-b border-[#dce2e9] bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <label className="flex h-[40px] flex-1 items-center gap-2 rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3">
            <SearchIcon className="size-[16px] shrink-0 text-[#637084]" />
            <input
              aria-label="Mot-clé"
              value={filters.query}
              onChange={(event) => updateFilters({ query: event.target.value })}
              placeholder="Villa, piscine, quartier…"
              className="w-full min-w-0 border-0 bg-transparent text-[13px] outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="relative h-[40px] shrink-0 cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white px-3 text-[12px] font-semibold text-[#071f49]"
          >
            Filtres
            {activeCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex size-[18px] items-center justify-center rounded-full bg-[#f3ad19] text-[10px] font-bold text-[#071f49]">
                {activeCount}
              </span>
            ) : null}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() =>
                updateFilters({ transaction: filters.transaction === "vente" ? "location" : "vente", priceMin: null, priceMax: null })
              }
              className={`shrink-0 cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                filters.transaction === "location"
                  ? "border-[#071f49] bg-[#071f49] text-white"
                  : "border-[#dce2e9] bg-white text-[#637084]"
              }`}
            >
              {filters.transaction === "vente" ? "Acheter" : "Louer"}
            </button>
            {filters.city ? (
              <button
                type="button"
                onClick={() => updateFilters({ city: "" })}
                className={chipClass}
              >
                {filters.city} <CloseIcon className="size-[9px]" />
              </button>
            ) : null}
            {filters.type ? (
              <button
                type="button"
                onClick={() => updateFilters({ type: "" })}
                className={chipClass}
              >
                {TYPE_LABELS[filters.type]} <CloseIcon className="size-[9px]" />
              </button>
            ) : null}
            {filters.priceMin !== null || filters.priceMax !== null ? (
              <button
                type="button"
                onClick={() => updateFilters({ priceMin: null, priceMax: null })}
                className={chipClass}
              >
                {filters.priceMax !== null ? `≤ ${compactPrice(filters.priceMax)}` : "Budget"} FCFA{" "}
                <CloseIcon className="size-[9px]" />
              </button>
            ) : null}
            {filters.features.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={chipClass}
              >
                {feature} <CloseIcon className="size-[9px]" />
              </button>
            ))}
          </div>

          <select
            aria-label="Trier les résultats"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="h-[30px] shrink-0 cursor-pointer rounded-[6px] border border-[#dce2e9] bg-white px-1.5 text-[11px] font-medium text-[#071f49] outline-none"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-4 pt-4">
        <h1 className="text-[18px] font-bold leading-snug text-[#071f49]">{title}</h1>
        <p className="mt-0.5 text-[12px] text-[#637084]">
          {results.length} bien{results.length > 1 ? "s" : ""}{" "}
          {results.length > 1 ? "correspondent" : "correspond"} à votre recherche
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-2 px-4">
        {visible.map((listing) => (
          <MobileListingCard key={listing.id} listing={listing} />
        ))}

        {visible.length === 0 ? (
          <div className="rounded-[12px] border border-[#dce2e9] bg-white px-4 py-8 text-center">
            <p className="text-[14px] font-semibold text-[#071f49]">Aucun bien ne correspond.</p>
            <p className="mt-1 text-[12px] text-[#637084]">
              Élargissez le budget, la ville ou retirez un filtre.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 h-[38px] cursor-pointer rounded-[8px] border-0 bg-[#f3ad19] px-4 text-[12px] font-semibold text-[#071f49]"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : null}
      </div>

      {results.length > PAGE_SIZE ? (
        <div className="mt-4 flex items-center justify-between gap-2 px-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="h-[38px] cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white px-3 text-[12px] font-semibold text-[#071f49] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="text-[12px] text-[#637084]">
            Page {currentPage} / {pageCount}
          </span>
          <button
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            className="h-[38px] cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white px-3 text-[12px] font-semibold text-[#071f49] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      ) : null}

      <div className="mt-4 px-4">
        <button
          type="button"
          onClick={saveCurrentSearch}
          className="h-[40px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white text-[12px] font-semibold text-[#071f49]"
        >
          Enregistrer cette recherche
        </button>
      </div>

      {/* Panneau de filtres */}
      {filtersOpen ? (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <button
            type="button"
            aria-label="Fermer les filtres"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 cursor-pointer border-0 bg-[#071f49]/45"
          />
          <div className="animate-fade-in relative max-h-[88dvh] overflow-y-auto rounded-t-[16px] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold text-[#071f49]">Filtres</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Fermer"
                className="flex size-[34px] cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-white text-[#637084]"
              >
                <CloseIcon className="size-[12px]" />
              </button>
            </div>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
              Transaction
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(["vente", "location"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    updateFilters({ transaction: value, priceMin: null, priceMax: null })
                  }
                  className={`h-[38px] cursor-pointer rounded-[8px] border text-[12px] font-semibold ${
                    filters.transaction === value
                      ? "border-[#071f49] bg-[#071f49] text-white"
                      : "border-[#dce2e9] bg-white text-[#071f49]"
                  }`}
                >
                  {value === "vente" ? "Acheter" : "Louer"}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                  Ville
                </span>
                <select
                  value={filters.city}
                  onChange={(event) => updateFilters({ city: event.target.value })}
                  className="mt-1 h-[40px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white px-2 text-[12px] outline-none focus:border-[#f3ad19]"
                >
                  <option value="">Tout le Cameroun</option>
                  {CITY_OPTIONS.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                  Type de bien
                </span>
                <select
                  value={filters.type}
                  onChange={(event) =>
                    updateFilters({ type: event.target.value as PropertyType | "" })
                  }
                  className="mt-1 h-[40px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white px-2 text-[12px] outline-none focus:border-[#f3ad19]"
                >
                  <option value="">Tous les biens</option>
                  {(Object.keys(TYPE_LABELS) as PropertyType[]).map((type) => (
                    <option key={type} value={type}>
                      {TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                  {filters.transaction === "location" ? "Loyer min" : "Prix min"}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={filters.priceMin ?? ""}
                  onChange={(event) =>
                    updateFilters({
                      priceMin: event.target.value ? Number(event.target.value) : null,
                    })
                  }
                  placeholder="—"
                  className="mt-1 h-[40px] w-full rounded-[8px] border border-[#dce2e9] px-2 text-[12px] outline-none focus:border-[#f3ad19]"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                  {filters.transaction === "location" ? "Loyer max" : "Prix max"}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={filters.priceMax ?? ""}
                  onChange={(event) =>
                    updateFilters({
                      priceMax: event.target.value ? Number(event.target.value) : null,
                    })
                  }
                  placeholder="—"
                  className="mt-1 h-[40px] w-full rounded-[8px] border border-[#dce2e9] px-2 text-[12px] outline-none focus:border-[#f3ad19]"
                />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                  Surface min (m²)
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={filters.surfaceMin ?? ""}
                  onChange={(event) =>
                    updateFilters({
                      surfaceMin: event.target.value ? Number(event.target.value) : null,
                    })
                  }
                  placeholder="—"
                  className="mt-1 h-[40px] w-full rounded-[8px] border border-[#dce2e9] px-2 text-[12px] outline-none focus:border-[#f3ad19]"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                  Chambres min
                </span>
                <select
                  value={filters.bedroomsMin ?? ""}
                  onChange={(event) =>
                    updateFilters({
                      bedroomsMin: event.target.value ? Number(event.target.value) : null,
                    })
                  }
                  className="mt-1 h-[40px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white px-2 text-[12px] outline-none focus:border-[#f3ad19]"
                >
                  <option value="">Toutes</option>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value} et plus
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
              Équipements
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {FEATURE_OPTIONS.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                    filters.features.includes(feature)
                      ? "border-[#f3ad19] bg-[#fff7e6] text-[#071f49]"
                      : "border-[#dce2e9] bg-white text-[#637084]"
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
              Documents
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {DOCUMENT_OPTIONS.map((document) => (
                <button
                  key={document}
                  type="button"
                  onClick={() => toggleDocument(document)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                    filters.documents.includes(document)
                      ? "border-[#f3ad19] bg-[#fff7e6] text-[#071f49]"
                      : "border-[#dce2e9] bg-white text-[#637084]"
                  }`}
                >
                  {document}
                </button>
              ))}
            </div>

            <div className="sticky bottom-0 mt-5 flex gap-2 bg-white pb-1 pt-2">
              <button
                type="button"
                onClick={resetFilters}
                className="h-[44px] flex-1 cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white text-[13px] font-semibold text-[#637084]"
              >
                Réinitialiser
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-[44px] flex-[1.4] cursor-pointer items-center justify-center gap-1 rounded-[8px] border-0 bg-[#f3ad19] text-[13px] font-semibold text-[#071f49]"
              >
                Voir {results.length} bien{results.length > 1 ? "s" : ""}
                <ChevronIcon className="size-[12px]" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
