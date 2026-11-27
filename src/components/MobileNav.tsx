import { useState } from "react";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";
import { ChevronIcon, CloseIcon, HeartIcon, MenuIcon } from "./icons";

export default function MobileNav() {
  const {
    navigate,
    searchWith,
    favorites,
    openFavorites,
    openDeposit,
    user,
    openAuth,
    logout,
    scrollToSection,
    language,
    setLanguage,
  } = useApp();
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user
    ? user.name
        .split(/\s+/)
        .map((word) => word[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const close = () => setMenuOpen(false);

  const links: { label: string; onClick: () => void }[] = [
    { label: t.nav.buy, onClick: () => searchWith({ transaction: "vente" }) },
    { label: t.nav.rent, onClick: () => searchWith({ transaction: "location" }) },
    { label: t.nav.land, onClick: () => searchWith({ transaction: "vente", type: "terrain" }) },
    { label: t.nav.offices, onClick: () => searchWith({ transaction: "location", type: "bureau" }) },
    { label: t.nav.furnished, onClick: () => searchWith({ transaction: "location", features: ["Meublé"] }) },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce2e9] bg-white">
      <div className="flex h-[58px] items-center gap-1.5 px-3">
        <button
          type="button"
          aria-label="Accueil IMMO DU LETCH"
          onClick={() => navigate("home")}
          className="mr-auto cursor-pointer border-0 bg-transparent p-1"
        >
          <img
            src="/assets/aab40.png"
            alt="IMMO DU LETCH"
            className="h-[32px] w-auto object-contain"
          />
        </button>

        <button
          type="button"
          onClick={openFavorites}
          aria-label="Ouvrir mes favoris"
          className="relative flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-white text-[#071f49]"
        >
          <HeartIcon className="size-[18px]" filled={favorites.length > 0} />
          {favorites.length > 0 ? (
            <span className="absolute -right-1 -top-1 flex size-[17px] items-center justify-center rounded-full bg-[#f3ad19] text-[10px] font-bold text-[#071f49]">
              {favorites.length}
            </span>
          ) : null}
        </button>

        {user ? (
          <button
            type="button"
            onClick={() => navigate("profile")}
            aria-label="Mon profil"
            className="flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-[#f8fafc] text-[11px] font-bold text-white"
          >
            <span
              className={`flex size-[27px] items-center justify-center rounded-full ${
                user.provider === "google" ? "bg-[#4285F4]" : "bg-[#071f49]"
              }`}
            >
              {initials}
            </span>
          </button>
        ) : (
            <button
            type="button"
            onClick={() => openAuth("login")}
            className="h-[38px] cursor-pointer rounded-full border border-[#dce2e9] bg-white px-3 text-[12px] font-semibold text-[#071f49]"
          >
            {t.nav.loginShort}
          </button>
        )}

        <button
          type="button"
          onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
          aria-label="Changer de langue"
          className="flex h-[38px] cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-[#f8fafc] px-2.5 text-[11px] font-bold uppercase text-[#071f49]"
        >
          {language}
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-white text-[#071f49]"
        >
          <MenuIcon className="size-[18px]" />
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={close}
            className="absolute inset-0 cursor-pointer border-0 bg-[#071f49]/45"
          />
          <div className="animate-fade-in absolute inset-x-0 top-0 max-h-[92dvh] overflow-y-auto rounded-b-[16px] bg-white p-4 shadow-[0_24px_60px_rgb(7_31_73/28%)]">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold text-[#071f49]">Menu</p>
              <button
                type="button"
                onClick={close}
                aria-label="Fermer"
                className="flex size-[34px] cursor-pointer items-center justify-center rounded-full border border-[#dce2e9] bg-white text-[#637084]"
              >
                <CloseIcon className="size-[13px]" />
              </button>
            </div>

            <nav className="mt-3 flex flex-col">
              {links.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    close();
                    link.onClick();
                  }}
                  className="flex cursor-pointer items-center justify-between border-b border-[#eef2f6] py-3 text-left text-[14px] font-medium text-[#172b45]"
                >
                  {link.label}
                  <ChevronIcon className="size-[14px] text-[#8a95a5]" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  close();
                  navigate("home");
                  window.setTimeout(() => scrollToSection("conseils"), 60);
                }}
                className="flex cursor-pointer items-center justify-between border-b border-[#eef2f6] py-3 text-left text-[14px] font-medium text-[#172b45]"
              >
                {t.nav.ourAdvice}
                <ChevronIcon className="size-[14px] text-[#8a95a5]" />
              </button>
            </nav>

            <button
              type="button"
              onClick={() => {
                close();
                openDeposit();
              }}
              className="mt-4 h-[44px] w-full cursor-pointer rounded-[8px] border-0 bg-[#f3ad19] text-[14px] font-semibold text-[#071f49]"
            >
              {t.nav.postListing}
            </button>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  close();
                  openFavorites();
                }}
                className="h-[40px] flex-1 cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white text-[12px] font-semibold text-[#071f49]"
              >
                {t.nav.favorites}
              </button>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      navigate("profile");
                    }}
                    className="h-[40px] flex-1 cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white text-[12px] font-semibold text-[#071f49]"
                  >
                    {t.nav.myProfile.split(" ")[0]}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      logout();
                    }}
                    className="h-[40px] cursor-pointer rounded-[8px] border border-[#fecdd3] bg-white px-3 text-[12px] font-semibold text-[#dc2626]"
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    close();
                    openAuth("login");
                  }}
                  className="h-[40px] flex-1 cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white text-[12px] font-semibold text-[#071f49]"
                >
                  {t.nav.signIn}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
