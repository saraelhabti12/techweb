<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SharedFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'original_name',
        'file_path',
        'file_type',
        'size',
        'uploaded_by',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
