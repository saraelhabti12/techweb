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
        Schema::create('creators', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('display_name');
            $table->string('profile_photo')->nullable();
            $table->json('gallery_images')->nullable();
            $table->integer('age')->nullable();
            $table->string('gender')->nullable();
            $table->string('city')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->integer('height_cm')->nullable();
            $table->integer('weight_kg')->nullable();
            $table->string('clothing_size')->nullable();
            $table->string('shoe_size')->nullable();
            $table->json('languages')->nullable();
            $table->text('skills')->nullable();
            $table->text('experience_notes')->nullable();
            $table->enum('availability_status', ['available', 'busy', 'on_shoot', 'vacation'])->default('available');
            $table->decimal('daily_rate', 10, 2)->nullable();
            $table->boolean('visible_on_homepage')->default(false);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creators');
    }
};
