<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('app_settings', function (Blueprint $table) {
            $table->integer('id')->primary();
            
            // Basic App Info
            $table->string('app_name')->default('Laravel App');
            $table->text('app_description')->nullable();
            $table->string('app_logo')->nullable();
            $table->string('app_favicon')->nullable();
            
            // SEO Settings
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->text('seo_keywords')->nullable();
            $table->string('seo_og_image')->nullable();
            
            $table->string('primary_color')->default('#3b82f6');
            $table->string('secondary_color')->default('#6b7280');
            $table->string('accent_color')->default('#10b981');
            
            // Contact & Social
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->text('contact_address')->nullable();
            $table->json('social_links')->nullable(); // {"facebook": "url", "twitter": "url", etc}
            
            // Additional Settings
            $table->json('custom_settings')->nullable(); // For future extensibility
            $table->boolean('maintenance_mode')->default(false);
            $table->text('maintenance_message')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_settings');
    }
};
