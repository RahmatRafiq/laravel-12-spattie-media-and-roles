<?php

namespace App\Services;

use App\Models\AppSetting;

class AppSettingService
{
    public function getSettings(): AppSetting
    {
        return AppSetting::firstOrCreate(
            ['id' => 1],
            [
                'app_name' => config('app.name', 'Laravel App'),
                'primary_color' => '#3b82f6',
                'secondary_color' => '#6b7280',
                'accent_color' => '#10b981',
                'maintenance_mode' => false,
            ]
        );
    }

    public function updateSettings(array $data): AppSetting
    {
        $settings = $this->getSettings();
        $settings->update($data);
        return $settings;
    }

    public function getAvailableColors(): array
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

    public function getTailwindColors(AppSetting $settings): array
    {
        return [
            'primary' => $this->hexToTailwindColor($settings->primary_color),
            'secondary' => $this->hexToTailwindColor($settings->secondary_color),
            'accent' => $this->hexToTailwindColor($settings->accent_color),
        ];
    }

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
}
