<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'start_date',
        'end_date',
        'status',
        'client_id',
        'project_type',
        'client_name',
        'client_phone',
        'client_email',
        'client_address',
        'client_city',
        'client_logo',
        'project_manager_id',
        'commercial_type',
        'commercial_id',
        'commercial_name',
        'commercial_phone',
        'commercial_email',
        'commercial_commission',
        'commercial_notes',
    ];

    protected $appends = ['progress'];

    public function getProgressAttribute()
    {
        $totalTasks = $this->tasks()->count();
        if ($totalTasks === 0) return 0;
        
        $completedTasks = $this->tasks()->where('status', 'completed')->count();
        return round(($completedTasks / $totalTasks) * 100);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function members() {
        return $this->belongsToMany(User::class);
    }

    public function projectManager()
    {
        return $this->belongsTo(User::class, 'project_manager_id');
    }

    public function commercialInternal()
    {
        return $this->belongsTo(Commercial::class, 'commercial_id');
    }

    public function commercials()
    {
        return $this->belongsToMany(Commercial::class, 'commercial_project');
    }

    public function creators()
    {
        return $this->belongsToMany(Creator::class);
    }

    public function aiSuggestions()
    {
        return $this->hasMany(ProjectAiSuggestion::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}

