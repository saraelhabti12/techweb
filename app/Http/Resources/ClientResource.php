<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'whatsapp' => $this->whatsapp,
            'company_name' => $this->company_name,
            'city' => $this->city,
            'address' => $this->address,
            'website' => $this->website,
            'social_links' => $this->social_links,
            'logo' => $this->logo,
            'notes' => $this->notes,
            'status' => $this->status,
            'is_blacklisted' => (bool) $this->is_blacklisted,
            'blacklist_reason' => $this->blacklist_reason,
            'contact_method' => $this->contact_method,
            'contact_date' => $this->contact_date,
            'user' => new UserResource($this->whenLoaded('user')),
            'files' => $this->files, // Or create a ClientFileResource if needed
            'created_at' => $this->created_at,
        ];
    }
}
