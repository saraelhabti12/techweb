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
        'is_read',
        'needs_creator',
        'selected_creators',
    ];

    protected $casts = [
        'services' => 'array',
        'is_read' => 'boolean',
        'needs_creator' => 'boolean',
        'selected_creators' => 'array',
    ];
}
