<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppSettingController extends Controller
{
    /**
     * Display app settings.
     */
    public function index(): Response
    {
        $settings = AppSetting::getInstance();
        $availableColors = AppSetting::getAvailableColors();

        return Inertia::render('AppSetting/AppSettings', [
            'settings' => $settings,
            'availableColors' => $availableColors,
            
        ]);
    }

    /**
     * Update app settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
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
            
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'contact_address' => 'nullable|string|max:1000',
            
            'social_links' => 'nullable|array',
            'social_links.facebook' => 'nullable|string|max:255',
            'social_links.twitter' => 'nullable|string|max:255',
            'social_links.instagram' => 'nullable|string|max:255',
            'social_links.linkedin' => 'nullable|string|max:255',
            'social_links.youtube' => 'nullable|string|max:255',
            
            'maintenance_mode' => 'boolean',
            'maintenance_message' => 'nullable|string|max:1000',
        ]);

        AppSetting::updateSettings($validatedData);

        return redirect()->route('app-settings.index')->with('success', 'App settings berhasil diperbarui.');
    }
}
