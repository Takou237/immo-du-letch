import { useApp } from "../store/AppStore";

export default function MobileFooter() {
  const { searchWith, openDeposit, scrollToSection, navigate } = useApp();

  const links: { label: string; onClick: () => void }[] = [
    { label: "Acheter un bien", onClick: () => searchWith({ transaction: "vente" }) },
    { label: "Louer un logement", onClick: () => searchWith({ transaction: "location" }) },
    { label: "Terrains à vendre", onClick: () => searchWith({ transaction: "vente", type: "terrain" }) },
    { label: "Bureaux & commerces", onClick: () => searchWith({ transaction: "location", type: "bureau" }) },
    { label: "Déposer une annonce", onClick: openDeposit },
    {
      label: "Nos conseils",
      onClick: () => {
        navigate("home");
        window.setTimeout(() => scrollToSection("conseils"), 60);
      },
    },
  ];

  return (
    <footer className="mt-8 bg-[#071f49] px-4 py-6 text-[#ccd6e5]">
      <p className="text-[18px] font-bold text-white">IMMO DU LETCH</p>
      <p className="mt-0.5 text-[11px] text-[#f3ad19]">Votre partenaire immobilier</p>
      <p className="mt-2 text-[12px] leading-relaxed">
        Acheter, louer et investir au Cameroun. À chaque projet, une nouvelle adresse.
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
      <p className="mt-5 text-[10px] text-[#8fa2bd]">© 2026 IMMO DU LETCH · Douala, Cameroun</p>
    </footer>
  );
}
