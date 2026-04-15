<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'file_path',
        'original_name',
        'type',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
