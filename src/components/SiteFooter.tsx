import { useApp } from "../store/AppStore";

type FooterLinkProps = {
  left: number;
  top: number;
  children: string;
  onClick: () => void;
};

function FooterLink({ left, top, children, onClick }: FooterLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ left, top }}
      className="absolute cursor-pointer border-0 bg-transparent p-0 text-left font-['Inter:Regular'] font-normal leading-[1.45] text-[#ccd6e5] text-[13px] whitespace-nowrap transition-colors hover:text-white"
    >
      {children}
    </button>
  );
}

export default function SiteFooter() {
  const { searchWith, browseAll, scrollToSection, showToast, openDeposit } = useApp();

  return (
    <div
      className="bg-[#071f49] h-[340px] overflow-clip relative shrink-0 w-full"
      data-name="Pied de page"
    >
      <p className="absolute font-['Inter:Bold'] font-bold leading-[1.45] left-[100px] text-[24px] text-white top-[39px] whitespace-nowrap">
        IMMO DU LETCH
      </p>
      <p className="absolute font-['Inter:Medium'] font-medium leading-[1.45] left-[100px] text-[#f3ad19] text-[14px] top-[82px] whitespace-nowrap">
        Votre partenaire immobilier
      </p>
      <div className="absolute font-['Inter:Regular'] font-normal leading-[0] left-[100px] text-[#ccd6e5] text-[13px] top-[118px] w-[340px]">
        <p className="leading-[1.45] mb-0">Acheter, louer et investir au Cameroun.</p>
        <p className="leading-[1.45]">À chaque projet, une nouvelle adresse.</p>
      </div>

      <p className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[530px] text-[15px] text-white top-[42px] whitespace-nowrap">
        Rechercher
      </p>
      <FooterLink left={530} top={82} onClick={() => searchWith({ transaction: "vente" })}>
        Acheter un bien
      </FooterLink>
      <FooterLink left={530} top={112} onClick={() => searchWith({ transaction: "location" })}>
        Louer un logement
      </FooterLink>
      <FooterLink
        left={530}
        top={142}
        onClick={() => searchWith({ transaction: "vente", type: "terrain" })}
      >
        Terrains à vendre
      </FooterLink>
      <FooterLink
        left={530}
        top={172}
        onClick={() => searchWith({ transaction: "location", type: "bureau" })}
      >
        Bureaux & commerces
      </FooterLink>

      <p className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[810px] text-[15px] text-white top-[42px] whitespace-nowrap">
        Vous accompagner
      </p>
      <FooterLink
        left={810}
        top={82}
        onClick={openDeposit}
      >
        Déposer une annonce
      </FooterLink>
      <FooterLink left={810} top={112} onClick={() => scrollToSection("conseils")}>
        Conseils immobiliers
      </FooterLink>
      <FooterLink
        left={810}
        top={142}
        onClick={() => showToast("Aide & contact : contact@immoduletch.cm (démo).")}
      >
        Aide & contact
      </FooterLink>
      <FooterLink
        left={810}
        top={172}
        onClick={() => showToast("Ne versez jamais d’acompte sans visite ni vérification.")}
      >
        Sécurité des transactions
      </FooterLink>

      <p className="absolute font-['Inter:Semi_Bold'] font-semibold leading-[1.45] left-[1090px] text-[15px] text-white top-[42px] whitespace-nowrap">
        Explorer le Cameroun
      </p>
      <FooterLink
        left={1090}
        top={82}
        onClick={() => searchWith({ transaction: "vente", city: "Douala" })}
      >
        Immobilier à Douala
      </FooterLink>
      <FooterLink
        left={1090}
        top={112}
        onClick={() => searchWith({ transaction: "vente", city: "Yaoundé" })}
      >
        Immobilier à Yaoundé
      </FooterLink>
      <FooterLink
        left={1090}
        top={142}
        onClick={() => searchWith({ transaction: "vente", city: "Kribi" })}
      >
        Immobilier à Kribi
      </FooterLink>
      <FooterLink left={1090} top={172} onClick={browseAll}>
        Toutes les villes
      </FooterLink>

      <div
        className="absolute bg-[#304565] h-px left-[100px] top-[234px] w-[1240px]"
        data-name="Séparateur"
      />
      <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[100px] text-[#ccd6e5] text-[12px] top-[254px] whitespace-pre">
        © IMMO DU LETCH • Mentions légales • Confidentialité • Cookies
      </p>
      <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[1110px] text-[#ccd6e5] text-[12px] top-[254px] whitespace-pre">
        Français · Cameroun · FCFA
      </p>
      <p className="absolute font-['Inter:Regular'] font-normal leading-[1.45] left-[100px] text-[#adbbd0] text-[11px] top-[292px] w-[1240px]">
        Maquette de démonstration : annonces, prix et visuels illustratifs. Disponibilité et
        documents à confirmer auprès de l’annonceur.
      </p>
    </div>
  );
}
