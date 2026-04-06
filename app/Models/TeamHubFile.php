<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamHubFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'file_name',
        'file_path',
        'uploaded_by', 
        'visibility',
    ];

    public function activity() {
        return $this->belongsTo(TeamHubActivity::class, 'activity_id');
    }

    public function uploader() {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function authorizedMembers() {
        return $this->belongsToMany(User::class, 'teamhub_file_user', 'file_id', 'user_id');
    }

    
}
