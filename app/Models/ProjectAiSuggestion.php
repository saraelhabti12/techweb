<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectAiSuggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'suggested_tasks',
        'risk_level',
        'ai_timeline',
        'recommendations',
        'raw_ai_output',
    ];

    protected $casts = [
        'suggested_tasks' => 'array',
        'ai_timeline' => 'array',
        'raw_ai_output' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
