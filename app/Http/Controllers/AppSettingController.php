<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppSetting\UpdateAppSettingRequest;
use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AppSettingController extends Controller
{
    public function index(): Response
    {
        $settings = AppSetting::getInstance();
        $availableColors = AppSetting::getAvailableColors();

        return Inertia::render('AppSetting/Index', [
            'settings' => $settings,
            'availableColors' => $availableColors,
        ]);
    }

    public function update(UpdateAppSettingRequest $request): RedirectResponse
    {
        AppSetting::updateSettings($request->validated());

        return redirect()->route('app-settings.index')->with('success', 'App settings have been updated successfully.');
    }
}
