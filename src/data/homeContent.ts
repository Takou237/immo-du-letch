import type { Filters, PropertyType } from "./listings";

const asset = (file: string) => `/assets/${file}`;

const imgIconeHome = asset("0831c.svg");
const imgIconeBuilding = asset("36436.svg");
const imgIconeLand = asset("7cd46.svg");
const imgIconeKey = asset("15765.svg");
const imgIconeBrief = asset("a8c47.svg");
const imgIconeBed = asset("51cee.svg");

export type HomeTab = "vente" | "location" | "meuble" | "terrain" | "pro";

export const HERO_TABS: { id: HomeTab; label: string }[] = [
  { id: "vente", label: "Acheter" },
  { id: "location", label: "Louer" },
  { id: "meuble", label: "Meublé" },
  { id: "terrain", label: "Terrains" },
  { id: "pro", label: "Professionnel" },
];

export const HERO_SLIDES = [
  {
    id: "villa-bonapriso",
    image: asset("d92fa.png"),
    tag: "VILLA CONTEMPORAINE",
    title: "Villa contemporaine avec jardin",
    location: "Bonapriso, Douala",
    price: "185 000 000 FCFA",
  },
  {
    id: "duplex-makepe",
    image: asset("d8a71.png"),
    tag: "NOUVEAUTÉ",
    title: "Duplex lumineux avec cour privative",
    location: "Makepe, Douala",
    price: "210 000 000 FCFA",
  },
  {
    id: "villa-kribi",
    image: asset("9f819.png"),
    tag: "BORD DE MER",
    title: "Villa de plain-pied proche de l'océan",
    location: "Mpalla, Kribi",
    price: "95 000 000 FCFA",
  },
  {
    id: "appartement-meuble-bastos",
    image: asset("df5dc.png"),
    tag: "LOCATION MEUBLÉE",
    title: "Appartement meublé avec balcon",
    location: "Bastos, Yaoundé",
    price: "350 000 FCFA / mois",
  },
];

export const BUDGET_VENTE = [
  { value: "", label: "Indifférent" },
  { value: "5000000", label: "5 M" },
  { value: "10000000", label: "10 M" },
  { value: "15000000", label: "15 M" },
  { value: "20000000", label: "20 M" },
  { value: "25000000", label: "25 M" },
  { value: "50000000", label: "50 M" },
  { value: "100000000", label: "100 M" },
  { value: "150000000", label: "150 M" },
  { value: "200000000", label: "200 M" },
  { value: "300000000", label: "300 M" },
  { value: "500000000", label: "500 M" },
];

export const BUDGET_LOCATION = [
  { value: "", label: "Indifférent" },
  { value: "100000", label: "100 000" },
  { value: "200000", label: "200 000" },
  { value: "350000", label: "350 000" },
  { value: "500000", label: "500 000" },
  { value: "750000", label: "750 000" },
  { value: "1000000", label: "1 M" },
  { value: "2000000", label: "2 M" },
];

export const SURFACE_OPTIONS = [
  { value: "", label: "Indifférent" },
  { value: "50", label: "50 m²" },
  { value: "100", label: "100 m²" },
  { value: "150", label: "150 m²" },
  { value: "200", label: "200 m²" },
  { value: "300", label: "300 m²" },
];

export const ROOM_OPTIONS = [
  { value: "", label: "Indifférent" },
  { value: "1", label: "1 chambre +" },
  { value: "2", label: "2 chambres +" },
  { value: "3", label: "3 chambres +" },
  { value: "4", label: "4 chambres +" },
  { value: "5", label: "5 chambres +" },
];

export const CATEGORIES: {
  label: string;
  icon: string;
  filter: Partial<Filters>;
}[] = [
  {
    label: "Maisons & villas",
    icon: imgIconeHome,
    filter: { transaction: "vente", type: "villa" },
  },
  {
    label: "Appartements",
    icon: imgIconeBuilding,
    filter: { transaction: "vente", type: "appartement" },
  },
  {
    label: "Terrains",
    icon: imgIconeLand,
    filter: { transaction: "vente", type: "terrain" },
  },
  {
    label: "Studios & chambres",
    icon: imgIconeKey,
    filter: { transaction: "location", type: "studio" },
  },
  {
    label: "Bureaux & commerces",
    icon: imgIconeBrief,
    filter: { transaction: "location", type: "bureau" },
  },
  {
    label: "Locations meublées",
    icon: imgIconeBed,
    filter: { transaction: "location", features: ["Meublé"] },
  },
];

export const POPULAR_SEARCHES: { label: string; filter: Partial<Filters> }[] = [
  {
    label: "Villa à Douala ≤ 200 M",
    filter: { transaction: "vente", city: "Douala", type: "villa", priceMax: 200_000_000 },
  },
  {
    label: "Appartement meublé à Yaoundé",
    filter: { transaction: "location", city: "Yaoundé", type: "appartement", features: ["Meublé"] },
  },
  {
    label: "Terrain titré à Kribi",
    filter: { transaction: "vente", city: "Kribi", type: "terrain", documents: ["Titre foncier"] },
  },
  {
    label: "Studio à louer à Douala",
    filter: { transaction: "location", city: "Douala", type: "studio" },
  },
  { label: "Bureau à louer", filter: { transaction: "location", type: "bureau" } },
];

export const LOCATION_SUGGESTIONS = [
  "Bonapriso, Douala",
  "Bonamoussadi, Douala",
  "Makepe, Douala",
  "Akwa, Douala",
  "Kotto, Douala",
  "Bastos, Yaoundé",
  "Cité verte, Yaoundé",
  "Melen, Yaoundé",
  "Odza, Yaoundé",
  "Londji, Kribi",
  "Mpalla, Kribi",
];

/** Filtres correspondant à un onglet du moteur de recherche. */
export function tabToFilters(tab: HomeTab): Partial<Filters> {
  switch (tab) {
    case "location":
      return { transaction: "location" };
    case "meuble":
      return { transaction: "location", features: ["Meublé"] };
    case "terrain":
      return { transaction: "vente", type: "terrain" };
    case "pro":
      return { sellerType: "professionnel" };
    default:
      return { transaction: "vente" };
  }
}

export function tabToType(tab: HomeTab): PropertyType | "" {
  return tab === "terrain" ? "terrain" : "";
}
