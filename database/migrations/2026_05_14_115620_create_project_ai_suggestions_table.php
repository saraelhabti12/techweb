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
        Schema::create('project_ai_suggestions', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('project_id')->constrained()->onDelete('cascade');
            $blueprint->json('suggested_tasks')->nullable();
            $blueprint->string('risk_level')->nullable();
            $blueprint->json('ai_timeline')->nullable();
            $blueprint->text('recommendations')->nullable();
            $blueprint->json('raw_ai_output')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_ai_suggestions');
    }
};
