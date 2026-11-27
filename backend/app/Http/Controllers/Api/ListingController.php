<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ListingController extends Controller
{
    private const CITY_REGIONS = [
        'Douala' => 'Littoral',
        'Yaoundé' => 'Centre',
        'Kribi' => 'Sud',
    ];

    private const FALLBACK_IMAGES = [
        'villa' => '/assets/d92fa.png',
        'appartement' => '/assets/df5dc.png',
        'terrain' => '/assets/26532.png',
        'studio' => '/assets/d8a71.png',
        'bureau' => '/assets/9f819.png',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = Listing::where('status', 'approved');

        if ($request->filled('transaction')) {
            $query->where('transaction', $request->string('transaction'));
        }
        if ($request->filled('city')) {
            $query->where('city', $request->string('city'));
        }
        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }
        if ($request->filled('priceMin')) {
            $query->where('price', '>=', (int) $request->input('priceMin'));
        }
        if ($request->filled('priceMax')) {
            $query->where('price', '<=', (int) $request->input('priceMax'));
        }
        if ($request->filled('surfaceMin')) {
            $query->where('surface', '>=', (int) $request->input('surfaceMin'));
        }

        $listings = $query->orderByDesc('published_at')->orderByDesc('id')->get();

        return response()->json([
            'listings' => $listings->map->toFrontendArray()->values(),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $listing = Listing::where('slug', $slug)
            ->where('status', 'approved')
            ->firstOrFail();

        $listing->increment('views');

        return response()->json([
            'listing' => $listing->fresh()->toFrontendArray(),
        ]);
    }

    public function myListings(Request $request): JsonResponse
    {
        $listings = Listing::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'listings' => $listings->map->toUserListingArray()->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'transaction' => ['required', 'in:vente,location'],
            'type' => ['required', 'in:villa,appartement,terrain,studio,bureau'],
            'city' => ['required', 'string', 'max:80'],
            'neighborhood' => ['required', 'string', 'max:120'],
            'price' => ['required', 'integer', 'min:0'],
            'surface' => ['required', 'integer', 'min:1'],
            'rooms' => ['nullable', 'integer', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:80'],
            'images' => ['nullable', 'array', 'max:6'],
            'images.*' => ['string'],
            'description' => ['required', 'string', 'max:4000'],
            'sellerName' => ['nullable', 'string', 'max:120'],
            'sellerPhone' => ['nullable', 'string', 'max:40'],
        ]);

        $user = $request->user();
        $storedImages = $this->storeIncomingImages($request, $data['images'] ?? []);
        $fallback = self::FALLBACK_IMAGES[$data['type']] ?? '/assets/d92fa.png';
        $gallery = count($storedImages) > 0 ? $storedImages : [$fallback];

        $rooms = (int) ($data['rooms'] ?? 0);
        $bedrooms = match ($data['type']) {
            'studio' => 1,
            'villa', 'appartement' => max(0, $rooms - 1),
            default => 0,
        };

        $slug = 'ul-'.now()->getTimestampMs().'-'.Str::lower(Str::random(5));
        $reference = 'IDL-USER-'.Str::upper(Str::random(6));
        $sellerName = trim($data['sellerName'] ?? $user->name);

        $listing = Listing::create([
            'slug' => $slug,
            'reference' => $reference,
            'user_id' => $user->id,
            'title' => trim($data['title']),
            'price' => (int) $data['price'],
            'transaction' => $data['transaction'],
            'type' => $data['type'],
            'city' => trim($data['city']),
            'neighborhood' => trim($data['neighborhood']),
            'region' => self::CITY_REGIONS[trim($data['city'])] ?? 'Cameroun',
            'rooms' => $rooms,
            'bedrooms' => $bedrooms,
            'bathrooms' => 0,
            'surface' => (int) $data['surface'],
            'parking' => 0,
            'image' => $gallery[0],
            'gallery' => $gallery,
            'description' => trim($data['description']),
            'description2' => "Annonce publiée par un membre d'IMMO DU LETCH. Contactez l'annonceur pour organiser une visite.",
            'features' => $data['features'] ?? [],
            'documents' => [],
            'condition' => 'ancien',
            'seller_type' => $user->account_type === 'professionnel' ? 'professionnel' : 'particulier',
            'seller' => $sellerName,
            'seller_rating' => 0,
            'seller_reviews' => 0,
            'seller_since' => (string) ($user->created_at?->year ?? now()->year),
            'seller_description' => "Annonce déposée par {$sellerName} sur IMMO DU LETCH.",
            'seller_phone' => $data['sellerPhone'] ?? $user->phone,
            'is_new' => true,
            'published_at' => now()->toDateString(),
            'views' => 0,
            'price_dropped' => false,
            'status' => 'pending',
        ]);

        return response()->json([
            'listing' => $listing->toUserListingArray(),
        ], 201);
    }

    public function destroy(Request $request, string $slug): JsonResponse
    {
        $listing = Listing::where('slug', $slug)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $listing->delete();

        return response()->json(['ok' => true]);
    }

    private function storeIncomingImages(Request $request, array $base64Images): array
    {
        $paths = [];

        if ($request->hasFile('photos')) {
            foreach ((array) $request->file('photos') as $file) {
                if ($file && $file->isValid()) {
                    $stored = $file->store('listings', 'public');
                    $paths[] = '/storage/'.$stored;
                }
            }
        }

        foreach ($base64Images as $raw) {
            if (preg_match('/^data:image\/(png|jpe?g|webp);base64,(.+)$/i', $raw, $matches)) {
                $ext = strtolower($matches[1]) === 'jpeg' ? 'jpg' : strtolower($matches[1]);
                $binary = base64_decode($matches[2], true);
                if ($binary !== false) {
                    $filename = 'listings/'.Str::uuid().'.'.$ext;
                    Storage::disk('public')->put($filename, $binary);
                    $paths[] = '/storage/'.$filename;
                }
            } elseif (str_starts_with($raw, '/assets/') || str_starts_with($raw, '/storage/')) {
                $paths[] = $raw;
            }
        }

        return array_slice($paths, 0, 6);
    }
}
