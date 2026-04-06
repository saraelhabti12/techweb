<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', 
        'avatar', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Add relationships
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_user');
    }

    // public function activities()
    // {
    //     return $this->belongsToMany(TeamHubActivity::class, 'activity_user', 'user_id', 'activity_id');
    // }

    public function teamHubActivities()
    {
        return $this->belongsToMany(
            TeamHubActivity::class,
            'activity_user',
            'user_id',
            'activity_id'
        );
    }

}
