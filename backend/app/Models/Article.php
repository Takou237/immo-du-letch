<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'tag',
        'title',
        'image',
        'body',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'body' => 'array',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'tag' => $this->tag,
            'title' => $this->title,
            'image' => $this->image,
            'body' => $this->body ?? [],
        ];
    }
}
