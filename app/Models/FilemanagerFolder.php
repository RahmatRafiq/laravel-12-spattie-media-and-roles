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
