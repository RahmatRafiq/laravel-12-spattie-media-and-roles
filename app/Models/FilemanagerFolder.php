<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FilemanagerFolder extends Model
{
    use HasFactory;

    protected $table = 'filemanager_folders';

    protected $fillable = [
        'name',
        'parent_id',
        'path',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(FilemanagerFolder::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(FilemanagerFolder::class, 'parent_id');
    }
}
