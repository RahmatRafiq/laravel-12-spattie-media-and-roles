<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    use HasFactory;

    protected $fillable = [
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
     * Get the singleton app settings instance
     */
    public static function getInstance(): self
    {
        $settings = static::firstOrCreate(
            ['id' => 1],
            [
                'app_name' => 'Laravel App',
                'primary_color' => '#3b82f6',
                'secondary_color' => '#6b7280',
                'accent_color' => '#10b981',
                'maintenance_mode' => false,
            ]
        );

        return $settings;
    }

    /**
     * Update app settings
     */
    public static function updateSettings(array $data): self
    {
        $settings = static::getInstance();
        $settings->update($data);

        return $settings;
    }

    /**
     * Get Tailwind-compatible color classes
     */
    public function getTailwindColors(): array
    {
        return [
            'primary' => $this->hexToTailwindColor($this->primary_color),
            'secondary' => $this->hexToTailwindColor($this->secondary_color),
            'accent' => $this->hexToTailwindColor($this->accent_color),
        ];
    }

    /**
     * Convert hex color to Tailwind color name (simplified)
     */
    private function hexToTailwindColor(string $hex): string
    {
        $tailwindColors = [
            '#3b82f6' => 'blue-500',
            '#ef4444' => 'red-500',
            '#10b981' => 'emerald-500',
            '#f59e0b' => 'amber-500',
            '#8b5cf6' => 'violet-500',
            '#ec4899' => 'pink-500',
            '#6b7280' => 'gray-500',
            '#14b8a6' => 'teal-500',
            '#f97316' => 'orange-500',
            '#84cc16' => 'lime-500',
        ];

        return $tailwindColors[$hex] ?? 'blue-500';
    }

    /**
     * Get available theme colors for forms
     */
    public static function getAvailableColors(): array
    {
        return [
            '#3b82f6' => 'Blue',
            '#ef4444' => 'Red',
            '#10b981' => 'Emerald',
            '#f59e0b' => 'Amber',
            '#8b5cf6' => 'Violet',
            '#ec4899' => 'Pink',
            '#6b7280' => 'Gray',
            '#14b8a6' => 'Teal',
            '#f97316' => 'Orange',
            '#84cc16' => 'Lime',
        ];
    }
}
