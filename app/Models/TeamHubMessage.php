<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamHubMessage extends Model
{
    use HasFactory;

    // Align with admin schema: team_hub_messages(activity_id, user_id, message, receiver_id)
    protected $fillable = ['activity_id', 'user_id','receiver_id' ,'message', 'is_read' ];

    public function activity()
    {
        return $this->belongsTo(TeamHubActivity::class, 'activity_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeUnreadFor($query, $userId)
    {
        return $query->where('receiver_id', $userId)->whereNull('read_at');
    }

}
