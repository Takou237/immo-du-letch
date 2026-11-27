import { useEffect, useState, type FormEvent } from "react";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";
import { requestGoogleAccessToken } from "../utils/googleAuth";
import Modal from "./Modal";
import { EyeIcon } from "./icons";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

export default function AuthModal() {
  const {
    authOpen,
    authMode,
    openAuth,
    closeAuth,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    showToast,
  } = useApp();
  const t = useT();

  const [googleLoading, setGoogleLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regType, setRegType] = useState<"particulier" | "professionnel">("particulier");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  useEffect(() => {
    if (authOpen) {
      setGoogleLoading(false);
      setShowPassword(false);
    }
  }, [authOpen, authMode]);

  if (!authOpen) return null;

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    if (!isEmailValid(email)) {
      showToast("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    if (password.length < 6) {
      showToast("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    loginWithEmail(email, password);
  };

  const handleRegister = (event: FormEvent) => {
    event.preventDefault();
    if (!regName.trim()) {
      showToast("Veuillez renseigner votre nom complet.");
      return;
    }
    if (!isEmailValid(regEmail)) {
      showToast("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    if (regPassword.length < 6) {
      showToast("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (regPassword !== regConfirm) {
      showToast("Les mots de passe ne correspondent pas.");
      return;
    }
    registerWithEmail({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      accountType: regType,
    });
  };

  const handleGoogleAuth = async () => {
    const clientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "").trim();
    if (!clientId) {
      showToast("Authentification Google non configurée (VITE_GOOGLE_CLIENT_ID manquant).");
      return;
    }

    setGoogleLoading(true);
    try {
      const accessToken = await requestGoogleAccessToken(clientId);
      await loginWithGoogle(accessToken);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Impossible de se connecter avec Google.";
      showToast(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Modal
      onClose={closeAuth}
      label={authMode === "login" ? "Connexion à IMMO DU LETCH" : "Inscription à IMMO DU LETCH"}
      panelClassName="w-[460px] max-w-[94vw]"
    >
      <div className="p-6 md:p-8">
          <div>
            <p className="font-['Inter:Bold'] text-[22px] font-bold text-[#071f49]">
              {authMode === "login" ? t.modals.loginTitle : t.modals.registerTitle}
            </p>
            <p className="mt-1 text-[13px] text-[#637084]">
              {t.modals.authSubtitle}
            </p>

            {/* Onglets Connexion / Inscription */}
            <div className="mt-5 grid grid-cols-2 rounded-[8px] bg-[#f4f6f8] p-1">
              <button
                type="button"
                onClick={() => openAuth("login")}
                className={`h-[36px] cursor-pointer rounded-[6px] border-0 font-['Inter:Semi_Bold'] text-[13px] font-semibold transition-colors ${
                  authMode === "login"
                    ? "bg-white text-[#071f49] shadow-sm"
                    : "bg-transparent text-[#637084] hover:text-[#071f49]"
                }`}
              >
                {t.modals.loginTab}
              </button>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className={`h-[36px] cursor-pointer rounded-[6px] border-0 font-['Inter:Semi_Bold'] text-[13px] font-semibold transition-colors ${
                  authMode === "register"
                    ? "bg-white text-[#071f49] shadow-sm"
                    : "bg-transparent text-[#637084] hover:text-[#071f49]"
                }`}
              >
                {t.modals.registerTab}
              </button>
            </div>

            {/* Bouton Google / Gmail */}
            <button
              type="button"
              disabled={googleLoading}
              onClick={() => void handleGoogleAuth()}
              className="mt-5 flex h-[44px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-[6px] border border-[#dce2e9] bg-white font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45] transition-colors hover:border-[#4285F4] hover:bg-[#f8faff] disabled:cursor-wait disabled:opacity-60"
            >
              <GoogleLogo />
              {googleLoading ? "Connexion Google en cours..." : t.modals.continueGoogle}
            </button>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#dce2e9]" />
              <span className="text-[11px] font-medium text-[#8a95a5]">{t.modals.orByEmail}</span>
              <div className="h-px flex-1 bg-[#dce2e9]" />
            </div>

            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#172b45]">
                    {t.modals.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@domaine.cm"
                    className="h-[42px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-[12px] font-semibold text-[#172b45]">
                      {t.modals.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        showToast(
                          "Un lien de réinitialisation vous sera envoyé si cet e-mail existe (démo).",
                        )
                      }
                      className="cursor-pointer border-0 bg-transparent p-0 text-[11px] font-medium text-[#637084] hover:text-[#071f49] hover:underline"
                    >
                      {t.modals.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-[42px] w-full rounded-[6px] border border-[#dce2e9] pl-3 pr-10 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-[11px] cursor-pointer border-0 bg-transparent p-0 text-[#637084] hover:text-[#071f49]"
                    >
                      <EyeIcon className="size-[18px]" />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 h-[44px] w-full cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] transition-colors hover:bg-[#ffbe33]"
                >
                  {t.modals.signInBtn}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#172b45]">
                    {t.modals.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: Paul Mbarga"
                    className="h-[40px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-[#172b45]">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nom@exemple.cm"
                      className="h-[40px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-[#172b45]">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+237 6..."
                      className="h-[40px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-[12px] font-semibold text-[#172b45]">Type de compte</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["particulier", "Particulier"],
                        ["professionnel", "Agence / Pro"],
                      ] as const
                    ).map(([val, lbl]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRegType(val)}
                        className={`h-[36px] cursor-pointer rounded-[6px] border text-[12px] font-semibold transition-colors ${
                          regType === val
                            ? "border-[#071f49] bg-[#071f49] text-white"
                            : "border-[#dce2e9] bg-white text-[#172b45] hover:border-[#f3ad19]"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-[#172b45]">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 caractères"
                      className="h-[40px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-[#172b45]">
                      Confirmer *
                    </label>
                    <input
                      type="password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder="Répétez"
                      className="h-[40px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 h-[44px] w-full cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49] transition-colors hover:bg-[#ffbe33]"
                >
                  {t.modals.createAccountBtn}
                </button>
              </form>
            )}
          </div>
      </div>
    </Modal>
  );
}
