<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'roles' => $this->roles->pluck('name'),
            'role_id' => $this->roles->first()?->id,
            'permissions' => $this->getAllPermissions()->pluck('name'),
            'is_admin' => $this->hasRole('admin'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'trashed' => ! is_null($this->deleted_at),
        ];
    }

    /**
     * Get additional data for the resource
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'timestamp' => now()->toISOString(),
            ],
        ];
    }
}
