import { useEffect, useState, type FormEvent } from "react";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";
import Modal from "./Modal";
import { ArrowIcon, EyeIcon } from "./icons";

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

const DEMO_GMAIL_ACCOUNTS = [
  { name: "Ken Daniel", email: "ken.daniel@gmail.com" },
  { name: "IMMO DU LETCH Pro", email: "contact.immoduletch@gmail.com" },
];

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

  const [googleStep, setGoogleStep] = useState(false);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");

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
      setGoogleStep(false);
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

  const handleGoogleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedEmail = googleEmail.trim().toLowerCase();
    if (!isEmailValid(trimmedEmail) || !trimmedEmail.endsWith("@gmail.com")) {
      showToast("Veuillez saisir une adresse Gmail valide (ex: nom@gmail.com).");
      return;
    }
    const derivedName =
      googleName.trim() ||
      trimmedEmail
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    loginWithGoogle(derivedName, trimmedEmail);
  };

  return (
    <Modal
      onClose={closeAuth}
      label={authMode === "login" ? "Connexion à IMMO DU LETCH" : "Inscription à IMMO DU LETCH"}
      panelClassName="w-[460px] max-w-[94vw]"
    >
      <div className="p-6 md:p-8">
        {googleStep ? (
          <div>
            <button
              type="button"
              onClick={() => setGoogleStep(false)}
              className="mb-4 inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-['Inter:Semi_Bold'] text-[12px] font-semibold text-[#637084] hover:text-[#071f49]"
            >
              <ArrowIcon className="size-[14px] rotate-180" /> {t.modals.back}
            </button>

            <div className="flex items-center gap-2.5">
              <GoogleLogo />
              <p className="font-['Inter:Bold'] text-[19px] font-bold text-[#071f49]">
                {t.modals.googleTitle}
              </p>
            </div>
            <p className="mt-1 text-[13px] text-[#637084]">
              {t.modals.googleSubtitle}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {DEMO_GMAIL_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => loginWithGoogle(acc.name, acc.email)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-[8px] border border-[#dce2e9] bg-white p-3 text-left transition-colors hover:border-[#4285F4] hover:bg-[#f8faff]"
                >
                  <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#4285F4] font-['Inter:Bold'] text-[14px] font-bold text-white">
                    {acc.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49]">
                      {acc.name}
                    </p>
                    <p className="truncate text-[12px] text-[#637084]">{acc.email}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#dce2e9]" />
              <span className="text-[11px] font-medium text-[#8a95a5]">OU AUTRE COMPTE GMAIL</span>
              <div className="h-px flex-1 bg-[#dce2e9]" />
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#172b45]">
                  Adresse Gmail *
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="votre.nom@gmail.com"
                  className="h-[42px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#4285F4]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#172b45]">
                  Nom affiché (optionnel)
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  className="h-[42px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#4285F4]"
                />
              </div>
              <button
                type="submit"
                className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border-0 bg-[#071f49] font-['Inter:Semi_Bold'] text-[13px] font-semibold text-white hover:bg-[#0d2d66]"
              >
                <GoogleLogo />
                Continuer avec ce compte Gmail
              </button>
            </form>
          </div>
        ) : (
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
              onClick={() => setGoogleStep(true)}
              className="mt-5 flex h-[44px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-[6px] border border-[#dce2e9] bg-white font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45] transition-colors hover:border-[#4285F4] hover:bg-[#f8faff]"
            >
              <GoogleLogo />
              {t.modals.continueGoogle}
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
        )}
      </div>
    </Modal>
  );
}
