<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Faq;
use App\Models\HeroSlide;
use App\Models\Listing;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteContentController extends Controller
{
    public function index(): JsonResponse
    {
        $approved = Listing::where('status', 'approved');
        $listingsCount = (clone $approved)->count();
        $citiesCount = (clone $approved)->distinct('city')->count('city');
        $typesCount = (clone $approved)->distinct('type')->count('type');
        $yearsExperience = SiteSetting::getValue('years_experience', '5');

        $articles = Article::where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map->toFrontendArray()
            ->values();

        $faqs = Faq::where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map->toFrontendArray()
            ->values();

        $heroSlides = HeroSlide::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map->toFrontendArray()
            ->values();

        return response()->json([
            'articles' => $articles,
            'faqs' => $faqs,
            'heroSlides' => $heroSlides,
            'stats' => [
                ['value' => (string) $listingsCount, 'label' => 'Annonces actives', 'suffix' => ''],
                ['value' => (string) max(1, $citiesCount), 'label' => 'Villes couvertes', 'suffix' => ''],
                ['value' => (string) max(1, $typesCount), 'label' => 'Types de biens', 'suffix' => ''],
                ['value' => (string) $yearsExperience, 'label' => "Ans d'expérience", 'suffix' => '+'],
            ],
            'settings' => [
                'yearsExperience' => $yearsExperience,
                'contactPhone' => SiteSetting::getValue('contact_phone', '+237 6 55 00 00 00'),
                'contactEmail' => SiteSetting::getValue('contact_email', 'contact@immoduletch.cm'),
            ],
        ]);
    }
}
