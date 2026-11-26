import { useEffect, useState } from "react";

/** En dessous de cette largeur, une mise en page mobile dédiée remplace le canevas 1440 px. */
export const MOBILE_BREAKPOINT = 900;

const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function readIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(readIsMobile);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handleChange = () => setIsMobile(mql.matches);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
