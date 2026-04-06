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
       Schema::create('contacts', function (Blueprint $table) {
        $table->id();
        $table->string('full_name');
        $table->string('contact_number');
        $table->string('company_name')->nullable();
        $table->string('email');
        $table->json('services')->nullable(); // Pour stocker plusieurs choix
        $table->text('message')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
