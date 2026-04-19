<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppSetting\UpdateAppSettingRequest;
use App\Services\AppSettingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AppSettingController extends Controller
{
    public function __construct(
        protected AppSettingService $appSettingService
    ) {}

    public function index(): Response
    {
        $settings = $this->appSettingService->getSettings();
        $availableColors = $this->appSettingService->getAvailableColors();

        return Inertia::render('AppSetting/Index', [
            'settings' => $settings,
            'availableColors' => $availableColors,
        ]);
    }

    public function update(UpdateAppSettingRequest $request): RedirectResponse
    {
        $this->appSettingService->updateSettings($request->validated());

        return redirect()->route('app-settings.index')->with('success', 'App settings have been updated successfully.');
    }
}
