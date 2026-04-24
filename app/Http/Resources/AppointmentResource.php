<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'client' => new ClientResource($this->whenLoaded('client')),
            'user' => new UserResource($this->whenLoaded('user')),
            'appointment_date' => $this->appointment_date,
            'end_date' => $this->end_date,
            'notes' => $this->notes,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
