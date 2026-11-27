<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Inquiry;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\View\View;

class AdminDashboardController extends Controller
{
    public function index(): View
    {
        $totalListings = Listing::count();
        $stats = [
            'total_listings' => $totalListings,
            'pending_listings' => Listing::where('status', 'pending')->count(),
            'approved_listings' => Listing::where('status', 'approved')->count(),
            'rejected_listings' => Listing::where('status', 'rejected')->count(),
            'vente_listings' => Listing::where('transaction', 'vente')->count(),
            'location_listings' => Listing::where('transaction', 'location')->count(),
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'pro_users' => User::where('account_type', 'professionnel')->count(),
            'new_inquiries' => Inquiry::where('status', 'new')->count(),
            'total_inquiries' => Inquiry::count(),
            'total_views' => (int) Listing::sum('views'),
            'total_favorites' => Favorite::count(),
        ];

        $pendingListings = Listing::with('user')
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->limit(6)
            ->get();

        $recentInquiries = Inquiry::with('listing')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $topListings = Listing::orderByDesc('views')
            ->limit(5)
            ->get();

        $listingsByCity = Listing::select('city', DB::raw('count(*) as total'))
            ->groupBy('city')
            ->orderByDesc('total')
            ->get();

        $listingsByType = Listing::select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->orderByDesc('total')
            ->get();

        return view('admin.dashboard', compact(
            'stats',
            'pendingListings',
            'recentInquiries',
            'topListings',
            'listingsByCity',
            'listingsByType',
        ));
    }

    public function listings(Request $request): View
    {
        $status = $request->string('status')->toString() ?: 'all';
        $city = trim($request->string('city')->toString());
        $type = trim($request->string('type')->toString());
        $transaction = trim($request->string('transaction')->toString());
        $sort = $request->string('sort')->toString() ?: 'recent';
        $search = trim($request->string('q')->toString());

        $query = Listing::with('user');

        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        }

        if ($city !== '') {
            $query->where('city', $city);
        }

        if (in_array($type, ['villa', 'appartement', 'terrain', 'studio', 'bureau'], true)) {
            $query->where('type', $type);
        }

        if (in_array($transaction, ['vente', 'location'], true)) {
            $query->where('transaction', $transaction);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('neighborhood', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhere('seller', 'like', "%{$search}%");
            });
        }

        match ($sort) {
            'views' => $query->orderByDesc('views'),
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->orderByDesc('created_at'),
        };

        $listings = $query->paginate(15)->withQueryString();
        $counts = [
            'all' => Listing::count(),
            'pending' => Listing::where('status', 'pending')->count(),
            'approved' => Listing::where('status', 'approved')->count(),
            'rejected' => Listing::where('status', 'rejected')->count(),
        ];

        $cities = Listing::select('city')->distinct()->orderBy('city')->pluck('city');

        return view('admin.listings', compact(
            'listings',
            'status',
            'city',
            'type',
            'transaction',
            'sort',
            'search',
            'counts',
            'cities',
        ));
    }

    public function createListing(): View
    {
        return view('admin.listing-form', ['listing' => null]);
    }

    public function storeListing(Request $request): RedirectResponse
    {
        $data = $this->validateListingData($request);
        $gallery = $this->resolveListingGallery($request, $data['image_url'] ?? null, $data['type']);

        $slug = Str::slug($data['title']) . '-' . Str::lower(Str::random(5));
        $reference = 'IDL-' . Str::upper(Str::random(6));

        $listing = Listing::create([
            'slug' => $slug,
            'reference' => $reference,
            'user_id' => Auth::id(),
            'title' => trim($data['title']),
            'price' => (int) $data['price'],
            'transaction' => $data['transaction'],
            'type' => $data['type'],
            'city' => trim($data['city']),
            'neighborhood' => trim($data['neighborhood']),
            'region' => $this->regionForCity($data['city']),
            'rooms' => (int) ($data['rooms'] ?? 0),
            'bedrooms' => (int) ($data['bedrooms'] ?? 0),
            'bathrooms' => (int) ($data['bathrooms'] ?? 0),
            'surface' => (int) $data['surface'],
            'land' => $data['land'] ? (int) $data['land'] : null,
            'parking' => (int) ($data['parking'] ?? 0),
            'image' => $gallery[0],
            'gallery' => $gallery,
            'description' => trim($data['description']),
            'description2' => trim($data['description2'] ?? ''),
            'features' => $data['features'] ?? [],
            'documents' => $data['documents'] ?? [],
            'condition' => $data['condition'],
            'seller_type' => $data['seller_type'],
            'seller' => trim($data['seller']),
            'seller_phone' => $data['seller_phone'] ? trim($data['seller_phone']) : null,
            'seller_rating' => 4.8,
            'seller_reviews' => 12,
            'seller_since' => (string) now()->year,
            'is_new' => $request->boolean('is_new', true),
            'published_at' => now()->toDateString(),
            'views' => 0,
            'price_dropped' => $request->boolean('price_dropped', false),
            'original_price' => $data['original_price'] ? (int) $data['original_price'] : null,
            'status' => $data['status'] ?? 'approved',
            'moderated_by' => Auth::id(),
            'moderated_at' => now(),
        ]);

        return redirect()
            ->route('admin.listings.show', $listing)
            ->with('success', "L'annonce « {$listing->title} » a été créée.");
    }

    public function editListing(Listing $listing): View
    {
        return view('admin.listing-form', compact('listing'));
    }

    public function updateListing(Request $request, Listing $listing): RedirectResponse
    {
        $data = $this->validateListingData($request);
        $gallery = $this->resolveListingGallery($request, $data['image_url'] ?? null, $data['type'], $listing->gallery ?? [$listing->image]);

        $listing->update([
            'title' => trim($data['title']),
            'price' => (int) $data['price'],
            'transaction' => $data['transaction'],
            'type' => $data['type'],
            'city' => trim($data['city']),
            'neighborhood' => trim($data['neighborhood']),
            'region' => $this->regionForCity($data['city']),
            'rooms' => (int) ($data['rooms'] ?? 0),
            'bedrooms' => (int) ($data['bedrooms'] ?? 0),
            'bathrooms' => (int) ($data['bathrooms'] ?? 0),
            'surface' => (int) $data['surface'],
            'land' => $data['land'] ? (int) $data['land'] : null,
            'parking' => (int) ($data['parking'] ?? 0),
            'image' => $gallery[0],
            'gallery' => $gallery,
            'description' => trim($data['description']),
            'description2' => trim($data['description2'] ?? ''),
            'features' => $data['features'] ?? [],
            'documents' => $data['documents'] ?? [],
            'condition' => $data['condition'],
            'seller_type' => $data['seller_type'],
            'seller' => trim($data['seller']),
            'seller_phone' => $data['seller_phone'] ? trim($data['seller_phone']) : null,
            'is_new' => $request->boolean('is_new'),
            'price_dropped' => $request->boolean('price_dropped'),
            'original_price' => $data['original_price'] ? (int) $data['original_price'] : null,
            'status' => $data['status'] ?? $listing->status,
        ]);

        return redirect()
            ->route('admin.listings.show', $listing)
            ->with('success', "L'annonce « {$listing->title} » a été mise à jour.");
    }

    private function validateListingData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'transaction' => ['required', 'in:vente,location'],
            'type' => ['required', 'in:villa,appartement,terrain,studio,bureau'],
            'city' => ['required', 'string', 'max:80'],
            'neighborhood' => ['required', 'string', 'max:120'],
            'price' => ['required', 'integer', 'min:0'],
            'original_price' => ['nullable', 'integer', 'min:0'],
            'surface' => ['required', 'integer', 'min:1'],
            'land' => ['nullable', 'integer', 'min:0'],
            'rooms' => ['nullable', 'integer', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'parking' => ['nullable', 'integer', 'min:0'],
            'condition' => ['required', 'in:neuf,ancien,a_renover'],
            'seller_type' => ['required', 'in:professionnel,particulier'],
            'seller' => ['required', 'string', 'max:120'],
            'seller_phone' => ['nullable', 'string', 'max:40'],
            'status' => ['nullable', 'in:pending,approved,rejected'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'photos.*' => ['nullable', 'image', 'max:5120'],
            'description' => ['required', 'string', 'max:4000'],
            'description2' => ['nullable', 'string', 'max:4000'],
            'features' => ['nullable', 'array'],
            'documents' => ['nullable', 'array'],
        ]);
    }

    private function resolveListingGallery(Request $request, ?string $imageUrl, string $type, array $existing = []): array
    {
        $paths = [];

        if ($request->hasFile('photos')) {
            foreach ((array) $request->file('photos') as $file) {
                if ($file && $file->isValid()) {
                    $stored = $file->store('listings', 'public');
                    $paths[] = '/storage/' . $stored;
                }
            }
        }

        if ($imageUrl && trim($imageUrl) !== '') {
            array_unshift($paths, trim($imageUrl));
        }

        if (count($paths) === 0 && count($existing) > 0) {
            return $existing;
        }

        if (count($paths) === 0) {
            $fallbacks = [
                'villa' => '/assets/d92fa.png',
                'appartement' => '/assets/df5dc.png',
                'terrain' => '/assets/26532.png',
                'studio' => '/assets/d8a71.png',
                'bureau' => '/assets/9f819.png',
            ];
            return [$fallbacks[$type] ?? '/assets/d92fa.png'];
        }

        return array_slice(array_values(array_unique($paths)), 0, 6);
    }

    private function regionForCity(string $city): string
    {
        return match (trim($city)) {
            'Douala' => 'Littoral',
            'Yaoundé' => 'Centre',
            'Kribi' => 'Sud',
            default => 'Cameroun',
        };
    }

    public function showListing(Listing $listing): View
    {
        $listing->load(['user', 'moderator', 'inquiries' => fn ($q) => $q->orderByDesc('created_at')]);

        return view('admin.listing-show', compact('listing'));
    }

    public function moderateListing(Request $request, Listing $listing): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected'],
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        $listing->update([
            'status' => $data['status'],
            'rejection_reason' => $data['status'] === 'rejected'
                ? (trim($data['rejection_reason'] ?? '') ?: 'Annonce non conforme aux critères de publication.')
                : null,
            'moderated_by' => Auth::id(),
            'moderated_at' => now(),
        ]);

        $label = match ($data['status']) {
            'approved' => 'validée et publiée',
            'rejected' => 'refusée',
            default => 'remise en attente',
        };

        return back()->with('success', "L'annonce « {$listing->title} » a été {$label}.");
    }

    public function destroyListing(Listing $listing): RedirectResponse
    {
        $title = $listing->title;
        $listing->delete();

        return redirect()
            ->route('admin.listings')
            ->with('success', "L'annonce « {$title} » a été supprimée.");
    }

    public function users(Request $request): View
    {
        $role = $request->string('role')->toString() ?: 'all';
        $accountType = $request->string('account_type')->toString() ?: 'all';
        $state = $request->string('state')->toString() ?: 'all';
        $search = trim($request->string('q')->toString());

        $query = User::withCount('listings')->orderByDesc('created_at');

        if (in_array($role, ['admin', 'user'], true)) {
            $query->where('role', $role);
        }

        if (in_array($accountType, ['particulier', 'professionnel'], true)) {
            $query->where('account_type', $accountType);
        }

        if ($state === 'active') {
            $query->where('is_active', true);
        } elseif ($state === 'blocked') {
            $query->where('is_active', false);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(20)->withQueryString();

        $userStats = [
            'total' => User::count(),
            'admins' => User::where('role', 'admin')->count(),
            'pros' => User::where('account_type', 'professionnel')->count(),
            'blocked' => User::where('is_active', false)->count(),
        ];

        return view('admin.users', compact('users', 'userStats', 'role', 'accountType', 'state', 'search'));
    }

    public function toggleUserActive(User $user): RedirectResponse
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Vous ne pouvez pas désactiver votre propre compte.');
        }

        $user->update(['is_active' => !$user->is_active]);

        return back()->with('success', "Statut du compte {$user->email} mis à jour.");
    }

    public function toggleUserRole(User $user): RedirectResponse
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Vous ne pouvez pas modifier votre propre rôle.');
        }

        $user->update(['role' => $user->role === 'admin' ? 'user' : 'admin']);

        return back()->with('success', "Rôle de {$user->email} mis à jour ({$user->role}).");
    }

    public function inquiries(Request $request): View
    {
        $status = $request->string('status')->toString() ?: 'all';
        $search = trim($request->string('q')->toString());

        $query = Inquiry::with(['listing', 'user'])->orderByDesc('created_at');

        if (in_array($status, ['new', 'read', 'replied'], true)) {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%")
                    ->orWhereHas('listing', fn ($lq) => $lq->where('title', 'like', "%{$search}%"));
            });
        }

        $inquiries = $query->paginate(20)->withQueryString();

        $counts = [
            'all' => Inquiry::count(),
            'new' => Inquiry::where('status', 'new')->count(),
            'read' => Inquiry::where('status', 'read')->count(),
            'replied' => Inquiry::where('status', 'replied')->count(),
        ];

        return view('admin.inquiries', compact('inquiries', 'status', 'search', 'counts'));
    }

    public function updateInquiryStatus(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,read,replied'],
        ]);

        $inquiry->update(['status' => $data['status']]);

        return back()->with('success', 'Statut de la demande mis à jour.');
    }

    public function destroyInquiry(Inquiry $inquiry): RedirectResponse
    {
        $inquiry->delete();

        return back()->with('success', 'Demande de contact supprimée.');
    }
}
