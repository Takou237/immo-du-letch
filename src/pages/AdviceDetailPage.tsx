import MobileFooter from "../components/MobileFooter";
import MobileNav from "../components/MobileNav";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { ArrowIcon } from "../components/icons";
import { useIsMobile } from "../hooks/useIsMobile";
import { useApp } from "../store/AppStore";

export default function AdviceDetailPage() {
  const { articles, selectedArticleId, openArticle, navigate, browseAll } = useApp();
  const isMobile = useIsMobile();

  const article = articles.find((a) => a.id === selectedArticleId) ?? articles[0];
  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);
  const paragraphs =
    typeof article.body === "string"
      ? [article.body]
      : (article.body as unknown as string[]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {isMobile ? <MobileNav /> : <SiteNav active="conseils" />}

      <main className="flex-1 bg-[#f8fafc] px-4 py-7 md:px-[100px] md:py-[44px]">
        <div className="mx-auto max-w-[1040px]">
          {/* Fil d'Ariane */}
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#637084]">
            <button
              type="button"
              onClick={() => navigate("home")}
              className="cursor-pointer border-0 bg-transparent p-0 text-[#637084] hover:text-[#071f49]"
            >
              Accueil
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => navigate("advice")}
              className="cursor-pointer border-0 bg-transparent p-0 text-[#637084] hover:text-[#071f49]"
            >
              Conseils immobiliers
            </button>
            <span>/</span>
            <span className="truncate font-semibold text-[#071f49]">{article.title}</span>
          </div>

          {/* Article principal */}
          <article className="mt-5 overflow-hidden rounded-[12px] border border-[#dce2e9] bg-white shadow-sm">
            <div className="h-[220px] w-full overflow-hidden bg-[#eef2f6] md:h-[360px]">
              <img
                src={article.image}
                alt={article.title}
                className="size-full object-cover"
              />
            </div>

            <div className="p-5 md:p-10">
              <span className="inline-block rounded-[4px] bg-[#fff7e6] px-2.5 py-1 font-['Inter:Bold'] text-[11px] font-bold tracking-[0.08em] text-[#996300]">
                {article.tag}
              </span>
              <h1 className="mt-3 font-['Inter:Bold'] text-[22px] font-bold leading-[1.25] text-[#071f49] md:text-[30px]">
                {article.title}
              </h1>

              <div className="mt-6 space-y-4 text-[14px] leading-[1.75] text-[#3a4a60] md:text-[15px]">
                {paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Encadré d'action */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-[#dce2e9] bg-[#f8fafc] p-5">
                <div>
                  <p className="font-['Inter:Bold'] text-[15px] font-bold text-[#071f49]">
                    Besoin d'un accompagnement personnalisé ?
                  </p>
                  <p className="mt-1 text-[13px] text-[#637084]">
                    Parcourez nos annonces vérifiées ou contactez nos conseillers immobiliers.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => navigate("contact")}
                    className="h-[42px] cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white px-4 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] hover:border-[#f3ad19]"
                  >
                    Nous contacter
                  </button>
                  <button
                    type="button"
                    onClick={browseAll}
                    className="inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-[8px] border-0 bg-[#f3ad19] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] hover:bg-[#ffbe33]"
                  >
                    Voir les annonces <ArrowIcon className="size-[15px]" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate("advice")}
                  className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-[#071f49] hover:text-[#996300]"
                >
                  ← Retour à tous les conseils
                </button>
              </div>
            </div>
          </article>

          {/* Conseils similaires */}
          {related.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
                Autres conseils utiles
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openArticle(item.id)}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-[8px] border border-[#dce2e9] bg-white text-left transition-all hover:border-[#f3ad19]"
                  >
                    <div className="h-[130px] w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-4">
                      <span className="font-['Inter:Bold'] text-[10px] font-bold tracking-[0.06em] text-[#996300]">
                        {item.tag}
                      </span>
                      <p className="mt-1 line-clamp-2 font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49]">
                        {item.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      {isMobile ? <MobileFooter /> : <SiteFooter />}
    </div>
  );
}
