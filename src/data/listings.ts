export type Transaction = "vente" | "location";
export type PropertyType = "villa" | "appartement" | "terrain" | "studio" | "bureau";
export type Condition = "neuf" | "ancien" | "a_renover";
export type SellerType = "professionnel" | "particulier";
export type PriceRating = "excellent" | "tres_bon" | "bon" | "marche" | "eleve";

export type Listing = {
  id: string;
  reference: string;
  title: string;
  price: number;
  transaction: Transaction;
  type: PropertyType;
  city: string;
  neighborhood: string;
  region: string;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  land?: number;
  parking: number;
  image: string;
  gallery: string[];
  description: string;
  description2: string;
  features: string[];
  documents: string[];
  condition: Condition;
  sellerType: SellerType;
  seller: string;
  sellerRating: number;
  sellerReviews: number;
  sellerSince?: string;
  sellerDescription?: string;
  sellerPhone?: string;
  isNew: boolean;
  publishedAt: string;
  views: number;
  priceDropped?: boolean;
  originalPrice?: number;
  yearBuilt?: number;
  floor?: number;
  totalFloors?: number;
};

const asset = (file: string) => `/assets/${file}`;

export const TYPE_LABELS: Record<PropertyType, string> = {
  villa: "Maisons & villas",
  appartement: "Appartements",
  terrain: "Terrains",
  studio: "Studios & chambres",
  bureau: "Bureaux & commerces",
};

export const TYPE_SINGULAR: Record<PropertyType, string> = {
  villa: "Maison / villa",
  appartement: "Appartement",
  terrain: "Terrain",
  studio: "Studio",
  bureau: "Bureau / commerce",
};

export const TRANSACTION_LABELS: Record<Transaction, string> = {
  vente: "Acheter",
  location: "Louer",
};

export const CONDITION_LABELS: Record<Condition, string> = {
  neuf: "Neuf / récent",
  ancien: "Ancien",
  a_renover: "À rénover",
};

export const CITY_OPTIONS = ["Douala", "Yaoundé", "Kribi"];

export const DOCUMENT_OPTIONS = ["Titre foncier", "Permis de bâtir", "Plan cadastral"];

export const FEATURE_OPTIONS = [
  "Jardin",
  "Parking",
  "Terrasse",
  "Piscine",
  "Climatisation",
  "Groupe électrogène",
  "Meublé",
];

export const PRICE_RATING_CONFIG: Record<
  PriceRating,
  { label: string; short: string; color: string; bg: string; barWidth: string }
> = {
  excellent: {
    label: "Excellent prix",
    short: "Excellent",
    color: "#1f7a3d",
    bg: "#e7f6ec",
    barWidth: "10%",
  },
  tres_bon: {
    label: "Très bon prix",
    short: "Très bon",
    color: "#2563eb",
    bg: "#eff6ff",
    barWidth: "30%",
  },
  bon: {
    label: "Bon prix",
    short: "Bon prix",
    color: "#7c3aed",
    bg: "#f5f3ff",
    barWidth: "50%",
  },
  marche: {
    label: "Prix du marché",
    short: "Marché",
    color: "#637084",
    bg: "#f4f6f8",
    barWidth: "70%",
  },
  eleve: {
    label: "Prix élevé",
    short: "Élevé",
    color: "#dc2626",
    bg: "#fef2f2",
    barWidth: "90%",
  },
};

export const PLATFORM_STATS = [
  { value: "20", label: "Annonces actives", suffix: "" },
  { value: "3", label: "Villes couvertes", suffix: "" },
  { value: "5", label: "Types de biens", suffix: "" },
  { value: "5", label: "Ans d'expérience", suffix: "+" },
];

export const ARTICLES = [
  {
    tag: "ACHETER",
    title: "Titre foncier : les vérifications à faire avant d'acheter",
    image: asset("26532.png"),
    body: [
      "Avant toute signature, demandez une copie du titre foncier et vérifiez son authenticité auprès des services compétents. Le nom du propriétaire doit correspondre à celui qui vend.",
      "Faites contrôler les limites du terrain, l'absence d'hypothèque ou de litige, et l'état réel du bien lors d'une visite. Un accompagnement juridique reste la meilleure protection.",
    ],
  },
  {
    tag: "LOUER",
    title: "Visiter un logement : les bonnes questions à poser",
    image: asset("df5dc.png"),
    body: [
      "Demandez le montant du loyer, des charges et de la caution, ainsi que la durée du bail. Vérifiez l'état des équipements, l'arrivée d'eau, l'électricité et la sécurité de l'immeuble.",
      "Précisez par écrit ce qui est inclus dans le loyer et ce qui reste à votre charge. Ne versez jamais de somme avant d'avoir visité et signé un document clair.",
    ],
  },
  {
    tag: "INVESTIR",
    title: "Terrain ou appartement : quel bien pour votre projet ?",
    image: asset("52f31.png"),
    body: [
      "Un terrain demande du temps et un budget de construction, mais offre une grande liberté d'aménagement. Un appartement se loue plus vite et demande moins d'entretien.",
      "Comparez le prix au m², la demande locative du quartier et les documents disponibles. Le bon choix dépend de votre horizon d'investissement et de votre trésorerie.",
    ],
  },
  {
    tag: "CONSTRUIRE",
    title: "Construire ou acheter : que choisir au Cameroun ?",
    image: asset("7bb4a.png"),
    body: [
      "Construire permet de personnaliser chaque détail de votre futur logement, mais implique de gérer un chantier sur plusieurs mois. L'achat d'un bien existant offre une installation immédiate.",
      "Dans les deux cas, vérifiez la validité du titre foncier, le respect des règles d'urbanisme et faites appel à un architecte agréé pour sécuriser votre projet.",
    ],
  },
  {
    tag: "INVESTIR",
    title: "Immobilier locatif : comment calculer votre rendement ?",
    image: asset("d8a71.png"),
    body: [
      "Le rendement locatif brut se calcule en divisant le loyer annuel par le prix d'achat, multiplié par 100. À Douala et Yaoundé, les bons rendements se situent entre 6 % et 10 %.",
      "Pensez aussi aux charges (entretien, taxes, vacance locative) pour obtenir le rendement net réel. Un quartier en développement peut offrir une meilleure plus-value à long terme.",
    ],
  },
  {
    tag: "JURIDIQUE",
    title: "Les étapes légales d'une transaction immobilière au Cameroun",
    image: asset("9f819.png"),
    body: [
      "Une vente immobilière au Cameroun passe par la promesse de vente, la vérification du titre foncier, le paiement des droits de mutation (environ 15 % du prix) et la signature de l'acte notarié.",
      "Ne signez jamais sans avoir fait appel à un notaire ou un avocat spécialisé. Les frais de notaire et taxes sont à intégrer dans votre budget total dès le départ.",
    ],
  },
];

export const FAQS = [
  {
    q: "Comment rechercher un bien au Cameroun ?",
    a: "Utilisez la recherche par transaction, ville, type de bien, budget, surface et nombre de pièces. Les filtres avancés permettent aussi de vérifier les documents annoncés et les équipements.",
  },
  {
    q: "Comment publier une annonce immobilière ?",
    a: "Cliquez sur « Déposer une annonce » pour renseigner les caractéristiques de votre bien. Préparez les photos, le prix et les documents disponibles. IMMO DU LETCH vous accompagne dans la mise en ligne.",
  },
  {
    q: "Quels documents vérifier avant un achat ?",
    a: "Titre foncier, plan cadastral, permis de bâtir et pièces d'identité du vendeur. Faites toujours confirmer leur authenticité et la situation du bien auprès des services compétents.",
  },
  {
    q: "Comment organiser une visite avec l'annonceur ?",
    a: "Depuis la fiche d'un bien, utilisez le formulaire de contact ou affichez le numéro de l'annonceur. Convenez d'un rendez-vous et vérifiez le bien sur place avant tout engagement.",
  },
  {
    q: "Peut-on acheter un bien sans titre foncier ?",
    a: "Il est fortement déconseillé d'acheter sans titre foncier. Ce document est la seule preuve légale de propriété reconnue au Cameroun. Exigez-le systématiquement et faites-le vérifier auprès du cadastre.",
  },
  {
    q: "Quelles sont les taxes à payer lors d'une vente ?",
    a: "Les principaux frais incluent les droits de mutation (environ 15 % du prix de vente), les frais de notaire, et éventuellement la taxe foncière. Prévoyez un budget total supérieur d'environ 18-20 % au prix affiché.",
  },
  {
    q: "Comment estimer le prix d'un bien au Cameroun ?",
    a: "Le prix dépend de la ville, du quartier, de la superficie, de l'état et des documents disponibles. À Douala, les prix varient de 300 000 à plus de 1 000 000 FCFA/m² selon le secteur. Comparez plusieurs annonces similaires avant de décider.",
  },
  {
    q: "Est-il possible d'obtenir un crédit immobilier ?",
    a: "Oui, plusieurs banques camerounaises proposent des crédits immobiliers, généralement sur 10 à 20 ans avec un apport minimum de 20-30 %. Le taux d'intérêt varie entre 7 % et 12 % selon l'établissement. Renseignez-vous auprès de votre banque.",
  },
];

export const LISTINGS: Listing[] = [
  {
    id: "villa-bonapriso",
    reference: "IDL-DEMO-001",
    title: "Villa contemporaine avec jardin",
    price: 185_000_000,
    transaction: "vente",
    type: "villa",
    city: "Douala",
    neighborhood: "Bonapriso",
    region: "Littoral",
    rooms: 5,
    bedrooms: 4,
    bathrooms: 3,
    surface: 280,
    land: 600,
    parking: 2,
    image: asset("d92fa.png"),
    gallery: [asset("d92fa.png"), asset("df5dc.png"), asset("024df.png")],
    description:
      "À Bonapriso, cette villa contemporaine offre de beaux volumes, un séjour lumineux et un jardin pour profiter de l'extérieur. Ses quatre chambres permettent d'accueillir la famille et d'aménager un espace de travail.",
    description2:
      "La terrasse prolonge les espaces de vie, tandis que la cour permet le stationnement. Contactez l'annonceur pour connaître les conditions de vente, obtenir les documents du bien et organiser une visite.",
    features: ["Jardin", "Terrasse", "Parking", "Cuisine aménagée", "Climatisation", "Clôture"],
    documents: ["Titre foncier", "Permis de bâtir", "Plan cadastral"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019. Nous accompagnons acheteurs, locataires et vendeurs à Douala, Yaoundé et Kribi.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: false,
    publishedAt: "2026-11-18",
    views: 312,
    yearBuilt: 2022,
  },
  {
    id: "villa-bonamoussadi",
    reference: "IDL-DEMO-002",
    title: "Villa familiale avec grande terrasse",
    price: 145_000_000,
    transaction: "vente",
    type: "villa",
    city: "Douala",
    neighborhood: "Bonamoussadi",
    region: "Littoral",
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    surface: 220,
    land: 450,
    parking: 2,
    image: asset("9f819.png"),
    gallery: [asset("9f819.png"), asset("df5dc.png"), asset("024df.png")],
    description:
      "Un espace pensé pour la vie de famille, à proximité des services du quotidien. La villa dispose d'un séjour traversant, d'une terrasse couverte et d'un jardin planté d'arbres adultes.",
    description2:
      "Le quartier est calme et desservi par les commerces, les écoles et les axes principaux. Une visite est recommandée pour apprécier les volumes et l'état général du bien.",
    features: ["Jardin", "Terrasse", "Parking", "Climatisation", "Clôture"],
    documents: ["Titre foncier", "Plan cadastral"],
    condition: "ancien",
    sellerType: "particulier",
    seller: "M. Etoundi",
    sellerRating: 4.2,
    sellerReviews: 8,
    sellerSince: "2024",
    sellerDescription: "Propriétaire particulier souhaitant céder sa résidence principale suite à une mutation professionnelle. Bien de famille, entretenu régulièrement.",
    sellerPhone: "+237 6 70 11 22 33",
    isNew: true,
    publishedAt: "2026-11-22",
    views: 189,
    priceDropped: true,
    originalPrice: 155_000_000,
    yearBuilt: 2015,
  },
  {
    id: "duplex-makepe",
    reference: "IDL-DEMO-003",
    title: "Duplex lumineux avec cour privative",
    price: 210_000_000,
    transaction: "vente",
    type: "villa",
    city: "Douala",
    neighborhood: "Makepe",
    region: "Littoral",
    rooms: 6,
    bedrooms: 5,
    bathrooms: 4,
    surface: 320,
    land: 550,
    parking: 3,
    image: asset("d8a71.png"),
    gallery: [asset("d8a71.png"), asset("df5dc.png"), asset("024df.png")],
    description:
      "Des espaces généreux et une cour privative pour votre prochain projet de vie. Ce duplex récent combine un rez-de-chaussée ouvert sur le jardin et un étage dédié aux chambres.",
    description2:
      "Le stationnement peut accueillir plusieurs véhicules. Les finitions et les équipements sont à confirmer lors de la visite avec l'annonceur.",
    features: ["Balcon", "Parking", "Climatisation", "Clôture", "Cuisine aménagée"],
    documents: ["Titre foncier", "Permis de bâtir"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: true,
    publishedAt: "2026-11-21",
    views: 421,
    yearBuilt: 2024,
  },
  {
    id: "appartement-bonapriso",
    reference: "IDL-DEMO-004",
    title: "Appartement avec séjour lumineux",
    price: 125_000_000,
    transaction: "vente",
    type: "appartement",
    city: "Douala",
    neighborhood: "Bonapriso",
    region: "Littoral",
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    surface: 160,
    land: undefined,
    parking: 1,
    image: asset("df5dc.png"),
    gallery: [asset("df5dc.png"), asset("024df.png"), asset("d92fa.png")],
    description:
      "Un appartement baigné de lumière, avec un séjour ouvert sur un balcon arboré. Les trois chambres et les rangements intégrés en font une base confortable pour une famille ou un pied-à-terre.",
    description2:
      "L'immeuble dispose d'un accès sécurisé et d'un parking. Les charges et les modalités de copropriété sont à préciser avec l'annonceur.",
    features: ["Balcon", "Parking", "Climatisation", "Ascenseur"],
    documents: ["Titre foncier"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: true,
    publishedAt: "2026-11-20",
    views: 278,
    floor: 3,
    totalFloors: 5,
    yearBuilt: 2023,
  },
  {
    id: "terrain-kribi",
    reference: "IDL-DEMO-005",
    title: "Terrain résidentiel de 500 m²",
    price: 18_000_000,
    transaction: "vente",
    type: "terrain",
    city: "Kribi",
    neighborhood: "Londji",
    region: "Sud",
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    surface: 500,
    land: 500,
    parking: 0,
    image: asset("26532.png"),
    gallery: [asset("26532.png"), asset("7bb4a.png")],
    description:
      "Une parcelle plate et facile à viabiliser, dans une zone résidentielle en développement. L'accès se fait par une route praticable en saison sèche.",
    description2:
      "Le titre foncier et le plan cadastral sont annoncés par le vendeur. Faites vérifier la situation du terrain auprès des services compétents avant tout engagement.",
    features: ["Accès par route", "Zone résidentielle"],
    documents: ["Titre foncier", "Plan cadastral"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: false,
    publishedAt: "2026-11-12",
    views: 134,
  },
  {
    id: "appartement-meuble-bastos",
    reference: "IDL-DEMO-006",
    title: "Appartement meublé avec balcon",
    price: 350_000,
    transaction: "location",
    type: "appartement",
    city: "Yaoundé",
    neighborhood: "Bastos",
    region: "Centre",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    surface: 95,
    land: undefined,
    parking: 1,
    image: asset("df5dc.png"),
    gallery: [asset("df5dc.png"), asset("024df.png")],
    description:
      "Un appartement meublé prêt à vivre, avec un séjour lumineux, une cuisine équipée et un balcon. Idéal pour une mission ou une installation rapide dans la capitale.",
    description2:
      "Les équipements et le mobilier sont fournis selon l'état actuel. Le loyer et les charges sont à confirmer directement avec l'annonceur.",
    features: ["Meublé", "Balcon", "Climatisation", "Parking", "Cuisine aménagée"],
    documents: ["Titre foncier"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: true,
    publishedAt: "2026-11-23",
    views: 203,
    floor: 2,
    totalFloors: 4,
    yearBuilt: 2021,
  },
  {
    id: "studio-bonapriso",
    reference: "IDL-DEMO-007",
    title: "Studio meublé avec kitchenette",
    price: 180_000,
    transaction: "location",
    type: "studio",
    city: "Douala",
    neighborhood: "Bonapriso",
    region: "Littoral",
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    surface: 45,
    land: undefined,
    parking: 1,
    image: asset("024df.png"),
    gallery: [asset("024df.png"), asset("df5dc.png")],
    description:
      "Un studio fonctionnel et meublé, avec kitchenette aménagée et espace nuit séparé. Il convient à une personne seule ou à un séjour professionnel.",
    description2:
      "L'immeuble est sécurisé et proche des commerces. Les conditions de location et les charges sont à préciser avec l'annonceur.",
    features: ["Meublé", "Climatisation", "Parking", "Cuisine aménagée"],
    documents: [],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: false,
    publishedAt: "2026-11-15",
    views: 97,
    priceDropped: true,
    originalPrice: 200_000,
    floor: 1,
    totalFloors: 3,
    yearBuilt: 2020,
  },
  {
    id: "villa-bonapriso-location",
    reference: "IDL-DEMO-008",
    title: "Villa contemporaine meublée à louer",
    price: 1_200_000,
    transaction: "location",
    type: "villa",
    city: "Douala",
    neighborhood: "Bonapriso",
    region: "Littoral",
    rooms: 5,
    bedrooms: 4,
    bathrooms: 3,
    surface: 280,
    land: 600,
    parking: 2,
    image: asset("d92fa.png"),
    gallery: [asset("d92fa.png"), asset("df5dc.png"), asset("024df.png")],
    description:
      "Cette villa meublée offre un cadre de vie rare à Bonapriso : séjour ouvert sur la piscine, quatre chambres climatisées et un jardin entretenu.",
    description2:
      "Le loyer s'entend hors charges. Contactez l'annonceur pour connaître la durée minimale, les garanties demandées et organiser une visite.",
    features: ["Meublé", "Jardin", "Terrasse", "Parking", "Piscine", "Climatisation"],
    documents: ["Titre foncier"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: false,
    publishedAt: "2026-11-19",
    views: 388,
    yearBuilt: 2022,
  },
  {
    id: "terrain-yaounde",
    reference: "IDL-DEMO-009",
    title: "Terrain de 800 m² à Odza",
    price: 45_000_000,
    transaction: "vente",
    type: "terrain",
    city: "Yaoundé",
    neighborhood: "Odza",
    region: "Centre",
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    surface: 800,
    land: 800,
    parking: 0,
    image: asset("26532.png"),
    gallery: [asset("26532.png"), asset("52f31.png")],
    description:
      "Un terrain de 800 m² dans une zone résidentielle calme, avec un accès direct depuis la route principale. Le relief est favorable à la construction.",
    description2:
      "Le titre foncier est annoncé par le vendeur. Une vérification auprès des services compétents est indispensable avant toute transaction.",
    features: ["Accès par route", "Zone résidentielle", "Terrain plat"],
    documents: ["Titre foncier"],
    condition: "neuf",
    sellerType: "particulier",
    seller: "Mme Ngo",
    sellerRating: 3.9,
    sellerReviews: 3,
    sellerSince: "2026",
    sellerDescription: "Propriétaire particulière souhaitant vendre un terrain hérité. Bien situé, documents disponibles sur demande.",
    sellerPhone: "+237 6 90 44 55 66",
    isNew: false,
    publishedAt: "2026-11-10",
    views: 76,
  },
  {
    id: "villa-kribi",
    reference: "IDL-DEMO-010",
    title: "Villa de plain-pied proche de l'océan",
    price: 95_000_000,
    transaction: "vente",
    type: "villa",
    city: "Kribi",
    neighborhood: "Mpalla",
    region: "Sud",
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    surface: 180,
    land: 700,
    parking: 2,
    image: asset("9f819.png"),
    gallery: [asset("9f819.png"), asset("df5dc.png"), asset("024df.png")],
    description:
      "Une villa de plain-pied avec un grand jardin arboré, à quelques minutes de la plage. Les volumes sont simples et lumineux, avec une terrasse couverte.",
    description2:
      "Le bien conviendrait à une résidence secondaire ou à un projet de location saisonnière. Les documents et l'état du bien sont à vérifier lors de la visite.",
    features: ["Jardin", "Terrasse", "Parking", "Clôture", "Climatisation"],
    documents: ["Titre foncier", "Plan cadastral"],
    condition: "ancien",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: true,
    publishedAt: "2026-11-24",
    views: 256,
    yearBuilt: 2010,
  },
  {
    id: "appartement-bastos",
    reference: "IDL-DEMO-011",
    title: "Appartement spacieux à Bastos",
    price: 98_000_000,
    transaction: "vente",
    type: "appartement",
    city: "Yaoundé",
    neighborhood: "Bastos",
    region: "Centre",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    surface: 110,
    land: undefined,
    parking: 1,
    image: asset("df5dc.png"),
    gallery: [asset("df5dc.png"), asset("024df.png")],
    description:
      "Un appartement spacieux et bien exposé, dans un quartier recherché de Yaoundé. Le séjour communique avec une cuisine séparée et un balcon.",
    description2:
      "L'immeuble dispose d'un parking et d'un accès contrôlé. Les charges de copropriété sont à confirmer avec l'annonceur.",
    features: ["Balcon", "Parking", "Climatisation"],
    documents: ["Titre foncier"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: false,
    publishedAt: "2026-11-16",
    views: 142,
    floor: 4,
    totalFloors: 6,
    yearBuilt: 2020,
  },
  {
    id: "bureau-akwa",
    reference: "IDL-DEMO-012",
    title: "Bureau aménagé au cœur d'Akwa",
    price: 450_000,
    transaction: "location",
    type: "bureau",
    city: "Douala",
    neighborhood: "Akwa",
    region: "Littoral",
    rooms: 3,
    bedrooms: 0,
    bathrooms: 1,
    surface: 120,
    land: undefined,
    parking: 2,
    image: asset("d8a71.png"),
    gallery: [asset("d8a71.png"), asset("df5dc.png")],
    description:
      "Un plateau de bureaux aménagé et divisible, dans un immeuble bien situé à Akwa. L'espace dispose de la climatisation et d'un accès facile pour les visiteurs.",
    description2:
      "Le loyer s'entend hors charges. Les modalités du bail et les équipements inclus sont à préciser avec l'annonceur.",
    features: ["Climatisation", "Parking", "Ascenseur"],
    documents: ["Titre foncier"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: false,
    publishedAt: "2026-11-14",
    views: 88,
    floor: 2,
    totalFloors: 8,
    yearBuilt: 2018,
  },
  // 8 NOUVELLES ANNONCES
  {
    id: "villa-akwa-douala",
    reference: "IDL-DEMO-013",
    title: "Villa moderne au quartier résidentiel d'Akwa",
    price: 175_000_000,
    transaction: "vente",
    type: "villa",
    city: "Douala",
    neighborhood: "Akwa Nord",
    region: "Littoral",
    rooms: 5,
    bedrooms: 4,
    bathrooms: 3,
    surface: 240,
    land: 500,
    parking: 2,
    image: asset("d8a71.png"),
    gallery: [asset("d8a71.png"), asset("d92fa.png"), asset("df5dc.png")],
    description:
      "Villa moderne dans le secteur résidentiel d'Akwa Nord, à deux pas du centre des affaires. Finitions soignées, jardin paysager et groupe électrogène inclus.",
    description2:
      "Idéale pour une famille ou un cadre en mission longue durée. Les documents sont disponibles et la situation juridique est claire.",
    features: ["Jardin", "Parking", "Climatisation", "Groupe électrogène", "Clôture", "Terrasse"],
    documents: ["Titre foncier", "Permis de bâtir", "Plan cadastral"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: true,
    publishedAt: "2026-11-25",
    views: 61,
    yearBuilt: 2024,
  },
  {
    id: "appartement-cite-verte",
    reference: "IDL-DEMO-014",
    title: "Appartement 3 chambres à Cité verte",
    price: 85_000_000,
    transaction: "vente",
    type: "appartement",
    city: "Yaoundé",
    neighborhood: "Cité verte",
    region: "Centre",
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    surface: 120,
    land: undefined,
    parking: 1,
    image: asset("024df.png"),
    gallery: [asset("024df.png"), asset("df5dc.png"), asset("d92fa.png")],
    description:
      "Un appartement lumineux dans la résidence sécurisée de Cité verte, quartier prisé de Yaoundé. Vue dégagée depuis le balcon, cuisine équipée et rangements optimisés.",
    description2:
      "L'immeuble bénéficie d'une gardiennerie 24h/24, d'un groupe électrogène et d'un parking souterrain. Charges de copropriété à confirmer.",
    features: ["Balcon", "Parking", "Climatisation", "Groupe électrogène", "Ascenseur"],
    documents: ["Titre foncier", "Plan cadastral"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: true,
    publishedAt: "2026-11-25",
    views: 44,
    floor: 5,
    totalFloors: 7,
    yearBuilt: 2023,
  },
  {
    id: "studio-bastos-location",
    reference: "IDL-DEMO-015",
    title: "Studio meublé haut de gamme à Bastos",
    price: 220_000,
    transaction: "location",
    type: "studio",
    city: "Yaoundé",
    neighborhood: "Bastos",
    region: "Centre",
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    surface: 50,
    land: undefined,
    parking: 1,
    image: asset("df5dc.png"),
    gallery: [asset("df5dc.png"), asset("024df.png")],
    description:
      "Studio entièrement meublé et équipé dans le quartier diplomatique de Bastos. Idéal pour les expatriés, les diplomates ou les professionnels en mission.",
    description2:
      "Loyer incluant l'eau et certaines charges. Connexion internet haut débit disponible. Gardiennerie à l'entrée de la résidence.",
    features: ["Meublé", "Climatisation", "Parking", "Cuisine aménagée", "Groupe électrogène"],
    documents: ["Titre foncier"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: false,
    publishedAt: "2026-11-17",
    views: 118,
    floor: 2,
    totalFloors: 4,
    yearBuilt: 2022,
  },
  {
    id: "terrain-bonaberi",
    reference: "IDL-DEMO-016",
    title: "Terrain constructible de 400 m² à Bonabéri",
    price: 25_000_000,
    transaction: "vente",
    type: "terrain",
    city: "Douala",
    neighborhood: "Bonabéri",
    region: "Littoral",
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    surface: 400,
    land: 400,
    parking: 0,
    image: asset("26532.png"),
    gallery: [asset("26532.png"), asset("7bb4a.png")],
    description:
      "Terrain plat et viabilisé de 400 m² dans la zone résidentielle de Bonabéri en expansion. Accès depuis une rue bitumée, eau et électricité disponibles en bordure.",
    description2:
      "Documents en cours de régularisation. Idéal pour construction d'une villa individuelle ou d'un petit immeuble de rapport.",
    features: ["Accès par route", "Zone résidentielle", "Terrain plat", "Viabilisé"],
    documents: ["Plan cadastral"],
    condition: "neuf",
    sellerType: "particulier",
    seller: "M. Mbarga",
    sellerRating: 4.0,
    sellerReviews: 5,
    sellerSince: "2025",
    sellerDescription: "Propriétaire particulier disposant d'un terrain familial à valoriser.",
    sellerPhone: "+237 6 77 88 99 00",
    isNew: true,
    publishedAt: "2026-11-24",
    views: 52,
  },
  {
    id: "bureau-yaounde-centre",
    reference: "IDL-DEMO-017",
    title: "Plateau de bureaux vue panoramique — Centre-ville",
    price: 600_000,
    transaction: "location",
    type: "bureau",
    city: "Yaoundé",
    neighborhood: "Centre administratif",
    region: "Centre",
    rooms: 5,
    bedrooms: 0,
    bathrooms: 2,
    surface: 180,
    land: undefined,
    parking: 3,
    image: asset("d8a71.png"),
    gallery: [asset("d8a71.png"), asset("df5dc.png")],
    description:
      "Grand plateau de bureaux au 7ème étage d'un immeuble moderne du centre administratif de Yaoundé. Vue panoramique sur la ville, climatisation centralisée et fibre optique.",
    description2:
      "Idéal pour une PME, un cabinet ou une représentation. Le bail est disponible de 1 à 3 ans. Accès 24h/24 avec badge sécurisé.",
    features: ["Climatisation", "Parking", "Ascenseur", "Groupe électrogène"],
    documents: ["Titre foncier"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: false,
    publishedAt: "2026-11-13",
    views: 93,
    priceDropped: true,
    originalPrice: 700_000,
    floor: 7,
    totalFloors: 10,
    yearBuilt: 2019,
  },
  {
    id: "villa-kotto-douala",
    reference: "IDL-DEMO-018",
    title: "Villa 3 chambres à Kotto avec piscine",
    price: 92_000_000,
    transaction: "vente",
    type: "villa",
    city: "Douala",
    neighborhood: "Kotto",
    region: "Littoral",
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    surface: 180,
    land: 420,
    parking: 2,
    image: asset("9f819.png"),
    gallery: [asset("9f819.png"), asset("d92fa.png"), asset("024df.png")],
    description:
      "Villa de plain-pied avec piscine dans le quartier résidentiel de Kotto. Jardin entretenu, terrasse couverte et cuisine semi-ouverte sur le séjour.",
    description2:
      "Bien entretenu par son propriétaire. Titre foncier disponible. Visite organisée sur rendez-vous avec l'agence.",
    features: ["Piscine", "Jardin", "Terrasse", "Parking", "Climatisation", "Clôture"],
    documents: ["Titre foncier", "Plan cadastral"],
    condition: "ancien",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: false,
    publishedAt: "2026-11-11",
    views: 167,
    yearBuilt: 2012,
  },
  {
    id: "appartement-kribi-location",
    reference: "IDL-DEMO-019",
    title: "Appartement meublé face à l'océan — Kribi",
    price: 180_000,
    transaction: "location",
    type: "appartement",
    city: "Kribi",
    neighborhood: "Rond-point",
    region: "Sud",
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    surface: 65,
    land: undefined,
    parking: 1,
    image: asset("df5dc.png"),
    gallery: [asset("df5dc.png"), asset("26532.png")],
    description:
      "Appartement meublé avec vue sur l'océan Atlantique, à deux minutes à pied de la plage de Kribi. Idéal pour un séjour touristique, une mission ou une résidence secondaire.",
    description2:
      "Loyer à la semaine ou au mois. Les charges (eau, électricité) sont incluses jusqu'à un certain seuil. Réservation par avance recommandée en haute saison.",
    features: ["Meublé", "Climatisation", "Parking", "Cuisine aménagée"],
    documents: [],
    condition: "neuf",
    sellerType: "particulier",
    seller: "Mme Ondoa",
    sellerRating: 4.5,
    sellerReviews: 12,
    sellerSince: "2023",
    sellerDescription: "Propriétaire de biens de vacances à Kribi depuis 2023. Accueil personnalisé et disponibilité rapide.",
    sellerPhone: "+237 6 55 77 88 11",
    isNew: true,
    publishedAt: "2026-11-25",
    views: 38,
    floor: 2,
    totalFloors: 3,
    yearBuilt: 2021,
  },
  {
    id: "villa-melen-yaounde",
    reference: "IDL-DEMO-020",
    title: "Grande villa familiale à Melen — 5 chambres",
    price: 165_000_000,
    transaction: "vente",
    type: "villa",
    city: "Yaoundé",
    neighborhood: "Melen",
    region: "Centre",
    rooms: 7,
    bedrooms: 5,
    bathrooms: 4,
    surface: 300,
    land: 650,
    parking: 3,
    image: asset("d92fa.png"),
    gallery: [asset("d92fa.png"), asset("d8a71.png"), asset("df5dc.png")],
    description:
      "Grande villa familiale à Melen, l'un des quartiers résidentiels les plus prisés de Yaoundé. Cinq chambres, deux salons, une cuisine professionnelle et un grand jardin arboré.",
    description2:
      "Groupe électrogène de 25 KVA, système d'alarme et clôture haute. Titre foncier disponible. Visite sur rendez-vous avec l'annonceur.",
    features: [
      "Jardin",
      "Terrasse",
      "Parking",
      "Climatisation",
      "Groupe électrogène",
      "Clôture",
    ],
    documents: ["Titre foncier", "Permis de bâtir"],
    condition: "neuf",
    sellerType: "professionnel",
    seller: "IMMO DU LETCH",
    sellerRating: 4.8,
    sellerReviews: 47,
    sellerSince: "2019",
    sellerDescription:
      "IMMO DU LETCH est votre partenaire immobilier de confiance au Cameroun depuis 2019.",
    sellerPhone: "+237 6 55 00 00 00",
    isNew: true,
    publishedAt: "2026-11-26",
    views: 14,
    yearBuilt: 2023,
  },
];

export type Filters = {
  transaction: Transaction;
  city: string;
  type: PropertyType | "";
  priceMin: number | null;
  priceMax: number | null;
  surfaceMin: number | null;
  surfaceMax: number | null;
  roomsMin: number | null;
  bedroomsMin: number | null;
  documents: string[];
  features: string[];
  condition: Condition | "";
  sellerType: SellerType | "";
  query: string;
};

export const DEFAULT_FILTERS: Filters = {
  transaction: "vente",
  city: "",
  type: "",
  priceMin: null,
  priceMax: null,
  surfaceMin: null,
  surfaceMax: null,
  roomsMin: null,
  bedroomsMin: null,
  documents: [],
  features: [],
  condition: "",
  sellerType: "",
  query: "",
};

export type SortKey =
  | "pertinence"
  | "prix-asc"
  | "prix-desc"
  | "surface-desc"
  | "recent"
  | "vues";

export const SORT_LABELS: Record<SortKey, string> = {
  pertinence: "Pertinence",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  "surface-desc": "Surface",
  recent: "Plus récent",
  vues: "Plus populaires",
};

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value).replace(/[\u202F\u00A0]/g, " ");
}

export function priceLabel(listing: Listing): string {
  return `${formatPrice(listing.price)} FCFA${listing.transaction === "location" ? " / mois" : ""}`;
}

export function compactPrice(value: number): string {
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)} M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} k`;
  return formatPrice(value);
}

export function badgeLabel(listing: Listing): string {
  if (listing.type === "terrain") return "Terrain";
  return listing.transaction === "location" ? "À louer" : "À vendre";
}

export function metaLine(listing: Listing): string {
  if (listing.type === "terrain") {
    return `${formatPrice(listing.surface)} m²  •  ${listing.documents[0] ?? "Documents à vérifier"}  •  ${listing.features[0] ?? "À aménager"}`;
  }
  if (listing.type === "bureau") {
    return `${listing.rooms} espaces  •  ${formatPrice(listing.surface)} m²  •  ${listing.parking} parking`;
  }
  return `${listing.rooms} pièces  •  ${listing.bedrooms} chambres  •  ${listing.surface} m²`;
}

export const MARKET_AVERAGE: Record<string, number> = {
  Douala: 700_000,
  Yaoundé: 850_000,
  Kribi: 560_000,
};

export function marketPricePerM2(listing: Listing): number | null {
  if (listing.transaction !== "vente") return null;
  if (listing.type === "terrain" || listing.type === "bureau") return null;
  if (!listing.surface) return null;
  return Math.round(listing.price / listing.surface);
}

export function isGoodDeal(listing: Listing): boolean {
  const rating = getPriceRating(listing);
  return rating === "bon" || rating === "tres_bon" || rating === "excellent";
}

export function getPriceRating(listing: Listing): PriceRating | null {
  const perM2 = marketPricePerM2(listing);
  const average = MARKET_AVERAGE[listing.city];
  if (!perM2 || !average) return null;
  const ratio = perM2 / average;
  if (ratio <= 0.8) return "excellent";
  if (ratio <= 0.9) return "tres_bon";
  if (ratio <= 0.97) return "bon";
  if (ratio <= 1.08) return "marche";
  return "eleve";
}

/**
 * Prépare un texte pour la recherche : minuscules, sans accents ni ligatures,
 * ponctuation et tirets remplacés par des espaces.
 */
export function normalizeText(value: string): string {
  return value
    .replace(/œ/gi, "oe")
    .replace(/æ/gi, "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
}

function searchableText(listing: Listing): string {
  return normalizeText(
    [
      listing.title,
      listing.city,
      listing.neighborhood,
      listing.description,
      listing.type,
      TYPE_LABELS[listing.type],
      listing.transaction,
      TRANSACTION_LABELS[listing.transaction],
      CONDITION_LABELS[listing.condition],
      listing.seller,
      ...listing.features,
      ...listing.documents,
    ].join(" "),
  );
}

export function filterListings(listings: Listing[], filters: Filters): Listing[] {
  const words = normalizeText(filters.query).split(" ").filter(Boolean);
  return listings.filter((listing) => {
    if (filters.transaction && listing.transaction !== filters.transaction) return false;
    if (filters.city && listing.city !== filters.city) return false;
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.priceMin !== null && listing.price < filters.priceMin) return false;
    if (filters.priceMax !== null && listing.price > filters.priceMax) return false;
    if (filters.surfaceMin !== null && listing.surface < filters.surfaceMin) return false;
    if (filters.surfaceMax !== null && listing.surface > filters.surfaceMax) return false;
    if (filters.roomsMin !== null && listing.rooms < filters.roomsMin) return false;
    if (filters.bedroomsMin !== null && listing.bedrooms < filters.bedroomsMin) return false;
    if (
      filters.documents.length > 0 &&
      !filters.documents.every((doc) => listing.documents.includes(doc))
    ) {
      return false;
    }
    if (
      filters.features.length > 0 &&
      !filters.features.every((feature) => listing.features.includes(feature))
    ) {
      return false;
    }
    if (filters.condition && listing.condition !== filters.condition) return false;
    if (filters.sellerType && listing.sellerType !== filters.sellerType) return false;
    if (words.length > 0) {
      const haystack = searchableText(listing);
      if (!words.every((word) => haystack.includes(word))) return false;
    }
    return true;
  });
}

export function sortListings(listings: Listing[], sort: SortKey): Listing[] {
  const sorted = [...listings];
  switch (sort) {
    case "prix-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "prix-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "surface-desc":
      return sorted.sort((a, b) => b.surface - a.surface);
    case "recent":
      return sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    case "vues":
      return sorted.sort((a, b) => b.views - a.views);
    default:
      return sorted;
  }
}

export function describeFilters(filters: Filters): string {
  const parts: string[] = [TRANSACTION_LABELS[filters.transaction]];
  if (filters.type) parts.push(TYPE_LABELS[filters.type]);
  if (filters.city) parts.push(filters.city);
  if (filters.priceMin !== null && filters.priceMax !== null) {
    parts.push(`${compactPrice(filters.priceMin)}–${compactPrice(filters.priceMax)} FCFA`);
  } else if (filters.priceMax !== null) {
    parts.push(`≤ ${compactPrice(filters.priceMax)} FCFA`);
  } else if (filters.priceMin !== null) {
    parts.push(`≥ ${compactPrice(filters.priceMin)} FCFA`);
  }
  if (filters.surfaceMin !== null && filters.surfaceMax !== null) {
    parts.push(`${filters.surfaceMin}–${filters.surfaceMax} m²`);
  } else if (filters.surfaceMin !== null) {
    parts.push(`≥ ${filters.surfaceMin} m²`);
  } else if (filters.surfaceMax !== null) {
    parts.push(`≤ ${filters.surfaceMax} m²`);
  }
  if (filters.roomsMin !== null) parts.push(`${filters.roomsMin} pièces +`);
  if (filters.bedroomsMin !== null) parts.push(`${filters.bedroomsMin} chambres +`);
  if (filters.condition) parts.push(CONDITION_LABELS[filters.condition]);
  if (filters.sellerType) {
    parts.push(filters.sellerType === "professionnel" ? "Professionnel" : "Particulier");
  }
  if (filters.documents.length > 0) parts.push(filters.documents.join(", "));
  if (filters.features.length > 0) parts.push(filters.features.join(", "));
  if (filters.query) parts.push(`« ${filters.query} »`);
  return parts.join(" · ");
}

export function findListing(id: string | null | undefined): Listing {
  return LISTINGS.find((listing) => listing.id === id) ?? LISTINGS[0];
}

export function getSellerListings(seller: string, excludeId?: string): Listing[] {
  return LISTINGS.filter((l) => l.seller === seller && l.id !== excludeId);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}
