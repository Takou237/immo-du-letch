import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";

export default function MobileFooter() {
  const { searchWith, openDeposit, scrollToSection, navigate, siteSettings } = useApp();
  const t = useT();

  const links: { label: string; onClick: () => void }[] = [
    { label: t.footer.buyProperty, onClick: () => searchWith({ transaction: "vente" }) },
    { label: t.footer.rentHome, onClick: () => searchWith({ transaction: "location" }) },
    { label: t.footer.landForSale, onClick: () => searchWith({ transaction: "vente", type: "terrain" }) },
    { label: t.footer.officesCommerce, onClick: () => searchWith({ transaction: "location", type: "bureau" }) },
    { label: t.footer.postListing, onClick: openDeposit },
    {
      label: t.footer.ourAdvice,
      onClick: () => {
        navigate("home");
        window.setTimeout(() => scrollToSection("conseils"), 60);
      },
    },
  ];

  return (
    <footer className="mt-8 bg-[#071f49] px-4 py-6 text-[#ccd6e5]">
      <p className="text-[18px] font-bold text-white">IMMO DU LETCH</p>
      <p className="mt-0.5 text-[11px] text-[#f3ad19]">{t.footer.tagline}</p>
      <p className="mt-2 text-[12px] leading-relaxed">
        {t.footer.desc1} {t.footer.desc2}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px]">
        {links.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={link.onClick}
            className="cursor-pointer border-0 bg-transparent p-0 text-left text-[#ccd6e5]"
          >
            {link.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-[#f3ad19]">
        {siteSettings?.contactPhone ?? "+237 6 55 00 00 00"} · {siteSettings?.contactEmail ?? "contact@immoduletch.cm"}
      </p>
      <p className="mt-5 text-[10px] text-[#8fa2bd]">© 2026 IMMO DU LETCH · Douala, Cameroun</p>
    </footer>
  );
}
