<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'file_name' => $this->file_name,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'size_formatted' => $this->human_readable_size,
            'disk' => $this->disk,
            'collection_name' => $this->collection_name,
            'folder_id' => $this->custom_properties['folder_id'] ?? null,
            'url' => $this->getUrl(),
            'preview_url' => $this->hasGeneratedConversion('thumb') ? $this->getUrl('thumb') : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
