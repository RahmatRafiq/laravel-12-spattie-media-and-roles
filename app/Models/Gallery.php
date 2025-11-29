<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Gallery extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'folder_id',
    ];

    /**
     * Get the user that owns the gallery.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the folder that owns the gallery.
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(FilemanagerFolder::class);
    }

    /**
     * Register media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('gallery')
            ->acceptsMimeTypes([
                // Images
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/svg+xml',
                // Documents
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                // Archives
                'application/zip',
                'application/x-rar-compressed',
                // Videos
                'video/mp4',
                'video/quicktime',
                'video/x-msvideo',
            ])
            ->useDisk('public'); // Default to public disk
    }

    /**
     * Register media conversions (for images).
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        // Only create conversions for images
        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 150, 150)
            ->nonQueued()
            ->performOnCollections('gallery');

        $this->addMediaConversion('medium')
            ->fit(Fit::Contain, 500, 500)
            ->nonQueued()
            ->performOnCollections('gallery');

        $this->addMediaConversion('large')
            ->fit(Fit::Contain, 1200, 1200)
            ->nonQueued()
            ->performOnCollections('gallery');
    }
}
