import { useEffect, useMemo, useState, type FormEvent } from "react";
import { normalizeText } from "../data/listings";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";
import { CloseIcon, HeartIcon, SearchIcon } from "./icons";

type NavActive = "vente" | "location" | "terrain" | "conseils";

const QUICK_SUGGESTIONS = [
  { label: "Villa à Douala", labelEn: "Villa in Douala", query: "Villa", city: "Douala" },
  { label: "Appartement à Bastos", labelEn: "Apartment in Bastos", query: "Bastos", city: "Yaoundé" },
  { label: "Terrain à Kribi", labelEn: "Land in Kribi", query: "Terrain", city: "Kribi" },
  { label: "Piscine", labelEn: "Pool", query: "Piscine", city: "" },
  { label: "Meublé", labelEn: "Furnished", query: "Meublé", city: "" },
];

export default function SiteNav({ active: _active }: { active?: NavActive }) {
  const {
    navigate,
    searchWith,
    favorites,
    allListings,
    openFavorites,
    openDeposit,
    user,
    openAuth,
    logout,
    language,
    setLanguage,
    searchHistory,
    applySearchHistory,
    clearSearchHistory,
  } = useApp();
  const t = useT();
  const [quickQuery, setQuickQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % t.nav.searchPlaceholder.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [t.nav.searchPlaceholder.length]);

  const hasPriceDropInFavorites = favorites.some(
    (id) => allListings.find((l) => l.id === id)?.priceDropped,
  );

  const suggestions = useMemo(() => {
    const q = normalizeText(quickQuery);
    if (!q) return QUICK_SUGGESTIONS;
    return QUICK_SUGGESTIONS.filter((s) => normalizeText(`${s.label} ${s.city}`).includes(q));
  }, [quickQuery]);

  const handleQuickSearch = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = quickQuery.trim();
    setFocused(false);
    if (!trimmed) {
      searchWith({});
      return;
    }
    searchWith({ query: trimmed });
  };

  const initials = user
    ? user.name
        .split(/\s+/)
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <div
      className="h-[112px] overflow-visible relative shrink-0 w-full bg-white z-40"
      data-name="Navigation"
    >
      {/* Logo */}
      <button
        type="button"
        aria-label="Accueil IMMO DU LETCH"
        onClick={() => navigate("home")}
        className="absolute h-[101px] left-[100px] top-[5px] w-[145px] cursor-pointer border-0 bg-transparent p-0"
      >
        <img
          alt="IMMO DU LETCH"
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src="/assets/aab40.png"
        />
      </button>

      {/* Grande barre de recherche animée (style mobile.de) */}
      <form
        onSubmit={handleQuickSearch}
        className={`nav-search-bar absolute left-[275px] top-[31px] flex h-[50px] w-[705px] items-center rounded-[10px] border bg-[#f8fafc] pl-4 pr-1.5 transition-all duration-300 ${
          focused
            ? "scale-[1.01] border-[#f3ad19] bg-white shadow-[0_8px_28px_rgb(7_31_73/12%),0_0_0_3px_rgb(243_173_25/22%)]"
            : "border-[#dce2e9] hover:border-[#b8c4d4] hover:bg-white"
        }`}
      >
        <SearchIcon
          className={`size-[20px] shrink-0 transition-transform duration-300 ${
            focused ? "scale-110 text-[#f3ad19]" : "text-[#637084]"
          }`}
        />

        <div className="relative ml-3 flex-1">
          <input
            type="text"
            aria-label="Rechercher un bien immobilier"
            value={quickQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 180)}
            onChange={(e) => setQuickQuery(e.target.value)}
            className="w-full border-0 bg-transparent font-['Inter:Medium'] text-[14px] text-[#071f49] outline-none"
          />
          {!quickQuery ? (
            <span
              key={placeholderIdx}
              className="animate-placeholder pointer-events-none absolute inset-y-0 left-0 flex items-center font-['Inter:Regular'] text-[14px] text-[#8a95a5]"
            >
              {t.nav.searchPlaceholder[placeholderIdx]}
            </span>
          ) : null}
        </div>

        {quickQuery ? (
          <button
            type="button"
            aria-label="Effacer la recherche"
            onClick={() => setQuickQuery("")}
            className="mr-2 flex size-[24px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#eef2f6] text-[#637084] hover:text-[#071f49]"
          >
            <CloseIcon className="size-[11px]" />
          </button>
        ) : null}

        <button
          type="submit"
          className="flex h-[38px] shrink-0 cursor-pointer items-center gap-2 rounded-[7px] border-0 bg-[#f3ad19] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] transition-all duration-200 hover:bg-[#ffbe33] active:scale-95"
        >
          <SearchIcon className="size-[16px]" />
          {t.nav.searchBtn}
        </button>

        {/* Suggestions déroulantes au focus */}
        {focused && (suggestions.length > 0 || (!quickQuery && searchHistory.length > 0)) ? (
          <div className="animate-fade-in absolute left-0 top-[56px] z-50 w-full rounded-[10px] border border-[#dce2e9] bg-white p-2 shadow-[0_18px_40px_rgb(7_31_73/14%)]">
            {!quickQuery && searchHistory.length > 0 ? (
              <>
                <div className="flex items-center justify-between px-3 py-1.5">
                  <p className="font-['Inter:Semi_Bold'] text-[11px] font-semibold uppercase tracking-wider text-[#8a95a5]">
                    Recherches récentes
                  </p>
                  <button
                    type="button"
                    onMouseDown={() => clearSearchHistory()}
                    className="cursor-pointer border-0 bg-transparent text-[11px] font-semibold text-[#637084] hover:text-[#dc2626]"
                  >
                    Effacer
                  </button>
                </div>
                <div className="flex flex-col gap-0.5 px-1 pb-2">
                  {searchHistory.slice(0, 5).map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onMouseDown={() => {
                        setQuickQuery("");
                        setFocused(false);
                        applySearchHistory(entry);
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded-[6px] border-0 bg-transparent px-2.5 py-1.5 text-left text-[12px] text-[#172b45] transition-colors hover:bg-[#f4f6f8]"
                    >
                      <SearchIcon className="size-[12px] shrink-0 text-[#8a95a5]" />
                      <span className="truncate">{entry.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : null}
            <p className="px-3 py-1.5 font-['Inter:Semi_Bold'] text-[11px] font-semibold uppercase tracking-wider text-[#8a95a5]">
              {t.nav.popularSuggestions}
            </p>
            <div className="flex flex-wrap gap-1.5 px-2 pb-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onMouseDown={() => {
                    setQuickQuery(s.query);
                    setFocused(false);
                    searchWith({ query: s.query, city: s.city });
                  }}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#dce2e9] bg-[#f8fafc] px-3.5 py-1.5 text-[12px] font-medium text-[#071f49] transition-colors hover:border-[#f3ad19] hover:bg-[#fffaf0]"
                >
                  <SearchIcon className="size-[12px] text-[#637084]" />
                  {language === "en" ? s.labelEn : s.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </form>

      {/* Actions droite : Favoris + Connexion/Profil + Langue */}
      <div className="absolute right-[100px] top-0 flex h-[111px] items-center">
        {/* Favoris */}
        <button
          type="button"
          onClick={openFavorites}
          aria-label={t.nav.favorites}
          className="flex cursor-pointer items-center gap-[8px] border-0 bg-transparent p-0"
        >
          <span className="relative block size-[20px]">
            <HeartIcon className="size-full" filled={favorites.length > 0} />
            {hasPriceDropInFavorites ? (
              <span
                title="Baisse de prix sur un favori"
                className="absolute -right-1 -top-1 size-[8px] rounded-full bg-[#e11d48] ring-2 ring-white"
              />
            ) : null}
          </span>
          <span className="font-['Inter:Medium'] font-medium leading-[1.45] text-[#172b45] text-[14px] whitespace-nowrap">
            {t.nav.favorites}{favorites.length > 0 ? ` · ${favorites.length}` : ""}
          </span>
        </button>

        {/* Profil connecté ou Se connecter + Changement de langue rapproché */}
        <div className="ml-5 flex items-center gap-2.5">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => navigate("profile")}
                onMouseEnter={() => setMenuOpen(true)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 180)}
                className="flex h-[38px] max-w-[148px] cursor-pointer items-center gap-2 rounded-full border border-[#dce2e9] bg-[#f8fafc] pl-1.5 pr-3 transition-colors hover:border-[#f3ad19]"
              >
                <span
                  className={`flex size-[26px] shrink-0 items-center justify-center rounded-full font-['Inter:Bold'] text-[11px] font-bold text-white ${
                    user.provider === "google" ? "bg-[#4285F4]" : "bg-[#071f49]"
                  }`}
                >
                  {initials}
                </span>
                <span className="truncate font-['Inter:Semi_Bold'] text-[12px] font-semibold text-[#071f49]">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {menuOpen ? (
                <div
                  onMouseLeave={() => setMenuOpen(false)}
                  className="absolute right-0 top-[44px] z-50 w-[230px] rounded-[8px] border border-[#dce2e9] bg-white p-2 shadow-xl"
                >
                  <div className="border-b border-[#eef2f6] px-3 py-2">
                    <p className="truncate font-['Inter:Bold'] text-[13px] font-bold text-[#071f49]">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] text-[#637084]">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-[#eaf0f8] px-2 py-0.5 text-[10px] font-semibold text-[#071f49]">
                      {user.provider === "google"
                        ? t.nav.googleAccount
                        : user.accountType === "professionnel"
                          ? t.nav.proAccount
                          : t.nav.particulierAccount}
                    </span>
                  </div>
                  <button
                    type="button"
                    onMouseDown={() => {
                      setMenuOpen(false);
                      navigate("profile");
                    }}
                    className="mt-1 w-full cursor-pointer rounded-[6px] border-0 bg-transparent px-3 py-2 text-left text-[12px] font-semibold text-[#071f49] hover:bg-[#f4f6f8]"
                  >
                    {t.nav.myProfile}
                  </button>
                  <button
                    type="button"
                    onMouseDown={() => {
                      setMenuOpen(false);
                      openFavorites();
                    }}
                    className="w-full cursor-pointer rounded-[6px] border-0 bg-transparent px-3 py-2 text-left text-[12px] font-medium text-[#172b45] hover:bg-[#f4f6f8]"
                  >
                    {t.nav.myFavorites}
                  </button>
                  <button
                    type="button"
                    onMouseDown={() => {
                      setMenuOpen(false);
                      openDeposit();
                    }}
                    className="w-full cursor-pointer rounded-[6px] border-0 bg-transparent px-3 py-2 text-left text-[12px] font-medium text-[#172b45] hover:bg-[#f4f6f8]"
                  >
                    {t.nav.postListing}
                  </button>
                  <button
                    type="button"
                    onMouseDown={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full cursor-pointer rounded-[6px] border-0 bg-transparent px-3 py-2 text-left text-[12px] font-semibold text-[#dc2626] hover:bg-[#fef2f2]"
                  >
                    {t.nav.logout}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="flex cursor-pointer items-center gap-[7px] border-0 bg-transparent p-0"
            >
              <span className="relative block size-[20px]">
                <img alt="" className="absolute inset-0 max-w-none size-full" src="/assets/a1e47.svg" />
              </span>
              <span className="font-['Inter:Medium'] font-medium leading-[1.45] text-[#172b45] text-[14px] whitespace-nowrap hover:text-[#071f49]">
                {t.nav.signIn}
              </span>
            </button>
          )}

          {/* Sélecteur de langue FR / EN */}
          <div
            role="group"
            aria-label="Changer de langue"
            className="flex items-center rounded-full border border-[#dce2e9] bg-[#f8fafc] p-0.5"
          >
            {(["fr", "en"] as const).map((lang) => {
              const active = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  aria-pressed={active}
                  className={`cursor-pointer rounded-full border-0 px-2 py-1 font-['Inter:Semi_Bold'] text-[11px] font-semibold uppercase transition-colors ${
                    active
                      ? "bg-[#071f49] text-white"
                      : "bg-transparent text-[#637084] hover:text-[#071f49]"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="absolute bg-[#dce2e9] h-px left-0 top-[111px] w-[1440px]"
        data-name="Séparateur"
      />
    </div>
  );
}
