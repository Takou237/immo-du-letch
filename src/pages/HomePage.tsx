import { useEffect, useMemo, useState } from "react";
import ListingTile from "../components/ListingTile";
import Modal from "../components/Modal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { ArrowIcon, ChevronIcon, PinIcon, SearchIcon, ShieldIcon } from "../components/icons";
import {
  CITY_OPTIONS,
  DEFAULT_FILTERS,
  MARKET_AVERAGE,
  TYPE_LABELS,
  filterListings,
  formatPrice,
  normalizeText,
  type Filters,
  type PropertyType,
} from "../data/listings";
import {
  BUDGET_LOCATION,
  BUDGET_VENTE,
  CATEGORIES,
  HERO_TABS,
  LOCATION_SUGGESTIONS,
  POPULAR_SEARCHES,
  ROOM_OPTIONS,
  SURFACE_OPTIONS,
  type HomeTab,
} from "../data/homeContent";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";

const asset = (file: string) => `/assets/${file}`;

const imgVillaContemporaineAvecJardin = asset("d92fa.png");
const imgDouala = asset("7bb4a.png");
const imgYaounde = asset("52f31.png");
const imgTerrainResidentielDe500M = asset("26532.png");

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M10 3.5v13M3.5 10h13" strokeLinecap="round" />
    </svg>
  );
}

export default function AccueilImmoDuLetch() {
  const { searchWith, browseAll, openDeposit, openListing, recentlyViewed, allListings, articles, faqs, heroSlides, platformStats, siteSettings } = useApp();
  const t = useT();
  const [tab, setTab] = useState<HomeTab>("vente");
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [type, setType] = useState<PropertyType | "">("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [surfaceMin, setSurfaceMin] = useState("");
  const [roomsMin, setRoomsMin] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const [articleIndex, setArticleIndex] = useState<number | null>(null);
  const [faqIndex, setFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroSlides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  // Estimateur de bien
  const [estCity, setEstCity] = useState("Douala");
  const [estType, setEstType] = useState<PropertyType>("villa");
  const [estSurface, setEstSurface] = useState("200");

  const isRent = tab === "location" || tab === "meuble";
  const budgetOptions = isRent ? BUDGET_LOCATION : BUDGET_VENTE;

  const [featuredIndex, setFeaturedIndex] = useState(0);

  const carouselListings = useMemo(() => {
    const priority = [
      "villa-bonapriso",
      "appartement-meuble-bastos",
      "terrain-kribi",
      "villa-akwa-douala",
    ];
    const ordered = priority
      .map((id) => allListings.find((listing) => listing.id === id))
      .filter((listing): listing is NonNullable<typeof listing> => Boolean(listing));
    const seen = new Set(ordered.map((listing) => listing.id));
    for (const listing of allListings) {
      if (!seen.has(listing.id)) {
        ordered.push(listing);
        seen.add(listing.id);
      }
    }
    return ordered.slice(0, 9);
  }, [allListings]);

  const maxFeaturedIndex = Math.max(0, carouselListings.length - 3);

  useEffect(() => {
    setFeaturedIndex((index) => Math.min(index, maxFeaturedIndex));
  }, [maxFeaturedIndex]);

  const recentListings = useMemo(
    () =>
      recentlyViewed
        .slice(0, 3)
        .map((id) => allListings.find((l) => l.id === id))
        .filter((l): l is NonNullable<typeof l> => Boolean(l)),
    [allListings, recentlyViewed],
  );

  const filteredSuggestions = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return [];
    return LOCATION_SUGGESTIONS.filter((s) => normalizeText(s).includes(q)).slice(0, 5);
  }, [query]);

  const estimationRange = useMemo(() => {
    const surface = Math.max(20, Number(estSurface) || 0);
    const basePerM2 = MARKET_AVERAGE[estCity] ?? 700_000;
    const typeFactor =
      estType === "villa"
        ? 1.0
        : estType === "appartement"
          ? 0.92
          : estType === "terrain"
            ? 0.12
            : estType === "bureau"
              ? 0.85
              : 0.75;
    const center = surface * basePerM2 * typeFactor;
    return {
      min: Math.round((center * 0.85) / 1_000_000) * 1_000_000,
      max: Math.round((center * 1.15) / 1_000_000) * 1_000_000,
    };
  }, [estCity, estSurface, estType]);

  const chooseTab = (next: HomeTab) => {
    setTab(next);
    setBudgetMin("");
    setBudgetMax("");
    if (next === "terrain") {
      setType("terrain");
    } else if (tab === "terrain") {
      setType("");
    }
  };

  const heroFilters: Filters = {
    ...DEFAULT_FILTERS,
    transaction: isRent ? "location" : "vente",
    city,
    query,
    type: tab === "terrain" ? "terrain" : type,
    priceMin: budgetMin ? Number(budgetMin) : null,
    priceMax: budgetMax ? Number(budgetMax) : null,
    surfaceMin: surfaceMin ? Number(surfaceMin) : null,
    bedroomsMin: roomsMin ? Number(roomsMin) : null,
    features: tab === "meuble" ? ["Meublé"] : [],
    sellerType: tab === "pro" ? "professionnel" : "",
  };

  const liveMatchCount = filterListings(allListings, heroFilters).length;

  const handleSearch = () => {
    searchWith(heroFilters);
  };

  const navActive = tab === "terrain" ? "terrain" : isRent ? "location" : "vente";

  return (
    <div
      className="bg-white content-stretch flex flex-col items-start relative size-full"
      data-name="Accueil · IMMO DU LETCH"
    >
      <SiteNav active={navActive} />

      {/* Hero + Moteur de recherche */}
      <div
        className="relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#f8fafc] via-white to-[#fffaf0] pl-[100px] pr-[24px] py-[40px]"
        data-name="Recherche immobilière"
      >
        <div className="flex items-stretch justify-between gap-[28px]">
          {/* Colonne gauche : Titre + Moteur de recherche */}
          <div className="flex w-[610px] shrink-0 flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff6df] px-3 py-1 font-['Inter:Bold'] text-[10px] font-bold tracking-[0.06em] text-[#996300]">
                {t.home.heroBadge}
              </span>
              <h1 className="mt-2.5 font-['Inter:Bold'] text-[33px] font-bold leading-[1.18] tracking-[-0.02em] text-[#071f49]">
                {t.home.heroTitle}
              </h1>
              <p className="mt-1.5 font-['Inter:Regular'] text-[15px] leading-[1.5] text-[#4a5a70]">
                {t.home.heroSubtitle}
              </p>
            </div>

            {/* Moteur de recherche */}
            <div
              role="search"
              className="mt-5 rounded-[14px] border border-[#dce2e9] bg-white p-5 shadow-[0_20px_50px_rgb(7_31_73/9%)]"
              data-name="Moteur de recherche"
            >
              {/* Onglets */}
              <div className="flex items-center gap-5 border-b border-[#e2e8f0]">
                {HERO_TABS.map((item) => {
                  const isActive = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => chooseTab(item.id)}
                      className={`relative cursor-pointer border-0 bg-transparent pb-2.5 font-['Inter:Semi_Bold'] text-[14px] transition-colors ${
                        isActive
                          ? "font-bold text-[#071f49]"
                          : "font-medium text-[#637084] hover:text-[#071f49]"
                      }`}
                    >
                      {t.home.tabs[item.id]}
                      <span
                        className={`absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#f3ad19] transition-all duration-300 ${
                          isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Ligne 1 : Ville, Mot-clé, Type */}
              <div className="mt-4 grid grid-cols-12 gap-2.5">
                <div className="col-span-3">
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    {t.home.city}
                  </label>
                  <select
                    aria-label={t.home.city}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    <option value="">{t.home.allCities}</option>
                    {CITY_OPTIONS.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative col-span-5">
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    {t.home.keywordLabel}
                  </label>
                  <input
                    type="text"
                    aria-label={t.home.keywordLabel}
                    value={query}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 160)}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder={t.home.keywordPlaceholder}
                    className="h-[42px] w-full rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 font-['Inter:Medium'] text-[13px] text-[#071f49] outline-none transition-colors placeholder:text-[#8a95a5] focus:border-[#f3ad19] focus:bg-white"
                  />
                  {showSuggestions && filteredSuggestions.length > 0 ? (
                    <ul className="absolute left-0 top-[68px] z-30 w-full rounded-[8px] border border-[#dce2e9] bg-white py-1 shadow-xl">
                      {filteredSuggestions.map((s) => (
                        <li key={s}>
                          <button
                            type="button"
                            onMouseDown={() => {
                              const [qPart, cPart] = s.split(", ");
                              setQuery(qPart);
                              if (cPart) setCity(cPart);
                              setShowSuggestions(false);
                            }}
                            className="w-full cursor-pointer border-0 bg-transparent px-3.5 py-2 text-left text-[13px] text-[#172b45] hover:bg-[#f4f6f8]"
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="col-span-4">
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    {t.home.propertyType}
                  </label>
                  <select
                    aria-label={t.home.propertyType}
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType | "")}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    <option value="">{t.home.allTypes}</option>
                    {(Object.keys(TYPE_LABELS) as PropertyType[]).map((value) => (
                      <option key={value} value={value}>
                        {t.types[value]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ligne 2 : Budget min/max, Surface, Chambres */}
              <div className="mt-3.5 grid grid-cols-4 gap-2.5">
                <div>
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    {t.home.budgetMin}
                  </label>
                  <select
                    aria-label={t.home.budgetMin}
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    {budgetOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value === "" ? t.home.any : o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    {t.home.budgetMax}
                  </label>
                  <select
                    aria-label={t.home.budgetMax}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    {budgetOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value === "" ? t.home.any : o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    {t.home.surfaceMin}
                  </label>
                  <select
                    aria-label={t.home.surfaceMin}
                    value={surfaceMin}
                    onChange={(e) => setSurfaceMin(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    {SURFACE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value === "" ? t.home.any : o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    {t.home.rooms}
                  </label>
                  <select
                    aria-label={t.home.rooms}
                    value={roomsMin}
                    onChange={(e) => setRoomsMin(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    {ROOM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value === "" ? t.home.any : o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pied du moteur de recherche */}
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eef2f6] pt-3.5">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="cursor-pointer border-0 bg-transparent p-0 text-left"
                >
                  <span className="block font-['Inter:Semi_Bold'] text-[12px] font-semibold text-[#071f49] hover:text-[#a26b00]">
                    {t.home.moreCriteria}
                  </span>
                  <span className="block text-[11px] text-[#637084]">
                    {t.home.moreCriteriaSub}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex h-[46px] w-[260px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[8px] border-0 bg-[#f3ad19] font-['Inter:Bold'] text-[13px] font-bold text-[#071f49] shadow-[0_6px_18px_rgb(243_173_25/35%)] transition-all hover:bg-[#ffbe33] active:scale-[0.98]"
                  data-name="Rechercher un bien"
                >
                  <SearchIcon className="size-[18px]" />
                  <span>{t.home.searchCount(liveMatchCount)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Colonne droite : Visuel animé (Switch automatique + manuel) */}
          <div
            className="relative h-[534px] flex-1 overflow-hidden rounded-[16px] bg-[#071f49] shadow-[0_24px_60px_rgb(7_31_73/18%)]"
            data-name="Vitrine immobilière animée"
          >
            {heroSlides.map((slide, index) => {
              const activeSlide = index === slideIndex;
              return (
                <img
                  key={slide.id}
                  src={slide.image}
                  alt={slide.title}
                  className={`absolute inset-0 size-full object-cover transition-all duration-1000 ease-in-out ${
                    activeSlide ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                />
              );
            })}

            {/* Dégradé de lisibilité */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071f49]/90 via-[#071f49]/20 to-transparent" />

            {/* Contrôles Précédent / Suivant */}
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
              <button
                type="button"
                aria-label="Image précédente"
                onClick={() =>
                  setSlideIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length)
                }
                className="flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/35"
              >
                <ChevronIcon className="size-[16px] rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Image suivante"
                onClick={() => setSlideIndex((i) => (i + 1) % heroSlides.length)}
                className="flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/35"
              >
                <ChevronIcon className="size-[16px]" />
              </button>
            </div>

            {/* Légende dynamique du bien affiché */}
            <div className="absolute inset-x-4 bottom-3.5 z-10">
              <div
                key={heroSlides[slideIndex]?.id}
                className="animate-fade-in mx-auto max-w-[360px] rounded-[10px] border border-white/20 bg-white/95 px-3.5 py-2.5 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#fff6df] px-2 py-0.5 font-['Inter:Bold'] text-[9px] font-bold tracking-wider text-[#996300]">
                    {heroSlides[slideIndex]?.tag}
                  </span>
                  <span className="font-['Inter:Bold'] text-[13px] font-bold text-[#071f49]">
                    {heroSlides[slideIndex]?.price}
                  </span>
                </div>

                <p className="mt-1 truncate font-['Inter:Bold'] text-[13px] font-bold text-[#071f49]">
                  {heroSlides[slideIndex]?.title}
                </p>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-[#637084]">
                    <PinIcon className="size-[11px]" />
                    {heroSlides[slideIndex]?.location}
                  </span>
                  <button
                    type="button"
                    onClick={() => openListing(heroSlides[slideIndex]?.id ?? "")}
                    className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-['Inter:Semi_Bold'] text-[11px] font-semibold text-[#071f49] hover:text-[#a26b00]"
                  >
                    Voir le bien <ArrowIcon className="size-[12px]" />
                  </button>
                </div>
              </div>

              {/* Indicateurs (dots) */}
              <div className="mt-2 flex items-center justify-center gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Afficher ${slide.title}`}
                    onClick={() => setSlideIndex(index)}
                    className={`h-[6px] cursor-pointer rounded-full border-0 transition-all duration-300 ${
                      index === slideIndex ? "w-[24px] bg-[#f3ad19]" : "w-[8px] bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de statistiques & badges de confiance */}
      <div className="w-full border-y border-[#dce2e9] bg-[#f8fafc] px-[100px] py-[28px]">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-12">
            {platformStats.map((stat, idx) => (
              <div key={stat.label}>
                <p className="font-['Inter:Bold'] text-[28px] font-bold leading-tight text-[#071f49]">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-0.5 text-[12px] text-[#637084]">{t.home.statsLabels[idx]}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {t.home.trustBadges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 rounded-full border border-[#dce2e9] bg-white px-4 py-2 text-[12px] font-medium text-[#172b45]"
              >
                <ShieldIcon className="size-[16px] text-[#1f7a3d]" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Catégories de biens */}
      <div
        className="h-[360px] overflow-clip relative shrink-0 w-full"
        data-name="Catégories de biens"
      >
        <p className="absolute font-['Inter:Bold'] font-bold leading-[1.45] left-[100px] text-[#071f49] text-[26px] top-[35px] whitespace-nowrap">
          {t.home.categoriesTitle}
        </p>
        <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[100px] text-[#637084] text-[15px] top-[80px] whitespace-nowrap">
          {t.home.categoriesSub}
        </p>

        {CATEGORIES.map((category, index) => {
          const count = filterListings(allListings, { ...DEFAULT_FILTERS, ...category.filter }).length;
          return (
            <button
              key={category.label}
              type="button"
              onClick={() => searchWith(category.filter)}
              style={{ left: 100 + index * 209 }}
              className="absolute bg-white border border-[#dce2e9] border-solid h-[112px] cursor-pointer overflow-clip rounded-[8px] top-[126px] w-[195px] transition-all hover:-translate-y-[2px] hover:border-[#f3ad19] hover:shadow-[0_10px_24px_rgb(7_31_73/10%)]"
            >
              <span className="absolute left-[81px] size-[30px] top-[17px]">
                <img alt="" className="absolute inset-0 max-w-none size-full" src={category.icon} />
              </span>
              <span className="-translate-x-1/2 absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[96.5px] text-[#172b45] text-[13px] text-center top-[62px] w-[179px]">
                {t.home.categories[category.label] ?? category.label}
              </span>
              <span className="-translate-x-1/2 absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[96.5px] text-[#637084] text-[11px] text-center top-[86px] w-[179px]">
                {t.home.listingCount(count)}
              </span>
            </button>
          );
        })}

        <p className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[100px] text-[#071f49] text-[14px] top-[262px] whitespace-nowrap">
          {t.home.popularSearches}
        </p>
        <div className="absolute left-[100px] top-[292px] flex w-[1240px] flex-wrap gap-[10px]">
          {POPULAR_SEARCHES.map((preset, idx) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => searchWith(preset.filter)}
              className="h-[34px] cursor-pointer rounded-full border border-[#dce2e9] bg-white px-[14px] font-['Inter:Medium'] text-[12px] font-medium text-[#172b45] transition-colors hover:border-[#f3ad19] hover:bg-[#fffaf0]"
            >
              {t.home.popularPresets[idx] ?? preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Annonces à découvrir (4 biens) */}
      <div
        className="bg-[#f4f6f8] w-full px-[100px] py-[44px]"
        data-name="Annonces à découvrir"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="font-['Inter:Bold'] text-[28px] font-bold leading-[1.3] text-[#071f49]">
              {t.home.featuredTitle}
            </p>
            <p className="mt-1 font-['Inter:Regular'] text-[15px] text-[#637084]">
              {t.home.featuredSub}
            </p>
          </div>
          <button
            type="button"
            onClick={browseAll}
            className="flex h-[40px] cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] hover:text-[#a26b00]"
          >
            {t.home.seeAllListings(allListings.length)}
            <ArrowIcon className="size-[18px]" />
          </button>
        </div>

        <div className="relative mt-7">
          <button
            type="button"
            aria-label="Afficher les biens précédents"
            onClick={() => setFeaturedIndex((index) => Math.max(0, index - 1))}
            disabled={featuredIndex === 0}
            className="absolute -left-[22px] top-1/2 z-10 flex size-[46px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-white text-[#071f49] shadow-[0_8px_22px_rgb(7_31_73/16%)] transition-colors hover:border-[#f3ad19] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronIcon className="size-[18px] rotate-180" />
          </button>

          <div className="overflow-hidden px-[2px]">
            <div className="grid grid-cols-3 gap-[20px]">
              {carouselListings.slice(featuredIndex, featuredIndex + 3).map((listing) => (
                <div key={listing.id} className="relative h-[428px]">
                  <ListingTile listing={listing} left={0} top={0} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Afficher les biens suivants"
            onClick={() => setFeaturedIndex((index) => Math.min(maxFeaturedIndex, index + 1))}
            disabled={featuredIndex >= maxFeaturedIndex}
            className="absolute -right-[22px] top-1/2 z-10 flex size-[46px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-white text-[#071f49] shadow-[0_8px_22px_rgb(7_31_73/16%)] transition-colors hover:border-[#f3ad19] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronIcon className="size-[18px]" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {carouselListings.map((listing, index) => (
            <button
              key={listing.id}
              type="button"
              aria-label={`Afficher le bien ${index + 1}`}
              onClick={() => setFeaturedIndex(Math.min(index, maxFeaturedIndex))}
              className={`h-[6px] cursor-pointer rounded-full border-0 transition-all ${
                index === featuredIndex ? "w-[24px] bg-[#f3ad19]" : "w-[8px] bg-[#dce2e9]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* CTA Vendre ou louer */}
      <div className="h-[340px] overflow-clip relative shrink-0 w-full" data-name="Vendre ou louer">
        <div
          className="absolute bg-[#071f49] h-[260px] left-[100px] overflow-clip rounded-[10px] top-[40px] w-[1240px]"
          data-name="Votre bien mérite sa place ici"
        >
          <p className="absolute font-['Inter:Bold'] font-bold leading-[1.45] left-[36px] text-[30px] text-white top-[30px] w-[740px]">
            {t.home.ctaTitle}
          </p>
          <div className="absolute font-['Inter:Regular'] font-normal leading-[0] left-[36px] text-[#dce4f0] text-[16px] top-[88px] w-[740px]">
            <p className="leading-[1.45] mb-0">
              {t.home.ctaDesc1}
            </p>
            <p className="leading-[1.45]">
              {t.home.ctaDesc2}
            </p>
          </div>
          <button
            type="button"
            onClick={openDeposit}
            className="absolute bg-[#f3ad19] h-[48px] left-[36px] cursor-pointer overflow-clip rounded-[6px] top-[178px] w-[240px] border-0 transition-colors hover:bg-[#ffbe33]"
          >
            <span className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[43.5px] text-[#071f49] text-[14px] top-[14px] whitespace-nowrap">
              {t.home.ctaBtn}
            </span>
          </button>
          <div
            className="absolute h-[260px] left-[850px] top-0 w-[390px]"
            data-name="Villa à présenter"
          >
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src={imgVillaContemporaineAvecJardin}
            />
          </div>
        </div>
      </div>

      {/* Estimateur de bien */}
      <div className="w-full bg-[#f8fafc] px-[100px] py-[40px] border-y border-[#dce2e9]">
        <div className="flex items-center justify-between gap-8 rounded-[10px] border border-[#dce2e9] bg-white p-7">
          <div className="max-w-[420px]">
            <span className="rounded-full bg-[#fff6df] px-3 py-1 text-[11px] font-bold text-[#996300]">
              {t.home.estBadge}
            </span>
            <p className="mt-3 font-['Inter:Bold'] text-[24px] font-bold leading-snug text-[#071f49]">
              {t.home.estTitle}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#637084]">
              {t.home.estDesc}
            </p>
          </div>

          <div className="flex flex-1 items-end gap-4">
            <div className="flex-1">
              <label className="mb-1.5 block text-[12px] font-semibold text-[#172b45]">{t.home.city}</label>
              <select
                value={estCity}
                onChange={(e) => setEstCity(e.target.value)}
                className="h-[46px] w-full rounded-[6px] border border-[#dce2e9] bg-white px-3 text-[13px] text-[#172b45]"
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-[12px] font-semibold text-[#172b45]">
                {t.home.propertyType}
              </label>
              <select
                value={estType}
                onChange={(e) => setEstType(e.target.value as PropertyType)}
                className="h-[46px] w-full rounded-[6px] border border-[#dce2e9] bg-white px-3 text-[13px] text-[#172b45]"
              >
                {(Object.keys(TYPE_LABELS) as PropertyType[]).map((val) => (
                  <option key={val} value={val}>
                    {t.types[val]}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-[130px]">
              <label className="mb-1.5 block text-[12px] font-semibold text-[#172b45]">
                {t.home.estSurface}
              </label>
              <input
                type="number"
                min={20}
                value={estSurface}
                onChange={(e) => setEstSurface(e.target.value)}
                className="h-[46px] w-full rounded-[6px] border border-[#dce2e9] bg-white px-3 text-[13px] text-[#172b45]"
              />
            </div>
            <div className="rounded-[8px] bg-[#eaf0f8] px-5 py-2.5 text-right">
              <p className="text-[11px] font-medium text-[#637084]">{t.home.estResultLabel}</p>
              <p className="font-['Inter:Bold'] text-[18px] font-bold text-[#071f49] whitespace-nowrap">
                {formatPrice(estimationRange.min)} – {formatPrice(estimationRange.max)} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explorer le Cameroun */}
      <div
        className="h-[400px] overflow-clip relative shrink-0 w-full"
        data-name="Explorer le Cameroun"
      >
        <p className="absolute font-['Inter:Bold'] font-bold leading-[1.45] left-[100px] text-[#071f49] text-[28px] top-[28px] whitespace-nowrap">
          {t.home.citiesTitle}
        </p>
        <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[100px] text-[#637084] text-[15px] top-[75px] whitespace-nowrap">
          {t.home.citiesSub}
        </p>

        {[
          { name: "Douala", tagline: t.home.cityTaglines.Douala, image: imgDouala },
          { name: "Yaoundé", tagline: t.home.cityTaglines["Yaoundé"], image: imgYaounde },
          {
            name: "Kribi",
            tagline: t.home.cityTaglines.Kribi,
            image: imgTerrainResidentielDe500M,
          },
        ].map((cityCard, index) => (
          <button
            key={cityCard.name}
            type="button"
            onClick={() => searchWith({ transaction: "vente", city: cityCard.name })}
            style={{ left: 100 + index * 420 }}
            className="absolute bg-white border border-[#dce2e9] border-solid h-[234px] cursor-pointer overflow-clip rounded-[8px] top-[120px] w-[400px] text-left transition-all hover:-translate-y-[2px] hover:border-[#f3ad19] hover:shadow-[0_12px_28px_rgb(7_31_73/10%)]"
          >
            <span className="absolute h-[156px] left-[-1px] top-[-1px] w-[400px]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src={cityCard.image}
              />
            </span>
            <span className="absolute font-['Inter:Bold'] font-bold leading-[1.45] left-[19px] text-[#071f49] text-[20px] top-[169px] whitespace-nowrap">
              {cityCard.name}
            </span>
            <span className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[19px] text-[#637084] text-[12px] top-[203px] whitespace-nowrap">
              {cityCard.tagline}
            </span>
            <span className="absolute left-[353px] size-[22px] top-[179px] text-[#071f49]">
              <ArrowIcon className="size-full" />
            </span>
          </button>
        ))}
      </div>

      {/* Qui sommes-nous & accompagnement */}
      <div
        className="w-full bg-[#f1f4f8] px-[100px] py-[44px]"
        data-name="Qui sommes-nous et accompagnement"
      >
        <h2 className="font-['Inter:Bold'] text-[34px] font-bold leading-[1.2] text-[#071f49]">
          Qui sommes-nous
        </h2>

        <div className="mt-6 flex items-start justify-between gap-[44px]">
          <div className="max-w-[700px]">
            <p className="font-['Inter:Regular'] text-[14px] leading-[1.7] text-[#4a5a70]">
              Depuis plus de {siteSettings?.yearsExperience ?? "5"} ans, IMMO DU LETCH accompagne les
              particuliers et les professionnels dans l'achat, la vente et la location de biens
              immobiliers à Douala, Yaoundé et Kribi. Notre mission : rendre chaque projet immobilier
              plus simple, plus transparent et plus sûr.
            </p>
            <p className="mt-2 font-['Inter:Regular'] text-[14px] leading-[1.7] text-[#4a5a70]">
              Nous sélectionnons des annonces vérifiées, favorisons la mise en relation directe avec
              les annonceurs et vous accompagnons à chaque étape, de la recherche du bien à la
              signature des documents.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {["Annonces vérifiées", "Conseils personnalisés", "Accompagnement de A à Z"].map(
                (value) => (
                  <span
                    key={value}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dce2e9] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#172b45]"
                  >
                    <ShieldIcon className="size-[14px] text-[#1f7a3d]" />
                    {value}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="relative h-[220px] w-[380px] shrink-0 overflow-hidden rounded-[12px]">
            <img
              alt="Équipe IMMO DU LETCH"
              className="absolute inset-0 size-full object-cover"
              src={imgVillaContemporaineAvecJardin}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071f49]/85 to-transparent p-4">
              <p className="font-['Inter:Semi_Bold'] text-[13px] font-semibold text-white">
                {siteSettings?.contactPhone ?? "+237 6 55 00 00 00"}
              </p>
              <p className="text-[11px] text-[#ccd6e5]">
                {siteSettings?.contactEmail ?? "contact@immoduletch.cm"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#dce2e9] pt-8">
          <h3 className="font-['Inter:Bold'] text-[26px] font-bold leading-[1.3] text-[#071f49]">
            Un projet immobilier, des étapes plus simples.
          </h3>
          <div className="mt-6 grid grid-cols-3 gap-[20px]">
          {[
            {
              number: "01",
              title: "Trouvez le bon bien",
              body: ["Affinez votre recherche par ville, budget,", "surface et caractéristiques."],
            },
            {
              number: "02",
              title: "Échangez en direct",
              body: ["Posez vos questions à l'annonceur", "et organisez une visite du bien."],
            },
            {
              number: "03",
              title: "Avancez en confiance",
              body: ["Vérifiez les documents et faites-vous", "accompagner avant de vous engager."],
            },
          ].map((step) => (
            <div key={step.number} className="flex items-start gap-[16px]">
              <p className="font-['Inter:Bold'] text-[32px] font-bold leading-[1.2] text-[#a26b00]">
                {step.number}
              </p>
              <div>
                <p className="font-['Inter:Semi_Bold'] text-[18px] font-semibold leading-[1.45] text-[#071f49]">
                  {step.title}
                </p>
                <div className="mt-1 font-['Inter:Regular'] text-[14px] leading-[1.45] text-[#637084]">
                  {step.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Conseils immobiliers (6 articles) */}
      <div id="conseils" className="w-full px-[100px] py-[44px]" data-name="Conseils immobiliers">
        <p className="font-['Inter:Bold'] text-[28px] font-bold leading-[1.3] text-[#071f49]">
          {t.home.adviceTitle}
        </p>
        <p className="mt-1 font-['Inter:Regular'] text-[15px] text-[#637084]">
          {t.home.adviceSub}
        </p>

        <div className="mt-7 grid grid-cols-3 gap-[20px]">
          {articles.map((article, index) => (
            <button
              key={article.title}
              type="button"
              onClick={() => setArticleIndex(index)}
              className="group relative flex h-[280px] cursor-pointer flex-col overflow-hidden rounded-[8px] border border-[#dce2e9] bg-white text-left transition-all hover:-translate-y-[2px] hover:border-[#f3ad19] hover:shadow-[0_12px_28px_rgb(7_31_73/10%)]"
            >
              <div className="h-[146px] w-full shrink-0 overflow-hidden">
                <img
                  alt=""
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  src={article.image}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <span className="font-['Inter:Bold'] text-[10px] font-bold tracking-[0.06em] text-[#996300]">
                    {article.tag}
                  </span>
                  <p className="mt-1.5 line-clamp-2 font-['Inter:Semi_Bold'] text-[17px] font-semibold leading-[1.35] text-[#071f49]">
                    {article.title}
                  </p>
                </div>
                <div className="flex justify-end">
                  <ArrowIcon className="size-[18px] text-[#071f49]" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Biens récemment vus (si disponibles) */}
      {recentListings.length > 0 ? (
        <div className="w-full bg-[#f8fafc] px-[100px] py-[44px] border-t border-[#dce2e9]">
          <p className="font-['Inter:Bold'] text-[26px] font-bold text-[#071f49]">
            {t.home.recentTitle}
          </p>
          <p className="mt-1 text-[14px] text-[#637084]">
            Reprenez votre recherche là où vous l'avez laissée.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-[20px]">
            {recentListings.map((listing) => (
              <div key={listing.id} className="relative h-[428px]">
                <ListingTile listing={listing} left={0} top={0} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* FAQ (8 questions) */}
      <div
        className="w-full bg-[#f4f6f8] px-[100px] py-[48px]"
        data-name="Questions fréquentes"
      >
        <div className="flex items-start justify-between gap-12">
          <div className="w-[380px] shrink-0">
            <p className="font-['Inter:Bold'] text-[28px] font-bold leading-[1.3] text-[#071f49]">
              {t.home.faqTitle}
            </p>
            <p className="mt-3 text-[15px] leading-[1.5] text-[#637084]">
              Quelques réponses pour bien démarrer votre recherche avec IMMO DU LETCH.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-3">
            {faqs.map((faq, index) => (
              <button
                key={faq.q}
                type="button"
                onClick={() => setFaqIndex(index)}
                className="flex h-[60px] w-full cursor-pointer items-center justify-between rounded-[6px] border border-[#dce2e9] bg-white px-5 text-left transition-colors hover:border-[#f3ad19]"
              >
                <span className="font-['Inter:Semi_Bold'] text-[15px] font-semibold text-[#071f49]">
                  {faq.q}
                </span>
                <PlusIcon className="size-[18px] shrink-0 text-[#071f49]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />

      {articleIndex !== null ? (
        <Modal
          onClose={() => setArticleIndex(null)}
          label={articles[articleIndex].title}
          panelClassName="w-[560px] max-w-[92vw]"
        >
          <img
            alt=""
            src={articles[articleIndex].image}
            className="h-[230px] w-full object-cover"
          />
          <div className="p-7">
            <p className="font-['Inter:Bold'] text-[10px] font-bold tracking-[0.08em] text-[#996300]">
              {articles[articleIndex].tag}
            </p>
            <p className="mt-2 font-['Inter:Bold'] text-[22px] font-bold leading-[1.3] text-[#071f49]">
              {articles[articleIndex].title}
            </p>
            {(typeof articles[articleIndex].body === "string"
              ? [articles[articleIndex].body as string]
              : (articles[articleIndex].body as unknown as string[])
            ).map((paragraph) => (
              <p key={paragraph} className="mt-4 text-[13px] leading-[1.6] text-[#4a5a70]">
                {paragraph}
              </p>
            ))}
            <button
              type="button"
              onClick={() => {
                setArticleIndex(null);
                browseAll();
              }}
              className="mt-6 inline-flex h-[44px] cursor-pointer items-center gap-2 rounded-[6px] bg-[#f3ad19] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49]"
            >
              Voir les annonces <ArrowIcon className="size-[16px]" />
            </button>
          </div>
        </Modal>
      ) : null}

      {faqIndex !== null ? (
        <Modal
          onClose={() => setFaqIndex(null)}
          label={faqs[faqIndex].q}
          panelClassName="w-[560px] max-w-[92vw]"
        >
          <div className="p-8 pr-16">
            <p className="font-['Inter:Bold'] text-[20px] font-bold leading-[1.35] text-[#071f49]">
              {faqs[faqIndex].q}
            </p>
            <p className="mt-4 text-[14px] leading-[1.65] text-[#4a5a70]">{faqs[faqIndex].a}</p>
            <button
              type="button"
              onClick={() => setFaqIndex(null)}
              className="mt-6 inline-flex h-[42px] cursor-pointer items-center rounded-[6px] bg-[#071f49] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-white"
            >
              J'ai compris
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
