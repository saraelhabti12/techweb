<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'project_id',
        'invoice_id',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'status',
        'payment_date',
        'proof_path',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
