<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'start_date',
        'end_date',
        'status',
        'client_id',
        'project_type',
        'client_name',
        'client_phone',
        'client_email',
        'client_address',
        'client_city',
        'client_logo',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function members() {

        return $this->belongsToMany(User::class);
    }
}

