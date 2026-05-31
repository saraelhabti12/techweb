<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commercial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'photo',
        'status',
        'commission_type',
        'commission_value',
        'notes',
        'user_id',
    ];

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'commercial_project');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
