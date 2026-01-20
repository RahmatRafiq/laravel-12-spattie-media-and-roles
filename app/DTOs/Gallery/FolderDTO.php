<?php

namespace App\DTOs\Gallery;

class FolderDTO
{
    public function __construct(
        public readonly string $name,
        public readonly ?int $parentId = null,
    ) {}

    /**
     * Create DTO from request data
     */
    public static function fromRequest(array $data): self
    {
        return new self(
            name: trim($data['name']),
            parentId: isset($data['parent_id']) ? (int) $data['parent_id'] : null,
        );
    }

    /**
     * Validate folder data
     */
    public function validate(): array
    {
        $errors = [];

        // Validate name
        if (empty($this->name)) {
            $errors['name'] = 'Folder name is required';
        }

        if (strlen($this->name) > 255) {
            $errors['name'] = 'Folder name is too long';
        }

        // Check for invalid characters
        if (preg_match('/[<>:\"\/\\\\|?*]/', $this->name)) {
            $errors['name'] = 'Folder name contains invalid characters';
        }

        // Check for path traversal attempts
        if (str_contains($this->name, '..') || str_contains($this->name, './')) {
            $errors['name'] = 'Invalid folder name';
        }

        return $errors;
    }

    /**
     * Check if parent folder exists (if specified)
     */
    public function validateParentExists(): bool
    {
        if ($this->parentId === null) {
            return true;
        }

        return \App\Models\FilemanagerFolder::where('id', $this->parentId)->exists();
    }

    /**
     * Prevent circular reference
     */
    public function validateNoCircularReference(?int $currentFolderId = null): bool
    {
        if ($this->parentId === null || $currentFolderId === null) {
            return true;
        }

        // Can't set parent to itself
        if ($this->parentId === $currentFolderId) {
            return false;
        }

        // Check if parent is a descendant of current folder
        $parent = \App\Models\FilemanagerFolder::find($this->parentId);
        while ($parent) {
            if ($parent->id === $currentFolderId) {
                return false;
            }
            $parent = $parent->parent;
        }

        return true;
    }
}
