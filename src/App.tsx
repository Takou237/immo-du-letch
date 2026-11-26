import { useLayoutEffect } from "react";
import AuthModal from "./components/AuthModal";
import CompareBar from "./components/CompareBar";
import CompareModal from "./components/CompareModal";
import DepositModal from "./components/DepositModal";
import FavoritesPanel from "./components/FavoritesPanel";
import Toast from "./components/Toast";
import { useIsMobile } from "./hooks/useIsMobile";
import DetailPage from "./pages/DetailPage";
import HomePage from "./pages/HomePage";
import MobileDetailPage from "./pages/MobileDetailPage";
import MobileHomePage from "./pages/MobileHomePage";
import MobileProfilePage from "./pages/MobileProfilePage";
import MobileResultsPage from "./pages/MobileResultsPage";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";
import { AppProvider, useApp } from "./store/AppStore";

function Shell() {
  const { page } = useApp();
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    const stage = document.querySelector<HTMLElement>(".design-stage");
    if (!stage) return;

    const updateScale = () => {
      const width = document.documentElement.clientWidth;
      // Le design est dessiné sur 1440 px : on l'agrandit ou le réduit exactement
      // à la largeur de l'écran pour qu'il occupe toute la page (plus de bandes blanches).
      const scale = Math.max(width / 1440, 0.2);
      stage.style.zoom = String(Math.round(scale * 10000) / 10000);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
    };
  }, [isMobile]);

  return (
    <>
      {isMobile ? (
        page === "home" ? (
          <MobileHomePage />
        ) : page === "results" ? (
          <MobileResultsPage />
        ) : page === "detail" ? (
          <MobileDetailPage />
        ) : (
          <MobileProfilePage />
        )
      ) : (
        <div className="design-stage">
          {page === "home" && <HomePage />}
          {page === "results" && <ResultsPage />}
          {page === "detail" && <DetailPage />}
          {page === "profile" && <ProfilePage />}
        </div>
      )}
      <Toast />
      <FavoritesPanel />
      <CompareBar />
      <CompareModal />
      <DepositModal />
      <AuthModal />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
