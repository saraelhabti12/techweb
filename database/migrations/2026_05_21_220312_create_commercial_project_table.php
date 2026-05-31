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
        Schema::create('commercial_project', function (Blueprint $col) {
            $col->id();
            $col->foreignId('project_id')->constrained()->onDelete('cascade');
            $col->foreignId('commercial_id')->constrained()->onDelete('cascade');
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commercial_project');
    }
};
