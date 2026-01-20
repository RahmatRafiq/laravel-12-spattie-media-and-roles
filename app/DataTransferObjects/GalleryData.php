<?php

namespace App\DataTransferObjects;

use Illuminate\Http\Request;

class GalleryData
{
    /**
     * GalleryData constructor
     */
    public function __construct(
        public readonly string $visibility,
        public readonly string $collection,
        public readonly ?int $folderId = null,
        public readonly ?string $search = null,
    ) {}

    /**
     * Create DTO from HTTP request
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            visibility: $request->string('visibility', 'public')->toString(),
            collection: $request->string('collection_name', 'gallery')->toString(),
            folderId: $request->integer('folder_id') ?: null,
            search: $request->string('search')->toString() ?: null,
        );
    }

    /**
     * Create DTO from array
     */
    public static function fromArray(array $data): self
    {
        return new self(
            visibility: $data['visibility'] ?? 'public',
            collection: $data['collection'] ?? 'gallery',
            folderId: $data['folder_id'] ?? null,
            search: $data['search'] ?? null,
        );
    }

    /**
     * Convert DTO to array
     */
    public function toArray(): array
    {
        return array_filter([
            'visibility' => $this->visibility,
            'collection' => $this->collection,
            'folder_id' => $this->folderId,
            'search' => $this->search,
        ], fn ($value) => $value !== null);
    }

    /**
     * Check if visibility is public
     */
    public function isPublic(): bool
    {
        return $this->visibility === 'public';
    }

    /**
     * Check if visibility is private
     */
    public function isPrivate(): bool
    {
        return $this->visibility === 'private';
    }
}
