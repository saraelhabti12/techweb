<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'client_id',
        'user_id',
        'appointment_date',
        'end_date',
        'notes',
        'status',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function toCalendarEvent()
    {
        $typeColors = [
            'client_visit' => ['bg' => '#7c3aed', 'border' => '#6d28d9'], // Purple
            'client_meeting' => ['bg' => '#3b82f6', 'border' => '#2563eb'], // Blue
            'internal_meeting' => ['bg' => '#10b981', 'border' => '#059669'], // Green
            'lunch_break' => ['bg' => '#f59e0b', 'border' => '#d97706'], // Yellow
            'busy_outside' => ['bg' => '#ef4444', 'border' => '#dc2626'], // Red
            'personal_event' => ['bg' => '#ec4899', 'border' => '#db2777'], // Pink
        ];

        $colors = $typeColors[$this->type] ?? $typeColors['client_visit'];
        $title = $this->title ?: ($this->client ? $this->client->name . ' (Visit)' : 'Event');

        return [
            'id' => $this->id,
            'title' => $this->status === 'manual' ? 'Admin Busy' : $title,
            'start' => $this->appointment_date->toIso8601String(),
            'end' => $this->end_date ? $this->end_date->toIso8601String() : null,
            'extendedProps' => [
                'type' => $this->type,
                'member' => $this->user ? $this->user->name : 'Admin',
                'client_name' => $this->client ? $this->client->name : null,
                'notes' => $this->notes,
                'is_manual' => $this->status === 'manual',
            ],
            'backgroundColor' => $this->status === 'manual' ? '#9ca3af' : $colors['bg'], // Gray for manual to indicate busy
            'borderColor' => $this->status === 'manual' ? '#6b7280' : $colors['border'],
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
