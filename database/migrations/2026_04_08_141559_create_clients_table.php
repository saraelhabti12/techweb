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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The member who added the client
            $table->string('name');
            $table->string('phone');
            $table->string('city')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'interested', 'not_interested'])->default('pending');
            $table->enum('contact_method', ['whatsapp', 'call', 'meeting'])->default('whatsapp');
            $table->date('contact_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
