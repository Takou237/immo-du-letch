import { useEffect, useMemo, useState, type FormEvent } from "react";
import FinancingCalculator from "../components/FinancingCalculator";
import Lightbox from "../components/Lightbox";
import ListingTile from "../components/ListingTile";
import PriceScale from "../components/PriceScale";
import SellerProfileModal from "../components/SellerProfileModal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import {
  ArrowIcon,
  CheckIcon,
  EyeIcon,
  GridIcon,
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
  MARKET_AVERAGE,
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

export default function FicheDeBienVillaABonapriso() {
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
  }, [listing.id, listing.title, listing.reference, user]);

  const gallery = listing.gallery.length > 0 ? listing.gallery : [listing.image];
  const favorite = isFavorite(listing.id);
  const comparing = isInCompare(listing.id);
  const perM2 = marketPricePerM2(listing);
  const cityAvg = MARKET_AVERAGE[listing.city];
  const phoneNumber = listing.sellerPhone ?? "+237 6 55 00 00 00";
  const simulatedFavoritesCount = Math.max(3, Math.round(listing.views * 0.12));

  const published = (() => {
    const [year, month, day] = listing.publishedAt.split("-");
    return `${day}/${month}/${year}`;
  })();

  const activeNav =
    listing.transaction === "location"
      ? "location"
      : listing.type === "terrain"
        ? "terrain"
        : "vente";
  const breadcrumb = `${t.detail.backToResults}   /   ${
    listing.transaction === "location" ? t.detail.rent : t.detail.buy
  }   /   ${listing.city}   /   ${listing.neighborhood}`;

  const storyTitle =
    listing.type === "terrain"
      ? t.detail.storyLand
      : listing.type === "bureau"
        ? t.detail.storyOffice
        : t.detail.storyDefault;

  const characteristics: [string, string][] = [
    [t.detail.charLabels.type, t.typesSingular[listing.type]],
    [t.detail.charLabels.transaction, listing.transaction === "vente" ? t.detail.buy : t.detail.rent],
    [
      listing.type === "terrain"
        ? t.detail.charLabels.landSurface
        : listing.type === "bureau"
          ? t.detail.charLabels.usableSurface
          : t.detail.charLabels.livingSurface,
      `${formatPrice(listing.surface)} m²`,
    ],
    [t.detail.charLabels.land, listing.land ? `${formatPrice(listing.land)} m²` : t.detail.charLabels.notApplicable],
    [
      t.detail.charLabels.roomsBedrooms,
      listing.rooms ? `${listing.rooms} / ${listing.bedrooms}` : "—",
    ],
    [t.detail.charLabels.bathrooms, listing.bathrooms ? String(listing.bathrooms) : "—"],
    [t.detail.charLabels.parking, listing.parking ? t.detail.charLabels.parkingCount(listing.parking) : t.detail.charLabels.notSpecified],
    [t.detail.charLabels.condition, t.conditions[listing.condition]],
  ];

  if (listing.type === "terrain") {
    characteristics[3] = [
      t.detail.charLabels.pricePerM2,
      `${formatPrice(Math.round(listing.price / listing.surface))} FCFA`,
    ];
  }
  if (listing.yearBuilt) {
    characteristics.push([t.detail.charLabels.yearBuilt, String(listing.yearBuilt)]);
  }
  if (listing.floor !== undefined && listing.totalFloors !== undefined) {
    characteristics.push([t.detail.charLabels.floor, t.detail.charLabels.floorVal(listing.floor, listing.totalFloors)]);
  }

  const stat1 = {
    value: `${formatPrice(listing.surface)} m²`,
    label:
      listing.type === "terrain"
        ? "Superficie"
        : listing.type === "bureau"
          ? "Surface utile"
          : "Surface habitable",
  };
  const stat2 =
    listing.type === "terrain"
      ? {
          value: `${listing.documents.length} document${listing.documents.length > 1 ? "s" : ""}`,
          label: "Documents annoncés",
        }
      : listing.type === "bureau"
        ? { value: `${listing.rooms} espaces`, label: "Climatisés" }
        : { value: `${listing.rooms} pièces`, label: `Dont ${listing.bedrooms} chambres` };
  const stat3 =
    listing.type === "terrain"
      ? {
          value: `${formatPrice(Math.round(listing.price / listing.surface))} FCFA`,
          label: "Prix au m²",
        }
      : listing.land
        ? { value: `${formatPrice(listing.land)} m²`, label: "Surface du terrain" }
        : {
            value: `${listing.parking} place${listing.parking > 1 ? "s" : ""}`,
            label: "Stationnement",
          };
  const stat4 = {
    value: listing.transaction === "vente" ? "À vendre" : "À louer",
    label: TYPE_LABELS[listing.type],
  };

  const similar = useMemo(() => {
    const sameCity = allListings.filter(
      (item) =>
        item.id !== listing.id &&
        item.city === listing.city &&
        item.transaction === listing.transaction,
    );
    const rest = allListings.filter(
      (item) => item.id !== listing.id && !sameCity.includes(item),
    );
    return [...sameCity, ...rest].slice(0, 4);
  }, [allListings, listing.id, listing.city, listing.transaction]);

  const docsText = listing.documents.length
    ? `Documents annoncés : ${listing.documents.join(", ")}. Demandez une copie et faites vérifier leur authenticité ainsi que la situation du bien auprès des services compétents. Les caractéristiques et documents présentés restent à confirmer lors de la visite.`
    : "Aucun document n'est annoncé pour ce bien. Demandez à l'annonceur de préciser la situation et faites vérifier les documents auprès des services compétents avant tout engagement.";

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

  return (
    <div
      className="bg-white content-stretch flex flex-col items-start relative size-full"
      data-name="Fiche de bien"
    >
      <SiteNav active={activeNav} />

      {/* En-tête + Galerie */}
      <div
        className="h-[680px] overflow-clip relative shrink-0 w-full"
        data-name="Présentation du bien"
      >
        <button
          type="button"
          aria-label="Retour aux résultats"
          onClick={() => navigate("results")}
          className="absolute left-[100px] top-[24px] flex size-[18px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#637084] transition-colors hover:text-[#071f49]"
        >
          <ArrowIcon className="size-[18px] rotate-180" />
        </button>
        <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[128px] text-[#637084] text-[12px] top-[23px] whitespace-pre">
          {breadcrumb}
        </p>

        <div className="absolute right-[100px] top-[22px] flex items-center gap-4 text-[12px] text-[#637084]">
          <span className="inline-flex items-center gap-1.5">
            <EyeIcon className="size-[15px]" /> {t.detail.viewsCount(listing.views)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HeartIcon className="size-[14px]" filled /> {t.detail.favoritesCount(simulatedFavoritesCount)}
          </span>
        </div>

        <p className="absolute font-['Inter:Bold'] font-bold leading-[1.3] left-[100px] text-[#071f49] text-[34px] top-[64px] w-[980px]">
          {listing.title}
        </p>

        <span className="absolute left-[100px] top-[126px] size-[18px] text-[#637084]">
          <PinIcon className="size-full" />
        </span>
        <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[128px] text-[#637084] text-[14px] top-[123px] whitespace-nowrap">
          {listing.neighborhood}, {listing.city} · {listing.region}
        </p>
        <p className="absolute font-['Inter:Medium'] font-medium leading-[1.45] left-[940px] text-[#637084] text-[12px] top-[125px] whitespace-nowrap">
          Réf. {listing.reference} · Publié le {published}
        </p>

        <button
          type="button"
          aria-label={comparing ? "Retirer du comparateur" : "Comparer ce bien"}
          onClick={() => toggleCompare(listing.id)}
          className={`absolute left-[1182px] top-[118px] flex h-[32px] cursor-pointer items-center gap-1.5 rounded-[6px] border px-3 text-[12px] font-semibold transition-colors ${
            comparing
              ? "border-[#f3ad19] bg-[#f3ad19] text-[#071f49]"
              : "border-[#dce2e9] bg-white text-[#071f49] hover:border-[#f3ad19]"
          }`}
        >
          <ScaleIcon className="size-[15px]" />
          {comparing ? t.detail.compared : t.detail.compare}
        </button>

        <button
          type="button"
          aria-label="Partager l'annonce"
          onClick={handleShare}
          className="absolute left-[1284px] top-[123px] flex size-[22px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#637084] transition-colors hover:text-[#071f49]"
        >
          <ShareIcon className="size-[22px]" />
        </button>
        <button
          type="button"
          aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={() => toggleFavorite(listing.id)}
          className="absolute left-[1318px] top-[123px] flex size-[22px] cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        >
          <HeartIcon className="size-[22px]" filled={favorite} />
        </button>

        <button
          type="button"
          aria-label="Agrandir la photo principale"
          onClick={() => openLightbox(0)}
          className="absolute h-[422px] left-[100px] cursor-pointer overflow-clip rounded-[7px] top-[172px] w-[820px] border-0 bg-transparent p-0"
        >
          <img
            alt={listing.title}
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[7px] size-full transition-transform duration-300 hover:scale-[1.01]"
            src={gallery[0]}
          />
        </button>
        <button
          type="button"
          aria-label="Agrandir la photo 2"
          onClick={() => openLightbox(1)}
          className="absolute h-[204px] left-[934px] cursor-pointer overflow-clip rounded-[7px] top-[172px] w-[406px] border-0 bg-transparent p-0"
        >
          <img
            alt={`${listing.title} — photo 2`}
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[7px] size-full transition-transform duration-300 hover:scale-[1.02]"
            src={gallery[1] ?? gallery[0]}
          />
        </button>
        <button
          type="button"
          aria-label="Agrandir la photo 3"
          onClick={() => openLightbox(Math.min(2, gallery.length - 1))}
          className="absolute h-[204px] left-[934px] cursor-pointer overflow-clip rounded-[7px] top-[390px] w-[406px] border-0 bg-transparent p-0"
        >
          <img
            alt={`${listing.title} — photo 3`}
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[7px] size-full transition-transform duration-300 hover:scale-[1.02]"
            src={gallery[2] ?? gallery[0]}
          />
        </button>

        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="absolute flex h-[48px] w-[205px] cursor-pointer items-center justify-center gap-[9px] overflow-clip rounded-[6px] border border-[#dce2e9] border-solid bg-white left-[1115px] top-[529px] transition-colors hover:border-[#f3ad19]"
        >
          <GridIcon className="size-[20px] text-[#071f49]" />
          <span className="font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49]">
            {t.detail.seePhotos(gallery.length)}
          </span>
        </button>

        {[
          { left: 100, value: stat1.value, label: stat1.label },
          { left: 416, value: stat2.value, label: stat2.label },
          { left: 732, value: stat3.value, label: stat3.label },
          { left: 1048, value: stat4.value, label: stat4.label },
        ].map((stat) => (
          <div key={stat.label}>
            <p
              style={{ left: stat.left }}
              className="absolute font-['Inter:Bold'] font-bold leading-[1.45] text-[#071f49] text-[22px] top-[615px] whitespace-nowrap"
            >
              {stat.value}
            </p>
            <p
              style={{ left: stat.left }}
              className="absolute font-['Inter:Regular'] font-normal leading-[1.45] text-[#637084] text-[12px] top-[650px] whitespace-nowrap"
            >
              {stat.label}
            </p>
          </div>
        ))}
        {[375, 691, 1007].map((left) => (
          <div
            key={left}
            style={{ left }}
            className="absolute bg-[#dce2e9] h-[46px] top-[618px] w-px"
          />
        ))}
      </div>

      {/* Corps Détails + Sidebar Contact */}
      <div
        className="w-full shrink-0 bg-[#f4f6f8] px-[100px] py-[40px]"
        data-name="Détails et contact"
      >
        <div className="flex items-start gap-[46px]">
          {/* Colonne gauche */}
          <div className="min-w-0 flex-1 space-y-8">
            <div>
              <h2 className="font-['Inter:Bold'] text-[24px] font-bold text-[#071f49]">
                {storyTitle}
              </h2>
              <p className="mt-4 font-['Inter:Regular'] text-[15px] leading-[1.6] text-[#172b45]">
                {listing.description}
              </p>
              <p className="mt-4 font-['Inter:Regular'] text-[15px] leading-[1.6] text-[#172b45]">
                {listing.description2}
              </p>
            </div>

            {/* Ce bien en chiffres + PriceScale */}
            {perM2 && cityAvg ? (
              <div>
                <h3 className="mb-3 font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
                  {t.detail.priceAnalysis}
                </h3>
                <PriceScale listing={listing} />
              </div>
            ) : null}

            {/* Caractéristiques */}
            <div>
              <h3 className="font-['Inter:Bold'] text-[22px] font-bold text-[#071f49]">
                {t.detail.characteristics}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-x-8">
                {characteristics.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-[#dce2e9] py-3"
                  >
                    <span className="text-[13px] text-[#637084]">{label}</span>
                    <span className="font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Équipements */}
            <div>
              <h3 className="font-['Inter:Bold'] text-[22px] font-bold text-[#071f49]">
                Les petits plus au quotidien
              </h3>
              {listing.features.length === 0 ? (
                <p className="mt-3 text-[14px] text-[#637084]">
                  Aucun équipement n'est renseigné pour ce bien.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-3 gap-y-3 gap-x-6">
                  {listing.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <CheckIcon className="size-[18px] shrink-0 text-[#1f7a3d]" />
                      <span className="font-['Inter:Medium'] text-[14px] font-medium text-[#172b45]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Simulateur de financement (si vente) */}
            {listing.transaction === "vente" ? (
              <FinancingCalculator price={listing.price} />
            ) : null}

            {/* Documents */}
            <div className="flex gap-4 rounded-[8px] bg-[#fff6df] p-5">
              <ShieldIcon className="size-[28px] shrink-0 text-[#071f49]" />
              <div>
                <p className="font-['Inter:Semi_Bold'] text-[17px] font-semibold text-[#071f49]">
                  Les bons réflexes avant de vous engager
                </p>
                <p className="mt-2 text-[13px] leading-[1.55] text-[#65502a]">{docsText}</p>
              </div>
            </div>

            {/* Localisation */}
            <div className="flex items-center justify-between rounded-[8px] border border-[#dce2e9] bg-white p-5">
              <div className="flex items-start gap-3">
                <PinIcon className="mt-0.5 size-[22px] shrink-0 text-[#071f49]" />
                <div>
                  <p className="font-['Inter:Bold'] text-[18px] font-bold text-[#071f49]">
                    {listing.neighborhood}, {listing.city} · Région du {listing.region}
                  </p>
                  <p className="mt-1 text-[13px] text-[#637084]">
                    L'adresse exacte est communiquée par l'annonceur lors de la prise de
                    rendez-vous.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar droite (Prix + Contact) */}
          <div className="w-[394px] shrink-0 space-y-5">
            <form
              onSubmit={handleSubmit}
              className="rounded-[8px] border border-[#dce2e9] bg-white p-6"
              data-name="Prix et contact annonceur"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-['Inter:Bold'] text-[11px] font-bold uppercase text-[#637084]">
                  {TYPE_SINGULAR[listing.type]} à{" "}
                  {listing.transaction === "vente" ? "vendre" : "louer"}
                </p>
                <PriceScale listing={listing} compact />
              </div>

              <div className="mt-2 flex flex-wrap items-baseline gap-2.5">
                <p className="font-['Inter:Bold'] text-[28px] font-bold text-[#071f49]">
                  {priceLabel(listing)}
                </p>
                {listing.priceDropped && listing.originalPrice ? (
                  <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#fef2f2] px-2 py-0.5 text-[11px] font-semibold text-[#dc2626]">
                    <TrendDownIcon className="size-[12px]" />{" "}
                    <span className="line-through">
                      {formatPrice(listing.originalPrice)} FCFA
                    </span>
                  </span>
                ) : null}
              </div>

              <p className="mt-1 text-[11px] text-[#637084]">
                {listing.transaction === "location"
                  ? "Loyer mensuel · Charges à préciser avec l'annonceur"
                  : "Prix de vente · Frais à préciser avec l'annonceur"}
              </p>
              <p className="mt-1 text-[10px] text-[#637084]">
                {perM2 ? `${formatPrice(perM2)} FCFA / m² · ` : ""}Réf. {listing.reference} ·
                Publié le {published}
              </p>

              <div className="my-5 h-px w-full bg-[#dce2e9]" />

              {/* Interlocuteur */}
              <p className="font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49]">
                Votre interlocuteur
              </p>
              <div className="mt-3 flex items-center gap-3.5">
                {listing.seller === "IMMO DU LETCH" ? (
                  <div className="flex h-[56px] w-[82px] shrink-0 items-center justify-center rounded-[6px] border border-[#dce2e9] bg-white p-1.5">
                    <img
                      alt="IMMO DU LETCH"
                      className="size-full object-contain"
                      src="/assets/aab40.png"
                    />
                  </div>
                ) : (
                  <div className="flex size-[56px] shrink-0 items-center justify-center rounded-full bg-[#eef2f7] font-['Inter:Bold'] text-[18px] font-bold text-[#071f49]">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-['Inter:Bold'] text-[15px] font-bold text-[#071f49]">
                    {listing.seller}
                  </p>
                  <p className="text-[12px] text-[#a26b00] font-semibold">
                    {renderStars(listing.sellerRating)} {formatRating(listing.sellerRating)} (
                    {listing.sellerReviews} avis)
                  </p>
                  <button
                    type="button"
                    onClick={() => setSellerModalOpen(true)}
                    className="mt-0.5 cursor-pointer border-0 bg-transparent p-0 text-[11px] font-semibold text-[#071f49] underline hover:text-[#a26b00]"
                  >
                    Voir le profil et ses annonces
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePhone}
                className="mt-4 flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-[#dce2e9] bg-white font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] transition-colors hover:border-[#f3ad19]"
              >
                <PhoneIcon className="size-[18px]" />
                {phoneVisible ? phoneNumber : "Afficher le numéro"}
              </button>

              <p className="mt-5 font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49]">
                {t.detail.requestVisit}
              </p>

              <div className="mt-3 space-y-3">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1 block font-['Inter:Medium'] text-[12px] font-medium text-[#172b45]"
                  >
                    {t.detail.yourName}
                  </label>
                  <input
                    id="contact-name"
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder={t.detail.namePlaceholder}
                    className="h-[44px] w-full rounded-[5px] border border-[#dce2e9] bg-white px-3 text-[12px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1 block font-['Inter:Medium'] text-[12px] font-medium text-[#172b45]"
                  >
                    {t.detail.yourEmail}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="exemple@adresse.com"
                    className="h-[44px] w-full rounded-[5px] border border-[#dce2e9] bg-white px-3 text-[12px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1 block font-['Inter:Medium'] text-[12px] font-medium text-[#172b45]"
                  >
                    {t.detail.yourMessage}
                  </label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, message: event.target.value }))
                    }
                    className="h-[88px] w-full resize-none rounded-[5px] border border-[#dce2e9] bg-white p-3 text-[12px] leading-[1.45] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border-0 bg-[#f3ad19] font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] transition-colors hover:bg-[#ffbe33]"
                >
                  <MailIcon className="size-[18px]" />
                  {t.detail.sendMessage}
                </button>
              </div>

              <p className="mt-3 text-[10px] leading-[1.45] text-[#637084]">
                Vos coordonnées sont transmises à l'annonceur pour lui permettre de répondre à votre
                demande.
              </p>
            </form>

            <div className="rounded-[8px] bg-[#e9eff7] p-5">
              <div className="flex items-center gap-3">
                <ShieldIcon className="size-[24px] shrink-0 text-[#071f49]" />
                <p className="font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49]">
                  La prudence fait partie du projet.
                </p>
              </div>
              <p className="mt-3 text-[12px] leading-[1.5] text-[#637084]">
                Visitez le bien et faites contrôler les documents avant tout paiement. Ne
                communiquez jamais vos codes bancaires à un annonceur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Biens similaires (4 biens) */}
      <div className="w-full px-[100px] py-[44px]" data-name="Biens similaires">
        <p className="font-['Inter:Bold'] text-[28px] font-bold text-[#071f49]">
          D'autres biens à découvrir à {listing.city}
        </p>
        <p className="mt-1 text-[15px] text-[#637084]">
          Continuez à explorer les possibilités pour votre projet.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-[20px]">
          {similar.slice(0, 3).map((item) => (
            <div key={item.id} className="relative h-[428px]">
              <ListingTile listing={item} left={0} top={0} />
            </div>
          ))}
        </div>
        {similar[3] ? (
          <div className="mt-5 flex items-center justify-between rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] p-4">
            <div className="flex items-center gap-4">
              <img
                src={similar[3].image}
                alt={similar[3].title}
                className="h-[64px] w-[96px] rounded-[6px] object-cover"
              />
              <div>
                <p className="font-['Inter:Bold'] text-[15px] font-bold text-[#071f49]">
                  {similar[3].title} — {similar[3].neighborhood}, {similar[3].city}
                </p>
                <p className="text-[13px] text-[#637084]">
                  {priceLabel(similar[3])} · {similar[3].surface} m²
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openListing(similar[3].id)}
              className="h-[40px] cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] hover:bg-[#ffbe33]"
            >
              Voir ce bien
            </button>
          </div>
        ) : null}
      </div>

      <SiteFooter />

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
