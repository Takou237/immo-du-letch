import HelpAndContactSection from "../components/HelpAndContactSection";
import MobileFooter from "../components/MobileFooter";
import MobileNav from "../components/MobileNav";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { useIsMobile } from "../hooks/useIsMobile";
import { useApp } from "../store/AppStore";

export default function ContactPage() {
  const { navigate } = useApp();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f4f6f8]">
      {isMobile ? <MobileNav /> : <SiteNav />}

      <main className="flex-1">
        <div className="border-b border-[#dce2e9] bg-white px-4 py-6 md:px-[100px]">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex items-center gap-2 text-[12px] text-[#637084]">
              <button
                type="button"
                onClick={() => navigate("home")}
                className="cursor-pointer border-0 bg-transparent p-0 text-[#637084] hover:text-[#071f49]"
              >
                Accueil
              </button>
              <span>/</span>
              <span className="font-semibold text-[#071f49]">Aide & Contact</span>
            </div>
            <h1 className="mt-2 font-['Inter:Bold'] text-[24px] font-bold text-[#071f49] md:text-[32px]">
              Centre d'aide & Contact
            </h1>
            <p className="mt-1 text-[14px] text-[#637084]">
              Toutes les réponses à vos questions et nos coordonnées pour joindre l'équipe IMMO DU LETCH.
            </p>
          </div>
        </div>

        <HelpAndContactSection />
      </main>

      {isMobile ? <MobileFooter /> : <SiteFooter />}
    </div>
  );
}
