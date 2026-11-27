import { useEffect, useState, type FormEvent } from "react";
import {
  CITY_OPTIONS,
  FEATURE_OPTIONS,
  TYPE_LABELS,
  type PropertyType,
  type Transaction,
} from "../data/listings";
import { useT } from "../i18n/translations";
import { useApp } from "../store/AppStore";
import ImageUploader from "./ImageUploader";
import Modal from "./Modal";

export default function DepositModal() {
  const { depositOpen, closeDeposit, showToast, user, addUserListing, navigate } = useApp();
  const t = useT();
  const STEPS = t.deposit.steps;
  const [step, setStep] = useState(0);
  const [transaction, setTransaction] = useState<Transaction>("vente");
  const [type, setType] = useState<PropertyType>("villa");
  const [city, setCity] = useState("Douala");
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice] = useState("");
  const [surface, setSurface] = useState("");
  const [rooms, setRooms] = useState("3");
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");

  useEffect(() => {
    if (depositOpen && user) {
      setSellerName((prev) => prev || user.name);
      setSellerEmail((prev) => prev || user.email);
      if (user.phone) setSellerPhone((prev) => prev || user.phone!);
    }
  }, [depositOpen, user]);

  if (!depositOpen) return null;

  const toggleFeature = (feature: string) => {
    setFeatures((current) =>
      current.includes(feature) ? current.filter((f) => f !== feature) : [...current, feature],
    );
  };

  const resetAndClose = () => {
    setStep(0);
    setImages([]);
    closeDeposit();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!sellerName.trim() || !sellerPhone.trim()) {
      showToast("Veuillez renseigner votre nom et numéro de téléphone.");
      return;
    }
    if (!neighborhood.trim() || !price || !surface) {
      showToast("Veuillez renseigner le quartier, le prix et la surface.");
      return;
    }
    addUserListing({
      title: `${TYPE_LABELS[type].replace(/s$/, "")} à ${neighborhood.trim()}, ${city}`,
      transaction,
      type,
      city,
      neighborhood: neighborhood.trim(),
      price: Number(price),
      surface: Number(surface),
      rooms: Number(rooms) || 0,
      features,
      images,
      description: `Annonce déposée par ${sellerName.trim()} (${sellerPhone.trim()}).`,
      sellerName: sellerName.trim(),
      sellerPhone: sellerPhone.trim(),
    });
    resetAndClose();
    navigate("profile");
  };

  return (
    <Modal
      onClose={resetAndClose}
      label={t.deposit.modalLabel}
      panelClassName="w-[580px] max-w-[94vw]"
    >
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <p className="font-['Inter:Bold'] text-[22px] font-bold text-[#071f49]">
          {t.deposit.title}
        </p>
        <p className="mt-1 text-[13px] text-[#637084]">
          {t.deposit.stepOf(step + 1, STEPS.length, STEPS[step])}
        </p>

        {/* Barre de progression */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {STEPS.map((label, index) => (
            <div key={label} className="flex flex-col gap-1">
              <div
                className={`h-[5px] rounded-full transition-colors ${
                  index <= step ? "bg-[#f3ad19]" : "bg-[#e2e8f0]"
                }`}
              />
              <span
                className={`text-[10px] font-semibold ${
                  index <= step ? "text-[#071f49]" : "text-[#8a95a5]"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 min-h-[220px]">
          {step === 0 ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-2 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  {t.deposit.transactionType}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      ["vente", t.deposit.sellProperty],
                      ["location", t.deposit.rentOut],
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTransaction(val)}
                      className={`h-[46px] cursor-pointer rounded-[6px] border font-['Inter:Semi_Bold'] text-[13px] font-semibold transition-colors ${
                        transaction === val
                          ? "border-[#071f49] bg-[#071f49] text-white"
                          : "border-[#dce2e9] bg-white text-[#172b45] hover:border-[#f3ad19]"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  {t.deposit.propertyCategory}
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {(Object.keys(TYPE_LABELS) as PropertyType[]).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setType(val)}
                      className={`h-[42px] cursor-pointer rounded-[6px] border px-2 font-['Inter:Medium'] text-[12px] font-medium transition-colors ${
                        type === val
                          ? "border-[#f3ad19] bg-[#fffaf0] font-semibold text-[#071f49]"
                          : "border-[#dce2e9] bg-white text-[#172b45] hover:border-[#f3ad19]"
                      }`}
                    >
                      {t.types[val]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Ville
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] bg-white px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                >
                  {CITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Quartier
                </label>
                <input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Bonapriso, Bastos, Makepe…"
                  className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  {transaction === "location" ? "Loyer mensuel (FCFA)" : "Prix de vente (FCFA)"}
                </label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={transaction === "location" ? "Ex: 350000" : "Ex: 120000000"}
                  className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                    Surface (m²)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={surface}
                    onChange={(e) => setSurface(e.target.value)}
                    placeholder="Ex: 180"
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                    Nombre de pièces
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Équipements inclus
                </p>
                <div className="flex flex-wrap gap-2">
                  {FEATURE_OPTIONS.map((f) => {
                    const active = features.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFeature(f)}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                          active
                            ? "border-[#071f49] bg-[#071f49] text-white"
                            : "border-[#dce2e9] bg-white text-[#172b45] hover:border-[#f3ad19]"
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              <ImageUploader images={images} onChange={setImages} compact />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="mb-1 block font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Votre nom ou agence *
                </label>
                <input
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="Ex: M. Kamga"
                  className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                />
              </div>
              <div>
                <label className="mb-1 block font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  Téléphone (WhatsApp) *
                </label>
                <input
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="+237 6 XX XX XX XX"
                  className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                />
              </div>
              <div>
                <label className="mb-1 block font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
                  E-mail
                </label>
                <input
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  placeholder="exemple@domaine.cm"
                  className="h-[44px] w-full rounded-[6px] border border-[#dce2e9] px-3 text-[13px] text-[#172b45] outline-none focus:border-[#f3ad19]"
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#dce2e9] pt-4">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="h-[42px] cursor-pointer rounded-[6px] border border-[#dce2e9] bg-white px-4 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.deposit.prev}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="h-[42px] cursor-pointer rounded-[6px] border-0 bg-[#f3ad19] px-6 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#071f49] hover:bg-[#ffbe33]"
            >
              {t.deposit.next}
            </button>
          ) : (
            <button
              type="submit"
              className="h-[42px] cursor-pointer rounded-[6px] border-0 bg-[#071f49] px-6 font-['Inter:Semi_Bold'] text-[13px] font-semibold text-white hover:bg-[#0d2d66]"
            >
              {t.deposit.publish}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
