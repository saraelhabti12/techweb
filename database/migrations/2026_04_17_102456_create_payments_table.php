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
        Schema::create('payments', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('invoice_id')->constrained()->onDelete('cascade');
            $blueprint->decimal('amount', 15, 2);
            $blueprint->date('payment_date');
            $blueprint->string('payment_method')->nullable();
            $blueprint->text('notes')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
