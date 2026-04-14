<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamHubItem extends Model
{
    use HasFactory;

    // Your database uses underscore table names
    protected $table = 'teamhub_items';

    protected $fillable = ['title', 'content', 'file_path', 'admin_id'];

    public function users()
    {
        // Custom pivot table name with underscores
        return $this->belongsToMany(User::class, 'teamhub_item_user', 'teamhub_item_id', 'user_id');
    }

    public function messages()
    {
        return $this->hasMany(TeamHubMessage::class, 'teamhub_item_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}





