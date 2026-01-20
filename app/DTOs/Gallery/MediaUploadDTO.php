<?php

namespace App\DTOs\Gallery;

use Illuminate\Http\UploadedFile;

class MediaUploadDTO
{
    public function __construct(
        public readonly UploadedFile $file,
        public readonly ?string $name,
        public readonly ?string $description,
        public readonly ?int $folderId,
        public readonly string $visibility = 'public',
    ) {}

    /**
     * Create DTO from request data
     */
    public static function fromRequest(array $data): self
    {
        return new self(
            file: $data['file'],
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            folderId: isset($data['folder_id']) ? (int) $data['folder_id'] : null,
            visibility: $data['visibility'] ?? 'public',
        );
    }

    /**
     * Validate file before upload
     */
    public function validate(): array
    {
        $errors = [];

        // Check file size (10MB max)
        if ($this->file->getSize() > 10 * 1024 * 1024) {
            $errors['file'] = 'File size exceeds 10MB limit';
        }

        // Check MIME type
        $allowedMimes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'video/mp4', 'video/quicktime',
        ];

        if (! in_array($this->file->getMimeType(), $allowedMimes)) {
            $errors['file'] = 'File type not allowed';
        }

        // Check visibility
        if (! in_array($this->visibility, ['public', 'private'])) {
            $errors['visibility'] = 'Invalid visibility value';
        }

        return $errors;
    }

    /**
     * Get disk based on visibility
     */
    public function getDisk(): string
    {
        return $this->visibility === 'private' ? 'private' : 'public';
    }
}
