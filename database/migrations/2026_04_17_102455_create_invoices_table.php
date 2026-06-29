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
        Schema::create('invoices', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('client_id')->constrained()->onDelete('cascade');
            $blueprint->foreignId('quotation_id')->nullable()->constrained()->onDelete('set null');
            $blueprint->string('invoice_number')->unique();
            $blueprint->date('date');
            $blueprint->date('due_date')->nullable();
            $blueprint->decimal('subtotal', 15, 2)->default(0);
            $blueprint->decimal('tax', 15, 2)->default(0);
            $blueprint->decimal('discount', 15, 2)->default(0);
            $blueprint->decimal('total', 15, 2)->default(0);
            $blueprint->decimal('amount_paid', 15, 2)->default(0);
            $blueprint->enum('status', ['unpaid', 'partial', 'paid', 'late'])->default('unpaid');
            $blueprint->text('notes')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
