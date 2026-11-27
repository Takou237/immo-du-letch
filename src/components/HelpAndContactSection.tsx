import { useState, type FormEvent } from "react";
import { useApp } from "../store/AppStore";
import { MailIcon, PhoneIcon, PinIcon, ShieldIcon } from "./icons";

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M10 3.5v13M3.5 10h13" strokeLinecap="round" />
    </svg>
  );
}

type Props = {
  compact?: boolean;
};

export default function HelpAndContactSection({ compact = false }: Props) {
  const { faqs, siteSettings, showToast, navigate } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Informations sur un bien");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const contactPhone = siteSettings?.contactPhone ?? "+237 6 55 00 00 00";
  const contactEmail = siteSettings?.contactEmail ?? "contact@immoduletch.cm";
  const contactAddress = "Rue Toyota, Bonapriso — Douala, Cameroun";

  const filteredFaqs = faqs.filter((item) => {
    const q = faqSearch.trim().toLowerCase();
    if (!q) return true;
    return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("Veuillez remplir votre nom, votre e-mail et votre message.");
      return;
    }
    setSent(true);
    showToast("Votre message a bien été envoyé à l'équipe IMMO DU LETCH.");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <section
      id="aide-contact"
      data-name="Aide et contact"
      className={
        compact
          ? "w-full bg-[#f4f6f8] px-4 py-8 md:px-[100px] md:py-[52px]"
          : "w-full bg-[#f4f6f8] px-4 py-6 md:px-[100px] md:py-[44px]"
      }
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-[#fff6df] px-3 py-1 font-['Inter:Bold'] text-[10px] font-bold uppercase tracking-[0.08em] text-[#996300]">
              Support & Accompagnement
            </span>
            <h2 className="mt-2 font-['Inter:Bold'] text-[22px] font-bold leading-[1.25] text-[#071f49] md:text-[28px]">
              Aide & Contact
            </h2>
            <p className="mt-1.5 text-[14px] text-[#637084] md:text-[15px]">
              Consultez notre FAQ ou écrivez directement à nos conseillers immobiliers.
            </p>
          </div>
          {compact ? (
            <button
              type="button"
              onClick={() => navigate("contact")}
              className="cursor-pointer rounded-[8px] border border-[#dce2e9] bg-white px-4 py-2 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] transition-colors hover:border-[#f3ad19]"
            >
              Ouvrir la page Aide & Contact →
            </button>
          ) : null}
        </div>

        <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Colonne gauche : FAQ */}
          <div className="lg:col-span-6">
            <div className="rounded-[12px] border border-[#dce2e9] bg-white p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-['Inter:Bold'] text-[18px] font-bold text-[#071f49]">
                  Questions fréquentes (FAQ)
                </h3>
                <span className="rounded-full bg-[#f4f6f8] px-2.5 py-0.5 text-[11px] font-semibold text-[#637084]">
                  {filteredFaqs.length} questions
                </span>
              </div>

              <input
                type="search"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Rechercher dans la FAQ (titre foncier, visite, crédit...)"
                className="mt-3 h-[40px] w-full rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] text-[#071f49] outline-none transition-colors focus:border-[#f3ad19] focus:bg-white"
              />

              <div className="mt-4 flex flex-col gap-2.5">
                {filteredFaqs.length === 0 ? (
                  <p className="py-6 text-center text-[13px] text-[#637084]">
                    Aucune question ne correspond à « {faqSearch} ». Utilisez le formulaire ci-contre pour nous écrire.
                  </p>
                ) : (
                  filteredFaqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={faq.q}
                        className={`rounded-[8px] border transition-colors ${
                          isOpen ? "border-[#f3ad19] bg-[#fffdf7]" : "border-[#dce2e9] bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          className="flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-4 py-3.5 text-left"
                        >
                          <span className="font-['Inter:Semi_Bold'] text-[14px] font-semibold text-[#071f49]">
                            {faq.q}
                          </span>
                          <PlusIcon
                            className={`size-[16px] shrink-0 text-[#071f49] transition-transform duration-200 ${
                              isOpen ? "rotate-45 text-[#996300]" : ""
                            }`}
                          />
                        </button>
                        {isOpen ? (
                          <p className="border-t border-[#eef2f6] px-4 pb-4 pt-3 text-[13px] leading-[1.6] text-[#4a5a70]">
                            {faq.a}
                          </p>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite : Formulaire de contact + Coordonnées */}
          <div className="flex flex-col gap-5 lg:col-span-6">
            <div className="rounded-[12px] border border-[#dce2e9] bg-white p-5 md:p-6">
              <h3 className="font-['Inter:Bold'] text-[18px] font-bold text-[#071f49]">
                Envoyer un message
              </h3>
              <p className="mt-1 text-[13px] text-[#637084]">
                Notre équipe vous répond sous 24 heures ouvrées.
              </p>

              {sent ? (
                <div className="mt-4 rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-[13px] text-[#166534]">
                  <p className="font-semibold">Message envoyé avec succès !</p>
                  <p className="mt-1">
                    Merci de nous avoir contactés. Un conseiller IMMO DU LETCH reviendra vers vous très rapidement.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-3 cursor-pointer rounded-[6px] border border-[#166534]/30 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#166534]"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                        Nom complet *
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Jean-Paul Mbarga"
                        className="h-[40px] w-full rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                        E-mail *
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@exemple.com"
                        className="h-[40px] w-full rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                        Téléphone
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+237 6XX XX XX XX"
                        className="h-[40px] w-full rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                        Objet
                      </span>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-[40px] w-full cursor-pointer rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] px-3 text-[13px] text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                      >
                        <option value="Informations sur un bien">Informations sur un bien</option>
                        <option value="Accompagnement achat / titre foncier">
                          Accompagnement achat / titre foncier
                        </option>
                        <option value="Publier une annonce">Publier une annonce</option>
                        <option value="Signaler une annonce">Signaler une annonce</option>
                        <option value="Partenariat agence">Partenariat agence</option>
                        <option value="Autre demande">Autre demande</option>
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#637084]">
                      Message *
                    </span>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Décrivez votre projet ou votre question..."
                      className="w-full rounded-[8px] border border-[#dce2e9] bg-[#f8fafc] p-3 text-[13px] text-[#071f49] outline-none focus:border-[#f3ad19] focus:bg-white"
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-1 flex h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border-0 bg-[#f3ad19] font-['Inter:Bold'] text-[14px] font-bold text-[#071f49] transition-colors hover:bg-[#ffbe33]"
                  >
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>

            {/* Coordonnées & Réseaux sociaux */}
            <div className="rounded-[12px] border border-[#dce2e9] bg-[#071f49] p-5 text-white md:p-6">
              <h3 className="font-['Inter:Bold'] text-[17px] font-bold">
                Nos coordonnées
              </h3>
              <p className="mt-1 text-[12px] text-[#ccd6e5]">
                Disponible du lundi au samedi, de 8h00 à 18h00.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 text-[13px] sm:grid-cols-2">
                <div className="flex items-start gap-2.5">
                  <PinIcon className="mt-0.5 size-[16px] shrink-0 text-[#f3ad19]" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-[#9db0c9]">Adresse</p>
                    <p className="font-medium text-white">{contactAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <PhoneIcon className="mt-0.5 size-[16px] shrink-0 text-[#f3ad19]" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-[#9db0c9]">Téléphone</p>
                    <a
                      href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                      className="font-medium text-white no-underline hover:text-[#f3ad19]"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MailIcon className="mt-0.5 size-[16px] shrink-0 text-[#f3ad19]" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-[#9db0c9]">E-mail</p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="font-medium text-white no-underline hover:text-[#f3ad19]"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldIcon className="mt-0.5 size-[16px] shrink-0 text-[#f3ad19]" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-[#9db0c9]">
                      Réseaux sociaux
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {[
                        { label: "Facebook", href: "https://facebook.com" },
                        { label: "Instagram", href: "https://instagram.com" },
                        { label: "LinkedIn", href: "https://linkedin.com" },
                        {
                          label: "WhatsApp",
                          href: `https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`,
                        },
                      ].map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-[5px] bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white no-underline transition-colors hover:bg-[#f3ad19] hover:text-[#071f49]"
                        >
                          {social.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
