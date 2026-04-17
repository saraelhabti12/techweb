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
        Schema::create('quotations', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('client_id')->constrained()->onDelete('cascade');
            $blueprint->string('quotation_number')->unique();
            $blueprint->date('date');
            $blueprint->date('expiry_date')->nullable();
            $blueprint->decimal('subtotal', 15, 2)->default(0);
            $blueprint->decimal('tax', 15, 2)->default(0);
            $blueprint->decimal('discount', 15, 2)->default(0);
            $blueprint->decimal('total', 15, 2)->default(0);
            $blueprint->text('notes')->nullable();
            $blueprint->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
