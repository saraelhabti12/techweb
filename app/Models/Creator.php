<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Creator extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'display_name',
        'profile_photo',
        'gallery_images',
        'age',
        'gender',
        'city',
        'phone',
        'email',
        'height_cm',
        'weight_kg',
        'clothing_size',
        'shoe_size',
        'languages',
        'skills',
        'experience_notes',
        'availability_status',
        'daily_rate',
        'visible_on_homepage',
        'active',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'languages' => 'array',
        'visible_on_homepage' => 'boolean',
        'active' => 'boolean',
        'daily_rate' => 'decimal:2',
    ];

    public function projects()
    {
        return $this->belongsToMany(Project::class);
    }
}
