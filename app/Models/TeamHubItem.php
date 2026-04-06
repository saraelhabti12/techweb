<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamHubItem extends Model
{
    use HasFactory;

    // Your database uses dashed table names
    protected $table = 'teamhub-items';

    protected $fillable = ['title', 'content', 'file_path', 'admin_id'];

    public function users()
    {
        // Custom pivot table name with dashes
        return $this->belongsToMany(User::class, 'teamhub-item-user', 'teamhub_item_id', 'user_id');
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





