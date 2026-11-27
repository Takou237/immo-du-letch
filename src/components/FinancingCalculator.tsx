import { useState } from "react";
import { formatPrice } from "../data/listings";
import { useT } from "../i18n/translations";

type Props = {
  price: number;
};

const DURATIONS = [12, 24, 36, 60];
const ANNUAL_RATE = 0.09; // 9% taux indicatif simulé

export default function FinancingCalculator({ price }: Props) {
  const t = useT();
  const [downPercent, setDownPercent] = useState(20);
  const [months, setMonths] = useState(36);

  const downPayment = Math.round((price * downPercent) / 100);
  const principal = Math.max(0, price - downPayment);
  const monthlyRate = ANNUAL_RATE / 12;
  const monthlyPayment =
    principal === 0
      ? 0
      : Math.round(
          (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1),
        );

  return (
    <div className="rounded-[8px] border border-[#dce2e9] bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-['Inter:Bold'] text-[18px] font-bold text-[#071f49]">
            {t.financing.title}
          </h3>
          <p className="mt-0.5 text-[12px] text-[#637084]">
            {t.financing.subtitle}
          </p>
        </div>
        <div className="rounded-[6px] bg-[#eaf0f8] px-4 py-2 text-right">
          <p className="text-[11px] font-medium text-[#637084]">{t.financing.estimatedMonthly}</p>
          <p className="font-['Inter:Bold'] text-[20px] font-bold text-[#071f49]">
            {formatPrice(monthlyPayment)} {t.financing.perMonth}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-['Inter:Semi_Bold'] font-semibold text-[#172b45]">
              {t.financing.downPayment(downPercent)}
            </span>
            <span className="font-['Inter:Bold'] font-bold text-[#071f49]">
              {formatPrice(downPayment)} FCFA
            </span>
          </div>
          <input
            type="range"
            aria-label={t.financing.downPayment(downPercent)}
            min={10}
            max={50}
            step={5}
            value={downPercent}
            onChange={(event) => setDownPercent(Number(event.target.value))}
            className="mt-2 w-full accent-[#f3ad19]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-[#8a95a5]">
            <span>10 %</span>
            <span>30 %</span>
            <span>50 %</span>
          </div>
        </div>

        <div>
          <p className="font-['Inter:Semi_Bold'] text-[13px] font-semibold text-[#172b45]">
            {t.financing.duration}
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setMonths(d)}
                className={`h-[38px] cursor-pointer rounded-[6px] border font-['Inter:Semi_Bold'] text-[12px] font-semibold transition-colors ${
                  months === d
                    ? "border-[#071f49] bg-[#071f49] text-white"
                    : "border-[#dce2e9] bg-white text-[#172b45] hover:border-[#f3ad19]"
                }`}
              >
                {d} {t.financing.monthsUnit}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-[#637084]">
        {t.financing.disclaimer(formatPrice(principal))}
      </p>
    </div>
  );
}
