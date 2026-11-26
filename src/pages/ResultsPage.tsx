import { useEffect, useState } from "react";
import ListingRow from "../components/ListingRow";
import ListingTile from "../components/ListingTile";
import MapModal from "../components/MapModal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { CheckOption, NumberField } from "../components/fields";
import {
  BellIcon,
  ChevronIcon,
  CloseIcon,
  GridIcon,
  ListIcon,
  MapIcon,
  SearchIcon,
} from "../components/icons";
import {
  CONDITION_LABELS,
  DOCUMENT_OPTIONS,
  FEATURE_OPTIONS,
  SORT_LABELS,
  TRANSACTION_LABELS,
  TYPE_LABELS,
  compactPrice,
  type Condition,
  type PropertyType,
  type SellerType,
  type SortKey,
} from "../data/listings";
import { useApp } from "../store/AppStore";

type PanelOption = { value: string; label: string };

function PanelSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: PanelOption[];
  ariaLabel: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-[44px] w-full cursor-pointer rounded-[5px] border border-[#dce2e9] bg-white px-[11px] text-[13px] text-[#172b45] outline-none transition-colors focus:border-[#f3ad19]"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function QuickSelect({
  label,
  value,
  onChange,
  options,
  className,
  ariaLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: PanelOption[];
  className: string;
  ariaLabel: string;
}) {
  return (
    <div
      className={`relative overflow-clip rounded-[6px] border border-[#dce2e9] border-solid bg-white ${className}`}
    >
      <span className="pointer-events-none absolute left-[15px] top-[7px] font-['Inter:Medium'] text-[11px] font-medium text-[#637084]">
        {label}
      </span>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 size-full cursor-pointer appearance-none truncate border-0 bg-transparent pb-[6px] pl-[15px] pr-[36px] pt-[24px] font-['Inter:Semi_Bold'] text-[15px] font-semibold text-[#172b45] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <img
        alt=""
        src="/assets/69d26.svg"
        className="pointer-events-none absolute right-[15px] top-[25px] size-[18px]"
      />
    </div>
  );
}

const ROOM_PANEL_OPTIONS = [
  { value: "", label: "Toutes" },
  { value: "1", label: "1 +" },
  { value: "2", label: "2 +" },
  { value: "3", label: "3 +" },
  { value: "4", label: "4 +" },
  { value: "5", label: "5 +" },
];

export default function ResultatsVillasADouala() {
  const {
    filters,
    updateFilters,
    resetFilters,
    results,
    sort,
    setSort,
    viewMode,
    setViewMode,
    saveCurrentSearch,
    showToast,
    openListing,
  } = useApp();
  const [page, setPage] = useState(1);
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [filters, sort, viewMode]);

  const pageSize = viewMode === "grid" ? 6 : 4;
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const start = results.length ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, results.length);

  const typeLabel = filters.type ? TYPE_LABELS[filters.type] : "Biens";
  const title = `${typeLabel} ${filters.transaction === "location" ? "à louer" : "à vendre"}${
    filters.city ? ` à ${filters.city}` : ""
  }`;
  const breadcrumb = `Accueil   /   ${TRANSACTION_LABELS[filters.transaction]}   /   ${
    filters.city || "Cameroun"
  }   /   ${filters.type ? TYPE_LABELS[filters.type] : "Tous les biens"}`;

  type Chip = { key: string; label: string; clear: () => void };
  const chips: Chip[] = [];
  if (filters.transaction === "location") {
    chips.push({
      key: "transaction",
      label: "Louer",
      clear: () => updateFilters({ transaction: "vente" }),
    });
  }
  if (filters.city) {
    chips.push({ key: "city", label: filters.city, clear: () => updateFilters({ city: "" }) });
  }
  if (filters.type) {
    chips.push({
      key: "type",
      label: TYPE_LABELS[filters.type],
      clear: () => updateFilters({ type: "" }),
    });
  }
  if (filters.priceMin !== null || filters.priceMax !== null) {
    const label =
      filters.priceMin !== null && filters.priceMax !== null
        ? `${compactPrice(filters.priceMin)}–${compactPrice(filters.priceMax)} FCFA`
        : filters.priceMax !== null
          ? `≤ ${compactPrice(filters.priceMax)} FCFA`
          : `≥ ${compactPrice(filters.priceMin ?? 0)} FCFA`;
    chips.push({
      key: "price",
      label,
      clear: () => updateFilters({ priceMin: null, priceMax: null }),
    });
  }
  if (filters.surfaceMin !== null || filters.surfaceMax !== null) {
    const label =
      filters.surfaceMax !== null
        ? `${filters.surfaceMin ?? 0}–${filters.surfaceMax} m²`
        : `${filters.surfaceMin} m² et plus`;
    chips.push({
      key: "surface",
      label,
      clear: () => updateFilters({ surfaceMin: null, surfaceMax: null }),
    });
  }
  if (filters.roomsMin !== null) {
    chips.push({
      key: "rooms",
      label: `${filters.roomsMin} pièces et plus`,
      clear: () => updateFilters({ roomsMin: null }),
    });
  }
  if (filters.bedroomsMin !== null) {
    chips.push({
      key: "bedrooms",
      label: `${filters.bedroomsMin} chambres et plus`,
      clear: () => updateFilters({ bedroomsMin: null }),
    });
  }
  filters.documents.forEach((document) => {
    chips.push({
      key: `doc-${document}`,
      label: document,
      clear: () =>
        updateFilters({ documents: filters.documents.filter((item) => item !== document) }),
    });
  });
  filters.features.forEach((feature) => {
    chips.push({
      key: `feature-${feature}`,
      label: feature,
      clear: () => updateFilters({ features: filters.features.filter((item) => item !== feature) }),
    });
  });
  if (filters.condition) {
    chips.push({
      key: "condition",
      label: CONDITION_LABELS[filters.condition],
      clear: () => updateFilters({ condition: "" }),
    });
  }
  if (filters.sellerType) {
    chips.push({
      key: "seller",
      label: filters.sellerType === "professionnel" ? "Professionnel" : "Particulier",
      clear: () => updateFilters({ sellerType: "" }),
    });
  }
  if (filters.query) {
    chips.push({
      key: "query",
      label: `« ${filters.query} »`,
      clear: () => updateFilters({ query: "" }),
    });
  }

  const toggleDocument = (document: string) => {
    updateFilters({
      documents: filters.documents.includes(document)
        ? filters.documents.filter((item) => item !== document)
        : [...filters.documents, document],
    });
  };

  const toggleFeature = (feature: string) => {
    updateFilters({
      features: filters.features.includes(feature)
        ? filters.features.filter((item) => item !== feature)
        : [...filters.features, feature],
    });
  };

  const toggleCondition = (condition: Condition) => {
    updateFilters({ condition: filters.condition === condition ? "" : condition });
  };

  const toggleSeller = (seller: SellerType) => {
    updateFilters({ sellerType: filters.sellerType === seller ? "" : seller });
  };

  return (
    <div
      className="bg-white content-stretch flex flex-col items-start relative size-full"
      data-name="Résultats · Villas à Douala"
    >
      <SiteNav
        active={
          filters.transaction === "location"
            ? "location"
            : filters.type === "terrain"
              ? "terrain"
              : "vente"
        }
      />

      {/* Barre de recherche rapide */}
      <div
        className="flex h-[120px] w-full shrink-0 items-center gap-[16px] bg-[#eff2f6] px-[100px]"
        data-name="Recherche rapide"
      >
        <QuickSelect
          label="Transaction"
          ariaLabel="Transaction"
          value={filters.transaction}
          onChange={(value) =>
            updateFilters({
              transaction: value as typeof filters.transaction,
              priceMin: null,
              priceMax: null,
            })
          }
          options={[
            { value: "vente", label: "Acheter" },
            { value: "location", label: "Louer" },
          ]}
          className="h-[64px] w-[190px]"
        />
        <QuickSelect
          label="Localisation"
          ariaLabel="Localisation"
          value={filters.city}
          onChange={(value) => updateFilters({ city: value })}
          options={[
            { value: "", label: "Tout le Cameroun" },
            ...["Douala", "Yaoundé", "Kribi"].map((city) => ({ value: city, label: city })),
          ]}
          className="h-[64px] w-[300px]"
        />
        <QuickSelect
          label="Type de bien"
          ariaLabel="Type de bien"
          value={filters.type}
          onChange={(value) => updateFilters({ type: value as PropertyType | "" })}
          options={[
            { value: "", label: "Tous les types" },
            ...Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label })),
          ]}
          className="h-[64px] w-[310px]"
        />
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("filtres")
              ?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
          className="flex h-[46px] flex-1 cursor-pointer items-center justify-center gap-[10px] rounded-[6px] border-0 bg-[#f3ad19] transition-colors hover:bg-[#ffbe33]"
        >
          <SearchIcon className="size-[20px] text-[#071f49]" />
          <span className="font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49]">
            Modifier la recherche
          </span>
        </button>
      </div>

      {/* Corps résultats */}
      <div
        id="resultats"
        className="w-full shrink-0 bg-[#f4f6f8] px-[100px] pb-[64px] pt-[22px]"
        data-name="Résultats immobiliers"
      >
        <p className="font-['Inter:Regular'] text-[12px] text-[#637084] whitespace-pre">
          {breadcrumb}
        </p>

        <div className="mt-[22px] flex items-start gap-[32px]">
          {/* Panneau filtres gauche */}
          <div
            id="filtres"
            className="w-[302px] shrink-0 rounded-[8px] border border-[#dce2e9] bg-white p-[21px]"
            data-name="Filtres immobiliers avancés"
          >
            <div className="flex items-start justify-between">
              <p className="font-['Inter:Bold'] text-[20px] font-bold leading-[1.45] text-[#071f49]">
                Affiner la recherche
              </p>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  showToast("Filtres réinitialisés.");
                }}
                className="mt-[6px] cursor-pointer border-0 bg-transparent p-0 font-['Inter:Semi_Bold'] text-[12px] font-semibold text-[#637084] underline-offset-2 hover:text-[#071f49] hover:underline"
              >
                Réinitialiser
              </button>
            </div>
            <div className="mt-[14px] h-px w-full bg-[#dce2e9]" />

            <div className="mt-[16px] flex flex-col gap-[15px]">
              <div>
                <p className="mb-[7px] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Ville et quartier
                </p>
                <PanelSelect
                  ariaLabel="Ville et quartier"
                  value={filters.city}
                  onChange={(value) => updateFilters({ city: value })}
                  options={[
                    { value: "", label: "Toutes les villes" },
                    { value: "Douala", label: "Douala · tous les quartiers" },
                    { value: "Yaoundé", label: "Yaoundé · tous les quartiers" },
                    { value: "Kribi", label: "Kribi · tous les quartiers" },
                  ]}
                />
              </div>

              <div>
                <p className="mb-[7px] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Mot-clé
                </p>
                <input
                  aria-label="Mot-clé"
                  value={filters.query}
                  onChange={(event) => updateFilters({ query: event.target.value })}
                  placeholder="Villa, jardin, Bonapriso…"
                  className="h-[44px] w-full rounded-[5px] border border-[#dce2e9] bg-white px-[11px] text-[13px] text-[#172b45] outline-none transition-colors placeholder:text-[#8a95a5] focus:border-[#f3ad19]"
                />
              </div>

              <div>
                <p className="mb-[7px] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  {filters.transaction === "location" ? "Loyer (FCFA / mois)" : "Budget (FCFA)"}
                </p>
                <div className="grid grid-cols-2 gap-[14px]">
                  <NumberField
                    ariaLabel="Budget minimum"
                    value={filters.priceMin !== null ? String(filters.priceMin) : ""}
                    onChange={(value) => updateFilters({ priceMin: value ? Number(value) : null })}
                    placeholder="Min."
                  />
                  <NumberField
                    ariaLabel="Budget maximum"
                    value={filters.priceMax !== null ? String(filters.priceMax) : ""}
                    onChange={(value) => updateFilters({ priceMax: value ? Number(value) : null })}
                    placeholder="Max."
                  />
                </div>
              </div>

              <div>
                <p className="mb-[7px] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Surface (m²)
                </p>
                <div className="grid grid-cols-2 gap-[14px]">
                  <NumberField
                    ariaLabel="Surface minimum"
                    value={filters.surfaceMin !== null ? String(filters.surfaceMin) : ""}
                    onChange={(value) =>
                      updateFilters({ surfaceMin: value ? Number(value) : null })
                    }
                    placeholder="Min."
                  />
                  <NumberField
                    ariaLabel="Surface maximum"
                    value={filters.surfaceMax !== null ? String(filters.surfaceMax) : ""}
                    onChange={(value) =>
                      updateFilters({ surfaceMax: value ? Number(value) : null })
                    }
                    placeholder="Max."
                  />
                </div>
              </div>

              <div>
                <p className="mb-[7px] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Pièces / chambres
                </p>
                <div className="grid grid-cols-2 gap-[14px]">
                  <PanelSelect
                    ariaLabel="Pièces minimum"
                    value={filters.roomsMin !== null ? String(filters.roomsMin) : ""}
                    onChange={(value) => updateFilters({ roomsMin: value ? Number(value) : null })}
                    options={ROOM_PANEL_OPTIONS.map((option) => ({
                      value: option.value,
                      label: option.value
                        ? `${option.value} pièce${option.value === "1" ? "" : "s"} +`
                        : "Pièces",
                    }))}
                  />
                  <PanelSelect
                    ariaLabel="Chambres minimum"
                    value={filters.bedroomsMin !== null ? String(filters.bedroomsMin) : ""}
                    onChange={(value) =>
                      updateFilters({ bedroomsMin: value ? Number(value) : null })
                    }
                    options={ROOM_PANEL_OPTIONS.map((option) => ({
                      value: option.value,
                      label: option.value
                        ? `${option.value} chambre${option.value === "1" ? "" : "s"} +`
                        : "Chambres",
                    }))}
                  />
                </div>
              </div>

              <div>
                <p className="mb-[8px] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Documents déclarés
                </p>
                <div className="flex flex-col gap-[8px]">
                  {DOCUMENT_OPTIONS.map((document) => (
                    <CheckOption
                      key={document}
                      label={document}
                      checked={filters.documents.includes(document)}
                      onChange={() => toggleDocument(document)}
                    />
                  ))}
                </div>
                <p className="mt-[8px] text-[11px] leading-[1.45] text-[#637084]">
                  À faire vérifier auprès des services compétents avant toute transaction.
                </p>
              </div>

              <div>
                <p className="mb-[8px] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Équipements
                </p>
                <div className="flex flex-col gap-[8px]">
                  {FEATURE_OPTIONS.map((feature) => (
                    <CheckOption
                      key={feature}
                      label={feature}
                      checked={filters.features.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-[8px] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  État du bien
                </p>
                <div className="flex flex-col gap-[8px]">
                  {(Object.entries(CONDITION_LABELS) as [Condition, string][]).map(
                    ([value, label]) => (
                      <CheckOption
                        key={value}
                        label={label}
                        checked={filters.condition === value}
                        onChange={() => toggleCondition(value)}
                      />
                    ),
                  )}
                </div>
              </div>

              <div>
                <p className="mb-[8px] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Type d'annonceur
                </p>
                <div className="flex flex-col gap-[8px]">
                  <CheckOption
                    label="Professionnel"
                    checked={filters.sellerType === "professionnel"}
                    onChange={() => toggleSeller("professionnel")}
                  />
                  <CheckOption
                    label="Particulier"
                    checked={filters.sellerType === "particulier"}
                    onChange={() => toggleSeller("particulier")}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  showToast(
                    `${results.length} bien${results.length > 1 ? "s" : ""} correspond${results.length > 1 ? "ent" : ""} à vos critères.`,
                  )
                }
                className="mt-[2px] h-[46px] w-full cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] transition-colors hover:bg-[#ffbe33]"
              >
                Appliquer les filtres
              </button>
              <p className="text-[11px] leading-[1.45] text-[#637084]">
                Les prix sont exprimés en FCFA (XAF). Les résultats se mettent à jour automatiquement.
              </p>
            </div>
          </div>

          {/* Colonne résultats droite */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-['Inter:Bold'] text-[28px] font-bold leading-[1.3] text-[#071f49]">
                  {title}
                </p>
                <p className="mt-1 font-['Inter:Regular'] text-[14px] text-[#637084]">
                  {results.length} bien{results.length > 1 ? "s" : ""}{" "}
                  {results.length > 1 ? "correspondent" : "correspond"} à votre recherche · Données
                  de démonstration
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="flex h-[46px] w-[196px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[6px] border border-[#dce2e9] bg-white transition-colors hover:border-[#f3ad19]"
                data-name="Voir sur la carte"
              >
                <MapIcon className="size-[20px] text-[#071f49]" />
                <span className="font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49]">
                  Voir sur la carte
                </span>
              </button>
            </div>

            {/* Chips + Toggle Vue + Tri */}
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[8px]">
                {chips.length > 0 ? (
                  chips.map((chip) => (
                    <span
                      key={chip.key}
                      className="flex h-[34px] shrink-0 items-center gap-[8px] rounded-[17px] bg-[#e9edf3] pl-[14px] pr-[9px]"
                    >
                      <span className="font-['Inter:Medium'] text-[12px] font-medium text-[#071f49] whitespace-nowrap">
                        {chip.label}
                      </span>
                      <button
                        type="button"
                        aria-label={`Retirer le filtre ${chip.label}`}
                        onClick={chip.clear}
                        className="flex size-[18px] cursor-pointer items-center justify-center rounded-full border-0 bg-white/70 text-[#637084] transition-colors hover:text-[#071f49]"
                      >
                        <CloseIcon className="size-[10px]" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="font-['Inter:Regular'] text-[12px] text-[#637084]">
                    Aucun filtre actif — affinez votre recherche à gauche.
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {/* Toggle Liste / Grille */}
                <div className="flex rounded-[6px] border border-[#dce2e9] bg-white p-0.5">
                  <button
                    type="button"
                    aria-label="Affichage en liste"
                    onClick={() => setViewMode("list")}
                    className={`flex size-[34px] cursor-pointer items-center justify-center rounded-[4px] border-0 transition-colors ${
                      viewMode === "list"
                        ? "bg-[#071f49] text-white"
                        : "bg-transparent text-[#637084] hover:text-[#071f49]"
                    }`}
                  >
                    <ListIcon className="size-[17px]" />
                  </button>
                  <button
                    type="button"
                    aria-label="Affichage en grille"
                    onClick={() => setViewMode("grid")}
                    className={`flex size-[34px] cursor-pointer items-center justify-center rounded-[4px] border-0 transition-colors ${
                      viewMode === "grid"
                        ? "bg-[#071f49] text-white"
                        : "bg-transparent text-[#637084] hover:text-[#071f49]"
                    }`}
                  >
                    <GridIcon className="size-[17px]" />
                  </button>
                </div>

                {/* Tri */}
                <div className="relative w-[210px]">
                  <select
                    aria-label="Trier les résultats"
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="h-[38px] w-full cursor-pointer appearance-none rounded-[6px] border border-[#dce2e9] bg-white pl-3 pr-8 font-['Inter:Medium'] text-[12px] font-medium text-[#172b45] outline-none"
                  >
                    {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([value, label]) => (
                      <option key={value} value={value}>
                        Trier : {label}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon className="pointer-events-none absolute right-2.5 top-[11px] size-[16px] rotate-90 text-[#637084]" />
                </div>
              </div>
            </div>

            {/* Liste ou Grille des résultats */}
            {visible.length === 0 ? (
              <div className="mt-6 flex h-[320px] w-full flex-col items-center justify-center rounded-[8px] border border-dashed border-[#dce2e9] bg-white">
                <p className="font-['Inter:Semi_Bold'] text-[18px] font-semibold text-[#071f49]">
                  Aucun bien ne correspond à vos critères.
                </p>
                <p className="mt-2 text-[13px] text-[#637084]">
                  Élargissez la zone, le budget ou retirez un filtre pour voir les {results.length}{" "}
                  annonces.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 h-[42px] cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49]"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : viewMode === "list" ? (
              <div className="mt-5 flex flex-col gap-[20px]">
                {visible.map((listing) => (
                  <div key={listing.id} className="relative h-[290px] w-full">
                    <div className="relative -left-[434px] h-[290px]">
                      <ListingRow listing={listing} top={0} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-[24px]">
                {visible.map((listing) => (
                  <div key={listing.id} className="relative h-[428px]">
                    <ListingTile listing={listing} left={0} top={0} />
                  </div>
                ))}
              </div>
            )}

            {/* Alerte de recherche */}
            <div
              className="mt-8 flex h-[112px] w-full items-center justify-between rounded-[8px] bg-[#eaf0f8] px-6"
              data-name="Alerte de recherche"
            >
              <div className="flex items-center gap-4">
                <BellIcon className="size-[28px] text-[#071f49]" />
                <div>
                  <p className="font-['Inter:Bold'] text-[18px] font-bold text-[#071f49]">
                    Le bon bien peut arriver demain.
                  </p>
                  <p className="mt-1 font-['Inter:Regular'] text-[13px] text-[#637084]">
                    Enregistrez votre recherche pour retrouver vos critères et recevoir les nouveautés.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={saveCurrentSearch}
                className="h-[46px] w-[210px] shrink-0 cursor-pointer rounded-[6px] border border-[#dce2e9] bg-white font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] transition-colors hover:border-[#f3ad19]"
              >
                Créer une alerte
              </button>
            </div>

            {/* Pagination dynamique */}
            <div className="mt-7 flex items-center justify-between">
              <p className="font-['Inter:Regular'] text-[12px] text-[#637084]">
                {start}–{end} sur {results.length} bien{results.length > 1 ? "s" : ""} · Données
                illustratives
              </p>

              {results.length > 0 ? (
                <div className="flex items-center gap-2">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNumber) => {
                    const isActive = pageNumber === currentPage;
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => {
                          setPage(pageNumber);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`flex size-[42px] cursor-pointer items-center justify-center rounded-[5px] border font-['Inter:Semi_Bold'] text-[13px] font-semibold transition-colors ${
                          isActive
                            ? "border-[#071f49] bg-[#071f49] text-white"
                            : "border-[#dce2e9] bg-white text-[#071f49] hover:border-[#f3ad19]"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <p className="mt-6 font-['Inter:Regular'] text-[12px] text-[#637084]">
              Conseil : ne versez aucun acompte sans visite, vérification des documents et accord
              formalisé.
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />

      {mapOpen ? (
        <MapModal
          listings={results}
          onClose={() => setMapOpen(false)}
          onOpen={(id) => {
            setMapOpen(false);
            openListing(id);
          }}
        />
      ) : null}
    </div>
  );
}
