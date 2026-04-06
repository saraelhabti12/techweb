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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author')->default('Techweb');
            $table->text('excerpt')->nullable();
            $table->longText('content'); // contenu principal
            $table->json('images')->nullable(); // plusieurs images
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();
     });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
