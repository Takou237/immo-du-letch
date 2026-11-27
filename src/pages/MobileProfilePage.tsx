import { useEffect, useState, type FormEvent } from "react";
import ImageUploader from "../components/ImageUploader";
import MobileFooter from "../components/MobileFooter";
import MobileNav from "../components/MobileNav";
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

type ProfileTab = "listings" | "deposit" | "info";

const STATUS_BADGE: Record<ListingStatus, { label: string; bg: string; color: string }> = {
  pending: { label: "En attente", bg: "#fff6df", color: "#996300" },
  approved: { label: "Publiée", bg: "#e7f6ec", color: "#1f7a3d" },
  rejected: { label: "Refusée", bg: "#fef2f2", color: "#dc2626" },
};

export default function MobileProfilePage() {
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

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [accountType, setAccountType] = useState<"particulier" | "professionnel">(
    user?.accountType ?? "particulier",
  );

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

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
      setAccountType(user.accountType);
    }
  }, [user]);

  const fieldClass =
    "mt-1 h-[44px] w-full rounded-[7px] border border-[#dce2e9] bg-white px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]";
  const labelClass = "block text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]";

  if (!user) {
    return (
      <div className="min-h-dvh bg-[#f4f6f8] font-['Inter:Regular'] text-[#071f49]">
        <MobileNav />
        <div className="px-4 py-8">
          <div className="rounded-[12px] border border-[#dce2e9] bg-white p-6 text-center">
            <ShieldIcon className="mx-auto size-[38px] text-[#071f49]" />
            <h1 className="mt-3 text-[19px] font-bold leading-snug text-[#071f49]">
              Connectez-vous pour accéder à votre espace
            </h1>
            <p className="mt-2 text-[12px] leading-relaxed text-[#637084]">
              Seuls les membres inscrits peuvent gérer leur profil, déposer des annonces et suivre
              leur validation.
            </p>
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="mt-4 h-[44px] w-full cursor-pointer rounded-[8px] border-0 bg-[#f3ad19] text-[14px] font-semibold text-[#071f49]"
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => openAuth("register")}
              className="mt-2 h-[44px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white text-[14px] font-semibold text-[#071f49]"
            >
              Créer un compte
            </button>
          </div>
        </div>
        <MobileFooter />
      </div>
    );
  }

  const myListings = userListings.filter((item) => item.userId === user.id);
  const filteredListings =
    statusFilter === "all" ? myListings : myListings.filter((item) => item.status === statusFilter);

  const initials = user.name
    .split(/\s+/)
    .map((word) => word[0])
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
      current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature],
    );
  };

  const handleDepositSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!neighborhood.trim() || !price || !surface) {
      showToast("Veuillez renseigner le quartier, le prix et la surface.");
      return;
    }
    const finalTitle = title.trim() || `${TYPE_SINGULAR[type]} à ${neighborhood.trim()}, ${city}`;
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
    <div className="min-h-dvh bg-[#f4f6f8] font-['Inter:Regular'] text-[#071f49]">
      <MobileNav />

      {/* En-tête profil */}
      <div className="px-4 pt-4">
        <div className="rounded-[12px] border border-[#dce2e9] bg-white p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-[52px] shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white ${
                user.provider === "google" ? "bg-[#4285F4]" : "bg-[#071f49]"
              }`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-[17px] font-bold text-[#071f49]">{user.name}</h1>
              <p className="truncate text-[11px] text-[#637084]">{user.email}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                <span className="rounded-full bg-[#eaf0f8] px-2 py-0.5 text-[9px] font-semibold text-[#071f49]">
                  {user.accountType === "professionnel" ? t.nav.proAccount : t.nav.particulierAccount}
                </span>
                {user.provider === "google" ? (
                  <span className="rounded-full bg-[#eff6ff] px-2 py-0.5 text-[9px] font-semibold text-[#2563eb]">
                    Google / Gmail
                  </span>
                ) : null}
                <span className="rounded-full bg-[#f4f6f8] px-2 py-0.5 text-[9px] text-[#637084]">
                  {t.profile.memberSince(memberSince)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#eef2f6] pt-3 text-center">
            <div>
              <p className="text-[16px] font-bold text-[#071f49]">{myListings.length}</p>
              <p className="text-[10px] text-[#637084]">{t.profile.listingsStat}</p>
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#071f49]">{favorites.length}</p>
              <p className="text-[10px] text-[#637084]">{t.profile.favoritesStat}</p>
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#071f49]">{savedSearches.length}</p>
              <p className="text-[10px] text-[#637084]">{t.profile.alertsStat}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-3 h-[38px] w-full cursor-pointer rounded-[8px] border border-[#fecdd3] bg-white text-[12px] font-semibold text-[#dc2626]"
          >
            {t.profile.logout}
          </button>
        </div>

        {/* Onglets */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto">
          {(
            [
              ["listings", t.profile.tabListings(myListings.length)],
              ["deposit", t.profile.tabDepositShort],
              ["info", t.profile.tabInfoShort],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`h-[38px] shrink-0 cursor-pointer rounded-[8px] border px-3 text-[12px] font-semibold ${
                tab === key
                  ? "border-[#071f49] bg-[#071f49] text-white"
                  : "border-[#dce2e9] bg-white text-[#172b45]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 px-4">
        {/* Mes annonces */}
        {tab === "listings" ? (
          <div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {(
                [
                  ["all", `Toutes (${myListings.length})`],
                  ["pending", `En attente (${myListings.filter((l) => l.status === "pending").length})`],
                  ["approved", `Validées (${myListings.filter((l) => l.status === "approved").length})`],
                  ["rejected", `Refusées (${myListings.filter((l) => l.status === "rejected").length})`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`h-[32px] shrink-0 cursor-pointer rounded-full border px-3 text-[11px] font-semibold ${
                    statusFilter === key
                      ? "border-[#071f49] bg-[#071f49] text-white"
                      : "border-[#dce2e9] bg-white text-[#637084]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {filteredListings.length === 0 ? (
              <div className="mt-3 rounded-[12px] border border-dashed border-[#dce2e9] bg-white px-4 py-8 text-center">
                <p className="text-[14px] font-bold text-[#071f49]">Aucune annonce ici</p>
                <p className="mt-1 text-[12px] text-[#637084]">
                  Déposez votre premier bien pour le soumettre à la validation.
                </p>
                <button
                  type="button"
                  onClick={() => setTab("deposit")}
                  className="mt-3 h-[40px] cursor-pointer rounded-[8px] border-0 bg-[#f3ad19] px-4 text-[12px] font-semibold text-[#071f49]"
                >
                  Déposer une annonce
                </button>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                {filteredListings.map((item) => {
                  const badge = STATUS_BADGE[item.status];
                  return (
                    <div
                      key={item.id}
                      className="rounded-[12px] border border-[#dce2e9] bg-white p-3.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          style={{ backgroundColor: badge.bg, color: badge.color }}
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                        >
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-[#8a95a5]">
                          {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>

                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="mt-2 h-[120px] w-full rounded-[8px] border border-[#dce2e9] object-cover"
                        />
                      ) : null}

                      <h3 className="mt-1.5 text-[14px] font-bold leading-snug text-[#071f49]">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#637084]">
                        <PinIcon className="size-[11px]" /> {item.neighborhood}, {item.city} ·{" "}
                        {item.surface} m² · {item.rooms} pièces
                      </p>
                      <p className="mt-1 text-[14px] font-bold text-[#071f49]">
                        {formatPrice(item.price)} FCFA
                        {item.transaction === "location" ? " / mois" : ""}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#8a95a5]">
                        {TYPE_SINGULAR[item.type]} ·{" "}
                        {item.transaction === "location" ? "Location" : "Vente"}
                      </p>

                      {item.status === "pending" ? (
                        <p className="mt-2 text-[11px] text-[#637084]">
                          En attente de validation par un administrateur.
                        </p>
                      ) : null}

                      {item.status === "rejected" && item.rejectionReason ? (
                        <p className="mt-2 rounded-[6px] bg-[#fef2f2] px-2.5 py-1.5 text-[11px] text-[#dc2626]">
                          <strong>Motif :</strong> {item.rejectionReason}
                        </p>
                      ) : null}

                      <div className="mt-2.5 flex gap-1.5">
                        {item.status === "approved" ? (
                          <button
                            type="button"
                            onClick={() => openListing(item.id)}
                            className="h-[34px] flex-1 cursor-pointer rounded-[7px] border-0 bg-[#f3ad19] text-[11px] font-semibold text-[#071f49]"
                          >
                            Voir la fiche
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => deleteUserListing(item.id)}
                          className="h-[34px] flex-1 cursor-pointer rounded-[7px] border border-[#dce2e9] bg-white text-[11px] font-semibold text-[#637084]"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        {/* Dépôt d'annonce */}
        {tab === "deposit" ? (
          <form
            onSubmit={handleDepositSubmit}
            className="rounded-[12px] border border-[#dce2e9] bg-white p-3.5"
          >
            <h2 className="text-[15px] font-bold text-[#071f49]">Déposer une annonce</h2>
            <p className="mt-0.5 text-[11px] text-[#637084]">
              Votre annonce sera soumise à validation avant publication.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="block">
                <span className={labelClass}>Transaction</span>
                <select
                  value={transaction}
                  onChange={(event) => setTransaction(event.target.value as Transaction)}
                  className={fieldClass}
                >
                  <option value="vente">Vente</option>
                  <option value="location">Location</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Type de bien</span>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value as PropertyType)}
                  className={fieldClass}
                >
                  {(Object.keys(TYPE_SINGULAR) as PropertyType[]).map((item) => (
                    <option key={item} value={item}>
                      {TYPE_SINGULAR[item]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-2.5 block">
              <span className={labelClass}>Titre (facultatif)</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex. Villa 4 chambres avec jardin"
                className={fieldClass}
              />
            </label>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <label className="block">
                <span className={labelClass}>Ville</span>
                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className={fieldClass}
                >
                  {CITY_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Quartier</span>
                <input
                  value={neighborhood}
                  onChange={(event) => setNeighborhood(event.target.value)}
                  placeholder="Ex. Bonapriso"
                  className={fieldClass}
                />
              </label>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2">
              <label className="block">
                <span className={labelClass}>Prix</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="FCFA"
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Surface</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={surface}
                  onChange={(event) => setSurface(event.target.value)}
                  placeholder="m²"
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Pièces</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={rooms}
                  onChange={(event) => setRooms(event.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>

            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-[#8a95a5]">
              Équipements
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {FEATURE_OPTIONS.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                    features.includes(feature)
                      ? "border-[#f3ad19] bg-[#fff7e6] text-[#071f49]"
                      : "border-[#dce2e9] bg-white text-[#637084]"
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <ImageUploader images={images} onChange={setImages} compact />
            </div>

            <label className="mt-3 block">
              <span className={labelClass}>Description (facultatif)</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Décrivez les atouts du bien, les documents disponibles…"
                className="mt-1 h-[88px] w-full resize-none rounded-[7px] border border-[#dce2e9] p-2.5 text-[13px] outline-none focus:border-[#f3ad19]"
              />
            </label>

            <button
              type="submit"
              className="mt-3 h-[44px] w-full cursor-pointer rounded-[8px] border-0 bg-[#f3ad19] text-[13px] font-semibold text-[#071f49]"
            >
              Soumettre pour validation
            </button>
          </form>
        ) : null}

        {/* Informations du profil */}
        {tab === "info" ? (
          <form
            onSubmit={handleSaveProfile}
            className="rounded-[12px] border border-[#dce2e9] bg-white p-3.5"
          >
            <h2 className="text-[15px] font-bold text-[#071f49]">Informations du profil</h2>
            <p className="mt-0.5 text-[11px] text-[#637084]">
              Ces coordonnées servent à vos annonces et prises de contact.
            </p>

            <label className="mt-3 block">
              <span className={labelClass}>Nom complet</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="mt-2.5 block">
              <span className={labelClass}>Téléphone</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+237 …"
                className={fieldClass}
              />
            </label>
            <label className="mt-2.5 block">
              <span className={labelClass}>Type de compte</span>
              <select
                value={accountType}
                onChange={(event) =>
                  setAccountType(event.target.value as "particulier" | "professionnel")
                }
                className={fieldClass}
              >
                <option value="particulier">Particulier</option>
                <option value="professionnel">Professionnel</option>
              </select>
            </label>
            <p className="mt-2 text-[11px] text-[#637084]">E-mail : {user.email}</p>

            <button
              type="submit"
              className="mt-3 h-[44px] w-full cursor-pointer rounded-[8px] border-0 bg-[#f3ad19] text-[13px] font-semibold text-[#071f49]"
            >
              Enregistrer
            </button>
          </form>
        ) : null}
      </div>

      <MobileFooter />
    </div>
  );
}
