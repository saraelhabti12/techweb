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
        Schema::table('attendances', function (Blueprint $table) {
            // Add type column (arrival/departure)
            $table->enum('type', ['arrival', 'departure'])->after('user_id');

            // Add location columns
            $table->decimal('latitude', 10, 7)->nullable()->after('marked_at');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->string('location_address')->nullable()->after('longitude');



            // Add new index for better query performance
            $table->index(['user_id', 'date', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
