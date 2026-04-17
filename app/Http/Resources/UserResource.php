<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $todayAttendance = $this->attendances()->whereDate('date', now()->toDateString())->first();
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'avatar' => $this->avatar,
            'last_seen' => $this->last_seen,
            'is_online' => $this->isOnline(),
            'last_attendance_at' => $this->last_attendance_at ? $this->last_attendance_at->format('H:i') : 'No logs today',
            'attendance_status' => $todayAttendance ? 'Present Today ✓' : 'Available',
            'is_present' => !!$todayAttendance,
        ];
    }
}
