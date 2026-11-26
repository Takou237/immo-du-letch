import { priceLabel } from "../data/listings";
import { useApp } from "../store/AppStore";
import Modal from "./Modal";
import { CloseIcon, HeartIcon, PinIcon, SearchIcon, TrendDownIcon } from "./icons";

export default function FavoritesPanel() {
  const {
    favoritesOpen,
    closeFavorites,
    favorites,
    allListings,
    toggleFavorite,
    openListing,
    savedSearches,
    applySavedSearch,
    deleteSavedSearch,
    recentlyViewed,
    browseAll,
  } = useApp();

  if (!favoritesOpen) return null;

  const savedListings = favorites
    .map((id) => allListings.find((listing) => listing.id === id))
    .filter((listing): listing is NonNullable<typeof listing> => Boolean(listing));

  const recentListings = recentlyViewed
    .slice(0, 6)
    .map((id) => allListings.find((listing) => listing.id === id))
    .filter((listing): listing is NonNullable<typeof listing> => Boolean(listing));

  return (
    <Modal onClose={closeFavorites} label="Mes favoris et recherches" align="drawer">
      <div className="flex h-full flex-col">
        <div className="border-b border-[#dce2e9] px-6 py-6 pr-16">
          <p className="font-['Inter:Bold'] text-[22px] font-bold text-[#071f49]">Mes favoris</p>
          <p className="mt-1 text-[13px] text-[#637084]">
            {savedListings.length} bien{savedListings.length > 1 ? "s" : ""} enregistré
            {savedListings.length > 1 ? "s" : ""} sur cet appareil.
          </p>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          {savedListings.length === 0 ? (
            <div className="rounded-[8px] border border-dashed border-[#dce2e9] px-5 py-8 text-center">
              <HeartIcon className="mx-auto size-[26px]" />
              <p className="mt-3 font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49]">
                Aucun favori pour le moment
              </p>
              <p className="mt-1 text-[12px] leading-[1.5] text-[#637084]">
                Cliquez sur le cœur d’une annonce pour la retrouver ici.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeFavorites();
                  browseAll();
                }}
                className="mt-4 inline-flex h-[38px] cursor-pointer items-center gap-2 rounded-[6px] bg-[#f3ad19] px-4 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49]"
              >
                <SearchIcon className="size-[16px]" /> Découvrir les annonces
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {savedListings.map((listing) => (
                <li
                  key={listing.id}
                  className="flex gap-3 rounded-[8px] border border-[#dce2e9] p-3 transition-colors hover:border-[#f3ad19]"
                >
                  <button
                    type="button"
                    onClick={() => openListing(listing.id)}
                    className="h-[70px] w-[96px] shrink-0 cursor-pointer overflow-hidden rounded-[5px] border-0 p-0"
                  >
                    <img
                      alt={listing.title}
                      src={listing.image}
                      className="size-full object-cover"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => openListing(listing.id)}
                      className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left font-['Inter:Semi_Bold'] text-[13px] font-semibold leading-[1.35] text-[#071f49]"
                    >
                      {listing.title}
                    </button>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <p className="font-['Inter:Bold'] text-[13px] font-bold text-[#071f49]">
                        {priceLabel(listing)}
                      </p>
                      {listing.priceDropped ? (
                        <span className="inline-flex items-center gap-0.5 rounded-[4px] bg-[#fef2f2] px-1.5 py-0.5 text-[10px] font-semibold text-[#dc2626]">
                          <TrendDownIcon className="size-[10px]" /> Prix baissé
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#637084]">
                      <PinIcon className="size-[12px]" /> {listing.neighborhood}, {listing.city}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Retirer des favoris"
                    onClick={() => toggleFavorite(listing.id)}
                    className="flex size-[26px] shrink-0 cursor-pointer items-center justify-center self-start rounded-full border-0 bg-[#f4f6f8] text-[#637084] transition-colors hover:text-[#e11d48]"
                  >
                    <CloseIcon className="size-[12px]" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 border-t border-[#dce2e9] pt-6">
            <p className="font-['Inter:Bold'] text-[16px] font-bold text-[#071f49]">
              Mes recherches enregistrées
            </p>
            {savedSearches.length === 0 ? (
              <p className="mt-2 text-[12px] leading-[1.5] text-[#637084]">
                Créez une alerte depuis la page de résultats pour retrouver vos critères ici.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {savedSearches.map((search) => (
                  <li
                    key={search.id}
                    className="flex items-center gap-2 rounded-[6px] bg-[#f4f6f8] px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => applySavedSearch(search)}
                      className="flex-1 cursor-pointer border-0 bg-transparent p-0 text-left text-[12px] font-['Inter:Medium'] font-medium text-[#172b45]"
                    >
                      {search.label}
                    </button>
                    <button
                      type="button"
                      aria-label="Supprimer la recherche"
                      onClick={() => deleteSavedSearch(search.id)}
                      className="flex size-[24px] cursor-pointer items-center justify-center rounded-full border-0 bg-white text-[#637084] hover:text-[#e11d48]"
                    >
                      <CloseIcon className="size-[11px]" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {recentListings.length > 0 ? (
            <div className="mt-8 border-t border-[#dce2e9] pt-6">
              <p className="font-['Inter:Bold'] text-[16px] font-bold text-[#071f49]">
                Récemment vus ({recentListings.length})
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {recentListings.map((listing) => (
                  <li key={listing.id}>
                    <button
                      type="button"
                      onClick={() => openListing(listing.id)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-[8px] border border-[#dce2e9] bg-white p-2 text-left transition-colors hover:border-[#f3ad19]"
                    >
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="size-[48px] shrink-0 rounded-[5px] object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-['Inter:Semi_Bold'] text-[12px] font-semibold text-[#071f49]">
                          {listing.title}
                        </p>
                        <p className="font-['Inter:Bold'] text-[12px] font-bold text-[#071f49]">
                          {priceLabel(listing)}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
