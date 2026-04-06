<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamHubMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'member_id', 
    ];

    public function activity() {
        return $this->belongsTo(TeamHubActivity::class, 'activity_id');
    }

    public function member() {
        return $this->belongsTo(User::class, 'member_id');
    }

}
