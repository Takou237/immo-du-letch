import { useEffect, useMemo, useState, type FormEvent } from "react";
import FinancingCalculator from "../components/FinancingCalculator";
import Lightbox from "../components/Lightbox";
import MobileFooter from "../components/MobileFooter";
import MobileListingCard from "../components/MobileListingCard";
import MobileNav from "../components/MobileNav";
import PriceScale from "../components/PriceScale";
import SellerProfileModal from "../components/SellerProfileModal";
import {
  ArrowIcon,
  CheckIcon,
  EyeIcon,
  HeartIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  ScaleIcon,
  ShareIcon,
  ShieldIcon,
  TrendDownIcon,
} from "../components/icons";
import {
  CONDITION_LABELS,
  TYPE_LABELS,
  TYPE_SINGULAR,
  formatPrice,
  formatRating,
  marketPricePerM2,
  priceLabel,
  renderStars,
} from "../data/listings";
import { api, getApiToken } from "../api/client";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";

export default function MobileDetailPage() {
  const {
    selectedListing: listing,
    navigate,
    isFavorite,
    toggleFavorite,
    isInCompare,
    toggleCompare,
    showToast,
    openListing,
    allListings,
    user,
  } = useApp();
  const t = useT();

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      message: `Bonjour, je souhaite visiter « ${listing.title} » (réf. ${listing.reference}). Merci de me recontacter.`,
    });
    setPhoneVisible(false);
    setLightbox(null);
    setSellerModalOpen(false);
    window.scrollTo({ top: 0 });
  }, [listing.id, listing.title, listing.reference, user]);

  const gallery = listing.gallery.length > 0 ? listing.gallery : [listing.image];
  const favorite = isFavorite(listing.id);
  const comparing = isInCompare(listing.id);
  const perM2 = marketPricePerM2(listing);
  const phoneNumber = listing.sellerPhone ?? "+237 6 55 00 00 00";
  const published = (() => {
    const [year, month, day] = listing.publishedAt.split("-");
    return `${day}/${month}/${year}`;
  })();

  const characteristics: [string, string][] = [
    ["Type de bien", TYPE_SINGULAR[listing.type]],
    ["Transaction", listing.transaction === "vente" ? "Vente" : "Location"],
    [
      listing.type === "terrain"
        ? "Surface du terrain"
        : listing.type === "bureau"
          ? "Surface utile"
          : "Surface habitable",
      `${formatPrice(listing.surface)} m²`,
    ],
    ["Terrain", listing.land ? `${formatPrice(listing.land)} m²` : "Non applicable"],
    ["Pièces / chambres", listing.rooms ? `${listing.rooms} / ${listing.bedrooms}` : "—"],
    ["Salles de bains", listing.bathrooms ? String(listing.bathrooms) : "—"],
    ["Stationnement", listing.parking ? `${listing.parking} places` : "Non renseigné"],
    ["État du bien", CONDITION_LABELS[listing.condition]],
  ];
  if (listing.yearBuilt) characteristics.push(["Année de construction", String(listing.yearBuilt)]);
  if (listing.floor !== undefined && listing.totalFloors !== undefined) {
    characteristics.push(["Étage", `${listing.floor}e sur ${listing.totalFloors}`]);
  }

  const stats =
    listing.type === "terrain"
      ? [
          { value: `${formatPrice(listing.surface)} m²`, label: "Superficie" },
          {
            value: `${listing.documents.length} document${listing.documents.length > 1 ? "s" : ""}`,
            label: "Documents annoncés",
          },
          {
            value: `${formatPrice(Math.round(listing.price / listing.surface))} FCFA`,
            label: "Prix au m²",
          },
          {
            value: listing.transaction === "vente" ? "À vendre" : "À louer",
            label: TYPE_LABELS[listing.type],
          },
        ]
      : [
          { value: `${formatPrice(listing.surface)} m²`, label: "Surface habitable" },
          { value: `${listing.rooms} pièces`, label: `Dont ${listing.bedrooms} chambres` },
          listing.land
            ? { value: `${formatPrice(listing.land)} m²`, label: "Surface du terrain" }
            : {
                value: `${listing.parking} place${listing.parking > 1 ? "s" : ""}`,
                label: "Stationnement",
              },
          {
            value: listing.transaction === "vente" ? "À vendre" : "À louer",
            label: TYPE_LABELS[listing.type],
          },
        ];

  const similar = useMemo(() => {
    const sameCity = allListings.filter(
      (item) =>
        item.id !== listing.id &&
        item.city === listing.city &&
        item.transaction === listing.transaction,
    );
    const rest = allListings.filter((item) => item.id !== listing.id && !sameCity.includes(item));
    return [...sameCity, ...rest].slice(0, 3);
  }, [allListings, listing.city, listing.id, listing.transaction]);

  const docsText = listing.documents.length
    ? `Documents annoncés : ${listing.documents.join(", ")}. Demandez une copie et faites vérifier leur authenticité et la situation du bien auprès des services compétents.`
    : "Aucun document n'est annoncé pour ce bien. Demandez à l'annonceur de préciser la situation et faites vérifier les documents avant tout engagement.";

  const initials = listing.seller
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#detail/${listing.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Lien de l'annonce copié.");
    } catch {
      showToast("Copiez le lien depuis la barre d'adresse.");
    }
  };

  const handlePhone = async () => {
    if (!phoneVisible) {
      setPhoneVisible(true);
      showToast("Numéro affiché (démonstration).");
      return;
    }
    try {
      await navigator.clipboard.writeText(phoneNumber.replace(/\s/g, ""));
      showToast("Numéro copié.");
    } catch {
      showToast(`Numéro : ${phoneNumber}`);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!form.name.trim() || !emailOk || !form.message.trim()) {
      showToast("Veuillez renseigner votre nom, un e-mail valide et un message.");
      return;
    }
    if (getApiToken()) {
      try {
        await api.sendInquiry(listing.id, {
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        });
        showToast(`Message envoyé à ${listing.seller}.`);
      } catch {
        showToast(`Message envoyé à ${listing.seller} (hors ligne).`);
      }
    } else {
      showToast(`Message envoyé à ${listing.seller} (démonstration).`);
    }
    setForm((current) => ({ ...current, name: "", email: "" }));
  };

  const openLightbox = (index: number) => {
    setLightbox(((index % gallery.length) + gallery.length) % gallery.length);
  };

  const fieldClass =
    "mt-1 h-[44px] w-full rounded-[7px] border border-[#dce2e9] bg-white px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]";

  return (
    <div className="min-h-dvh bg-white font-['Inter:Regular'] text-[#071f49]">
      <MobileNav />

      <div className="px-4 pt-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate("results")}
            className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[12px] font-semibold text-[#637084]"
          >
            <ArrowIcon className="size-[14px] rotate-180" /> {t.detail.backToResults}
          </button>
          <span className="text-[10px] text-[#8a95a5]">Réf. {listing.reference}</span>
        </div>

        {/* Galerie */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => openLightbox(0)}
            aria-label="Agrandir la photo principale"
            className="block h-[210px] w-full cursor-pointer overflow-hidden rounded-[10px] border-0 bg-[#eef2f6] p-0"
          >
            <img src={gallery[0]} alt={listing.title} className="size-full object-cover" />
          </button>

          <div className="mt-2 flex gap-2 overflow-x-auto">
            {gallery.slice(1, 5).map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => openLightbox(index + 1)}
                aria-label={`Agrandir la photo ${index + 2}`}
                className="h-[62px] w-[86px] shrink-0 cursor-pointer overflow-hidden rounded-[7px] border-0 bg-[#eef2f6] p-0"
              >
                <img src={image} alt="" className="size-full object-cover" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="flex h-[62px] shrink-0 cursor-pointer items-center justify-center rounded-[7px] border border-[#dce2e9] bg-white px-3 text-[11px] font-semibold text-[#071f49]"
            >
              {gallery.length} photo{gallery.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-[4px] bg-[#eaf0f8] px-2 py-0.5 text-[10px] font-semibold text-[#071f49]">
            {listing.transaction === "vente" ? "À vendre" : "À louer"}
          </span>
          <span className="rounded-[4px] bg-[#f4f6f8] px-2 py-0.5 text-[10px] font-semibold text-[#637084]">
            {TYPE_LABELS[listing.type]}
          </span>
          {listing.isNew ? (
            <span className="rounded-[4px] bg-[#e7f6ec] px-2 py-0.5 text-[10px] font-semibold text-[#1f7a3d]">
              Nouveau
            </span>
          ) : null}
        </div>

        <h1 className="mt-2 text-[21px] font-bold leading-snug text-[#071f49]">{listing.title}</h1>
        <p className="mt-1 flex items-center gap-1 text-[12px] text-[#637084]">
          <PinIcon className="size-[13px] shrink-0" /> {listing.neighborhood}, {listing.city} ·{" "}
          {listing.region}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8a95a5]">
          <span className="inline-flex items-center gap-1">
            <EyeIcon className="size-[12px]" /> {listing.views} vues
          </span>
          <span>Publié le {published}</span>
        </p>
      </div>

      {/* Prix + actions */}
      <div className="mx-4 mt-3 rounded-[10px] border border-[#dce2e9] bg-white p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#637084]">
              {TYPE_SINGULAR[listing.type]} à {listing.transaction === "vente" ? "vendre" : "louer"}
            </p>
            <p className="mt-1 flex flex-wrap items-baseline gap-2 text-[22px] font-bold text-[#071f49]">
              {priceLabel(listing)}
              {listing.priceDropped && listing.originalPrice ? (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#fef2f2] px-1.5 py-0.5 text-[10px] font-semibold text-[#dc2626]">
                  <TrendDownIcon className="size-[10px]" />
                  <span className="line-through">{formatPrice(listing.originalPrice)} FCFA</span>
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 text-[10px] text-[#637084]">
              {perM2 ? `${formatPrice(perM2)} FCFA / m² · ` : ""}
              {listing.transaction === "location"
                ? "Loyer mensuel, charges à préciser"
                : "Frais à préciser avec l'annonceur"}
            </p>
          </div>
          <PriceScale listing={listing} compact />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(listing.id)}
            className={`flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border text-[11px] font-semibold ${
              favorite
                ? "border-[#f3ad19] bg-[#fff7e6] text-[#071f49]"
                : "border-[#dce2e9] bg-white text-[#071f49]"
            }`}
          >
            <HeartIcon className="size-[14px]" filled={favorite} />
            {favorite ? "Enregistré" : "Favori"}
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(listing.id)}
            className={`flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border text-[11px] font-semibold ${
              comparing
                ? "border-[#f3ad19] bg-[#f3ad19] text-[#071f49]"
                : "border-[#dce2e9] bg-white text-[#071f49]"
            }`}
          >
            <ScaleIcon className="size-[14px]" />
            {comparing ? "Comparé" : "Comparer"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border border-[#dce2e9] bg-white text-[11px] font-semibold text-[#071f49]"
          >
            <ShareIcon className="size-[14px]" />
            Partager
          </button>
        </div>
      </div>

      {/* En chiffres */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[10px] border border-[#dce2e9] bg-[#f8fafc] px-3 py-2.5"
          >
            <p className="text-[15px] font-bold text-[#071f49]">{stat.value}</p>
            <p className="text-[10px] text-[#637084]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-6 px-4">
        {/* Description */}
        <section>
          <h2 className="text-[16px] font-bold text-[#071f49]">Le bien en détail</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-[#172b45]">{listing.description}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#172b45]">{listing.description2}</p>
        </section>

        {/* Analyse du prix */}
        {perM2 ? (
          <section>
            <h2 className="text-[16px] font-bold text-[#071f49]">Analyse du prix</h2>
            <div className="mt-2">
              <PriceScale listing={listing} />
            </div>
          </section>
        ) : null}

        {/* Caractéristiques */}
        <section>
          <h2 className="text-[16px] font-bold text-[#071f49]">Les caractéristiques</h2>
          <div className="mt-2 rounded-[10px] border border-[#dce2e9] bg-white px-3">
            {characteristics.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 border-b border-[#eef2f6] py-2.5 last:border-0"
              >
                <span className="text-[12px] text-[#637084]">{label}</span>
                <span className="text-right text-[12px] font-semibold text-[#172b45]">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Équipements */}
        <section>
          <h2 className="text-[16px] font-bold text-[#071f49]">Les petits plus au quotidien</h2>
          {listing.features.length === 0 ? (
            <p className="mt-2 text-[12px] text-[#637084]">
              Aucun équipement n'est renseigné pour ce bien.
            </p>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {listing.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 rounded-[8px] border border-[#dce2e9] bg-white px-2.5 py-2"
                >
                  <CheckIcon className="size-[15px] shrink-0 text-[#1f7a3d]" />
                  <span className="text-[12px] font-medium text-[#172b45]">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Financement */}
        {listing.transaction === "vente" ? (
          <section>
            <FinancingCalculator price={listing.price} />
          </section>
        ) : null}

        {/* Bons réflexes */}
        <section className="flex gap-3 rounded-[10px] bg-[#fff6df] p-3.5">
          <ShieldIcon className="mt-0.5 size-[22px] shrink-0 text-[#071f49]" />
          <div>
            <p className="text-[13px] font-semibold text-[#071f49]">
              Les bons réflexes avant de vous engager
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#65502a]">{docsText}</p>
          </div>
        </section>

        {/* Localisation */}
        <section className="rounded-[10px] border border-[#dce2e9] bg-white p-3.5">
          <div className="flex items-start gap-2.5">
            <PinIcon className="mt-0.5 size-[18px] shrink-0 text-[#071f49]" />
            <div>
              <p className="text-[13px] font-bold text-[#071f49]">
                {listing.neighborhood}, {listing.city} · Région du {listing.region}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#637084]">
                L'adresse exacte est communiquée par l'annonceur lors de la prise de rendez-vous.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-[10px] border border-[#dce2e9] bg-white p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#637084]">
            Votre interlocuteur
          </p>
          <div className="mt-2 flex items-center gap-3">
            {listing.seller === "IMMO DU LETCH" ? (
              <div className="flex h-[46px] w-[66px] shrink-0 items-center justify-center rounded-[6px] border border-[#dce2e9] bg-white p-1.5">
                <img src="/assets/aab40.png" alt="IMMO DU LETCH" className="size-full object-contain" />
              </div>
            ) : (
              <div className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-[#eef2f7] text-[15px] font-bold text-[#071f49]">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-[#071f49]">{listing.seller}</p>
              <p className="text-[11px] font-semibold text-[#a26b00]">
                {renderStars(listing.sellerRating)} {formatRating(listing.sellerRating)} (
                {listing.sellerReviews} avis)
              </p>
              <button
                type="button"
                onClick={() => setSellerModalOpen(true)}
                className="mt-0.5 cursor-pointer border-0 bg-transparent p-0 text-[11px] font-semibold text-[#071f49] underline"
              >
                Voir ses annonces
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePhone}
            className="mt-3 flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-[7px] border border-[#dce2e9] bg-white text-[13px] font-semibold text-[#071f49]"
          >
            <PhoneIcon className="size-[16px]" />
            {phoneVisible ? phoneNumber : "Afficher le numéro"}
          </button>

          <p className="mt-4 text-[13px] font-semibold text-[#071f49]">
            {t.detail.requestVisit}
          </p>
          <form onSubmit={handleSubmit} className="mt-2">
            <label htmlFor="m-contact-name" className="block text-[11px] font-medium text-[#172b45]">
              Votre nom
              <input
                id="m-contact-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Nom et prénom"
                className={fieldClass}
              />
            </label>
            <label
              htmlFor="m-contact-email"
              className="mt-2.5 block text-[11px] font-medium text-[#172b45]"
            >
              Votre e-mail
              <input
                id="m-contact-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="exemple@adresse.com"
                className={fieldClass}
              />
            </label>
            <label
              htmlFor="m-contact-message"
              className="mt-2.5 block text-[11px] font-medium text-[#172b45]"
            >
              Votre message
              <textarea
                id="m-contact-message"
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({ ...current, message: event.target.value }))
                }
                className="mt-1 h-[86px] w-full resize-none rounded-[7px] border border-[#dce2e9] bg-white p-2.5 text-[13px] leading-snug text-[#172b45] outline-none focus:border-[#f3ad19]"
              />
            </label>
            <button
              type="submit"
              className="mt-3 flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-[7px] border-0 bg-[#f3ad19] text-[13px] font-semibold text-[#071f49]"
            >
              <MailIcon className="size-[16px]" /> {t.detail.sendMessage}
            </button>
            <p className="mt-2 text-[10px] leading-relaxed text-[#637084]">
              Vos coordonnées sont transmises à l'annonceur pour répondre à votre demande.
            </p>
          </form>
        </section>

        <section className="rounded-[10px] bg-[#e9eff7] p-3.5">
          <p className="flex items-center gap-2 text-[12px] font-semibold text-[#071f49]">
            <ShieldIcon className="size-[18px] text-[#071f49]" /> La prudence fait partie du projet.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#637084]">
            Visitez le bien et faites contrôler les documents avant tout paiement. Ne communiquez
            jamais vos codes bancaires à un annonceur.
          </p>
        </section>
      </div>

      {/* Biens similaires */}
      <section className="px-4 pt-6">
        <h2 className="text-[16px] font-bold text-[#071f49]">
          D'autres biens à découvrir à {listing.city}
        </h2>
        <div className="mt-2 flex flex-col gap-2">
          {similar.map((item) => (
            <MobileListingCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      <MobileFooter />

      {lightbox !== null ? (
        <Lightbox
          images={gallery}
          index={lightbox}
          title={listing.title}
          onChange={openLightbox}
          onClose={() => setLightbox(null)}
        />
      ) : null}

      {sellerModalOpen ? (
        <SellerProfileModal listing={listing} onClose={() => setSellerModalOpen(false)} />
      ) : null}
    </div>
  );
}
