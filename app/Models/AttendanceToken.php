<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class AttendanceToken extends Model
{
    use HasFactory;

    // Define the table name (if it doesn't follow Laravel's convention)
    protected $table = 'attendance_tokens';

    // Define the fillable fields
    protected $fillable = [
        'user_id',
        'token',
        'date',
    ];

    // Optional: Define the relationship if needed (e.g., to User model)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
