<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    
    use HasFactory;
    protected $fillable = [
        'title',
        'author',
        'excerpt',
        'content',
        'images',
        'category',
        'tags', // ✅ ajouter tags
    ];

    protected $casts = [
        'images' => 'array', // JSON → array
        'tags' => 'array',   // ✅ ajouter tags
    ];
}
