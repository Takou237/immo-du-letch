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
import {
  DEFAULT_FILTERS,
  LISTINGS,
  describeFilters,
  filterListings,
  sortListings,
  type Filters,
  type Listing,
  type PropertyType,
  type SortKey,
} from "../data/listings";

export type Page = "home" | "results" | "detail" | "profile";
export type ViewMode = "list" | "grid";
export type AuthMode = "login" | "register";
export type ListingStatus = "pending" | "approved" | "rejected";

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
  const image = USER_LISTING_IMAGES[item.type];
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
    gallery: [image],
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
  toast: string | null;
  showToast: (message: string) => void;
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
  const allListings = useMemo(() => {
    const approved = userListings
      .filter((item) => item.status === "approved")
      .map((item) => toPublicListing(item, accounts.find((acc) => acc.id === item.userId)));
    return [...approved, ...LISTINGS];
  }, [accounts, userListings]);
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
    writeStored("immo:recent", recentlyViewed);
  }, [recentlyViewed]);

  useEffect(() => {
    writeStored("immo:compare", compareList);
  }, [compareList]);

  useEffect(() => {
    writeStored("immo:viewmode", viewMode);
  }, [viewMode]);

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
      setFilters({ ...DEFAULT_FILTERS, ...partial });
      setSort("pertinence");
      navigate("results");
    },
    [navigate],
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
      const found = accounts.find(
        (acc) => acc.email.toLowerCase() === normalized && acc.provider === "email",
      );
      if (!found) {
        showToast("Aucun compte trouvé avec cet e-mail. Créez un compte ou utilisez Gmail.");
        return false;
      }
      if (found.password !== password) {
        showToast("Mot de passe incorrect.");
        return false;
      }
      const { password: _pw, ...safeUser } = found;
      setUser(safeUser);
      setAuthOpen(false);
      showToast(`Ravi de vous revoir, ${safeUser.name} !`);
      return true;
    },
    [accounts, showToast],
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
      const exists = accounts.some((acc) => acc.email.toLowerCase() === normalized);
      if (exists) {
        showToast("Un compte existe déjà avec cet e-mail. Connectez-vous.");
        return false;
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
      return true;
    },
    [accounts, showToast],
  );

  const loginWithGoogle = useCallback(
    (name: string, email: string) => {
      const normalized = email.trim().toLowerCase();
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
    },
    [accounts, showToast],
  );

  const logout = useCallback(() => {
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
      const created: UserListing = {
        ...payload,
        id: `ul-${Date.now()}`,
        userId: user.id,
        status: "pending",
        sellerName: payload.sellerName ?? user.name,
        sellerPhone: payload.sellerPhone ?? user.phone,
        createdAt: Date.now(),
      };
      setUserListings((current) => [created, ...current]);
      showToast("Annonce envoyée ! Elle est en attente de validation par l'administrateur.");
      return created;
    },
    [showToast, user],
  );

  const deleteUserListing = useCallback(
    (id: string) => {
      setUserListings((current) => current.filter((item) => item.id !== id));
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
    setSavedSearches((current) =>
      [{ id: `search-${Date.now()}`, label, filters, createdAt: Date.now() }, ...current].slice(
        0,
        8,
      ),
    );
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
      toast,
      showToast,
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
      toast,
      showToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp doit être utilisé dans AppProvider");
  return context;
}
