<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamHubActivity extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'admin_id'];

    public function files() {
        return $this->hasMany(TeamHubFile::class, 'activity_id');
    }

    public function messages() {
        return $this->hasMany(TeamHubMessage::class, 'activity_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'activity_user', 'activity_id', 'user_id');
    }

    public function admin() {
        return $this->belongsTo(User::class, 'admin_id');
    }

}
