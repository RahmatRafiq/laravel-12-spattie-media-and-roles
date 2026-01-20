<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class FilemanagerFolder extends Model
{
    use HasFactory;

    protected $table = 'filemanager_folders';

    protected $fillable = [
        'name',
        'parent_id',
        'path',
    ];

    protected $casts = [
        'parent_id' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // When deleting a folder, handle orphaned galleries
        static::deleting(function ($folder) {
            // Set folder_id to null for galleries (prevent cascade deletion of galleries)
            $folder->galleries()->update(['folder_id' => null]);

            // Recursively delete child folders (cascade handled by DB constraint)
            // Media files will cascade delete via DB constraint as well
        });

        // Auto-generate path when creating folder
        static::creating(function ($folder) {
            if ($folder->parent_id && ! $folder->path) {
                $parent = self::find($folder->parent_id);
                $folder->path = $parent->path ? "{$parent->path}/{$folder->name}" : $folder->name;
            } elseif (! $folder->path) {
                $folder->path = $folder->name;
            }
        });

        // Update path when folder is renamed or moved
        static::updating(function ($folder) {
            if ($folder->isDirty('name') || $folder->isDirty('parent_id')) {
                if ($folder->parent_id) {
                    $parent = self::find($folder->parent_id);
                    $folder->path = $parent->path ? "{$parent->path}/{$folder->name}" : $folder->name;
                } else {
                    $folder->path = $folder->name;
                }

                // Update all children paths recursively
                $folder->updateChildrenPaths();
            }
        });
    }

    /**
     * Update paths for all children recursively
     */
    public function updateChildrenPaths(): void
    {
        foreach ($this->children as $child) {
            $child->path = $this->path ? "{$this->path}/{$child->name}" : $child->name;
            $child->saveQuietly(); // Save without triggering events
            $child->updateChildrenPaths();
        }
    }

    /**
     * Get the parent folder.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(FilemanagerFolder::class, 'parent_id');
    }

    /**
     * Get the child folders.
     */
    public function children(): HasMany
    {
        return $this->hasMany(FilemanagerFolder::class, 'parent_id');
    }

    /**
     * Get all media files in this folder.
     */
    public function media(): HasMany
    {
        return $this->hasMany(Media::class, 'folder_id');
    }

    /**
     * Get all galleries in this folder.
     */
    public function galleries(): HasMany
    {
        return $this->hasMany(Gallery::class, 'folder_id');
    }
}
