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
        Schema::create('quotation_items', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('quotation_id')->constrained()->onDelete('cascade');
            $blueprint->string('description');
            $blueprint->decimal('quantity', 15, 2)->default(1);
            $blueprint->decimal('unit_price', 15, 2)->default(0);
            $blueprint->decimal('subtotal', 15, 2)->default(0);
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_items');
    }
};
