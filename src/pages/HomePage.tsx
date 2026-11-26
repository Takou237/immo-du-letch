import { useEffect, useMemo, useState } from "react";
import ListingTile from "../components/ListingTile";
import Modal from "../components/Modal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { ArrowIcon, ChevronIcon, PinIcon, SearchIcon, ShieldIcon } from "../components/icons";
import {
  ARTICLES,
  CITY_OPTIONS,
  DEFAULT_FILTERS,
  FAQS,
  MARKET_AVERAGE,
  PLATFORM_STATS,
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
  HERO_SLIDES,
  HERO_TABS,
  LOCATION_SUGGESTIONS,
  POPULAR_SEARCHES,
  ROOM_OPTIONS,
  SURFACE_OPTIONS,
  type HomeTab,
} from "../data/homeContent";
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
  const { searchWith, browseAll, openDeposit, openListing, recentlyViewed, allListings } = useApp();
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
      setSlideIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  // Estimateur de bien
  const [estCity, setEstCity] = useState("Douala");
  const [estType, setEstType] = useState<PropertyType>("villa");
  const [estSurface, setEstSurface] = useState("200");

  const isRent = tab === "location" || tab === "meuble";
  const budgetOptions = isRent ? BUDGET_LOCATION : BUDGET_VENTE;

  const featured = [
    "villa-bonapriso",
    "appartement-meuble-bastos",
    "terrain-kribi",
    "villa-akwa-douala",
  ]
    .map((id) => allListings.find((listing) => listing.id === id))
    .filter((listing): listing is NonNullable<typeof listing> => Boolean(listing));

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
                IMMOBILIER AU CAMEROUN · DOUALA · YAOUNDÉ · KRIBI
              </span>
              <h1 className="mt-2.5 font-['Inter:Bold'] text-[33px] font-bold leading-[1.18] tracking-[-0.02em] text-[#071f49]">
                Trouvez le bien qui vous ressemble.
              </h1>
              <p className="mt-1.5 font-['Inter:Regular'] text-[15px] leading-[1.5] text-[#4a5a70]">
                Acheter, louer ou investir en toute confiance. Comparez les prix du marché en temps
                réel.
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
                      {item.label}
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
                    Ville
                  </label>
                  <select
                    aria-label="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    <option value="">Toutes</option>
                    {CITY_OPTIONS.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative col-span-5">
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    Quartier ou mot-clé
                  </label>
                  <input
                    type="text"
                    aria-label="Quartier ou mot-clé"
                    value={query}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 160)}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder="Bonapriso, Bastos, piscine…"
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
                    Type de bien
                  </label>
                  <select
                    aria-label="Type de bien"
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType | "")}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    <option value="">Tous les types</option>
                    {Object.entries(TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ligne 2 : Budget min/max, Surface, Chambres */}
              <div className="mt-3.5 grid grid-cols-4 gap-2.5">
                <div>
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    Budget min.
                  </label>
                  <select
                    aria-label="Budget minimum"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    {budgetOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    Budget max.
                  </label>
                  <select
                    aria-label="Budget maximum"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    {budgetOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    Surface min.
                  </label>
                  <select
                    aria-label="Surface minimum"
                    value={surfaceMin}
                    onChange={(e) => setSurfaceMin(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    {SURFACE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-['Inter:Semi_Bold'] text-[10px] font-semibold uppercase tracking-wider text-[#637084]">
                    Chambres
                  </label>
                  <select
                    aria-label="Nombre de chambres minimum"
                    value={roomsMin}
                    onChange={(e) => setRoomsMin(e.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-2.5 font-['Inter:Medium'] text-[13px] font-medium text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
                  >
                    {ROOM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
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
                    + Plus de critères avancés
                  </span>
                  <span className="block text-[11px] text-[#637084]">
                    Titre foncier, équipements, état du bien…
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex h-[46px] w-[260px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[8px] border-0 bg-[#f3ad19] font-['Inter:Bold'] text-[13px] font-bold text-[#071f49] shadow-[0_6px_18px_rgb(243_173_25/35%)] transition-all hover:bg-[#ffbe33] active:scale-[0.98]"
                  data-name="Rechercher un bien"
                >
                  <SearchIcon className="size-[18px]" />
                  <span>
                    Rechercher ({liveMatchCount} bien{liveMatchCount > 1 ? "s" : ""})
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Colonne droite : Visuel animé (Switch automatique + manuel) */}
          <div
            className="relative h-[534px] flex-1 overflow-hidden rounded-[16px] bg-[#071f49] shadow-[0_24px_60px_rgb(7_31_73/18%)]"
            data-name="Vitrine immobilière animée"
          >
            {HERO_SLIDES.map((slide, index) => {
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
                  setSlideIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                }
                className="flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/35"
              >
                <ChevronIcon className="size-[16px] rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Image suivante"
                onClick={() => setSlideIndex((i) => (i + 1) % HERO_SLIDES.length)}
                className="flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/35"
              >
                <ChevronIcon className="size-[16px]" />
              </button>
            </div>

            {/* Légende dynamique du bien affiché */}
            <div className="absolute inset-x-4 bottom-3.5 z-10">
              <div
                key={HERO_SLIDES[slideIndex].id}
                className="animate-fade-in mx-auto max-w-[360px] rounded-[10px] border border-white/20 bg-white/95 px-3.5 py-2.5 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#fff6df] px-2 py-0.5 font-['Inter:Bold'] text-[9px] font-bold tracking-wider text-[#996300]">
                    {HERO_SLIDES[slideIndex].tag}
                  </span>
                  <span className="font-['Inter:Bold'] text-[13px] font-bold text-[#071f49]">
                    {HERO_SLIDES[slideIndex].price}
                  </span>
                </div>

                <p className="mt-1 truncate font-['Inter:Bold'] text-[13px] font-bold text-[#071f49]">
                  {HERO_SLIDES[slideIndex].title}
                </p>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-[#637084]">
                    <PinIcon className="size-[11px]" />
                    {HERO_SLIDES[slideIndex].location}
                  </span>
                  <button
                    type="button"
                    onClick={() => openListing(HERO_SLIDES[slideIndex].id)}
                    className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-['Inter:Semi_Bold'] text-[11px] font-semibold text-[#071f49] hover:text-[#a26b00]"
                  >
                    Voir le bien <ArrowIcon className="size-[12px]" />
                  </button>
                </div>
              </div>

              {/* Indicateurs (dots) */}
              <div className="mt-2 flex items-center justify-center gap-2">
                {HERO_SLIDES.map((slide, index) => (
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
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-['Inter:Bold'] text-[28px] font-bold leading-tight text-[#071f49]">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-0.5 text-[12px] text-[#637084]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {[
              "Titre foncier & documents contrôlés",
              "Annonceurs identifiés & notés",
              "Évaluation prix du marché",
            ].map((badge) => (
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
          Quel bien recherchez-vous ?
        </p>
        <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[100px] text-[#637084] text-[15px] top-[80px] whitespace-nowrap">
          Du premier appartement au prochain investissement.
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
                {category.label}
              </span>
              <span className="-translate-x-1/2 absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[96.5px] text-[#637084] text-[11px] text-center top-[86px] w-[179px]">
                {count} annonce{count > 1 ? "s" : ""}
              </span>
            </button>
          );
        })}

        <p className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[100px] text-[#071f49] text-[14px] top-[262px] whitespace-nowrap">
          Recherches populaires
        </p>
        <div className="absolute left-[100px] top-[292px] flex w-[1240px] flex-wrap gap-[10px]">
          {POPULAR_SEARCHES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => searchWith(preset.filter)}
              className="h-[34px] cursor-pointer rounded-full border border-[#dce2e9] bg-white px-[14px] font-['Inter:Medium'] text-[12px] font-medium text-[#172b45] transition-colors hover:border-[#f3ad19] hover:bg-[#fffaf0]"
            >
              {preset.label}
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
              Des biens pour vos envies
            </p>
            <p className="mt-1 font-['Inter:Regular'] text-[15px] text-[#637084]">
              Une sélection pour habiter, louer ou investir au Cameroun.
            </p>
          </div>
          <button
            type="button"
            onClick={browseAll}
            className="flex h-[40px] cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] hover:text-[#a26b00]"
          >
            Voir toutes les annonces ({allListings.length})
            <ArrowIcon className="size-[18px]" />
          </button>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-[20px]">
          {featured.slice(0, 3).map((listing) => (
            <div key={listing.id} className="relative h-[428px]">
              <ListingTile listing={listing} left={0} top={0} />
            </div>
          ))}
        </div>
        {featured[3] ? (
          <div className="mt-5 flex items-center justify-between rounded-[8px] border border-[#dce2e9] bg-white p-4">
            <div className="flex items-center gap-4">
              <img
                src={featured[3].image}
                alt={featured[3].title}
                className="h-[72px] w-[108px] rounded-[6px] object-cover"
              />
              <div>
                <span className="rounded-[4px] bg-[#e7f6ec] px-2 py-0.5 text-[10px] font-semibold text-[#1f7a3d]">
                  Coup de cœur
                </span>
                <p className="mt-1 font-['Inter:Bold'] text-[16px] font-bold text-[#071f49]">
                  {featured[3].title} — {featured[3].neighborhood}, {featured[3].city}
                </p>
                <p className="text-[13px] text-[#637084]">
                  {formatPrice(featured[3].price)} FCFA · {featured[3].surface} m² ·{" "}
                  {featured[3].rooms} pièces
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => searchWith({ transaction: "vente", city: "Douala" })}
              className="h-[40px] cursor-pointer rounded-[6px] border-0 bg-[#071f49] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-white hover:bg-[#0d2d66]"
            >
              Découvrir
            </button>
          </div>
        ) : null}
      </div>

      {/* CTA Vendre ou louer */}
      <div className="h-[340px] overflow-clip relative shrink-0 w-full" data-name="Vendre ou louer">
        <div
          className="absolute bg-[#071f49] h-[260px] left-[100px] overflow-clip rounded-[10px] top-[40px] w-[1240px]"
          data-name="Votre bien mérite sa place ici"
        >
          <p className="absolute font-['Inter:Bold'] font-bold leading-[1.45] left-[36px] text-[30px] text-white top-[30px] w-[740px]">
            Vous vendez ou louez un bien ?
          </p>
          <div className="absolute font-['Inter:Regular'] font-normal leading-[0] left-[36px] text-[#dce4f0] text-[16px] top-[88px] w-[740px]">
            <p className="leading-[1.45] mb-0">
              Donnez de la visibilité à votre annonce et présentez votre bien
            </p>
            <p className="leading-[1.45]">
              aux personnes qui le recherchent. Photos, détails, prix : à vous de jouer.
            </p>
          </div>
          <button
            type="button"
            onClick={openDeposit}
            className="absolute bg-[#f3ad19] h-[48px] left-[36px] cursor-pointer overflow-clip rounded-[6px] top-[178px] w-[240px] border-0 transition-colors hover:bg-[#ffbe33]"
          >
            <span className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[43.5px] text-[#071f49] text-[14px] top-[14px] whitespace-nowrap">
              Déposer mon annonce
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
              ESTIMATION GRATUITE
            </span>
            <p className="mt-3 font-['Inter:Bold'] text-[24px] font-bold leading-snug text-[#071f49]">
              Estimez la valeur de votre bien au Cameroun
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#637084]">
              Obtenez une fourchette indicative basée sur les prix moyens au m² à Douala, Yaoundé et
              Kribi.
            </p>
          </div>

          <div className="flex flex-1 items-end gap-4">
            <div className="flex-1">
              <label className="mb-1.5 block text-[12px] font-semibold text-[#172b45]">Ville</label>
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
                Type de bien
              </label>
              <select
                value={estType}
                onChange={(e) => setEstType(e.target.value as PropertyType)}
                className="h-[46px] w-full rounded-[6px] border border-[#dce2e9] bg-white px-3 text-[13px] text-[#172b45]"
              >
                {(Object.entries(TYPE_LABELS) as [PropertyType, string][]).map(([val, lbl]) => (
                  <option key={val} value={val}>
                    {lbl}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-[130px]">
              <label className="mb-1.5 block text-[12px] font-semibold text-[#172b45]">
                Surface (m²)
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
              <p className="text-[11px] font-medium text-[#637084]">Estimation indicative</p>
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
          Votre projet, votre ville
        </p>
        <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[100px] text-[#637084] text-[15px] top-[75px] whitespace-nowrap">
          Découvrez les biens dans les villes qui vous attirent.
        </p>

        {[
          { name: "Douala", tagline: "Vivre au cœur du littoral", image: imgDouala },
          { name: "Yaoundé", tagline: "Trouver votre place dans la capitale", image: imgYaounde },
          {
            name: "Kribi",
            tagline: "Habiter ou investir côté océan",
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

      {/* Accompagnement */}
      <div
        className="bg-[#f1f4f8] h-[300px] overflow-clip relative shrink-0 w-full"
        data-name="Accompagnement"
      >
        <p className="absolute font-['Inter:Bold'] font-bold leading-[1.45] left-[100px] text-[#071f49] text-[28px] top-[34px] whitespace-nowrap">
          Un projet immobilier, des étapes plus simples.
        </p>
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
        ].map((step, index) => (
          <div key={step.number}>
            <p
              className="absolute font-['Inter:Bold'] font-bold leading-[1.45] text-[#a26b00] text-[32px] top-[106px] whitespace-nowrap"
              style={{ left: 100 + index * 420 }}
            >
              {step.number}
            </p>
            <p
              className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] text-[#071f49] text-[18px] top-[112px] whitespace-nowrap"
              style={{ left: 164 + index * 420 }}
            >
              {step.title}
            </p>
            <div
              className="absolute font-['Inter:Regular'] font-normal leading-[0] text-[#637084] text-[14px] top-[151px] w-[328px]"
              style={{ left: 164 + index * 420 }}
            >
              {step.body.map((line) => (
                <p key={line} className="leading-[1.45]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Conseils immobiliers (6 articles) */}
      <div id="conseils" className="w-full px-[100px] py-[44px]" data-name="Conseils immobiliers">
        <p className="font-['Inter:Bold'] text-[28px] font-bold leading-[1.3] text-[#071f49]">
          Les clés d'un projet bien préparé
        </p>
        <p className="mt-1 font-['Inter:Regular'] text-[15px] text-[#637084]">
          Des repères concrets pour vos démarches immobilières au Cameroun.
        </p>

        <div className="mt-7 grid grid-cols-3 gap-[20px]">
          {ARTICLES.map((article, index) => (
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
            Consultés récemment
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
              Vous avez des questions ?
            </p>
            <p className="mt-3 text-[15px] leading-[1.5] text-[#637084]">
              Quelques réponses pour bien démarrer votre recherche avec IMMO DU LETCH.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-3">
            {FAQS.map((faq, index) => (
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
          label={ARTICLES[articleIndex].title}
          panelClassName="w-[560px] max-w-[92vw]"
        >
          <img
            alt=""
            src={ARTICLES[articleIndex].image}
            className="h-[230px] w-full object-cover"
          />
          <div className="p-7">
            <p className="font-['Inter:Bold'] text-[10px] font-bold tracking-[0.08em] text-[#996300]">
              {ARTICLES[articleIndex].tag}
            </p>
            <p className="mt-2 font-['Inter:Bold'] text-[22px] font-bold leading-[1.3] text-[#071f49]">
              {ARTICLES[articleIndex].title}
            </p>
            {ARTICLES[articleIndex].body.map((paragraph) => (
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
          label={FAQS[faqIndex].q}
          panelClassName="w-[560px] max-w-[92vw]"
        >
          <div className="p-8 pr-16">
            <p className="font-['Inter:Bold'] text-[20px] font-bold leading-[1.35] text-[#071f49]">
              {FAQS[faqIndex].q}
            </p>
            <p className="mt-4 text-[14px] leading-[1.65] text-[#4a5a70]">{FAQS[faqIndex].a}</p>
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
