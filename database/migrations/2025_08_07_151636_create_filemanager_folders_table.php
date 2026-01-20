<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filemanager_folders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('parent_id')->nullable()->constrained('filemanager_folders')->onDelete('cascade');
            $table->string('path')->nullable()->index();
            $table->timestamps();

            // Unique constraint: prevent duplicate folder names within same parent
            $table->unique(['parent_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filemanager_folders');
    }
};
