<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'client_id',
        'full_name',
        'contact_number',
        'company_name',
        'email',
        'services',
        'message',
        'is_read'
    ];

    protected $casts = [
        'services' => 'array', // pour gérer JSON automatiquement
    ];
}
