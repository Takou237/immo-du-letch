import { useMemo, useState } from "react";
import MobileFooter from "../components/MobileFooter";
import MobileNav from "../components/MobileNav";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { ArrowIcon } from "../components/icons";
import { useIsMobile } from "../hooks/useIsMobile";
import { useApp } from "../store/AppStore";

export default function AdvicePage() {
  const { articles, openArticle, navigate, browseAll } = useApp();
  const isMobile = useIsMobile();
  const [selectedTag, setSelectedTag] = useState<string>("TOUS");

  const tags = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.tag)));
    return ["TOUS", ...unique];
  }, [articles]);

  const filtered = useMemo(() => {
    if (selectedTag === "TOUS") return articles;
    return articles.filter((a) => a.tag === selectedTag);
  }, [articles, selectedTag]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {isMobile ? <MobileNav /> : <SiteNav active="conseils" />}

      <main className="flex-1 bg-[#f8fafc] px-4 py-7 md:px-[100px] md:py-[48px]">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#637084]">
            <button
              type="button"
              onClick={() => navigate("home")}
              className="cursor-pointer border-0 bg-transparent p-0 text-[#637084] hover:text-[#071f49]"
            >
              Accueil
            </button>
            <span>/</span>
            <span className="font-semibold text-[#071f49]">Nos conseils immobiliers</span>
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-[#fff6df] px-3 py-1 font-['Inter:Bold'] text-[10px] font-bold uppercase tracking-[0.08em] text-[#996300]">
                Guides & Ressources
              </span>
              <h1 className="mt-2 font-['Inter:Bold'] text-[24px] font-bold leading-[1.25] text-[#071f49] md:text-[32px]">
                Nos conseils pour votre projet immobilier
              </h1>
              <p className="mt-1.5 text-[14px] text-[#637084] md:text-[15px]">
                Acheter, louer, construire ou investir au Cameroun en toute sécurité juridique.
              </p>
            </div>
            <button
              type="button"
              onClick={browseAll}
              className="inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-[8px] border-0 bg-[#f3ad19] px-5 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] hover:bg-[#ffbe33]"
            >
              Voir les annonces <ArrowIcon className="size-[15px]" />
            </button>
          </div>

          {/* Filtres par catégorie */}
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 font-['Inter:Semi_Bold'] text-[12px] font-semibold transition-colors ${
                    active
                      ? "border-[#071f49] bg-[#071f49] text-white"
                      : "border-[#dce2e9] bg-white text-[#4a5a70] hover:border-[#f3ad19] hover:text-[#071f49]"
                  }`}
                >
                  {tag === "TOUS" ? "Tous les conseils" : tag}
                </button>
              );
            })}
          </div>

          {/* Grille des articles */}
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => {
              const paragraphs =
                typeof article.body === "string"
                  ? [article.body]
                  : (article.body as unknown as string[]);
              return (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => openArticle(article.id)}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-[10px] border border-[#dce2e9] bg-white text-left transition-all hover:-translate-y-[2px] hover:border-[#f3ad19] hover:shadow-[0_12px_28px_rgb(7_31_73/10%)]"
                >
                  <div className="h-[175px] w-full shrink-0 overflow-hidden bg-[#eef2f6]">
                    <img
                      alt={article.title}
                      src={article.image}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <span className="inline-block rounded-[4px] bg-[#fff7e6] px-2 py-0.5 font-['Inter:Bold'] text-[10px] font-bold tracking-[0.06em] text-[#996300]">
                        {article.tag}
                      </span>
                      <h2 className="mt-2 font-['Inter:Semi_Bold'] text-[17px] font-semibold leading-[1.35] text-[#071f49]">
                        {article.title}
                      </h2>
                      {paragraphs[0] ? (
                        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-[#637084]">
                          {paragraphs[0]}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#eef2f6] pt-3 text-[12px] font-semibold text-[#071f49]">
                      <span>Lire le guide complet</span>
                      <ArrowIcon className="size-[16px] text-[#071f49] transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {isMobile ? <MobileFooter /> : <SiteFooter />}
    </div>
  );
}
