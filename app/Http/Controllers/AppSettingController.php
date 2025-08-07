<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppSettingController extends Controller
{
    
    public function index(): Response
    {
        $settings = AppSetting::getInstance();
        $availableColors = AppSetting::getAvailableColors();

        return Inertia::render('AppSetting/AppSettings', [
            'settings' => $settings,
            'availableColors' => $availableColors,
            'themeOptions' => [
                'light' => 'Light',
                'dark' => 'Dark', 
                'system' => 'System',
            ],
        ]);
    }

   
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'app_name' => 'required|string|max:255',
            'app_description' => 'nullable|string|max:1000',
            'app_logo' => 'nullable|string|max:500',
            'app_favicon' => 'nullable|string|max:500',
            
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_keywords' => 'nullable|string|max:1000',
            'seo_og_image' => 'nullable|string|max:500',
            
            'primary_color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
            'secondary_color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
            'accent_color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
            'theme_mode' => 'required|in:light,dark,system',
            
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'contact_address' => 'nullable|string|max:1000',
            
            'social_links' => 'nullable|array',
            'social_links.facebook' => 'nullable|url',
            'social_links.twitter' => 'nullable|url',
            'social_links.instagram' => 'nullable|url',
            'social_links.linkedin' => 'nullable|url',
            'social_links.youtube' => 'nullable|url',
            
            'maintenance_mode' => 'boolean',
            'maintenance_message' => 'nullable|string|max:1000',
        ]);

        AppSetting::updateSettings($request->all());

        // Clear settings cache to reflect changes immediately
        \Illuminate\Support\Facades\Cache::forget('app_settings');

        return redirect()->back()->with('success', 'App settings updated successfully!');
    }
}
