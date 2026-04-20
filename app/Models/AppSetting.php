<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $fillable = [
        'id',
        'app_name',
        'app_description',
        'app_logo',
        'app_favicon',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'seo_og_image',
        'primary_color',
        'secondary_color',
        'accent_color',
        'contact_email',
        'contact_phone',
        'contact_address',
        'social_links',
        'custom_settings',
        'maintenance_mode',
        'maintenance_message',
    ];

    protected $casts = [
        'social_links' => 'array',
        'custom_settings' => 'array',
        'maintenance_mode' => 'boolean',
    ];

    /**
     * Get the application settings instance.
     *
     * @return self
     */
    public static function getInstance(): self
    {
        return static::find(1) ?: static::create([
            'id' => 1,
            'app_name' => config('app.name', 'Laravel App'),
        ]);
    }
}
