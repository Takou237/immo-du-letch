import { useMemo, useState } from "react";
import MobileFooter from "../components/MobileFooter";
import MobileNav from "../components/MobileNav";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { SearchIcon } from "../components/icons";
import { BUDGET_LOCATION, BUDGET_VENTE, HERO_TABS, type HomeTab } from "../data/homeContent";
import {
  CITY_OPTIONS,
  CONDITION_LABELS,
  DEFAULT_FILTERS,
  DOCUMENT_OPTIONS,
  TYPE_LABELS,
  filterListings,
  type Condition,
  type Filters,
  type PropertyType,
  type SellerType,
} from "../data/listings";
import { useIsMobile } from "../hooks/useIsMobile";
import { useApp } from "../store/AppStore";

const RESIDENTIAL_FEATURES = [
  "Jardin",
  "Terrasse",
  "Piscine",
  "Parking",
  "Climatisation",
  "Groupe électrogène",
  "Meublé",
  "Balcon",
  "Clôture",
];

const LAND_FEATURES = ["Accès par route", "Zone résidentielle", "Terrain plat"];

const PRO_FEATURES = ["Climatisation", "Parking", "Ascenseur", "Groupe électrogène"];

export default function AdvancedSearchPage() {
  const { allListings, filters: initialStoreFilters, searchWith, navigate } = useApp();
  const isMobile = useIsMobile();

  const deriveInitialTab = (): HomeTab => {
    if (initialStoreFilters.type === "terrain") return "terrain";
    if (initialStoreFilters.sellerType === "professionnel" || initialStoreFilters.type === "bureau") {
      return "pro";
    }
    if (
      initialStoreFilters.transaction === "location" &&
      initialStoreFilters.features.includes("Meublé")
    ) {
      return "meuble";
    }
    return initialStoreFilters.transaction === "location" ? "location" : "vente";
  };

  const [tab, setTab] = useState<HomeTab>(deriveInitialTab);
  const [draft, setDraft] = useState<Filters>({ ...initialStoreFilters });

  const isRent = tab === "location" || tab === "meuble";
  const isLand = tab === "terrain" || draft.type === "terrain";
  const isPro = tab === "pro" || draft.type === "bureau";
  const budgetOptions = isRent ? BUDGET_LOCATION : BUDGET_VENTE;

  const chooseTab = (next: HomeTab) => {
    setTab(next);
    setDraft((prev) => {
      const nextIsRent = next === "location" || next === "meuble";
      const nextFeatures =
        next === "meuble"
          ? Array.from(new Set([...prev.features, "Meublé"]))
          : prev.features.filter((f) => f !== "Meublé");

      return {
        ...prev,
        transaction: nextIsRent ? "location" : "vente",
        type:
          next === "terrain"
            ? "terrain"
            : next === "pro"
              ? "bureau"
              : prev.type === "terrain" && next !== "vente"
                ? ""
                : prev.type,
        priceMin: null,
        priceMax: null,
        features: nextFeatures,
        sellerType: next === "pro" ? "professionnel" : prev.sellerType,
        // Réinitialiser les champs non pertinents pour les terrains
        roomsMin: next === "terrain" ? null : prev.roomsMin,
        bedroomsMin: next === "terrain" ? null : prev.bedroomsMin,
        bathroomsMin: next === "terrain" ? null : prev.bathroomsMin,
        parkingMin: next === "terrain" ? null : prev.parkingMin,
        yearBuiltMin: next === "terrain" ? null : prev.yearBuiltMin,
      };
    });
  };

  const toggleArrayItem = (key: "documents" | "features", value: string) => {
    setDraft((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((item) => item !== value) : [...prev[key], value],
      };
    });
  };

  const matchCount = useMemo(
    () => filterListings(allListings, draft).length,
    [allListings, draft],
  );

  const availableFeatures = isLand
    ? LAND_FEATURES
    : isPro
      ? PRO_FEATURES
      : RESIDENTIAL_FEATURES;

  const availableTypes: PropertyType[] = isPro
    ? ["bureau"]
    : isLand
      ? ["terrain"]
      : isRent
        ? ["villa", "appartement", "studio", "bureau"]
        : ["villa", "appartement", "terrain", "studio", "bureau"];

  const handleReset = () => {
    setTab("vente");
    setDraft(DEFAULT_FILTERS);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f4f6f8]">
      {isMobile ? <MobileNav /> : <SiteNav active={isLand ? "terrain" : isRent ? "location" : "vente"} />}

      <main className="flex-1 px-4 pb-28 pt-6 md:px-[100px] md:pt-8">
        <div className="mx-auto max-w-[1100px]">
          {/* En-tête */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[12px] text-[#637084]">
                <button
                  type="button"
                  onClick={() => navigate("home")}
                  className="cursor-pointer border-0 bg-transparent p-0 text-[#637084] hover:text-[#071f49]"
                >
                  Accueil
                </button>
                <span>/</span>
                <span className="font-semibold text-[#071f49]">Recherche avancée</span>
              </div>
              <h1 className="mt-1.5 font-['Inter:Bold'] text-[22px] font-bold text-[#071f49] md:text-[28px]">
                Recherche détaillée — Tous les critères
              </h1>
              <p className="mt-0.5 text-[13px] text-[#637084]">
                Les critères s'adaptent automatiquement à la catégorie sélectionnée.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="h-[38px] cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white px-4 font-['Inter:Semi_Bold'] text-[12px] font-semibold text-[#637084] hover:border-[#071f49] hover:text-[#071f49]"
            >
              Réinitialiser les filtres
            </button>
          </div>

          {/* Barre d'onglets Catégorie (style mobile.de) */}
          <div className="mt-5 flex gap-2 overflow-x-auto rounded-[10px] border border-[#dce2e9] bg-white p-2">
            {HERO_TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseTab(item.id)}
                  className={`shrink-0 cursor-pointer rounded-[7px] border-0 px-4 py-2 font-['Inter:Semi_Bold'] text-[13px] font-semibold transition-colors ${
                    active
                      ? "bg-[#071f49] text-white"
                      : "bg-transparent text-[#4a5a70] hover:bg-[#f4f6f8] hover:text-[#071f49]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Sections de filtres */}
          <div className="mt-5 flex flex-col gap-5">
            {/* 1. Données de base & Localisation */}
            <section className="rounded-[12px] border border-[#dce2e9] bg-white p-5 md:p-6">
              <h2 className="font-['Inter:Bold'] text-[16px] font-bold text-[#071f49]">
                1. Données de base & Localisation
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                    Transaction
                  </span>
                  <select
                    value={draft.transaction}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        transaction: e.target.value as Filters["transaction"],
                        priceMin: null,
                        priceMax: null,
                      }))
                    }
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                  >
                    <option value="vente">Acheter</option>
                    <option value="location">Louer</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                    Type de bien
                  </span>
                  <select
                    value={draft.type}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, type: e.target.value as PropertyType | "" }))
                    }
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                  >
                    {availableTypes.length > 1 ? <option value="">Tous les types</option> : null}
                    {availableTypes.map((typeKey) => (
                      <option key={typeKey} value={typeKey}>
                        {TYPE_LABELS[typeKey]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                    Ville
                  </span>
                  <select
                    value={draft.city}
                    onChange={(e) => setDraft((p) => ({ ...p, city: e.target.value }))}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                  >
                    <option value="">Tout le Cameroun</option>
                    {CITY_OPTIONS.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                    Quartier ou mot-clé
                  </span>
                  <input
                    type="text"
                    value={draft.query}
                    onChange={(e) => setDraft((p) => ({ ...p, query: e.target.value }))}
                    placeholder="Bonapriso, Bastos, piscine..."
                    className="h-[42px] w-full rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                  />
                </label>
              </div>
            </section>

            {/* 2. Budget & Opportunités */}
            <section className="rounded-[12px] border border-[#dce2e9] bg-white p-5 md:p-6">
              <h2 className="font-['Inter:Bold'] text-[16px] font-bold text-[#071f49]">
                2. {isRent ? "Loyer mensuel & Opportunités" : "Budget d'achat & Opportunités"}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                    {isRent ? "Loyer min (FCFA / mois)" : "Prix minimum (FCFA)"}
                  </span>
                  <select
                    value={draft.priceMin ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        priceMin: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                  >
                    {budgetOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                    {isRent ? "Loyer max (FCFA / mois)" : "Prix maximum (FCFA)"}
                  </span>
                  <select
                    value={draft.priceMax ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        priceMax: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                  >
                    {budgetOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-col justify-end gap-2 sm:col-span-2">
                  <div className="flex flex-wrap gap-3">
                    <label className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 py-2 text-[13px] font-medium text-[#071f49]">
                      <input
                        type="checkbox"
                        checked={draft.priceDroppedOnly}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, priceDroppedOnly: e.target.checked }))
                        }
                        className="accent-[#f3ad19]"
                      />
                      Baisse de prix uniquement
                    </label>
                    {!isRent && !isLand && !isPro ? (
                      <label className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 py-2 text-[13px] font-medium text-[#071f49]">
                        <input
                          type="checkbox"
                          checked={draft.goodDealOnly}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, goodDealOnly: e.target.checked }))
                          }
                          className="accent-[#f3ad19]"
                        />
                        Bonnes affaires (prix sous le marché)
                      </label>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Dimensions & Caractéristiques (adaptées à la catégorie) */}
            <section className="rounded-[12px] border border-[#dce2e9] bg-white p-5 md:p-6">
              <h2 className="font-['Inter:Bold'] text-[16px] font-bold text-[#071f49]">
                3.{" "}
                {isLand
                  ? "Superficie du terrain"
                  : isPro
                    ? "Surface & Capacité d'accueil"
                    : "Surfaces, Pièces & État du bien"}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                    Surface min (m²)
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={draft.surfaceMin ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        surfaceMin: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    placeholder="Ex: 100"
                    className="h-[42px] w-full rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                    Surface max (m²)
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={draft.surfaceMax ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        surfaceMax: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    placeholder="Ex: 500"
                    className="h-[42px] w-full rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                  />
                </label>

                {!isLand ? (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                        {isPro ? "Espaces / Bureaux min" : "Pièces minimum"}
                      </span>
                      <select
                        value={draft.roomsMin ?? ""}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            roomsMin: e.target.value ? Number(e.target.value) : null,
                          }))
                        }
                        className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                      >
                        <option value="">Indifférent</option>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n}+
                          </option>
                        ))}
                      </select>
                    </label>

                    {!isPro ? (
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                          Chambres minimum
                        </span>
                        <select
                          value={draft.bedroomsMin ?? ""}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              bedroomsMin: e.target.value ? Number(e.target.value) : null,
                            }))
                          }
                          className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                        >
                          <option value="">Indifférent</option>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n} chambre{n > 1 ? "s" : ""} +
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}

                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                        Salles de bain min
                      </span>
                      <select
                        value={draft.bathroomsMin ?? ""}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            bathroomsMin: e.target.value ? Number(e.target.value) : null,
                          }))
                        }
                        className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                      >
                        <option value="">Indifférent</option>
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n}+
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                        Places de parking min
                      </span>
                      <select
                        value={draft.parkingMin ?? ""}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            parkingMin: e.target.value ? Number(e.target.value) : null,
                          }))
                        }
                        className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                      >
                        <option value="">Indifférent</option>
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n}+
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                        État du bien
                      </span>
                      <select
                        value={draft.condition}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, condition: e.target.value as Condition | "" }))
                        }
                        className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                      >
                        <option value="">Indifférent</option>
                        {(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => (
                          <option key={c} value={c}>
                            {CONDITION_LABELS[c]}
                          </option>
                        ))}
                      </select>
                    </label>

                    {!isRent ? (
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                          Construit à partir de
                        </span>
                        <select
                          value={draft.yearBuiltMin ?? ""}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              yearBuiltMin: e.target.value ? Number(e.target.value) : null,
                            }))
                          }
                          className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                        >
                          <option value="">Indifférent</option>
                          {[2010, 2015, 2018, 2020, 2022, 2024].map((y) => (
                            <option key={y} value={y}>
                              {y} et après
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                  </>
                ) : null}
              </div>
            </section>

            {/* 4. Équipements & Commodités */}
            <section className="rounded-[12px] border border-[#dce2e9] bg-white p-5 md:p-6">
              <h2 className="font-['Inter:Bold'] text-[16px] font-bold text-[#071f49]">
                4. {isLand ? "Environnement & Viabilisation" : "Équipements & Commodités"}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {availableFeatures.map((feature) => {
                  const active = draft.features.includes(feature);
                  return (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleArrayItem("features", feature)}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                        active
                          ? "border-[#071f49] bg-[#071f49] text-white"
                          : "border-[#dce2e9] bg-[#f8fafc] text-[#071f49] hover:border-[#f3ad19]"
                      }`}
                    >
                      {active ? "✓ " : "+ "}
                      {feature}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 5. Documents & Annonceur */}
            <section className="rounded-[12px] border border-[#dce2e9] bg-white p-5 md:p-6">
              <h2 className="font-['Inter:Bold'] text-[16px] font-bold text-[#071f49]">
                5. {isRent ? "Type d'annonceur & Fraîcheur" : "Documents fonciers & Annonceur"}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                {!isRent ? (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                      Documents disponibles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DOCUMENT_OPTIONS.map((doc) => {
                        const active = draft.documents.includes(doc);
                        return (
                          <button
                            key={doc}
                            type="button"
                            onClick={() => toggleArrayItem("documents", doc)}
                            className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                              active
                                ? "border-[#1f7a3d] bg-[#e7f6ec] text-[#1f7a3d]"
                                : "border-[#dce2e9] bg-[#f8fafc] text-[#4a5a70] hover:border-[#f3ad19]"
                            }`}
                          >
                            {active ? "✓ " : ""}
                            {doc}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-end gap-4">
                  <label className="block min-w-[180px] flex-1">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                      Annonceur
                    </span>
                    <select
                      value={draft.sellerType}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, sellerType: e.target.value as SellerType | "" }))
                      }
                      className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] font-medium text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                    >
                      <option value="">Tous les annonceurs</option>
                      <option value="professionnel">Professionnels / Agences</option>
                      <option value="particulier">Particuliers</option>
                    </select>
                  </label>

                  <label className="flex h-[42px] cursor-pointer items-center gap-2 rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3.5 text-[13px] font-medium text-[#071f49]">
                    <input
                      type="checkbox"
                      checked={draft.isNewOnly}
                      onChange={(e) => setDraft((p) => ({ ...p, isNewOnly: e.target.checked }))}
                      className="accent-[#f3ad19]"
                    />
                    Nouveautés uniquement
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Barre sticky en bas (style mobile.de) */}
      <div className="sticky bottom-0 z-40 border-t border-[#dce2e9] bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgb(7_31_73/10%)] backdrop-blur md:px-[100px]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#4a5a70]">
            <strong className="font-bold text-[#071f49]">{matchCount}</strong> bien
            {matchCount > 1 ? "s" : ""} correspondent à vos critères
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="hidden cursor-pointer border-0 bg-transparent text-[13px] font-semibold text-[#637084] hover:text-[#071f49] sm:inline-block"
            >
              Effacer tout
            </button>
            <button
              type="button"
              onClick={() => searchWith(draft)}
              className="flex h-[46px] cursor-pointer items-center gap-2 rounded-[8px] border-0 bg-[#f3ad19] px-6 font-['Inter:Bold'] text-[14px] font-bold text-[#071f49] shadow-[0_6px_18px_rgb(243_173_25/35%)] transition-colors hover:bg-[#ffbe33]"
            >
              <SearchIcon className="size-[17px]" />
              Afficher {matchCount} résultat{matchCount > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>

      {isMobile ? <MobileFooter /> : <SiteFooter />}
    </div>
  );
}
