<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Inquiry;
use App\Models\Listing;
use App\Models\SavedSearch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserActionController extends Controller
{
    public function favorites(Request $request): JsonResponse
    {
        $slugs = Favorite::where('user_id', $request->user()->id)
            ->with('listing:id,slug')
            ->get()
            ->pluck('listing.slug')
            ->filter()
            ->values();

        return response()->json(['favorites' => $slugs]);
    }

    public function toggleFavorite(Request $request, string $slug): JsonResponse
    {
        $listing = Listing::where('slug', $slug)->firstOrFail();
        $userId = $request->user()->id;

        $existing = Favorite::where('user_id', $userId)
            ->where('listing_id', $listing->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $favorited = false;
        } else {
            Favorite::create([
                'user_id' => $userId,
                'listing_id' => $listing->id,
            ]);
            $favorited = true;
        }

        return response()->json(['favorited' => $favorited]);
    }

    public function savedSearches(Request $request): JsonResponse
    {
        $searches = SavedSearch::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(fn (SavedSearch $s) => [
                'id' => (string) $s->id,
                'label' => $s->label,
                'filters' => $s->filters,
                'createdAt' => $s->created_at?->getTimestampMs() ?? now()->getTimestampMs(),
            ]);

        return response()->json(['savedSearches' => $searches]);
    }

    public function storeSavedSearch(Request $request): JsonResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'filters' => ['required', 'array'],
        ]);

        $search = SavedSearch::create([
            'user_id' => $request->user()->id,
            'label' => $data['label'],
            'filters' => $data['filters'],
        ]);

        return response()->json([
            'savedSearch' => [
                'id' => (string) $search->id,
                'label' => $search->label,
                'filters' => $search->filters,
                'createdAt' => $search->created_at->getTimestampMs(),
            ],
        ], 201);
    }

    public function destroySavedSearch(Request $request, int $id): JsonResponse
    {
        SavedSearch::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['ok' => true]);
    }

    public function storeInquiry(Request $request, string $slug): JsonResponse
    {
        $listing = Listing::where('slug', $slug)->firstOrFail();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:40'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $inquiry = Inquiry::create([
            'listing_id' => $listing->id,
            'user_id' => $request->user()?->id,
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'phone' => $data['phone'] ?? null,
            'message' => trim($data['message']),
            'status' => 'new',
        ]);

        return response()->json(['id' => $inquiry->id], 201);
    }
}
