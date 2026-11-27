import { useEffect, useState, type FormEvent } from "react";
import ImageUploader from "../components/ImageUploader";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { PinIcon, ShieldIcon } from "../components/icons";
import {
  CITY_OPTIONS,
  FEATURE_OPTIONS,
  TYPE_LABELS,
  TYPE_SINGULAR,
  formatPrice,
  type PropertyType,
  type Transaction,
} from "../data/listings";
import { useT } from "../i18n/translations";
import { useApp, type ListingStatus } from "../store/AppStore";

type ProfileTab = "info" | "deposit" | "listings";

const STATUS_BADGE: Record<ListingStatus, { label: string; bg: string; color: string }> = {
  pending: {
    label: "En attente de validation",
    bg: "#fff6df",
    color: "#996300",
  },
  approved: {
    label: "Validée · Publiée",
    bg: "#e7f6ec",
    color: "#1f7a3d",
  },
  rejected: {
    label: "Refusée",
    bg: "#fef2f2",
    color: "#dc2626",
  },
};

export default function ProfilePage() {
  const {
    user,
    openAuth,
    logout,
    updateUserProfile,
    favorites,
    savedSearches,
    userListings,
    addUserListing,
    deleteUserListing,
    showToast,
    openListing,
  } = useApp();
  const t = useT();

  const [tab, setTab] = useState<ProfileTab>("listings");
  const [statusFilter, setStatusFilter] = useState<"all" | ListingStatus>("all");

  // Formulaire infos profil
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [accountType, setAccountType] = useState<"particulier" | "professionnel">(
    user?.accountType ?? "particulier",
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
      setAccountType(user.accountType);
    }
  }, [user]);

  // Formulaire dépôt d'annonce intégré
  const [transaction, setTransaction] = useState<Transaction>("vente");
  const [type, setType] = useState<PropertyType>("villa");
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("Douala");
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice] = useState("");
  const [surface, setSurface] = useState("");
  const [rooms, setRooms] = useState("4");
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  if (!user) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#f4f6f8]">
        <SiteNav />
        <div className="flex flex-1 items-center justify-center px-[100px] py-[80px]">
          <div className="w-[520px] rounded-[12px] border border-[#dce2e9] bg-white p-10 text-center shadow-sm">
            <ShieldIcon className="mx-auto size-[42px] text-[#071f49]" />
            <h1 className="mt-4 font-['Inter:Bold'] text-[24px] font-bold text-[#071f49]">
              Connectez-vous pour accéder à votre espace
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#637084]">
              Seuls les membres inscrits peuvent gérer leur profil, déposer des annonces et suivre
              leur validation par l'administrateur.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="h-[44px] cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] px-6 font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] hover:bg-[#ffbe33]"
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className="h-[44px] cursor-pointer rounded-[6px] border border-[#dce2e9] bg-white px-6 font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] hover:border-[#071f49]"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const myListings = userListings.filter((item) => item.userId === user.id);
  const filteredListings =
    statusFilter === "all" ? myListings : myListings.filter((item) => item.status === statusFilter);

  const initials = user.name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const handleSaveProfile = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      showToast("Votre nom ne peut pas être vide.");
      return;
    }
    updateUserProfile({ name, phone, accountType });
  };

  const toggleFeature = (feature: string) => {
    setFeatures((current) =>
      current.includes(feature) ? current.filter((f) => f !== feature) : [...current, feature],
    );
  };

  const handleDepositSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!neighborhood.trim() || !price || !surface) {
      showToast("Veuillez renseigner le quartier, le prix et la surface.");
      return;
    }
    const finalTitle =
      title.trim() || `${TYPE_SINGULAR[type]} à ${neighborhood.trim()}, ${city}`;
    addUserListing({
      title: finalTitle,
      transaction,
      type,
      city,
      neighborhood: neighborhood.trim(),
      price: Number(price),
      surface: Number(surface),
      rooms: Number(rooms) || 0,
      features,
      images,
      description:
        description.trim() ||
        `${TYPE_SINGULAR[type]} ${transaction === "location" ? "à louer" : "à vendre"} situé à ${neighborhood.trim()}, ${city}.`,
    });
    setTitle("");
    setNeighborhood("");
    setPrice("");
    setSurface("");
    setFeatures([]);
    setImages([]);
    setDescription("");
    setTab("listings");
    setStatusFilter("all");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f4f6f8]">
      <SiteNav />

      <div className="w-full flex-1 px-[100px] py-[36px]">
        {/* En-tête du profil */}
        <div className="flex items-center justify-between rounded-[10px] border border-[#dce2e9] bg-white p-7">
          <div className="flex items-center gap-5">
            <div
              className={`flex size-[72px] shrink-0 items-center justify-center rounded-full font-['Inter:Bold'] text-[24px] font-bold text-white ${
                user.provider === "google" ? "bg-[#4285F4]" : "bg-[#071f49]"
              }`}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-['Inter:Bold'] text-[24px] font-bold text-[#071f49]">
                  {user.name}
                </h1>
                <span className="rounded-full bg-[#eaf0f8] px-3 py-0.5 text-[11px] font-semibold text-[#071f49]">
                  {user.accountType === "professionnel" ? t.nav.proAccount : t.nav.particulierAccount}
                </span>
                {user.provider === "google" ? (
                  <span className="rounded-full bg-[#eff6ff] px-3 py-0.5 text-[11px] font-semibold text-[#2563eb]">
                    Google / Gmail
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[13px] text-[#637084]">
                {user.email}
                {user.phone ? ` · ${user.phone}` : ""} · {t.profile.memberSince(memberSince)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6 border-r border-[#dce2e9] pr-6 text-center">
              <div>
                <p className="font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
                  {myListings.length}
                </p>
                <p className="text-[11px] text-[#637084]">{t.profile.listingsStat}</p>
              </div>
              <div>
                <p className="font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
                  {favorites.length}
                </p>
                <p className="text-[11px] text-[#637084]">{t.profile.favoritesStat}</p>
              </div>
              <div>
                <p className="font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
                  {savedSearches.length}
                </p>
                <p className="text-[11px] text-[#637084]">{t.profile.alertsStat}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="h-[40px] cursor-pointer rounded-[6px] border border-[#dce2e9] bg-white px-4 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#dc2626] transition-colors hover:border-[#dc2626] hover:bg-[#fef2f2]"
            >
              {t.profile.logout}
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="mt-6 flex items-center gap-3">
          {(
            [
              ["listings", t.profile.tabListings(myListings.length)],
              ["deposit", t.profile.tabDeposit],
              ["info", t.profile.tabInfo],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`h-[44px] cursor-pointer rounded-[8px] border px-5 font-['Inter:Semi_Bold'] text-[14px] font-semibold transition-colors ${
                tab === key
                  ? "border-[#071f49] bg-[#071f49] text-white"
                  : "border-[#dce2e9] bg-white text-[#172b45] hover:border-[#f3ad19]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div className="mt-6">
          {tab === "info" ? (
            <form
              onSubmit={handleSaveProfile}
              className="max-w-[680px] rounded-[10px] border border-[#dce2e9] bg-white p-7"
            >
              <h2 className="font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
                Informations du profil
              </h2>
              <p className="mt-1 text-[13px] text-[#637084]">
                Mettez à jour vos coordonnées pour vos futures annonces et prises de contact.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                    Nom complet ou agence
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] text-[#637084]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                    Téléphone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6 XX XX XX XX"
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <div>
                  <p className="mb-1.5 text-[13px] font-semibold text-[#172b45]">Type de compte</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        ["particulier", "Particulier"],
                        ["professionnel", "Professionnel / Agence"],
                      ] as const
                    ).map(([val, lbl]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAccountType(val)}
                        className={`h-[42px] cursor-pointer rounded-[6px] border text-[13px] font-semibold transition-colors ${
                          accountType === val
                            ? "border-[#071f49] bg-[#071f49] text-white"
                            : "border-[#dce2e9] bg-white text-[#172b45] hover:border-[#f3ad19]"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 h-[44px] cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] px-6 font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] hover:bg-[#ffbe33]"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          ) : null}

          {tab === "deposit" ? (
            <form
              onSubmit={handleDepositSubmit}
              className="rounded-[10px] border border-[#dce2e9] bg-white p-7"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
                    Déposer une nouvelle annonce
                  </h2>
                  <p className="mt-1 text-[13px] text-[#637084]">
                    Toute annonce soumise passe en statut « En attente de validation » avant
                    publication.
                  </p>
                </div>
                <span className="rounded-full bg-[#fff6df] px-3 py-1 text-[11px] font-semibold text-[#996300]">
                  Validation admin requise
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-5">
                <div>
                  <p className="mb-1.5 text-[13px] font-semibold text-[#172b45]">Transaction</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(
                      [
                        ["vente", "Vendre"],
                        ["location", "Louer"],
                      ] as const
                    ).map(([val, lbl]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setTransaction(val)}
                        className={`h-[44px] cursor-pointer rounded-[6px] border text-[13px] font-semibold ${
                          transaction === val
                            ? "border-[#071f49] bg-[#071f49] text-white"
                            : "border-[#dce2e9] bg-white text-[#172b45]"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                    Type de bien
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] bg-white px-3 text-[13px] text-[#172b45]"
                  >
                    {(Object.entries(TYPE_LABELS) as [PropertyType, string][]).map(([val, lbl]) => (
                      <option key={val} value={val}>
                        {lbl}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                    Titre de l'annonce (optionnel)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Villa contemporaine avec piscine à Bonapriso"
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                    Ville *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] bg-white px-3 text-[13px] text-[#172b45]"
                  >
                    {CITY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                    Quartier *
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex: Bonapriso, Bastos, Makepe…"
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                    {transaction === "location" ? "Loyer mensuel (FCFA) *" : "Prix (FCFA) *"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={transaction === "location" ? "350000" : "120000000"}
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                      Surface (m²) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={surface}
                      onChange={(e) => setSurface(e.target.value)}
                      placeholder="180"
                      className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                      Pièces
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <p className="mb-2 text-[13px] font-semibold text-[#172b45]">Équipements</p>
                  <div className="flex flex-wrap gap-2">
                    {FEATURE_OPTIONS.map((f) => {
                      const active = features.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => toggleFeature(f)}
                          className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] font-medium ${
                            active
                              ? "border-[#071f49] bg-[#071f49] text-white"
                              : "border-[#dce2e9] bg-white text-[#172b45] hover:border-[#f3ad19]"
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-2">
                  <ImageUploader images={images} onChange={setImages} />
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#172b45]">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez les atouts de votre bien, les documents disponibles…"
                    className="h-[96px] w-full resize-none rounded-[6px] border border-[#dce2e9] p-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 h-[46px] cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] px-7 font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] hover:bg-[#ffbe33]"
              >
                Soumettre l'annonce pour validation
              </button>
            </form>
          ) : null}

          {tab === "listings" ? (
            <div className="space-y-4">
              {/* Filtres de statut */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(
                    [
                      ["all", `Toutes (${myListings.length})`],
                      [
                        "pending",
                        `En attente de validation (${myListings.filter((l) => l.status === "pending").length})`,
                      ],
                      [
                        "approved",
                        `Validées (${myListings.filter((l) => l.status === "approved").length})`,
                      ],
                      [
                        "rejected",
                        `Refusées (${myListings.filter((l) => l.status === "rejected").length})`,
                      ],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStatusFilter(key)}
                      className={`h-[36px] cursor-pointer rounded-full border px-4 text-[12px] font-semibold transition-colors ${
                        statusFilter === key
                          ? "border-[#071f49] bg-[#071f49] text-white"
                          : "border-[#dce2e9] bg-white text-[#637084] hover:border-[#f3ad19] hover:text-[#071f49]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredListings.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-[#dce2e9] bg-white p-12 text-center">
                  <p className="font-['Inter:Bold'] text-[18px] font-bold text-[#071f49]">
                    Aucune annonce dans cette catégorie
                  </p>
                  <p className="mt-1 text-[13px] text-[#637084]">
                    Déposez votre premier bien pour le soumettre à la validation de
                    l'administrateur.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("deposit")}
                    className="mt-5 h-[42px] cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49]"
                  >
                    + Déposer une annonce
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredListings.map((item) => {
                    const badge = STATUS_BADGE[item.status];
                    return (
                      <div
                        key={item.id}
                        className="rounded-[10px] border border-[#dce2e9] bg-white p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="h-[88px] w-[116px] shrink-0 rounded-[8px] border border-[#dce2e9] object-cover"
                              />
                            ) : null}
                            <div>
                              <div className="flex items-center gap-2.5">
                                <span
                                  style={{ backgroundColor: badge.bg, color: badge.color }}
                                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
                                >
                                  {badge.label}
                                </span>
                                <span className="text-[12px] text-[#637084]">
                                  {TYPE_SINGULAR[item.type]} ·{" "}
                                  {item.transaction === "location" ? "Location" : "Vente"}
                                </span>
                                <span className="text-[12px] text-[#8a95a5]">
                                  · Déposée le{" "}
                                  {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                                </span>
                              </div>

                              <h3 className="mt-2 font-['Inter:Bold'] text-[18px] font-bold text-[#071f49]">
                                {item.title}
                              </h3>
                              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#637084]">
                                <PinIcon className="size-[14px]" /> {item.neighborhood}, {item.city}{" "}
                                · {item.surface} m² · {item.rooms} pièces
                              </p>
                              <p className="mt-2 font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
                                {formatPrice(item.price)} FCFA
                                {item.transaction === "location" ? " / mois" : ""}
                              </p>

                              {item.status === "pending" ? (
                                <p className="mt-2 text-[12px] text-[#637084]">
                                  En attente de validation par un administrateur avant publication.
                                </p>
                              ) : null}

                              {item.status === "rejected" && item.rejectionReason ? (
                                <p className="mt-2 rounded-[6px] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#dc2626]">
                                  <strong>Motif du refus :</strong> {item.rejectionReason}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {item.status === "approved" ? (
                              <button
                                type="button"
                                onClick={() => openListing(item.id)}
                                className="cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] px-3 py-1.5 text-[12px] font-semibold text-[#071f49] hover:bg-[#ffbe33]"
                              >
                                Voir la fiche publiée
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => deleteUserListing(item.id)}
                              className="cursor-pointer rounded-[6px] border border-[#dce2e9] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#637084] hover:border-[#dc2626] hover:text-[#dc2626]"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
