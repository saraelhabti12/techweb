<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'due_date', 'deadline', 'status', 'project_id', 'assigned_to'];

    // Laravel transformera automatiquement JSON <-> tableau
    // protected $casts = [
    //     'members' => 'array',
    // ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function progressUpdates()
    {
        return $this->hasMany(ProgressUpdate::class);
    }

    public function files()
    {
        return $this->hasMany(TaskFile::class);
    }

    public function members()
    {
        // return $this->belongsToMany(User::class);
         // Assure-toi que c'est bien une table pivot task_user
        return $this->belongsToMany(User::class, 'task_user', 'task_id', 'user_id');
    }
}

