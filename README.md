# IMMO DU LETCH

Site immobilier de démonstration inspiré de [mobile.de](https://www.mobile.de), adapté au marché camerounais : recherche d'annonces, comparateur de biens, simulateur de financement et dépôt d'annonce par les particuliers.

> Projet vitrine : toutes les données sont fictives et stockées dans le navigateur (`localStorage`). Aucun serveur ni base de données n'est nécessaire.

## Aperçu des fonctionnalités

- **Recherche** par mot-clé multi-mots (insensible aux accents et à la casse), par ville, budget, surface et nombre de pièces.
- **Vente et location** avec filtres dédiés (équipements, documents disponibles).
- **Comparateur** de 2 à 3 biens, limité aux annonces de même nature (vente ou location).
- **Fiche détaillée** : galerie photos, échelle de prix par rapport au marché, vues, favoris, biens similaires, profil du vendeur et simulateur de mensualité.
- **Publication d'annonce** en 4 étapes, avec suivi de statut (« En attente », « Validée ») dans l'espace profil.
- **Favoris** et **historique des biens consultés** conservés entre les visites.
- **Deux mises en page** : bureau (design de référence 1440 px, mis à l'échelle selon la largeur de l'écran) et mobile (interface dédiée et empilée sous 900 px).

## Technologies

| Outil | Usage |
| --- | --- |
| React 19 + TypeScript | Interface et typage |
| Vite 8 | Serveur de développement et build |
| Tailwind CSS 4 | Styles (via `@tailwindcss/vite`) |
| localStorage | Persistance des comptes, annonces, favoris et historique |

## Lancer le projet

Prérequis : **Node.js 22** (voir `.mise.toml`).

```bash
npm install
npm run dev
```

Vite affiche alors l'adresse locale du site (par défaut `http://localhost:5173`). Le rechargement est automatique à chaque modification d'un fichier.

Autres commandes :

```bash
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
npm run format    # formater le code avec oxfmt
```

Le projet utilise aussi `pnpm` (`pnpm-lock.yaml`) ; avec pnpm, remplacez simplement `npm install` par `pnpm install` et `npm run dev` par `pnpm dev`.

## Organisation du code

```
src/
├── App.tsx              # point d'entrée : routage par hash, zoom bureau, bascule mobile
├── index.css            # Tailwind + polices + styles globaux
├── data/
│   ├── listings.ts      # type Listing, 20 annonces, filtres, recherche, articles, FAQ
│   └── homeContent.ts   # contenus de la page d'accueil (onglets, budgets, catégories)
├── store/AppStore.tsx   # état global : session, annonces publiées, favoris, comparateur
├── hooks/useIsMobile.ts # bascule mobile sous 900 px
├── components/          # navigation, cartes d'annonce, modales, comparateur, formulaires
└── pages/               # pages bureau (Home, Results, Detail, Profile) et leurs versions mobiles
```

## Notes

- La mise en page bureau est conçue en 1440 px puis agrandie ou réduite proportionnellement pour occuper toute la largeur de l'écran.
- Les comptes et annonces créés restent locaux au navigateur : vider le stockage du site remet la démonstration à zéro.
