<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Seeder;

class AppSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AppSetting::updateOrCreate(
            ['id' => 1],
            [
                'app_name' => 'Laravel App',
                'app_description' => 'A modern Laravel application.',
                'app_logo' => '/logo.svg',
                'app_favicon' => '/favicon.ico',
                'seo_title' => 'Laravel App',
                'seo_description' => 'A modern Laravel application.',
                'seo_keywords' => 'laravel,php,app',
                'seo_og_image' => '/og-image.jpg',
                'primary_color' => '#3b82f6',
                'secondary_color' => '#6b7280',
                'accent_color' => '#10b981',
                'contact_email' => 'admin@example.com',
                'contact_phone' => '+628123456789',
                'contact_address' => 'Jl. Contoh No. 123, Jakarta',
                'social_links' => [
                    'facebook' => '',
                    'twitter' => '',
                    'instagram' => '',
                    'linkedin' => '',
                    'youtube' => '',
                ],
                'custom_settings' => [],
                'maintenance_mode' => false,
                'maintenance_message' => null,
            ]
        );
    }
}
