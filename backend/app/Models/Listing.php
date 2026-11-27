<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Listing extends Model
{
    protected $fillable = [
        'slug',
        'reference',
        'user_id',
        'title',
        'price',
        'transaction',
        'type',
        'city',
        'neighborhood',
        'region',
        'rooms',
        'bedrooms',
        'bathrooms',
        'surface',
        'land',
        'parking',
        'image',
        'gallery',
        'description',
        'description2',
        'features',
        'documents',
        'condition',
        'seller_type',
        'seller',
        'seller_rating',
        'seller_reviews',
        'seller_since',
        'seller_description',
        'seller_phone',
        'is_new',
        'published_at',
        'views',
        'price_dropped',
        'original_price',
        'year_built',
        'floor',
        'total_floors',
        'status',
        'rejection_reason',
        'moderated_by',
        'moderated_at',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'rooms' => 'integer',
            'bedrooms' => 'integer',
            'bathrooms' => 'integer',
            'surface' => 'integer',
            'land' => 'integer',
            'parking' => 'integer',
            'gallery' => 'array',
            'features' => 'array',
            'documents' => 'array',
            'seller_rating' => 'float',
            'seller_reviews' => 'integer',
            'is_new' => 'boolean',
            'published_at' => 'date',
            'views' => 'integer',
            'price_dropped' => 'boolean',
            'original_price' => 'integer',
            'year_built' => 'integer',
            'floor' => 'integer',
            'total_floors' => 'integer',
            'moderated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->slug,
            'reference' => $this->reference,
            'title' => $this->title,
            'price' => (int) $this->price,
            'transaction' => $this->transaction,
            'type' => $this->type,
            'city' => $this->city,
            'neighborhood' => $this->neighborhood,
            'region' => $this->region,
            'rooms' => (int) $this->rooms,
            'bedrooms' => (int) $this->bedrooms,
            'bathrooms' => (int) $this->bathrooms,
            'surface' => (int) $this->surface,
            'land' => $this->land ? (int) $this->land : null,
            'parking' => (int) $this->parking,
            'image' => $this->image,
            'gallery' => $this->gallery ?? [$this->image],
            'description' => $this->description,
            'description2' => $this->description2 ?? '',
            'features' => $this->features ?? [],
            'documents' => $this->documents ?? [],
            'condition' => $this->condition,
            'sellerType' => $this->seller_type,
            'seller' => $this->seller,
            'sellerRating' => (float) $this->seller_rating,
            'sellerReviews' => (int) $this->seller_reviews,
            'sellerSince' => $this->seller_since,
            'sellerDescription' => $this->seller_description,
            'sellerPhone' => $this->seller_phone,
            'isNew' => (bool) $this->is_new,
            'publishedAt' => $this->published_at?->format('Y-m-d') ?? $this->created_at->format('Y-m-d'),
            'views' => (int) $this->views,
            'priceDropped' => (bool) $this->price_dropped,
            'originalPrice' => $this->original_price ? (int) $this->original_price : null,
            'yearBuilt' => $this->year_built ? (int) $this->year_built : null,
            'floor' => $this->floor ? (int) $this->floor : null,
            'totalFloors' => $this->total_floors ? (int) $this->total_floors : null,
        ];
    }

    public function toUserListingArray(): array
    {
        return [
            'id' => $this->slug,
            'userId' => (string) $this->user_id,
            'title' => $this->title,
            'transaction' => $this->transaction,
            'type' => $this->type,
            'city' => $this->city,
            'neighborhood' => $this->neighborhood,
            'price' => (int) $this->price,
            'surface' => (int) $this->surface,
            'rooms' => (int) $this->rooms,
            'features' => $this->features ?? [],
            'images' => $this->gallery ?? [$this->image],
            'description' => $this->description,
            'status' => $this->status,
            'rejectionReason' => $this->rejection_reason,
            'sellerName' => $this->seller,
            'sellerPhone' => $this->seller_phone,
            'createdAt' => $this->created_at?->getTimestampMs() ?? now()->getTimestampMs(),
        ];
    }
}
