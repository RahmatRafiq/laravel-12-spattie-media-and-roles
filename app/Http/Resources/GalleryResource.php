<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $url = $this->disk === 'public' || str_contains($this->disk, 'profile-images')
            ? $this->getUrl()
            : route('gallery.file', $this->id);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'file_name' => $this->file_name,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'size_formatted' => $this->human_readable_size,
            'disk' => $this->disk,
            'collection_name' => $this->collection_name,
            'folder_id' => $this->folder_id,
            'original_url' => $url,
            'preview_url' => $this->hasGeneratedConversion('thumb') ? $this->getUrl('thumb') : null,
            'custom_properties' => $this->custom_properties,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
