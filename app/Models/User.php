<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', 
        'avatar', 
        'last_seen',
        'base_salary',
        'job_title',
        'show_on_homepage',
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
            'last_seen' => 'datetime',
            'show_on_homepage' => 'boolean',
        ];
    }

    /**
     * Check if the user is currently online.
     * Online status is active if the last heartbeat was within the last 60 seconds.
     */
    public function isOnline()
    {
        if (!$this->last_seen) return false;
        return $this->last_seen->gt(now()->subMinutes(1));
    }

    // Add relationships
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function lastAttendance()
    {
        return $this->hasOne(Attendance::class)->latestOfMany();
    }

    public function getLastAttendanceAtAttribute()
    {
        return $this->lastAttendance ? $this->lastAttendance->marked_at : null;
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

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_user')->withTimestamps();
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function personalTodos()
    {
        return $this->hasMany(PersonalTodo::class);
    }
}
