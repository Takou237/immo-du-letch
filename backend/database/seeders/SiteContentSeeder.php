<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Faq;
use App\Models\HeroSlide;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        if (Article::count() === 0) {
            $articles = [
                [
                    'tag' => 'ACHETER',
                    'title' => "Titre foncier : les vérifications à faire avant d'acheter",
                    'image' => '/assets/26532.png',
                    'body' => [
                        "Avant toute signature, demandez une copie du titre foncier et vérifiez son authenticité auprès des services compétents. Le nom du propriétaire doit correspondre à celui qui vend.",
                        "Faites contrôler les limites du terrain, l'absence d'hypothèque ou de litige, et l'état réel du bien lors d'une visite. Un accompagnement juridique reste la meilleure protection.",
                    ],
                    'sort_order' => 1,
                ],
                [
                    'tag' => 'LOUER',
                    'title' => 'Visiter un logement : les bonnes questions à poser',
                    'image' => '/assets/df5dc.png',
                    'body' => [
                        "Demandez le montant du loyer, des charges et de la caution, ainsi que la durée du bail. Vérifiez l'état des équipements, l'arrivée d'eau, l'électricité et la sécurité de l'immeuble.",
                        "Précisez par écrit ce qui est inclus dans le loyer et ce qui reste à votre charge. Ne versez jamais de somme avant d'avoir visité et signé un document clair.",
                    ],
                    'sort_order' => 2,
                ],
                [
                    'tag' => 'INVESTIR',
                    'title' => 'Terrain ou appartement : quel bien pour votre projet ?',
                    'image' => '/assets/52f31.png',
                    'body' => [
                        "Un terrain demande du temps et un budget de construction, mais offre une grande liberté d'aménagement. Un appartement se loue plus vite et demande moins d'entretien.",
                        "Comparez le prix au m², la demande locative du quartier et les documents disponibles. Le bon choix dépend de votre horizon d'investissement et de votre trésorerie.",
                    ],
                    'sort_order' => 3,
                ],
                [
                    'tag' => 'CONSTRUIRE',
                    'title' => 'Construire ou acheter : que choisir au Cameroun ?',
                    'image' => '/assets/7bb4a.png',
                    'body' => [
                        "Construire permet de personnaliser chaque détail de votre futur logement, mais implique de gérer un chantier sur plusieurs mois. L'achat d'un bien existant offre une installation immédiate.",
                        "Dans les deux cas, vérifiez la validité du titre foncier, le respect des règles d'urbanisme et faites appel à un architecte agréé pour sécuriser votre projet.",
                    ],
                    'sort_order' => 4,
                ],
                [
                    'tag' => 'INVESTIR',
                    'title' => 'Immobilier locatif : comment calculer votre rendement ?',
                    'image' => '/assets/d8a71.png',
                    'body' => [
                        "Le rendement locatif brut se calcule en divisant le loyer annuel par le prix d'achat, multiplié par 100. À Douala et Yaoundé, les bons rendements se situent entre 6 % et 10 %.",
                        "Pensez aussi aux charges (entretien, taxes, vacance locative) pour obtenir le rendement net réel. Un quartier en développement peut offrir une meilleure plus-value à long terme.",
                    ],
                    'sort_order' => 5,
                ],
                [
                    'tag' => 'JURIDIQUE',
                    'title' => "Les étapes légales d'une transaction immobilière au Cameroun",
                    'image' => '/assets/9f819.png',
                    'body' => [
                        "Une vente immobilière au Cameroun passe par la promesse de vente, la vérification du titre foncier, le paiement des droits de mutation (environ 15 % du prix) et la signature de l'acte notarié.",
                        "Ne signez jamais sans avoir fait appel à un notaire ou un avocat spécialisé. Les frais de notaire et taxes sont à intégrer dans votre budget total dès le départ.",
                    ],
                    'sort_order' => 6,
                ],
            ];

            foreach ($articles as $article) {
                Article::create($article);
            }
        }

        if (Faq::count() === 0) {
            $faqs = [
                [
                    'question' => 'Comment rechercher un bien au Cameroun ?',
                    'answer' => "Utilisez la recherche par transaction, ville, type de bien, budget, surface et nombre de pièces. Les filtres avancés permettent aussi de vérifier les documents annoncés et les équipements.",
                    'sort_order' => 1,
                ],
                [
                    'question' => 'Comment publier une annonce immobilière ?',
                    'answer' => "Cliquez sur « Déposer une annonce » pour renseigner les caractéristiques de votre bien. Préparez les photos, le prix et les documents disponibles. IMMO DU LETCH vous accompagne dans la mise en ligne.",
                    'sort_order' => 2,
                ],
                [
                    'question' => 'Quels documents vérifier avant un achat ?',
                    'answer' => "Titre foncier, plan cadastral, permis de bâtir et pièces d'identité du vendeur. Faites toujours confirmer leur authenticité et la situation du bien auprès des services compétents.",
                    'sort_order' => 3,
                ],
                [
                    'question' => "Comment organiser une visite avec l'annonceur ?",
                    'answer' => "Depuis la fiche d'un bien, utilisez le formulaire de contact ou affichez le numéro de l'annonceur. Convenez d'un rendez-vous et vérifiez le bien sur place avant tout engagement.",
                    'sort_order' => 4,
                ],
                [
                    'question' => 'Peut-on acheter un bien sans titre foncier ?',
                    'answer' => "Il est fortement déconseillé d'acheter sans titre foncier. Ce document est la seule preuve légale de propriété reconnue au Cameroun. Exigez-le systématiquement et faites-le vérifier auprès du cadastre.",
                    'sort_order' => 5,
                ],
                [
                    'question' => "Quelles sont les taxes à payer lors d'une vente ?",
                    'answer' => "Les principaux frais incluent les droits de mutation (environ 15 % du prix de vente), les frais de notaire, et éventuellement la taxe foncière. Prévoyez un budget total supérieur d'environ 18-20 % au prix affiché.",
                    'sort_order' => 6,
                ],
                [
                    'question' => "Comment estimer le prix d'un bien au Cameroun ?",
                    'answer' => "Le prix dépend de la ville, du quartier, de la superficie, de l'état et des documents disponibles. À Douala, les prix varient de 300 000 à plus de 1 000 000 FCFA/m² selon le secteur. Comparez plusieurs annonces similaires avant de décider.",
                    'sort_order' => 7,
                ],
                [
                    'question' => "Est-il possible d'obtenir un crédit immobilier ?",
                    'answer' => "Oui, plusieurs banques camerounaises proposent des crédits immobiliers, généralement sur 10 à 20 ans avec un apport minimum de 20-30 %. Le taux d'intérêt varie entre 7 % et 12 % selon l'établissement. Renseignez-vous auprès de votre banque.",
                    'sort_order' => 8,
                ],
            ];

            foreach ($faqs as $faq) {
                Faq::create($faq);
            }
        }

        if (HeroSlide::count() === 0) {
            $slides = [
                [
                    'listing_slug' => 'villa-bonapriso',
                    'image' => '/assets/d92fa.png',
                    'tag' => 'VILLA CONTEMPORAINE',
                    'title' => 'Villa contemporaine avec jardin',
                    'location' => 'Bonapriso, Douala',
                    'price_label' => '185 000 000 FCFA',
                    'sort_order' => 1,
                ],
                [
                    'listing_slug' => 'duplex-makepe',
                    'image' => '/assets/d8a71.png',
                    'tag' => 'NOUVEAUTÉ',
                    'title' => 'Duplex lumineux avec cour privative',
                    'location' => 'Makepe, Douala',
                    'price_label' => '210 000 000 FCFA',
                    'sort_order' => 2,
                ],
                [
                    'listing_slug' => 'villa-kribi',
                    'image' => '/assets/9f819.png',
                    'tag' => 'BORD DE MER',
                    'title' => "Villa de plain-pied proche de l'océan",
                    'location' => 'Mpalla, Kribi',
                    'price_label' => '95 000 000 FCFA',
                    'sort_order' => 3,
                ],
                [
                    'listing_slug' => 'appartement-meuble-bastos',
                    'image' => '/assets/df5dc.png',
                    'tag' => 'LOCATION MEUBLÉE',
                    'title' => 'Appartement meublé avec balcon',
                    'location' => 'Bastos, Yaoundé',
                    'price_label' => '350 000 FCFA / mois',
                    'sort_order' => 4,
                ],
            ];

            foreach ($slides as $slide) {
                HeroSlide::create($slide);
            }
        }

        $defaults = [
            'years_experience' => '5',
            'contact_phone' => '+237 6 55 00 00 00',
            'contact_email' => 'contact@immoduletch.cm',
        ];
        foreach ($defaults as $key => $val) {
            SiteSetting::firstOrCreate(['key' => $key], ['value' => $val]);
        }
    }
}
