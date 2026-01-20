<?php

namespace App\DTOs\Gallery;

class MediaQueryDTO
{
    public function __construct(
        public readonly ?int $folderId = null,
        public readonly ?string $visibility = null,
        public readonly int $page = 1,
        public readonly int $perPage = 20,
        public readonly ?string $search = null,
        public readonly ?string $sortBy = 'created_at',
        public readonly string $sortOrder = 'desc',
    ) {}

    /**
     * Create DTO from request data
     */
    public static function fromRequest(array $data): self
    {
        return new self(
            folderId: isset($data['folder_id']) ? (int) $data['folder_id'] : null,
            visibility: $data['visibility'] ?? null,
            page: isset($data['page']) ? max(1, (int) $data['page']) : 1,
            perPage: isset($data['per_page']) ? min(100, max(1, (int) $data['per_page'])) : 20,
            search: $data['search'] ?? null,
            sortBy: $data['sort_by'] ?? 'created_at',
            sortOrder: in_array($data['sort_order'] ?? 'desc', ['asc', 'desc']) ? $data['sort_order'] : 'desc',
        );
    }

    /**
     * Validate query parameters
     */
    public function validate(): array
    {
        $errors = [];

        // Validate visibility
        if ($this->visibility !== null && ! in_array($this->visibility, ['public', 'private', 'all'])) {
            $errors['visibility'] = 'Invalid visibility value';
        }

        // Validate sort column
        $allowedSortColumns = ['created_at', 'updated_at', 'name', 'size', 'mime_type'];
        if (! in_array($this->sortBy, $allowedSortColumns)) {
            $errors['sort_by'] = 'Invalid sort column';
        }

        // Validate per page limit
        if ($this->perPage < 1 || $this->perPage > 100) {
            $errors['per_page'] = 'Per page must be between 1 and 100';
        }

        return $errors;
    }

    /**
     * Get disk filter based on visibility
     */
    public function getDiskFilter(): ?string
    {
        return match ($this->visibility) {
            'public' => 'public',
            'private' => 'private',
            default => null,
        };
    }

    /**
     * Convert to array for query building
     */
    public function toArray(): array
    {
        return [
            'folder_id' => $this->folderId,
            'visibility' => $this->visibility,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'search' => $this->search,
            'sort_by' => $this->sortBy,
            'sort_order' => $this->sortOrder,
        ];
    }
}
