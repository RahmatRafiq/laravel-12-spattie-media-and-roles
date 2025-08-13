<?php

use App\Models\AppSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can get singleton instance', function () {
    $setting = AppSetting::getInstance();
    expect($setting)->not->toBeNull();
    expect($setting->id)->toBe(1);
});

test('can update settings', function () {
    $setting = AppSetting::getInstance();
    $setting = AppSetting::updateSettings(['app_name' => 'Updated App']);
    expect($setting->app_name)->toBe('Updated App');
});

test('casts work as expected', function () {
    $setting = AppSetting::getInstance();
    $setting->update(['social_links' => ['fb' => 'fb.com'], 'maintenance_mode' => true]);
    $setting->refresh();
    expect($setting->social_links)->toBeArray();
    expect($setting->maintenance_mode)->toBeTrue();
});
