import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, getApiToken, setApiToken } from "../api/client";
import {
  ARTICLES,
  DEFAULT_FILTERS,
  FAQS,
  LISTINGS,
  PLATFORM_STATS,
  describeFilters,
  filterListings,
  sortListings,
  type Filters,
  type Listing,
  type PropertyType,
  type SortKey,
} from "../data/listings";
import { HERO_SLIDES } from "../data/homeContent";

export type SiteArticle = { id: number; tag: string; title: string; image: string; body: string };
export type SiteFaq = { id: number; q: string; a: string };
export type SiteHeroSlide = { id: string; image: string; tag: string; title: string; location: string; price: string };
export type SiteStat = { value: string; label: string; suffix: string };
export type SiteSettings = { yearsExperience: string; contactPhone: string; contactEmail: string };

export type Page = "home" | "results" | "detail" | "profile";
export type ViewMode = "list" | "grid";
export type AuthMode = "login" | "register";
export type ListingStatus = "pending" | "approved" | "rejected";
export type Language = "fr" | "en";

export type UserListing = {
  id: string;
  userId: string;
  title: string;
  transaction: Filters["transaction"];
  type: PropertyType;
  city: string;
  neighborhood: string;
  price: number;
  surface: number;
  rooms: number;
  features: string[];
  images?: string[];
  description: string;
  status: ListingStatus;
  rejectionReason?: string;
  sellerName?: string;
  sellerPhone?: string;
  createdAt: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  accountType: "particulier" | "professionnel";
  provider: "email" | "google";
  createdAt: number;
};

type StoredAccount = User & { password?: string };

const CITY_REGIONS: Record<string, string> = {
  Douala: "Littoral",
  Yaoundé: "Centre",
  Kribi: "Sud",
};

const USER_LISTING_IMAGES: Record<PropertyType, string> = {
  villa: "/assets/d92fa.png",
  appartement: "/assets/df5dc.png",
  terrain: "/assets/26532.png",
  studio: "/assets/d8a71.png",
  bureau: "/assets/9f819.png",
};

function toPublicListing(item: UserListing, account?: StoredAccount): Listing {
  const sellerName = item.sellerName ?? account?.name ?? "Annonceur IMMO DU LETCH";
  const sellerPhone = item.sellerPhone ?? account?.phone;
  const sellerType = account?.accountType === "professionnel" ? "professionnel" : "particulier";
  const fallbackImage = USER_LISTING_IMAGES[item.type];
  const gallery = item.images && item.images.length > 0 ? item.images : [fallbackImage];
  const image = gallery[0];
  const createdAt = account?.createdAt ?? item.createdAt;
  const bedrooms =
    item.type === "studio"
      ? 1
      : item.type === "villa" || item.type === "appartement"
        ? Math.max(0, item.rooms - 1)
        : 0;

  return {
    id: item.id,
    reference: `IDL-USER-${item.id.replace(/^ul-/, "").slice(-8).toUpperCase()}`,
    title: item.title,
    price: item.price,
    transaction: item.transaction,
    type: item.type,
    city: item.city,
    neighborhood: item.neighborhood,
    region: CITY_REGIONS[item.city] ?? "Cameroun",
    rooms: item.rooms,
    bedrooms,
    bathrooms: 0,
    surface: item.surface,
    parking: 0,
    image,
    gallery,
    description: item.description,
    description2:
      "Annonce publiée par un membre d'IMMO DU LETCH. Contactez l'annonceur pour organiser une visite et vérifier les documents du bien.",
    features: item.features,
    documents: [],
    condition: "ancien",
    sellerType,
    seller: sellerName,
    sellerRating: 0,
    sellerReviews: 0,
    sellerSince: String(new Date(createdAt).getFullYear()),
    sellerDescription: `Annonce déposée par ${sellerName} sur IMMO DU LETCH.`,
    sellerPhone,
    isNew: true,
    publishedAt: new Date(item.createdAt).toISOString().slice(0, 10),
    views: 0,
    priceDropped: false,
  };
}

export type SavedSearch = {
  id: string;
  label: string;
  filters: Filters;
  createdAt: number;
};

export type SearchHistoryEntry = {
  id: string;
  label: string;
  filters: Filters;
  createdAt: number;
};

type AppContextValue = {
  page: Page;
  navigate: (page: Page, listingId?: string) => void;
  scrollToSection: (sectionId: string) => void;
  selectedId: string;
  selectedListing: Listing;
  openListing: (listingId: string) => void;
  filters: Filters;
  updateFilters: (partial: Partial<Filters>) => void;
  resetFilters: () => void;
  searchWith: (partial: Partial<Filters>) => void;
  browseAll: () => void;
  sort: SortKey;
  setSort: (sort: SortKey) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  allListings: Listing[];
  results: Listing[];
  favorites: string[];
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listingId: string) => void;
  favoritesOpen: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
  recentlyViewed: string[];
  addToRecentlyViewed: (listingId: string) => void;
  compareList: string[];
  isInCompare: (listingId: string) => boolean;
  addToCompare: (listingId: string) => void;
  removeFromCompare: (listingId: string) => void;
  toggleCompare: (listingId: string) => void;
  clearCompare: () => void;
  compareOpen: boolean;
  openCompare: () => void;
  closeCompare: () => void;
  depositOpen: boolean;
  openDeposit: () => void;
  closeDeposit: () => void;
  user: User | null;
  authOpen: boolean;
  authMode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  loginWithEmail: (email: string, password: string) => boolean;
  registerWithEmail: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    accountType: "particulier" | "professionnel";
  }) => boolean;
  loginWithGoogle: (name: string, email: string) => void;
  logout: () => void;
  updateUserProfile: (payload: {
    name: string;
    phone?: string;
    accountType: "particulier" | "professionnel";
  }) => void;
  userListings: UserListing[];
  addUserListing: (
    payload: Omit<UserListing, "id" | "userId" | "status" | "createdAt">,
  ) => UserListing | null;
  deleteUserListing: (id: string) => void;
  moderateUserListing: (id: string, status: ListingStatus, rejectionReason?: string) => void;
  savedSearches: SavedSearch[];
  saveCurrentSearch: () => void;
  applySavedSearch: (search: SavedSearch) => void;
  deleteSavedSearch: (searchId: string) => void;
  searchHistory: SearchHistoryEntry[];
  applySearchHistory: (entry: SearchHistoryEntry) => void;
  clearSearchHistory: () => void;
  sellerRatings: Record<string, number>;
  rateSeller: (seller: string, rating: number) => void;
  getSellerRating: (
    seller: string,
    baseRating: number,
    baseReviews: number,
  ) => { rating: number; reviews: number; userRating?: number };
  language: Language;
  setLanguage: (lang: Language) => void;
  toast: string | null;
  showToast: (message: string) => void;
  articles: SiteArticle[];
  faqs: SiteFaq[];
  heroSlides: SiteHeroSlide[];
  platformStats: SiteStat[];
  siteSettings: SiteSettings | null;
};

const AppContext = createContext<AppContextValue | null>(null);

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible */
  }
}

function parseHash(): { page: Page; listingId?: string } {
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (raw.startsWith("detail")) {
    const listingId = raw.split("/")[1];
    return { page: "detail", listingId };
  }
  if (raw.startsWith("results")) return { page: "results" };
  if (raw.startsWith("profile")) return { page: "profile" };
  return { page: "home" };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initialHash = parseHash();
  const [page, setPage] = useState<Page>(initialHash.page);
  const [selectedId, setSelectedId] = useState<string>(
    initialHash.listingId ?? LISTINGS[0].id,
  );
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("pertinence");
  const [viewMode, setViewModeState] = useState<ViewMode>(() =>
    readStored<ViewMode>("immo:viewmode", "list"),
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    readStored<string[]>("immo:favorites", []),
  );
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    readStored<string[]>("immo:recent", []),
  );
  const [compareList, setCompareList] = useState<string[]>(() =>
    readStored<string[]>("immo:compare", []),
  );
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() =>
    readStored<SavedSearch[]>("immo:searches", []),
  );
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>(() =>
    readStored<SearchHistoryEntry[]>("immo:search_history", []),
  );
  const [sellerRatings, setSellerRatings] = useState<Record<string, number>>(() =>
    readStored<Record<string, number>>("immo:seller_ratings", {}),
  );
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => readStored<User | null>("immo:user", null));
  const [accounts, setAccounts] = useState<StoredAccount[]>(() =>
    readStored<StoredAccount[]>("immo:accounts", []),
  );
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userListings, setUserListings] = useState<UserListing[]>(() =>
    readStored<UserListing[]>("immo:user_listings", []),
  );
  const [backendListings, setBackendListings] = useState<Listing[]>([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [language, setLanguageState] = useState<Language>(() =>
    readStored<Language>("immo:lang", "fr"),
  );
  const [articles, setArticles] = useState<SiteArticle[]>(
    ARTICLES.map((a, i) => ({ id: i + 1, tag: a.tag, title: a.title, image: a.image, body: Array.isArray(a.body) ? a.body.join(" ") : (a.body as string) })),
  );
  const [faqs, setFaqs] = useState<SiteFaq[]>(
    FAQS.map((f, i) => ({ id: i + 1, q: f.q, a: f.a })),
  );
  const [heroSlides, setHeroSlides] = useState<SiteHeroSlide[]>(HERO_SLIDES);
  const [platformStats, setPlatformStats] = useState<SiteStat[]>(PLATFORM_STATS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const allListings = useMemo(() => {
    const map = new Map<string, Listing>();
    if (!backendOnline) {
      for (const item of LISTINGS) {
        map.set(item.id, item);
      }
    }
    for (const item of backendListings) {
      map.set(item.id, item);
    }
    for (const item of userListings) {
      if (item.status === "approved" && !map.has(item.id)) {
        map.set(
          item.id,
          toPublicListing(item, accounts.find((acc) => acc.id === item.userId)),
        );
      }
    }
    return Array.from(map.values());
  }, [accounts, backendListings, backendOnline, userListings]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    writeStored("immo:user", user);
  }, [user]);

  useEffect(() => {
    writeStored("immo:accounts", accounts);
  }, [accounts]);

  useEffect(() => {
    writeStored("immo:user_listings", userListings);
  }, [userListings]);

  useEffect(() => {
    writeStored("immo:favorites", favorites);
  }, [favorites]);

  useEffect(() => {
    writeStored("immo:searches", savedSearches);
  }, [savedSearches]);

  useEffect(() => {
    writeStored("immo:search_history", searchHistory);
  }, [searchHistory]);

  useEffect(() => {
    writeStored("immo:seller_ratings", sellerRatings);
  }, [sellerRatings]);

  useEffect(() => {
    writeStored("immo:recent", recentlyViewed);
  }, [recentlyViewed]);

  useEffect(() => {
    writeStored("immo:compare", compareList);
  }, [compareList]);

  useEffect(() => {
    writeStored("immo:viewmode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    writeStored("immo:lang", language);
    document.documentElement.lang = language;
  }, [language]);

  const hydrateUserSession = useCallback(async () => {
    if (!getApiToken()) return;
    try {
      const [meRes, myListingsRes, favRes, searchRes] = await Promise.all([
        api.me(),
        api.getMyListings(),
        api.getFavorites(),
        api.getSavedSearches(),
      ]);
      setUser(meRes.user);
      setUserListings(myListingsRes.listings);
      setFavorites(favRes.favorites);
      setSavedSearches(searchRes.savedSearches);
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 401 || status === 403) {
        setApiToken(null);
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    api
      .getListings()
      .then((res) => {
        setBackendListings(res.listings);
        setBackendOnline(true);
      })
      .catch(() => {
        /* backend hors ligne : utilisation du catalogue local */
      });
    api
      .getSiteContent()
      .then((res) => {
        if (res.articles?.length) setArticles(res.articles);
        if (res.faqs?.length) setFaqs(res.faqs);
        if (res.heroSlides?.length) setHeroSlides(res.heroSlides);
        if (res.stats?.length) setPlatformStats(res.stats);
        if (res.settings) setSiteSettings(res.settings);
      })
      .catch(() => {
        /* backend hors ligne : utilisation du contenu local */
      });
    void hydrateUserSession();
  }, [hydrateUserSession]);

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHash();
      setPage(parsed.page);
      if (parsed.page === "detail") {
        const nextId =
          parsed.listingId && allListings.some((item) => item.id === parsed.listingId)
            ? parsed.listingId
            : allListings[0].id;
        setSelectedId(nextId);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [allListings]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      showToast(lang === "fr" ? "Langue : Français" : "Language: English");
    },
    [showToast],
  );

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
  }, []);

  const addToRecentlyViewed = useCallback(
    (listingId: string) => {
      if (!allListings.some((item) => item.id === listingId)) return;
      setRecentlyViewed((current) =>
        [listingId, ...current.filter((id) => id !== listingId)].slice(0, 10),
      );
    },
    [allListings],
  );

  const navigate = useCallback(
    (nextPage: Page, listingId?: string) => {
      const nextId =
        listingId && allListings.some((item) => item.id === listingId) ? listingId : undefined;
      if (nextId) setSelectedId(nextId);
      setPage(nextPage);
      const hash =
        nextPage === "home"
          ? ""
          : nextPage === "results"
            ? "results"
            : nextPage === "profile"
              ? "profile"
              : `detail/${nextId ?? selectedId}`;
      if (window.location.hash.replace(/^#/, "") !== hash) {
        window.location.hash = hash;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [allListings, selectedId],
  );

  const scrollToSection = useCallback(
    (sectionId: string) => {
      navigate("home");
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    },
    [navigate],
  );

  const openListing = useCallback(
    (listingId: string) => {
      setFavoritesOpen(false);
      setCompareOpen(false);
      addToRecentlyViewed(listingId);
      navigate("detail", listingId);
    },
    [addToRecentlyViewed, navigate],
  );

  const updateFilters = useCallback((partial: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...partial }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const searchWith = useCallback(
    (partial: Partial<Filters>) => {
      const nextFilters = { ...DEFAULT_FILTERS, ...partial };
      setFilters(nextFilters);
      setSort("pertinence");
      navigate("results");
      const label = describeFilters(nextFilters);
      if (label && label !== describeFilters(DEFAULT_FILTERS)) {
        setSearchHistory((current) => [
          { id: `sh-${Date.now()}`, label, filters: nextFilters, createdAt: Date.now() },
          ...current.filter((entry) => entry.label !== label),
        ].slice(0, 8));
      }
    },
    [navigate],
  );

  const applySearchHistory = useCallback(
    (entry: SearchHistoryEntry) => {
      setFilters(entry.filters);
      setSort("pertinence");
      navigate("results");
      setSearchHistory((current) => [
        entry,
        ...current.filter((item) => item.label !== entry.label),
      ].slice(0, 8));
    },
    [navigate],
  );

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const rateSeller = useCallback(
    (seller: string, rating: number) => {
      const clamped = Math.max(1, Math.min(5, Math.round(rating)));
      setSellerRatings((current) => ({ ...current, [seller]: clamped }));
      showToast(`Merci ! Vous avez noté ${seller} ${clamped}/5.`);
    },
    [showToast],
  );

  const getSellerRating = useCallback(
    (seller: string, baseRating: number, baseReviews: number) => {
      const userRating = sellerRatings[seller];
      if (!userRating) {
        return { rating: baseRating, reviews: baseReviews, userRating: undefined };
      }
      const reviews = baseReviews + 1;
      const rating = (baseRating * baseReviews + userRating) / reviews;
      return { rating, reviews, userRating };
    },
    [sellerRatings],
  );

  const browseAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort("pertinence");
    navigate("results");
  }, [navigate]);

  const isFavorite = useCallback((listingId: string) => favorites.includes(listingId), [favorites]);

  const toggleFavorite = useCallback(
    (listingId: string) => {
      setFavorites((current) => {
        if (current.includes(listingId)) {
          showToast("Bien retiré de vos favoris.");
          return current.filter((id) => id !== listingId);
        }
        showToast("Bien ajouté à vos favoris.");
        return [...current, listingId];
      });
      if (getApiToken()) {
        void api.toggleFavorite(listingId).catch(() => {
          /* ignore si hors ligne */
        });
      }
    },
    [showToast],
  );

  const isInCompare = useCallback(
    (listingId: string) => compareList.includes(listingId),
    [compareList],
  );

  const addToCompare = useCallback(
    (listingId: string) => {
      setCompareList((current) => {
        if (current.includes(listingId)) return current;
        if (current.length >= 3) {
          showToast("Vous pouvez comparer jusqu'à 3 biens maximum.");
          return current;
        }
        const candidate = allListings.find((listing) => listing.id === listingId);
        const anchor = allListings.find((listing) => listing.id === current[0]);
        if (candidate && anchor && candidate.transaction !== anchor.transaction) {
          showToast(
            `Comparez des biens de même nature : votre comparateur contient déjà des biens à ${
              anchor.transaction === "vente" ? "vendre" : "louer"
            }.`,
          );
          return current;
        }
        showToast("Bien ajouté au comparateur.");
        return [...current, listingId];
      });
    },
    [allListings, showToast],
  );

  const removeFromCompare = useCallback((listingId: string) => {
    setCompareList((current) => current.filter((id) => id !== listingId));
  }, []);

  const toggleCompare = useCallback(
    (listingId: string) => {
      if (compareList.includes(listingId)) {
        removeFromCompare(listingId);
        showToast("Bien retiré du comparateur.");
      } else {
        addToCompare(listingId);
      }
    },
    [addToCompare, compareList, removeFromCompare, showToast],
  );

  const clearCompare = useCallback(() => {
    setCompareList([]);
    setCompareOpen(false);
  }, []);

  const openAuth = useCallback((mode: AuthMode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
  }, []);

  const loginWithEmail = useCallback(
    (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      void api
        .login(normalized, password)
        .then((res) => {
          setApiToken(res.token);
          setUser(res.user);
          setAuthOpen(false);
          showToast(`Ravi de vous revoir, ${res.user.name} !`);
          void hydrateUserSession();
        })
        .catch((err) => {
          const status = (err as { status?: number }).status;
          if (status === 401 || status === 403 || status === 422) {
            showToast((err as Error).message);
            return;
          }
          // Repli localStorage si backend Laravel non démarré
          const found = accounts.find(
            (acc) => acc.email.toLowerCase() === normalized && acc.provider === "email",
          );
          if (!found) {
            showToast("Aucun compte trouvé avec cet e-mail. Créez un compte ou utilisez Gmail.");
            return;
          }
          if (found.password !== password) {
            showToast("Mot de passe incorrect.");
            return;
          }
          const { password: _pw, ...safeUser } = found;
          setUser(safeUser);
          setAuthOpen(false);
          showToast(`Ravi de vous revoir, ${safeUser.name} !`);
        });
      return true;
    },
    [accounts, hydrateUserSession, showToast],
  );

  const registerWithEmail = useCallback(
    (payload: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      accountType: "particulier" | "professionnel";
    }) => {
      const normalized = payload.email.trim().toLowerCase();
      void api
        .register({ ...payload, email: normalized })
        .then((res) => {
          setApiToken(res.token);
          setUser(res.user);
          setAuthOpen(false);
          showToast(`Bienvenue sur IMMO DU LETCH, ${res.user.name} !`);
          void hydrateUserSession();
        })
        .catch((err) => {
          const status = (err as { status?: number }).status;
          if (status === 422) {
            showToast((err as Error).message || "Cet e-mail est déjà utilisé.");
            return;
          }
          const exists = accounts.some((acc) => acc.email.toLowerCase() === normalized);
          if (exists) {
            showToast("Un compte existe déjà avec cet e-mail. Connectez-vous.");
            return;
          }
          const newUser: StoredAccount = {
            id: `usr-${Date.now()}`,
            name: payload.name.trim(),
            email: normalized,
            phone: payload.phone?.trim() || undefined,
            accountType: payload.accountType,
            provider: "email",
            password: payload.password,
            createdAt: Date.now(),
          };
          setAccounts((current) => [...current, newUser]);
          const { password: _pw, ...safeUser } = newUser;
          setUser(safeUser);
          setAuthOpen(false);
          showToast(`Bienvenue sur IMMO DU LETCH, ${safeUser.name} !`);
        });
      return true;
    },
    [accounts, hydrateUserSession, showToast],
  );

  const loginWithGoogle = useCallback(
    (name: string, email: string) => {
      const normalized = email.trim().toLowerCase();
      void api
        .googleLogin(name.trim(), normalized)
        .then((res) => {
          setApiToken(res.token);
          setUser(res.user);
          setAuthOpen(false);
          showToast(`Connecté avec Google (${res.user.email}).`);
          void hydrateUserSession();
        })
        .catch(() => {
          const existing = accounts.find((acc) => acc.email.toLowerCase() === normalized);
          const googleUser: User = existing
            ? {
                id: existing.id,
                name: existing.name,
                email: existing.email,
                phone: existing.phone,
                accountType: existing.accountType,
                provider: "google",
                createdAt: existing.createdAt,
              }
            : {
                id: `google-${Date.now()}`,
                name: name.trim(),
                email: normalized,
                accountType: "particulier",
                provider: "google",
                createdAt: Date.now(),
              };
          if (!existing) {
            setAccounts((current) => [...current, googleUser]);
          }
          setUser(googleUser);
          setAuthOpen(false);
          showToast(`Connecté avec Google (${googleUser.email}).`);
        });
    },
    [accounts, hydrateUserSession, showToast],
  );

  const logout = useCallback(() => {
    if (getApiToken()) {
      void api.logout().catch(() => {});
      setApiToken(null);
    }
    setUser(null);
    showToast("Vous êtes déconnecté.");
  }, [showToast]);

  const updateUserProfile = useCallback(
    (payload: {
      name: string;
      phone?: string;
      accountType: "particulier" | "professionnel";
    }) => {
      if (!user) return;
      const updated: User = {
        ...user,
        name: payload.name.trim(),
        phone: payload.phone?.trim() || undefined,
        accountType: payload.accountType,
      };
      setUser(updated);
      setAccounts((current) =>
        current.map((acc) =>
          acc.id === user.id
            ? {
                ...acc,
                name: updated.name,
                phone: updated.phone,
                accountType: updated.accountType,
              }
            : acc,
        ),
      );
      if (getApiToken()) {
        void api
          .updateProfile(payload)
          .then((res) => setUser(res.user))
          .catch(() => {});
      }
      showToast("Profil mis à jour avec succès.");
    },
    [showToast, user],
  );

  const openDeposit = useCallback(() => {
    if (!user) {
      showToast("Veuillez vous connecter ou créer un compte pour déposer une annonce.");
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }
    setDepositOpen(true);
  }, [showToast, user]);

  const addUserListing = useCallback(
    (payload: Omit<UserListing, "id" | "userId" | "status" | "createdAt">) => {
      if (!user) {
        showToast("Vous devez être connecté pour publier une annonce.");
        return null;
      }
      const optimistic: UserListing = {
        ...payload,
        id: `ul-${Date.now()}`,
        userId: user.id,
        status: "pending",
        sellerName: payload.sellerName ?? user.name,
        sellerPhone: payload.sellerPhone ?? user.phone,
        createdAt: Date.now(),
      };
      if (getApiToken()) {
        void api
          .createListing(payload)
          .then((res) => {
            setUserListings((current) => [
              res.listing,
              ...current.filter((item) => item.id !== optimistic.id),
            ]);
          })
          .catch(() => {
            setUserListings((current) => [optimistic, ...current]);
          });
      } else {
        setUserListings((current) => [optimistic, ...current]);
      }
      showToast("Annonce envoyée ! Elle est en attente de validation par l'administrateur.");
      return optimistic;
    },
    [showToast, user],
  );

  const deleteUserListing = useCallback(
    (id: string) => {
      setUserListings((current) => current.filter((item) => item.id !== id));
      if (getApiToken()) {
        void api.deleteListing(id).catch(() => {});
      }
      showToast("Annonce supprimée.");
    },
    [showToast],
  );

  const moderateUserListing = useCallback(
    (id: string, status: ListingStatus, rejectionReason?: string) => {
      setUserListings((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                rejectionReason: status === "rejected" ? rejectionReason : undefined,
              }
            : item,
        ),
      );
    },
    [],
  );

  const saveCurrentSearch = useCallback(() => {
    const label = describeFilters(filters);
    if (getApiToken()) {
      void api
        .createSavedSearch(label, filters)
        .then((res) => {
          setSavedSearches((current) => [res.savedSearch, ...current].slice(0, 8));
        })
        .catch(() => {
          setSavedSearches((current) =>
            [{ id: `search-${Date.now()}`, label, filters, createdAt: Date.now() }, ...current].slice(
              0,
              8,
            ),
          );
        });
    } else {
      setSavedSearches((current) =>
        [{ id: `search-${Date.now()}`, label, filters, createdAt: Date.now() }, ...current].slice(
          0,
          8,
        ),
      );
    }
    showToast(`Alerte créée : ${label}`);
  }, [filters, showToast]);

  const applySavedSearch = useCallback(
    (search: SavedSearch) => {
      setFilters(search.filters);
      setFavoritesOpen(false);
      navigate("results");
      showToast(`Recherche appliquée : ${search.label}`);
    },
    [navigate, showToast],
  );

  const deleteSavedSearch = useCallback((searchId: string) => {
    setSavedSearches((current) => current.filter((search) => search.id !== searchId));
    if (getApiToken()) {
      void api.deleteSavedSearch(searchId).catch(() => {});
    }
  }, []);

  const results = useMemo(
    () => sortListings(filterListings(allListings, filters), sort),
    [allListings, filters, sort],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      page,
      navigate,
      scrollToSection,
      selectedId,
      selectedListing: allListings.find((item) => item.id === selectedId) ?? allListings[0],
      openListing,
      filters,
      updateFilters,
      resetFilters,
      searchWith,
      browseAll,
      sort,
      setSort,
      viewMode,
      setViewMode,
      allListings,
      results,
      favorites,
      isFavorite,
      toggleFavorite,
      favoritesOpen,
      openFavorites: () => setFavoritesOpen(true),
      closeFavorites: () => setFavoritesOpen(false),
      recentlyViewed,
      addToRecentlyViewed,
      compareList,
      isInCompare,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
      compareOpen,
      openCompare: () => setCompareOpen(true),
      closeCompare: () => setCompareOpen(false),
      depositOpen,
      openDeposit,
      closeDeposit: () => setDepositOpen(false),
      user,
      authOpen,
      authMode,
      openAuth,
      closeAuth,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      updateUserProfile,
      userListings,
      addUserListing,
      deleteUserListing,
      moderateUserListing,
      savedSearches,
      saveCurrentSearch,
      applySavedSearch,
      deleteSavedSearch,
      searchHistory,
      applySearchHistory,
      clearSearchHistory,
      sellerRatings,
      rateSeller,
      getSellerRating,
      language,
      setLanguage,
      toast,
      showToast,
      articles,
      faqs,
      heroSlides,
      platformStats,
      siteSettings,
    }),
    [
      page,
      navigate,
      scrollToSection,
      selectedId,
      openListing,
      filters,
      updateFilters,
      resetFilters,
      searchWith,
      browseAll,
      sort,
      viewMode,
      setViewMode,
      allListings,
      results,
      favorites,
      isFavorite,
      toggleFavorite,
      favoritesOpen,
      recentlyViewed,
      addToRecentlyViewed,
      compareList,
      isInCompare,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
      compareOpen,
      depositOpen,
      openDeposit,
      user,
      authOpen,
      authMode,
      openAuth,
      closeAuth,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      updateUserProfile,
      userListings,
      addUserListing,
      deleteUserListing,
      moderateUserListing,
      savedSearches,
      saveCurrentSearch,
      applySavedSearch,
      deleteSavedSearch,
      searchHistory,
      applySearchHistory,
      clearSearchHistory,
      sellerRatings,
      rateSeller,
      getSellerRating,
      language,
      setLanguage,
      toast,
      showToast,
      articles,
      faqs,
      heroSlides,
      platformStats,
      siteSettings,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp doit être utilisé dans AppProvider");
  return context;
}
