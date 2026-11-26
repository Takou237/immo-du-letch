import { useApp } from "../store/AppStore";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div
      role="status"
      className="fixed bottom-8 left-1/2 z-[130] -translate-x-1/2 rounded-full bg-[#071f49] px-5 py-3 text-center font-['Inter:Medium'] text-[13px] font-medium text-white shadow-[0_16px_40px_rgb(7_31_73/35%)]"
    >
      {toast}
    </div>
  );
}
