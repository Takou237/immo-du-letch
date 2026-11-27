<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'listing_slug',
        'image',
        'tag',
        'title',
        'location',
        'price_label',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->listing_slug ?: ('slide-' . $this->id),
            'image' => $this->image,
            'tag' => $this->tag,
            'title' => $this->title,
            'location' => $this->location,
            'price' => $this->price_label,
        ];
    }
}
