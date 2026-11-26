import { CheckIcon } from "./icons";

export type SelectOption = { value: string; label: string };

type SelectBoxProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className: string;
  selectClassName?: string;
  iconClassName?: string;
  iconSrc?: string;
  ariaLabel: string;
};

export function SelectBox({
  value,
  onChange,
  options,
  className,
  selectClassName = "pl-[13px] text-[14px] font-['Inter:Regular'] text-[#2e2e2e]",
  iconClassName = "left-[calc(100%-31px)] top-[15px] size-[18px]",
  iconSrc = "/assets/ba8f4.svg",
  ariaLabel,
}: SelectBoxProps) {
  return (
    <div className={`absolute overflow-clip ${className}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`absolute inset-0 size-full cursor-pointer appearance-none truncate border-0 bg-transparent pr-[36px] outline-none [&>option]:bg-white [&>option]:text-[#172b45] ${selectClassName}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className={`pointer-events-none absolute ${iconClassName}`}>
        <img alt="" className="absolute inset-0 size-full" src={iconSrc} />
      </div>
    </div>
  );
}

type CheckOptionProps = {
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
};

export function CheckOption({ checked, onChange, label, className = "" }: CheckOptionProps) {
  return (
    <label
      className={`flex cursor-pointer select-none items-center gap-[10px] text-[12px] leading-[1.45] text-[#172b45] ${className}`}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
          checked
            ? "border-[#071f49] bg-[#071f49] text-white"
            : "border-[#dce2e9] bg-white text-transparent"
        }`}
      >
        <CheckIcon className="size-[11px]" />
      </span>
      <span>{label}</span>
    </label>
  );
}

type NumberFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
};

export function NumberField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className = "",
}: NumberFieldProps) {
  return (
    <input
      aria-label={ariaLabel}
      inputMode="numeric"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ""))}
      className={`h-[44px] w-full rounded-[5px] border border-[#dce2e9] bg-white px-[10px] text-[12px] text-[#172b45] outline-none transition-colors placeholder:text-[#8a95a5] focus:border-[#f3ad19] ${className}`}
    />
  );
}
