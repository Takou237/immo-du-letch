import { useState } from "react";
import { formatRating, priceLabel, renderStars, type Listing } from "../data/listings";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";
import Modal from "./Modal";
import { PhoneIcon, PinIcon, ShieldIcon } from "./icons";

type Props = {
  listing: Listing;
  onClose: () => void;
};

export default function SellerProfileModal({ listing, onClose }: Props) {
  const { openListing, showToast, allListings, getSellerRating, rateSeller } = useApp();
  const t = useT();
  const [hoverRating, setHoverRating] = useState(0);
  const sellerRating = getSellerRating(
    listing.seller,
    listing.sellerRating,
    listing.sellerReviews,
  );
  const otherListings = allListings.filter(
    (item) => item.seller === listing.seller && item.id !== listing.id,
  );

  const initials = listing.seller
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Modal
      onClose={onClose}
      label={`Profil de ${listing.seller}`}
      panelClassName="w-[620px] max-w-[94vw]"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 pr-10">
          {listing.seller === "IMMO DU LETCH" ? (
            <div className="flex h-[68px] w-[96px] shrink-0 items-center justify-center rounded-[8px] border border-[#dce2e9] bg-white p-2">
              <img
                src="/assets/aab40.png"
                alt={listing.seller}
                className="size-full object-contain"
              />
            </div>
          ) : (
            <div className="flex size-[68px] shrink-0 items-center justify-center rounded-full bg-[#eef2f7] font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
                {listing.seller}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f6ec] px-2.5 py-0.5 text-[11px] font-semibold text-[#1f7a3d]">
                <ShieldIcon className="size-[12px]" />
                {listing.sellerType === "professionnel"
                  ? t.seller.certifiedPro
                  : t.seller.verifiedIndiv}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[13px]">
              <span className="font-semibold text-[#a26b00]">
                {renderStars(sellerRating.rating)} {formatRating(sellerRating.rating)}/5
              </span>
              <span className="text-[#637084]">{t.seller.reviews(sellerRating.reviews)}</span>
              {listing.sellerSince ? (
                <span className="text-[#637084]">{t.seller.memberSince(listing.sellerSince)}</span>
              ) : null}
            </div>
          </div>
        </div>

        {listing.sellerDescription ? (
          <p className="mt-4 rounded-[8px] bg-[#f8fafc] p-4 text-[13px] leading-[1.6] text-[#4a5a70]">
            {listing.sellerDescription}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          {listing.sellerPhone ? (
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(listing.sellerPhone!.replace(/\s/g, ""));
                  showToast(`Numéro copié : ${listing.sellerPhone}`);
                } catch {
                  showToast(`Téléphone : ${listing.sellerPhone}`);
                }
              }}
              className="inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-[6px] border border-[#dce2e9] bg-white px-4 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] hover:border-[#f3ad19]"
            >
              <PhoneIcon className="size-[16px]" />
              {listing.sellerPhone}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              onClose();
              document.getElementById("contact-name")?.focus();
            }}
            className="inline-flex h-[42px] cursor-pointer items-center rounded-[6px] border-0 bg-[#f3ad19] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] hover:bg-[#ffbe33]"
          >
            {t.seller.contactAdvertiser}
          </button>
        </div>

        <div className="mt-4 rounded-[8px] border border-[#dce2e9] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-['Inter:Bold'] text-[13px] font-bold text-[#071f49]">
              Noter cet annonceur
            </p>
            {sellerRating.userRating ? (
              <span className="text-[11px] font-semibold text-[#1f7a3d]">
                Votre note : {sellerRating.userRating}/5
              </span>
            ) : (
              <span className="text-[11px] text-[#637084]">Cliquez sur une étoile</span>
            )}
          </div>
          <div
            className="mt-2 flex items-center gap-1"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((value) => {
              const active = (hoverRating || sellerRating.userRating || 0) >= value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`Donner ${value} étoile${value > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHoverRating(value)}
                  onClick={() => rateSeller(listing.seller, value)}
                  className="cursor-pointer border-0 bg-transparent p-0 text-[26px] leading-none transition-transform hover:scale-110"
                  style={{ color: active ? "#f3ad19" : "#dce2e9" }}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-[#dce2e9] pt-5">
          <p className="font-['Inter:Bold'] text-[15px] font-bold text-[#071f49]">
            {t.seller.otherListings(listing.seller, otherListings.length)}
          </p>
          {otherListings.length === 0 ? (
            <p className="mt-2 text-[12px] text-[#637084]">
              {t.seller.noOtherListings}
            </p>
          ) : (
            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {otherListings.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openListing(item.id);
                    }}
                    className="flex w-full cursor-pointer gap-2.5 rounded-[8px] border border-[#dce2e9] bg-white p-2.5 text-left transition-colors hover:border-[#f3ad19]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="size-[56px] shrink-0 rounded-[5px] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-['Inter:Semi_Bold'] text-[12px] font-semibold text-[#071f49]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-['Inter:Bold'] text-[12px] font-bold text-[#071f49]">
                        {priceLabel(item)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#637084]">
                        <PinIcon className="size-[11px]" /> {item.neighborhood}, {item.city}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
