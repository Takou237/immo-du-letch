import { useApp, type Language } from "../store/AppStore";
import type {
  Condition,
  PriceRating,
  PropertyType,
  SortKey,
  Transaction,
} from "../data/listings";
import type { HomeTab } from "../data/homeContent";

export type Translations = {
  nav: {
    searchPlaceholder: string[];
    searchBtn: string;
    popularSuggestions: string;
    favorites: string;
    signIn: string;
    loginShort: string;
    menu: string;
    myProfile: string;
    myFavorites: string;
    postListing: string;
    logout: string;
    googleAccount: string;
    proAccount: string;
    particulierAccount: string;
    ourAdvice: string;
    buy: string;
    rent: string;
    land: string;
    offices: string;
    furnished: string;
  };
  footer: {
    tagline: string;
    desc1: string;
    desc2: string;
    searchTitle: string;
    buyProperty: string;
    rentHome: string;
    landForSale: string;
    officesCommerce: string;
    supportTitle: string;
    postListing: string;
    realEstateAdvice: string;
    helpContact: string;
    transactionSafety: string;
    exploreTitle: string;
    inDouala: string;
    inYaounde: string;
    inKribi: string;
    allCities: string;
    legal: string;
    langRegion: string;
    disclaimer: string;
    ourAdvice: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    city: string;
    allCities: string;
    keywordLabel: string;
    keywordPlaceholder: string;
    propertyType: string;
    allTypes: string;
    budgetMin: string;
    budgetMax: string;
    surfaceMin: string;
    rooms: string;
    any: string;
    moreCriteria: string;
    moreCriteriaSub: string;
    searchCount: (n: number) => string;
    viewProperty: string;
    trustBadges: string[];
    statsLabels: [string, string, string, string];
    categoriesTitle: string;
    categoriesSub: string;
    listingCount: (n: number) => string;
    popularSearches: string;
    featuredTitle: string;
    featuredSub: string;
    seeAllListings: (n: number) => string;
    favoritePick: string;
    discover: string;
    ctaTitle: string;
    ctaDesc1: string;
    ctaDesc2: string;
    ctaBtn: string;
    estBadge: string;
    estTitle: string;
    estDesc: string;
    estSurface: string;
    estResultLabel: string;
    citiesTitle: string;
    citiesSub: string;
    cityTaglines: Record<string, string>;
    recentTitle: string;
    adviceTitle: string;
    adviceSub: string;
    faqTitle: string;
    readArticle: string;
    close: string;
    tabs: Record<HomeTab, string>;
    categories: Record<string, string>;
    popularPresets: string[];
  };
  results: {
    home: string;
    properties: string;
    forRent: string;
    forSale: string;
    inCity: (c: string) => string;
    foundCount: (n: number) => string;
    saveSearch: string;
    reset: string;
    filters: string;
    sortBy: string;
    list: string;
    grid: string;
    map: string;
    transaction: string;
    city: string;
    propertyType: string;
    minPrice: string;
    maxPrice: string;
    minSurface: string;
    maxSurface: string;
    minBedrooms: string;
    condition: string;
    sellerType: string;
    documents: string;
    features: string;
    all: string;
    professional: string;
    individual: string;
    noResultsTitle: string;
    noResultsDesc: string;
    resetFilters: string;
    apply: string;
    pageOf: (p: number, total: number) => string;
    prev: string;
    next: string;
  };
  detail: {
    backToResults: string;
    buy: string;
    rent: string;
    viewsCount: (n: number) => string;
    favoritesCount: (n: number) => string;
    refPublished: (ref: string, date: string) => string;
    compare: string;
    compared: string;
    favorite: string;
    saved: string;
    share: string;
    seePhotos: (n: number) => string;
    storyLand: string;
    storyOffice: string;
    storyDefault: string;
    priceAnalysis: string;
    characteristics: string;
    dailyExtras: string;
    noFeatures: string;
    goodReflexes: string;
    locationNotice: string;
    seeOnMap: string;
    yourContact: string;
    reviews: (n: number) => string;
    seeProfile: string;
    showPhone: string;
    requestVisit: string;
    yourName: string;
    namePlaceholder: string;
    yourEmail: string;
    yourMessage: string;
    sendMessage: string;
    contactDisclaimer: string;
    prudenceTitle: string;
    prudenceDesc: string;
    similarTitle: (city: string) => string;
    similarSub: string;
    seeThisProperty: string;
    rentMonthlyNote: string;
    saleNote: string;
    forSaleBadge: string;
    forRentBadge: string;
    newBadge: string;
    charLabels: {
      type: string;
      transaction: string;
      landSurface: string;
      usableSurface: string;
      livingSurface: string;
      land: string;
      notApplicable: string;
      roomsBedrooms: string;
      bathrooms: string;
      parking: string;
      parkingCount: (n: number) => string;
      notSpecified: string;
      condition: string;
      pricePerM2: string;
      yearBuilt: string;
      floor: string;
      floorVal: (f: number, t: number) => string;
    };
  };
  modals: {
    loginTitle: string;
    registerTitle: string;
    authSubtitle: string;
    loginTab: string;
    registerTab: string;
    continueGoogle: string;
    orByEmail: string;
    emailLabel: string;
    passwordLabel: string;
    forgotPassword: string;
    signInBtn: string;
    fullNameLabel: string;
    phoneLabel: string;
    accountTypeLabel: string;
    individual: string;
    proAgency: string;
    confirmPassword: string;
    createAccountBtn: string;
    back: string;
    googleTitle: string;
    googleSubtitle: string;
    orOtherGmail: string;
    gmailAddress: string;
    displayNameOpt: string;
    continueGmail: string;
    favoritesTitle: string;
    favoritesCountText: (n: number) => string;
    noFavoritesTitle: string;
    noFavoritesDesc: string;
    discoverListings: string;
    priceDropped: string;
    savedSearchesTitle: string;
    noSavedSearches: string;
    recentlyViewedTitle: string;
    comparator: string;
    clear: string;
    compareBtn: (n: number) => string;
  };
  deposit: {
    modalLabel: string;
    title: string;
    stepOf: (s: number, total: number, label: string) => string;
    steps: [string, string, string, string];
    transactionType: string;
    sellProperty: string;
    rentOut: string;
    propertyCategory: string;
    city: string;
    neighborhood: string;
    monthlyRent: string;
    salePrice: string;
    surface: string;
    rooms: string;
    featuresIncluded: string;
    yourNameOrAgency: string;
    phoneWhatsapp: string;
    email: string;
    prev: string;
    next: string;
    publish: string;
  };
  compare: {
    title: string;
    subtitle: string;
    clearAll: string;
    criteria: string;
    price: string;
    bestPrice: string;
    marketEval: string;
    propertyType: string;
    sale: string;
    rent: string;
    surface: string;
    roomsBedrooms: string;
    land: string;
    condition: string;
    documents: string;
    notSpecified: string;
    features: string;
    seller: string;
    viewListing: string;
  };
  financing: {
    title: string;
    subtitle: string;
    estimatedMonthly: string;
    perMonth: string;
    downPayment: (pct: number) => string;
    duration: string;
    monthsUnit: string;
    disclaimer: (principal: string) => string;
  };
  seller: {
    certifiedPro: string;
    verifiedIndiv: string;
    reviews: (n: number) => string;
    memberSince: (y: string) => string;
    contactAdvertiser: string;
    otherListings: (name: string, n: number) => string;
    noOtherListings: string;
  };
  profile: {
    listingsStat: string;
    favoritesStat: string;
    alertsStat: string;
    logout: string;
    memberSince: (d: string) => string;
    tabListings: (n: number) => string;
    tabDeposit: string;
    tabDepositShort: string;
    tabInfo: string;
    tabInfoShort: string;
    infoTitle: string;
    infoSub: string;
    fullName: string;
    email: string;
    phoneWhatsapp: string;
    accountType: string;
    saveBtn: string;
    filterAll: (n: number) => string;
    filterPending: (n: number) => string;
    filterApproved: (n: number) => string;
    filterRejected: (n: number) => string;
    emptyTitle: string;
    emptyDesc: string;
    emptyBtn: string;
    statusPending: string;
    statusApproved: string;
    statusRejected: string;
  };
  types: Record<PropertyType, string>;
  typesSingular: Record<PropertyType, string>;
  transactions: Record<Transaction, string>;
  conditions: Record<Condition, string>;
  sorts: Record<SortKey, string>;
  priceRatings: Record<PriceRating, { label: string; short: string }>;
};

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    nav: {
      searchPlaceholder: [
        "Rechercher une villa à Bonapriso…",
        "Appartement meublé à Bastos, Yaoundé…",
        "Terrain titré à Kribi…",
        "Studio ou bureau à louer à Douala…",
      ],
      searchBtn: "Rechercher",
      popularSuggestions: "Suggestions populaires",
      favorites: "Favoris",
      signIn: "Se connecter",
      loginShort: "Connexion",
      menu: "Menu",
      myProfile: "Mon profil & mes annonces",
      myFavorites: "Mes favoris & recherches",
      postListing: "Déposer une annonce",
      logout: "Se déconnecter",
      googleAccount: "Compte Google",
      proAccount: "Professionnel",
      particulierAccount: "Particulier",
      ourAdvice: "Nos conseils",
      buy: "Acheter",
      rent: "Louer",
      land: "Terrains",
      offices: "Bureaux & commerces",
      furnished: "Locations meublées",
    },
    footer: {
      tagline: "Votre partenaire immobilier",
      desc1: "Acheter, louer et investir au Cameroun.",
      desc2: "À chaque projet, une nouvelle adresse.",
      searchTitle: "Rechercher",
      buyProperty: "Acheter un bien",
      rentHome: "Louer un logement",
      landForSale: "Terrains à vendre",
      officesCommerce: "Bureaux & commerces",
      supportTitle: "Vous accompagner",
      postListing: "Déposer une annonce",
      realEstateAdvice: "Conseils immobiliers",
      helpContact: "Aide & contact",
      transactionSafety: "Sécurité des transactions",
      exploreTitle: "Explorer le Cameroun",
      inDouala: "Immobilier à Douala",
      inYaounde: "Immobilier à Yaoundé",
      inKribi: "Immobilier à Kribi",
      allCities: "Toutes les villes",
      legal: "© IMMO DU LETCH • Mentions légales • Confidentialité • Cookies",
      langRegion: "Français · Cameroun · FCFA",
      disclaimer:
        "Maquette de démonstration : annonces, prix et visuels illustratifs. Disponibilité et documents à confirmer auprès de l’annonceur.",
      ourAdvice: "Nos conseils",
    },
    home: {
      heroBadge: "IMMOBILIER AU CAMEROUN · DOUALA · YAOUNDÉ · KRIBI",
      heroTitle: "Trouvez le bien qui vous ressemble.",
      heroSubtitle:
        "Acheter, louer ou investir en toute confiance. Comparez les prix du marché en temps réel.",
      city: "Ville",
      allCities: "Toutes",
      keywordLabel: "Quartier ou mot-clé",
      keywordPlaceholder: "Bonapriso, Bastos, piscine…",
      propertyType: "Type de bien",
      allTypes: "Tous les types",
      budgetMin: "Budget min.",
      budgetMax: "Budget max.",
      surfaceMin: "Surface min.",
      rooms: "Chambres",
      any: "Indifférent",
      moreCriteria: "+ Plus de critères avancés",
      moreCriteriaSub: "Titre foncier, équipements, état du bien…",
      searchCount: (n) => `Rechercher (${n} bien${n > 1 ? "s" : ""})`,
      viewProperty: "Voir le bien",
      trustBadges: [
        "Titre foncier & documents contrôlés",
        "Annonceurs identifiés & notés",
        "Évaluation prix du marché",
      ],
      statsLabels: ["Annonces actives", "Villes couvertes", "Types de biens", "Ans d'expérience"],
      categoriesTitle: "Quel bien recherchez-vous ?",
      categoriesSub: "Du premier appartement au prochain investissement.",
      listingCount: (n) => `${n} annonce${n > 1 ? "s" : ""}`,
      popularSearches: "Recherches populaires",
      featuredTitle: "Des biens pour vos envies",
      featuredSub: "Une sélection pour habiter, louer ou investir au Cameroun.",
      seeAllListings: (n) => `Voir toutes les annonces (${n})`,
      favoritePick: "Coup de cœur",
      discover: "Découvrir",
      ctaTitle: "Vous vendez ou louez un bien ?",
      ctaDesc1: "Donnez de la visibilité à votre annonce et présentez votre bien",
      ctaDesc2: "aux personnes qui le recherchent. Photos, détails, prix : à vous de jouer.",
      ctaBtn: "Déposer mon annonce",
      estBadge: "ESTIMATION GRATUITE",
      estTitle: "Estimez la valeur de votre bien au Cameroun",
      estDesc:
        "Obtenez une fourchette indicative basée sur les prix moyens au m² à Douala, Yaoundé et Kribi.",
      estSurface: "Surface (m²)",
      estResultLabel: "Estimation indicative",
      citiesTitle: "Votre projet, votre ville",
      citiesSub: "Découvrez les biens dans les villes qui vous attirent.",
      cityTaglines: {
        Douala: "Vivre au cœur du littoral",
        Yaoundé: "Trouver votre place dans la capitale",
        Kribi: "Habiter ou investir côté océan",
      },
      recentTitle: "Consultés récemment",
      adviceTitle: "Nos conseils pour votre projet",
      adviceSub: "Guides pratiques pour acheter, louer et sécuriser vos démarches au Cameroun.",
      faqTitle: "Questions fréquentes",
      readArticle: "Lire l'article",
      close: "Fermer",
      tabs: {
        vente: "Acheter",
        location: "Louer",
        meuble: "Meublé",
        terrain: "Terrains",
        pro: "Professionnel",
      },
      categories: {
        "Maisons & villas": "Maisons & villas",
        Appartements: "Appartements",
        Terrains: "Terrains",
        "Studios & chambres": "Studios & chambres",
        "Bureaux & commerces": "Bureaux & commerces",
        "Locations meublées": "Locations meublées",
      },
      popularPresets: [
        "Villa à Douala ≤ 200 M",
        "Appartement meublé à Yaoundé",
        "Terrain titré à Kribi",
        "Studio à louer à Douala",
        "Bureau à louer",
      ],
    },
    results: {
      home: "Accueil",
      properties: "Biens",
      forRent: "à louer",
      forSale: "à vendre",
      inCity: (c) => `à ${c}`,
      foundCount: (n) => `${n} annonce${n > 1 ? "s" : ""} trouvée${n > 1 ? "s" : ""}`,
      saveSearch: "Sauvegarder cette recherche",
      reset: "Réinitialiser",
      filters: "Filtres",
      sortBy: "Trier par",
      list: "Liste",
      grid: "Grille",
      map: "Carte",
      transaction: "Transaction",
      city: "Ville",
      propertyType: "Type de bien",
      minPrice: "Budget min.",
      maxPrice: "Budget max.",
      minSurface: "Surface min.",
      maxSurface: "Surface max.",
      minBedrooms: "Chambres min.",
      condition: "État du bien",
      sellerType: "Annonceur",
      documents: "Documents",
      features: "Équipements",
      all: "Tous",
      professional: "Professionnel",
      individual: "Particulier",
      noResultsTitle: "Aucune annonce ne correspond à vos critères",
      noResultsDesc: "Essayez d'élargir votre budget, votre ville ou de réinitialiser les filtres.",
      resetFilters: "Réinitialiser les filtres",
      apply: "Appliquer",
      pageOf: (p, total) => `Page ${p} sur ${total}`,
      prev: "Précédent",
      next: "Suivant",
    },
    detail: {
      backToResults: "Retour aux résultats",
      buy: "Acheter",
      rent: "Louer",
      viewsCount: (n) => `${n} personnes ont consulté ce bien`,
      favoritesCount: (n) => `${n} favoris`,
      refPublished: (ref, date) => `Réf. ${ref} · Publié le ${date}`,
      compare: "Comparer",
      compared: "Comparé",
      favorite: "Favori",
      saved: "Enregistré",
      share: "Partager",
      seePhotos: (n) => `Voir les ${n} photo${n > 1 ? "s" : ""}`,
      storyLand: "Un terrain à imaginer à votre façon",
      storyOffice: "Un espace à imaginer pour votre activité",
      storyDefault: "Un cadre de vie à imaginer à votre façon",
      priceAnalysis: "Analyse du prix par rapport au marché",
      characteristics: "Les caractéristiques du bien",
      dailyExtras: "Les petits plus au quotidien",
      noFeatures: "Aucun équipement n'est renseigné pour ce bien.",
      goodReflexes: "Les bons réflexes avant de vous engager",
      locationNotice:
        "L'adresse exacte est communiquée par l'annonceur lors de la prise de rendez-vous.",
      seeOnMap: "Voir sur la carte",
      yourContact: "Votre interlocuteur",
      reviews: (n) => `${n} avis`,
      seeProfile: "Voir le profil et ses annonces",
      showPhone: "Afficher le numéro",
      requestVisit: "Demandez une visite ou plus de détails.",
      yourName: "Votre nom",
      namePlaceholder: "Nom et prénom",
      yourEmail: "Votre e-mail",
      yourMessage: "Votre message",
      sendMessage: "Envoyer mon message",
      contactDisclaimer:
        "Vos coordonnées sont transmises à l'annonceur pour lui permettre de répondre à votre demande.",
      prudenceTitle: "La prudence fait partie du projet.",
      prudenceDesc:
        "Visitez le bien et faites contrôler les documents avant tout paiement. Ne communiquez jamais vos codes bancaires à un annonceur.",
      similarTitle: (city) => `D'autres biens à découvrir à ${city}`,
      similarSub: "Continuez à explorer les possibilités pour votre projet.",
      seeThisProperty: "Voir ce bien",
      rentMonthlyNote: "Loyer mensuel · Charges à préciser avec l'annonceur",
      saleNote: "Prix de vente · Frais à préciser avec l'annonceur",
      forSaleBadge: "À vendre",
      forRentBadge: "À louer",
      newBadge: "Nouveau",
      charLabels: {
        type: "Type de bien",
        transaction: "Transaction",
        landSurface: "Surface du terrain",
        usableSurface: "Surface utile",
        livingSurface: "Surface habitable",
        land: "Terrain",
        notApplicable: "Non applicable",
        roomsBedrooms: "Pièces / chambres",
        bathrooms: "Salles de bains",
        parking: "Stationnement",
        parkingCount: (n) => `${n} places annoncées`,
        notSpecified: "Non renseigné",
        condition: "État du bien",
        pricePerM2: "Prix au m²",
        yearBuilt: "Année de construction",
        floor: "Étage",
        floorVal: (f, t) => `${f}e sur ${t}`,
      },
    },
    modals: {
      loginTitle: "Se connecter",
      registerTitle: "Créer un compte",
      authSubtitle: "Retrouvez vos favoris, alertes et annonces sur IMMO DU LETCH.",
      loginTab: "Connexion",
      registerTab: "Inscription",
      continueGoogle: "Continuer avec Google (Gmail)",
      orByEmail: "OU PAR E-MAIL",
      emailLabel: "Adresse e-mail",
      passwordLabel: "Mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      signInBtn: "Se connecter",
      fullNameLabel: "Nom complet ou agence *",
      phoneLabel: "Téléphone",
      accountTypeLabel: "Type de compte",
      individual: "Particulier",
      proAgency: "Agence / Pro",
      confirmPassword: "Confirmer *",
      createAccountBtn: "Créer mon compte",
      back: "Retour",
      googleTitle: "Connexion avec Google",
      googleSubtitle:
        "Sélectionnez un compte Gmail ou saisissez votre adresse Gmail pour continuer sur IMMO DU LETCH.",
      orOtherGmail: "OU AUTRE COMPTE GMAIL",
      gmailAddress: "Adresse Gmail *",
      displayNameOpt: "Nom affiché (optionnel)",
      continueGmail: "Continuer avec ce compte Gmail",
      favoritesTitle: "Mes favoris",
      favoritesCountText: (n) => `${n} bien${n > 1 ? "s" : ""} enregistré${n > 1 ? "s" : ""} sur cet appareil.`,
      noFavoritesTitle: "Aucun favori pour le moment",
      noFavoritesDesc: "Cliquez sur le cœur d’une annonce pour la retrouver ici.",
      discoverListings: "Découvrir les annonces",
      priceDropped: "Prix baissé",
      savedSearchesTitle: "Mes recherches enregistrées",
      noSavedSearches: "Créez une alerte depuis la page de résultats pour retrouver vos critères ici.",
      recentlyViewedTitle: "Consultés récemment",
      comparator: "Comparateur",
      clear: "Vider",
      compareBtn: (n) => `Comparer (${n})`,
    },
    deposit: {
      modalLabel: "Déposer une annonce immobilière",
      title: "Déposer une annonce",
      stepOf: (s, total, label) => `Étape ${s} sur ${total} — ${label}`,
      steps: ["Projet", "Localisation", "Détails", "Contact"],
      transactionType: "Type de transaction",
      sellProperty: "Vendre un bien",
      rentOut: "Mettre en location",
      propertyCategory: "Catégorie du bien",
      city: "Ville",
      neighborhood: "Quartier",
      monthlyRent: "Loyer mensuel (FCFA)",
      salePrice: "Prix de vente (FCFA)",
      surface: "Surface (m²)",
      rooms: "Nombre de pièces",
      featuresIncluded: "Équipements inclus",
      yourNameOrAgency: "Votre nom ou agence *",
      phoneWhatsapp: "Téléphone (WhatsApp) *",
      email: "E-mail",
      prev: "Précédent",
      next: "Suivant",
      publish: "Publier l'annonce",
    },
    compare: {
      title: "Comparateur côte à côte",
      subtitle: "Comparez jusqu'à 3 biens pour faire le meilleur choix.",
      clearAll: "Vider la comparaison",
      criteria: "Critères",
      price: "Prix",
      bestPrice: "Meilleur prix",
      marketEval: "Évaluation marché",
      propertyType: "Type de bien",
      sale: "Vente",
      rent: "Location",
      surface: "Surface",
      roomsBedrooms: "Pièces / Chambres",
      land: "Terrain",
      condition: "État",
      documents: "Documents",
      notSpecified: "Non renseigné",
      features: "Équipements",
      seller: "Annonceur",
      viewListing: "Voir la fiche",
    },
    financing: {
      title: "Simulateur de financement",
      subtitle: "Estimez votre mensualité de crédit immobilier (taux indicatif 9 % / an).",
      estimatedMonthly: "Mensualité estimée",
      perMonth: "FCFA / mois",
      downPayment: (pct) => `Apport initial (${pct} %)`,
      duration: "Durée du remboursement",
      monthsUnit: "mois",
      disclaimer: (principal) =>
        `Montant emprunté : ${principal} FCFA · Simulation indicative uniquement, hors frais de dossier et assurance. Rapprochez-vous de votre établissement bancaire pour une offre personnalisée.`,
    },
    seller: {
      certifiedPro: "Professionnel certifié",
      verifiedIndiv: "Particulier vérifié",
      reviews: (n) => `(${n} avis)`,
      memberSince: (y) => `· Membre depuis ${y}`,
      contactAdvertiser: "Contacter l'annonceur",
      otherListings: (name, n) => `Autres annonces de ${name} (${n})`,
      noOtherListings: "Aucune autre annonce active pour cet annonceur.",
    },
    profile: {
      listingsStat: "Annonces",
      favoritesStat: "Favoris",
      alertsStat: "Alertes",
      logout: "Se déconnecter",
      memberSince: (d) => `Membre depuis ${d}`,
      tabListings: (n) => `Mes annonces (${n})`,
      tabDeposit: "+ Déposer une annonce",
      tabDepositShort: "Déposer",
      tabInfo: "Informations du profil",
      tabInfoShort: "Mon profil",
      infoTitle: "Informations du profil",
      infoSub: "Mettez à jour vos coordonnées pour vos futures annonces et prises de contact.",
      fullName: "Nom complet ou agence",
      email: "Adresse e-mail",
      phoneWhatsapp: "Téléphone (WhatsApp)",
      accountType: "Type de compte",
      saveBtn: "Enregistrer les modifications",
      filterAll: (n) => `Toutes (${n})`,
      filterPending: (n) => `En attente (${n})`,
      filterApproved: (n) => `Validées (${n})`,
      filterRejected: (n) => `Refusées (${n})`,
      emptyTitle: "Aucune annonce ici",
      emptyDesc: "Déposez votre premier bien pour le soumettre à la validation.",
      emptyBtn: "Déposer une annonce",
      statusPending: "En attente",
      statusApproved: "Validée",
      statusRejected: "Refusée",
    },
    types: {
      villa: "Maisons & villas",
      appartement: "Appartements",
      terrain: "Terrains",
      studio: "Studios & chambres",
      bureau: "Bureaux & commerces",
    },
    typesSingular: {
      villa: "Maison / villa",
      appartement: "Appartement",
      terrain: "Terrain",
      studio: "Studio",
      bureau: "Bureau / commerce",
    },
    transactions: {
      vente: "Acheter",
      location: "Louer",
    },
    conditions: {
      neuf: "Neuf / récent",
      ancien: "Ancien",
      a_renover: "À rénover",
    },
    sorts: {
      pertinence: "Pertinence",
      "prix-asc": "Prix croissant",
      "prix-desc": "Prix décroissant",
      "surface-desc": "Surface",
      recent: "Plus récent",
      vues: "Plus populaires",
    },
    priceRatings: {
      excellent: { label: "Excellent prix", short: "Excellent" },
      tres_bon: { label: "Très bon prix", short: "Très bon" },
      bon: { label: "Bon prix", short: "Bon prix" },
      marche: { label: "Prix du marché", short: "Marché" },
      eleve: { label: "Prix élevé", short: "Élevé" },
    },
  },
  en: {
    nav: {
      searchPlaceholder: [
        "Search a villa in Bonapriso…",
        "Furnished apartment in Bastos, Yaoundé…",
        "Titled land in Kribi…",
        "Studio or office to rent in Douala…",
      ],
      searchBtn: "Search",
      popularSuggestions: "Popular suggestions",
      favorites: "Favorites",
      signIn: "Sign in",
      loginShort: "Sign in",
      menu: "Menu",
      myProfile: "My profile & listings",
      myFavorites: "My favorites & searches",
      postListing: "Post a listing",
      logout: "Sign out",
      googleAccount: "Google Account",
      proAccount: "Professional",
      particulierAccount: "Individual",
      ourAdvice: "Our advice",
      buy: "Buy",
      rent: "Rent",
      land: "Land",
      offices: "Offices & commercial",
      furnished: "Furnished rentals",
    },
    footer: {
      tagline: "Your real estate partner",
      desc1: "Buy, rent and invest in Cameroon.",
      desc2: "For every project, a new address.",
      searchTitle: "Search",
      buyProperty: "Buy a property",
      rentHome: "Rent a home",
      landForSale: "Land for sale",
      officesCommerce: "Offices & commercial",
      supportTitle: "Support",
      postListing: "Post a listing",
      realEstateAdvice: "Real estate advice",
      helpContact: "Help & contact",
      transactionSafety: "Transaction safety",
      exploreTitle: "Explore Cameroon",
      inDouala: "Real estate in Douala",
      inYaounde: "Real estate in Yaoundé",
      inKribi: "Real estate in Kribi",
      allCities: "All cities",
      legal: "© IMMO DU LETCH • Legal notice • Privacy • Cookies",
      langRegion: "English · Cameroon · FCFA",
      disclaimer:
        "Demo showcase: illustrative listings, prices and visuals. Availability and documents must be confirmed with the seller.",
      ourAdvice: "Our advice",
    },
    home: {
      heroBadge: "REAL ESTATE IN CAMEROON · DOUALA · YAOUNDÉ · KRIBI",
      heroTitle: "Find the property that fits you.",
      heroSubtitle:
        "Buy, rent or invest with confidence. Compare market prices in real time.",
      city: "City",
      allCities: "All",
      keywordLabel: "District or keyword",
      keywordPlaceholder: "Bonapriso, Bastos, pool…",
      propertyType: "Property type",
      allTypes: "All types",
      budgetMin: "Min budget",
      budgetMax: "Max budget",
      surfaceMin: "Min area",
      rooms: "Bedrooms",
      any: "Any",
      moreCriteria: "+ More advanced criteria",
      moreCriteriaSub: "Land title, amenities, condition…",
      searchCount: (n) => `Search (${n} propert${n > 1 ? "ies" : "y"})`,
      viewProperty: "View property",
      trustBadges: [
        "Land title & documents checked",
        "Verified & rated advertisers",
        "Market price evaluation",
      ],
      statsLabels: ["Active listings", "Cities covered", "Property types", "Years of experience"],
      categoriesTitle: "What property are you looking for?",
      categoriesSub: "From your first apartment to your next investment.",
      listingCount: (n) => `${n} listing${n > 1 ? "s" : ""}`,
      popularSearches: "Popular searches",
      featuredTitle: "Properties for your plans",
      featuredSub: "A curated selection to live, rent or invest in Cameroon.",
      seeAllListings: (n) => `See all listings (${n})`,
      favoritePick: "Top pick",
      discover: "Discover",
      ctaTitle: "Selling or renting a property?",
      ctaDesc1: "Give your listing visibility and showcase your property",
      ctaDesc2: "to people looking for it. Photos, details, price: it's your turn.",
      ctaBtn: "Post my listing",
      estBadge: "FREE ESTIMATE",
      estTitle: "Estimate your property's value in Cameroon",
      estDesc:
        "Get an indicative range based on average prices per m² in Douala, Yaoundé and Kribi.",
      estSurface: "Area (m²)",
      estResultLabel: "Indicative estimate",
      citiesTitle: "Your project, your city",
      citiesSub: "Discover properties in the cities you love.",
      cityTaglines: {
        Douala: "Live in the heart of the coast",
        Yaoundé: "Find your place in the capital",
        Kribi: "Live or invest by the ocean",
      },
      recentTitle: "Recently viewed",
      adviceTitle: "Advice for your project",
      adviceSub: "Practical guides to buy, rent and secure your transactions in Cameroon.",
      faqTitle: "Frequently asked questions",
      readArticle: "Read article",
      close: "Close",
      tabs: {
        vente: "Buy",
        location: "Rent",
        meuble: "Furnished",
        terrain: "Land",
        pro: "Professional",
      },
      categories: {
        "Maisons & villas": "Houses & villas",
        Appartements: "Apartments",
        Terrains: "Land",
        "Studios & chambres": "Studios & rooms",
        "Bureaux & commerces": "Offices & commercial",
        "Locations meublées": "Furnished rentals",
      },
      popularPresets: [
        "Villa in Douala ≤ 200 M",
        "Furnished apartment in Yaoundé",
        "Titled land in Kribi",
        "Studio for rent in Douala",
        "Office for rent",
      ],
    },
    results: {
      home: "Home",
      properties: "Properties",
      forRent: "to rent",
      forSale: "for sale",
      inCity: (c) => `in ${c}`,
      foundCount: (n) => `${n} listing${n > 1 ? "s" : ""} found`,
      saveSearch: "Save this search",
      reset: "Reset",
      filters: "Filters",
      sortBy: "Sort by",
      list: "List",
      grid: "Grid",
      map: "Map",
      transaction: "Transaction",
      city: "City",
      propertyType: "Property type",
      minPrice: "Min price",
      maxPrice: "Max price",
      minSurface: "Min area",
      maxSurface: "Max area",
      minBedrooms: "Min bedrooms",
      condition: "Condition",
      sellerType: "Seller",
      documents: "Documents",
      features: "Amenities",
      all: "All",
      professional: "Professional",
      individual: "Individual",
      noResultsTitle: "No listings match your criteria",
      noResultsDesc: "Try expanding your budget, city or resetting the filters.",
      resetFilters: "Reset filters",
      apply: "Apply",
      pageOf: (p, total) => `Page ${p} of ${total}`,
      prev: "Previous",
      next: "Next",
    },
    detail: {
      backToResults: "Back to results",
      buy: "Buy",
      rent: "Rent",
      viewsCount: (n) => `${n} people viewed this property`,
      favoritesCount: (n) => `${n} favorites`,
      refPublished: (ref, date) => `Ref. ${ref} · Published ${date}`,
      compare: "Compare",
      compared: "Compared",
      favorite: "Favorite",
      saved: "Saved",
      share: "Share",
      seePhotos: (n) => `View ${n} photo${n > 1 ? "s" : ""}`,
      storyLand: "Land to shape your own way",
      storyOffice: "A space tailored for your business",
      storyDefault: "A living space to make your own",
      priceAnalysis: "Price analysis vs. market",
      characteristics: "Property characteristics",
      dailyExtras: "Everyday amenities",
      noFeatures: "No amenities listed for this property.",
      goodReflexes: "Best practices before committing",
      locationNotice: "The exact address is shared by the advertiser when scheduling a visit.",
      seeOnMap: "View on map",
      yourContact: "Your contact",
      reviews: (n) => `${n} reviews`,
      seeProfile: "View profile & listings",
      showPhone: "Show phone number",
      requestVisit: "Request a visit or more details.",
      yourName: "Your name",
      namePlaceholder: "Full name",
      yourEmail: "Your email",
      yourMessage: "Your message",
      sendMessage: "Send my message",
      contactDisclaimer:
        "Your contact details are sent to the advertiser so they can respond to your inquiry.",
      prudenceTitle: "Caution is part of the project.",
      prudenceDesc:
        "Visit the property and have all documents verified before any payment. Never share your bank details with an advertiser.",
      similarTitle: (city) => `More properties to discover in ${city}`,
      similarSub: "Keep exploring options for your project.",
      seeThisProperty: "View property",
      rentMonthlyNote: "Monthly rent · Utilities to be confirmed with advertiser",
      saleNote: "Sale price · Fees to be confirmed with advertiser",
      forSaleBadge: "For sale",
      forRentBadge: "For rent",
      newBadge: "New",
      charLabels: {
        type: "Property type",
        transaction: "Transaction",
        landSurface: "Land area",
        usableSurface: "Usable area",
        livingSurface: "Living area",
        land: "Land",
        notApplicable: "Not applicable",
        roomsBedrooms: "Rooms / bedrooms",
        bathrooms: "Bathrooms",
        parking: "Parking",
        parkingCount: (n) => `${n} spaces listed`,
        notSpecified: "Not specified",
        condition: "Condition",
        pricePerM2: "Price per m²",
        yearBuilt: "Year built",
        floor: "Floor",
        floorVal: (f, t) => `${f} of ${t}`,
      },
    },
    modals: {
      loginTitle: "Sign in",
      registerTitle: "Create an account",
      authSubtitle: "Access your favorites, alerts and listings on IMMO DU LETCH.",
      loginTab: "Sign in",
      registerTab: "Register",
      continueGoogle: "Continue with Google (Gmail)",
      orByEmail: "OR BY EMAIL",
      emailLabel: "Email address",
      passwordLabel: "Password",
      forgotPassword: "Forgot password?",
      signInBtn: "Sign in",
      fullNameLabel: "Full name or agency *",
      phoneLabel: "Phone",
      accountTypeLabel: "Account type",
      individual: "Individual",
      proAgency: "Agency / Pro",
      confirmPassword: "Confirm *",
      createAccountBtn: "Create my account",
      back: "Back",
      googleTitle: "Sign in with Google",
      googleSubtitle:
        "Select a Gmail account or enter your Gmail address to continue on IMMO DU LETCH.",
      orOtherGmail: "OR ANOTHER GMAIL ACCOUNT",
      gmailAddress: "Gmail address *",
      displayNameOpt: "Display name (optional)",
      continueGmail: "Continue with this Gmail account",
      favoritesTitle: "My favorites",
      favoritesCountText: (n) => `${n} propert${n > 1 ? "ies" : "y"} saved on this device.`,
      noFavoritesTitle: "No favorites yet",
      noFavoritesDesc: "Click the heart icon on a listing to save it here.",
      discoverListings: "Browse listings",
      priceDropped: "Price drop",
      savedSearchesTitle: "My saved searches",
      noSavedSearches: "Create an alert from the results page to find your criteria here.",
      recentlyViewedTitle: "Recently viewed",
      comparator: "Compare",
      clear: "Clear",
      compareBtn: (n) => `Compare (${n})`,
    },
    deposit: {
      modalLabel: "Post a real estate listing",
      title: "Post a listing",
      stepOf: (s, total, label) => `Step ${s} of ${total} — ${label}`,
      steps: ["Project", "Location", "Details", "Contact"],
      transactionType: "Transaction type",
      sellProperty: "Sell a property",
      rentOut: "Rent out",
      propertyCategory: "Property category",
      city: "City",
      neighborhood: "District",
      monthlyRent: "Monthly rent (FCFA)",
      salePrice: "Sale price (FCFA)",
      surface: "Area (m²)",
      rooms: "Number of rooms",
      featuresIncluded: "Included amenities",
      yourNameOrAgency: "Your name or agency *",
      phoneWhatsapp: "Phone (WhatsApp) *",
      email: "Email",
      prev: "Previous",
      next: "Next",
      publish: "Publish listing",
    },
    compare: {
      title: "Side-by-side comparison",
      subtitle: "Compare up to 3 properties to make the best choice.",
      clearAll: "Clear comparison",
      criteria: "Criteria",
      price: "Price",
      bestPrice: "Best price",
      marketEval: "Market rating",
      propertyType: "Property type",
      sale: "Sale",
      rent: "Rent",
      surface: "Area",
      roomsBedrooms: "Rooms / Bedrooms",
      land: "Land",
      condition: "Condition",
      documents: "Documents",
      notSpecified: "Not specified",
      features: "Amenities",
      seller: "Advertiser",
      viewListing: "View listing",
    },
    financing: {
      title: "Financing simulator",
      subtitle: "Estimate your monthly mortgage payment (indicative rate 9% / year).",
      estimatedMonthly: "Estimated monthly payment",
      perMonth: "FCFA / month",
      downPayment: (pct) => `Down payment (${pct}%)`,
      duration: "Repayment term",
      monthsUnit: "months",
      disclaimer: (principal) =>
        `Borrowed amount: ${principal} FCFA · Indicative simulation only, excluding processing fees and insurance. Contact your bank for a personalized offer.`,
    },
    seller: {
      certifiedPro: "Certified professional",
      verifiedIndiv: "Verified individual",
      reviews: (n) => `(${n} reviews)`,
      memberSince: (y) => `· Member since ${y}`,
      contactAdvertiser: "Contact advertiser",
      otherListings: (name, n) => `Other listings by ${name} (${n})`,
      noOtherListings: "No other active listings for this advertiser.",
    },
    profile: {
      listingsStat: "Listings",
      favoritesStat: "Favorites",
      alertsStat: "Alerts",
      logout: "Sign out",
      memberSince: (d) => `Member since ${d}`,
      tabListings: (n) => `My listings (${n})`,
      tabDeposit: "+ Post a listing",
      tabDepositShort: "Post",
      tabInfo: "Profile information",
      tabInfoShort: "My profile",
      infoTitle: "Profile information",
      infoSub: "Update your contact details for future listings and inquiries.",
      fullName: "Full name or agency",
      email: "Email address",
      phoneWhatsapp: "Phone (WhatsApp)",
      accountType: "Account type",
      saveBtn: "Save changes",
      filterAll: (n) => `All (${n})`,
      filterPending: (n) => `Pending (${n})`,
      filterApproved: (n) => `Approved (${n})`,
      filterRejected: (n) => `Rejected (${n})`,
      emptyTitle: "No listings here",
      emptyDesc: "Submit your first property for admin review.",
      emptyBtn: "Post a listing",
      statusPending: "Pending",
      statusApproved: "Approved",
      statusRejected: "Rejected",
    },
    types: {
      villa: "Houses & villas",
      appartement: "Apartments",
      terrain: "Land",
      studio: "Studios & rooms",
      bureau: "Offices & commercial",
    },
    typesSingular: {
      villa: "House / villa",
      appartement: "Apartment",
      terrain: "Land",
      studio: "Studio",
      bureau: "Office / commercial",
    },
    transactions: {
      vente: "Buy",
      location: "Rent",
    },
    conditions: {
      neuf: "New / recent",
      ancien: "Older",
      a_renover: "To renovate",
    },
    sorts: {
      pertinence: "Relevance",
      "prix-asc": "Price: Low to High",
      "prix-desc": "Price: High to Low",
      "surface-desc": "Area",
      recent: "Newest",
      vues: "Most popular",
    },
    priceRatings: {
      excellent: { label: "Excellent price", short: "Excellent" },
      tres_bon: { label: "Very good price", short: "Very good" },
      bon: { label: "Good price", short: "Good price" },
      marche: { label: "Market price", short: "Market" },
      eleve: { label: "High price", short: "High" },
    },
  },
};

export function useT(): Translations {
  const { language } = useApp();
  return TRANSLATIONS[language];
}
