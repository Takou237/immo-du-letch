import { useEffect, useMemo, useState, type FormEvent } from "react";
import MobileFooter from "../components/MobileFooter";
import MobileListingCard from "../components/MobileListingCard";
import MobileNav from "../components/MobileNav";
import { ArrowIcon, ChevronIcon, PinIcon, SearchIcon, ShieldIcon } from "../components/icons";
import {
  BUDGET_LOCATION,
  BUDGET_VENTE,
  CATEGORIES,
  HERO_TABS,
  LOCATION_SUGGESTIONS,
  POPULAR_SEARCHES,
  type HomeTab,
} from "../data/homeContent";
import {
  CITY_OPTIONS,
  DEFAULT_FILTERS,
  TYPE_LABELS,
  filterListings,
  type Filters,
  type PropertyType,
} from "../data/listings";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";

const FEATURED_IDS = [
  "villa-bonapriso",
  "appartement-meuble-bastos",
  "terrain-kribi",
  "villa-akwa-douala",
];

export default function MobileHomePage() {
  const { allListings, searchWith, browseAll, openDeposit, openListing, recentlyViewed, articles, faqs, heroSlides, platformStats, siteSettings, searchHistory, applySearchHistory, clearSearchHistory } = useApp();
  const t = useT();

  const [tab, setTab] = useState<HomeTab>("vente");
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PropertyType | "">("");
  const [budgetMax, setBudgetMax] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((index) => (index + 1) % heroSlides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const isRent = tab === "location" || tab === "meuble";
  const budgetOptions = isRent ? BUDGET_LOCATION : BUDGET_VENTE;
  const effectiveType: PropertyType | "" = tab === "terrain" ? "terrain" : type;

  const draftFilters: Partial<Filters> = useMemo(
    () => ({
      transaction: isRent ? "location" : "vente",
      features: tab === "meuble" ? ["Meublé"] : [],
      sellerType: tab === "pro" ? "professionnel" : "",
      city,
      query,
      type: effectiveType,
      priceMax: budgetMax ? Number(budgetMax) : null,
    }),
    [budgetMax, city, effectiveType, isRent, query, tab],
  );

  const matchCount = useMemo(
    () => filterListings(allListings, { ...DEFAULT_FILTERS, ...draftFilters }).length,
    [allListings, draftFilters],
  );

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    searchWith(draftFilters);
  };

  const featured = FEATURED_IDS.map((id) => allListings.find((listing) => listing.id === id)).filter(
    (listing): listing is NonNullable<typeof listing> => Boolean(listing),
  );

  const recent = recentlyViewed
    .slice(0, 2)
    .map((id) => allListings.find((listing) => listing.id === id))
    .filter((listing): listing is NonNullable<typeof listing> => Boolean(listing));

  const slide = heroSlides[slideIndex] ?? heroSlides[0];

  return (
    <div className="min-h-dvh bg-white pb-7 font-['Inter:Regular'] text-[#071f49]">
      <MobileNav />

      {/* Hero + moteur de recherche */}
      <section className="relative overflow-hidden bg-[#071f49] px-4 pb-5 pt-6">
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-40 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071f49] via-[#071f49]/85 to-[#071f49]/55" />

        <div className="relative">
          <button
            type="button"
            onClick={() => openListing(slide.id)}
            className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f3ad19]">
              {slide.tag}
            </p>
            <h1 className="mt-2 text-[26px] font-bold leading-[1.15] text-white">
              {t.home.heroTitle}
            </h1>
            <p className="mt-2 flex items-center gap-1 text-[12px] text-[#ccd6e5]">
              <PinIcon className="size-[12px]" /> {slide.title} · {slide.location}
            </p>
            <p className="mt-1 text-[13px] font-bold text-white">{slide.price}</p>
          </button>

          <div className="mt-3 flex gap-1.5">
            {heroSlides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Voir le bien ${index + 1}`}
                onClick={() => setSlideIndex(index)}
                className={`h-[4px] flex-1 cursor-pointer rounded-full border-0 transition-colors ${
                  index === slideIndex ? "bg-[#f3ad19]" : "bg-white/35"
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSearch} className="mt-5 rounded-[12px] bg-white p-3 shadow-lg">
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {HERO_TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                    tab === item.id
                      ? "border-[#071f49] bg-[#071f49] text-white"
                      : "border-[#dce2e9] bg-white text-[#637084]"
                  }`}
                >
                  {t.home.tabs[item.id]}
                </button>
              ))}
            </div>

            <label className="mt-2 block">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                Mot-clé
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                list="mobile-locations"
                placeholder="Villa, piscine, Bonapriso…"
                className="mt-0.5 h-[40px] w-full rounded-[7px] border border-[#dce2e9] px-3 text-[13px] outline-none focus:border-[#f3ad19]"
              />
              <datalist id="mobile-locations">
                {LOCATION_SUGGESTIONS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </label>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                  Ville
                </span>
                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="mt-0.5 h-[40px] w-full cursor-pointer rounded-[7px] border border-[#dce2e9] bg-white px-2 text-[13px] outline-none focus:border-[#f3ad19]"
                >
                  <option value="">Tout le Cameroun</option>
                  {CITY_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                  Type
                </span>
                <select
                  value={effectiveType}
                  onChange={(event) => setType(event.target.value as PropertyType | "")}
                  className="mt-0.5 h-[40px] w-full cursor-pointer rounded-[7px] border border-[#dce2e9] bg-white px-2 text-[13px] outline-none focus:border-[#f3ad19]"
                >
                  <option value="">Tous les biens</option>
                  {(Object.keys(TYPE_LABELS) as PropertyType[]).map((item) => (
                    <option key={item} value={item}>
                      {TYPE_LABELS[item]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-2 block">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8a95a5]">
                {isRent ? "Loyer maximum (FCFA / mois)" : "Budget maximum (FCFA)"}
              </span>
              <select
                value={budgetMax}
                onChange={(event) => setBudgetMax(event.target.value)}
                className="mt-0.5 h-[40px] w-full cursor-pointer rounded-[7px] border border-[#dce2e9] bg-white px-2 text-[13px] outline-none focus:border-[#f3ad19]"
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="mt-3 flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border-0 bg-[#f3ad19] text-[14px] font-semibold text-[#071f49] active:bg-[#ffbe33]"
            >
              <SearchIcon className="size-[16px]" />
              {t.home.searchCount(matchCount)}
            </button>
          </form>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {POPULAR_SEARCHES.slice(0, 3).map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => searchWith(item.filter)}
                className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] text-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Historique des recherches */}
      {searchHistory.length > 0 ? (
        <section className="px-4 pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[#071f49]">Recherches récentes</h2>
            <button
              type="button"
              onClick={clearSearchHistory}
              className="cursor-pointer border-0 bg-transparent text-[11px] font-semibold text-[#637084]"
            >
              Effacer
            </button>
          </div>
          <div className="mt-2 flex flex-col gap-1.5">
            {searchHistory.slice(0, 5).map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => applySearchHistory(entry)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-[8px] border border-[#dce2e9] bg-white px-3 py-2 text-left text-[12px] text-[#172b45]"
              >
                <SearchIcon className="size-[13px] shrink-0 text-[#8a95a5]" />
                <span className="truncate">{entry.label}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Statistiques */}
      <section className="grid grid-cols-2 gap-2 px-4 py-4">
        {platformStats.map((stat, idx) => (
          <div
            key={stat.label}
            className="rounded-[10px] border border-[#dce2e9] bg-[#f8fafc] px-3 py-2.5"
          >
            <p className="text-[20px] font-bold text-[#071f49]">
              {stat.value}
              {stat.suffix}
            </p>
            <p className="text-[11px] text-[#637084]">{t.home.statsLabels[idx]}</p>
          </div>
        ))}
      </section>

      {/* Catégories */}
      <section className="px-4">
        <h2 className="text-[16px] font-bold text-[#071f49]">{t.home.categoriesTitle}</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.label}
              type="button"
              onClick={() => searchWith(category.filter)}
              className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#dce2e9] bg-white px-3 py-3 text-left active:border-[#f3ad19]"
            >
              <img src={category.icon} alt="" className="size-[22px] shrink-0 object-contain" />
              <span className="text-[12px] font-semibold leading-tight text-[#071f49]">
                {t.home.categories[category.label] ?? category.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="px-4 pt-6">
        <div className="rounded-[12px] border border-[#dce2e9] bg-[#f8fafc] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a26b00]">
            Qui sommes-nous
          </p>
          <h2 className="mt-1.5 text-[17px] font-bold leading-[1.3] text-[#071f49]">
            IMMO DU LETCH, votre partenaire immobilier au Cameroun
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-[#4a5a70]">
            Depuis plus de {siteSettings?.yearsExperience ?? "5"} ans, nous accompagnons particuliers
            et professionnels dans l'achat, la vente et la location de biens à Douala, Yaoundé et
            Kribi. Des annonces vérifiées, une mise en relation directe et un accompagnement de A à Z.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Annonces vérifiées", "Conseils", "Accompagnement"].map((value) => (
              <span
                key={value}
                className="rounded-full border border-[#dce2e9] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#172b45]"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Annonces à découvrir */}
      <section className="px-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#071f49]">{t.home.featuredTitle}</h2>
          <button
            type="button"
            onClick={browseAll}
            className="flex cursor-pointer items-center gap-1 border-0 bg-transparent text-[12px] font-semibold text-[#a26b00]"
          >
            {t.home.discover} <ArrowIcon className="size-[12px]" />
          </button>
        </div>
        <div className="relative mt-2">
          <button
            type="button"
            aria-label="Bien précédent"
            onClick={() => setFeaturedIndex((index) => Math.max(0, index - 1))}
            disabled={featuredIndex === 0}
            className="absolute -left-1 top-1/2 z-10 flex size-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-white/95 text-[#071f49] shadow-md disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronIcon className="size-[15px] rotate-180" />
          </button>
          <div className="overflow-hidden">
            {featured[featuredIndex] ? (
              <MobileListingCard key={featured[featuredIndex].id} listing={featured[featuredIndex]} />
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Bien suivant"
            onClick={() => setFeaturedIndex((index) => Math.min(featured.length - 1, index + 1))}
            disabled={featuredIndex >= featured.length - 1}
            className="absolute -right-1 top-1/2 z-10 flex size-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-white/95 text-[#071f49] shadow-md disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronIcon className="size-[15px]" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {featured.map((listing, index) => (
            <button
              key={listing.id}
              type="button"
              aria-label={`Afficher le bien ${index + 1}`}
              onClick={() => setFeaturedIndex(index)}
              className={`h-[5px] cursor-pointer rounded-full border-0 transition-all ${
                index === featuredIndex ? "w-[20px] bg-[#f3ad19]" : "w-[7px] bg-[#dce2e9]"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Récemment consultés */}
      {recent.length > 0 ? (
        <section className="px-4 pt-6">
          <h2 className="text-[16px] font-bold text-[#071f49]">Consultés récemment</h2>
          <div className="mt-2 flex flex-col gap-2">
            {recent.map((listing) => (
              <MobileListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Vendre ou louer */}
      <section className="px-4 pt-6">
        <div className="rounded-[12px] bg-[#071f49] px-4 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f3ad19]">
            Vendre · Louer
          </p>
          <h2 className="mt-1 text-[19px] font-bold leading-snug text-white">
            Votre bien mérite sa place ici.
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-[#ccd6e5]">
            Publiez votre annonce gratuitement et touchez des acheteurs et locataires à Douala,
            Yaoundé et Kribi.
          </p>
          <button
            type="button"
            onClick={openDeposit}
            className="mt-3 h-[42px] w-full cursor-pointer rounded-[8px] border-0 bg-[#f3ad19] text-[13px] font-semibold text-[#071f49]"
          >
            Déposer une annonce
          </button>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#ccd6e5]">
            <ShieldIcon className="size-[13px] text-[#f3ad19]" /> Annonces vérifiées avant publication
          </p>
        </div>
      </section>

      {/* Conseils */}
      <section className="px-4 pt-7">
        <h2 className="text-[16px] font-bold text-[#071f49]">Conseils immobiliers</h2>
        <div className="mt-2 flex flex-col gap-2">
          {articles.slice(0, 3).map((article) => (
            <details
              key={article.title}
              className="group rounded-[10px] border border-[#dce2e9] bg-white px-3 py-2.5"
            >
              <summary className="flex cursor-pointer list-none items-start gap-2">
                <span className="mt-0.5 shrink-0 rounded-[4px] bg-[#fff7e6] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#a26b00]">
                  {article.tag}
                </span>
                <span className="flex-1 text-[13px] font-semibold leading-snug text-[#071f49]">
                  {article.title}
                </span>
                <ChevronIcon className="mt-0.5 size-[13px] shrink-0 text-[#8a95a5] transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2 space-y-2 border-t border-[#eef2f6] pt-2 text-[12px] leading-relaxed text-[#4a5a70]">
                {(typeof article.body === "string" ? [article.body] : (article.body as unknown as string[])).map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pt-7">
        <h2 className="text-[16px] font-bold text-[#071f49]">Questions fréquentes</h2>
        <div className="mt-2 flex flex-col gap-2">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-[10px] border border-[#dce2e9] bg-white px-3 py-2.5"
            >
              <summary className="flex cursor-pointer list-none items-start gap-2">
                <span className="flex-1 text-[13px] font-semibold leading-snug text-[#071f49]">
                  {faq.q}
                </span>
                <ChevronIcon className="mt-0.5 size-[13px] shrink-0 text-[#8a95a5] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 border-t border-[#eef2f6] pt-2 text-[12px] leading-relaxed text-[#4a5a70]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <MobileFooter />
    </div>
  );
}
