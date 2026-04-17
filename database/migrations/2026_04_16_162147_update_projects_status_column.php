<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, update existing values to the new ones if we're using a string column
        // If we want to keep it as enum, it's better to change it to string first, update, then back to enum (if needed).
        // But for simplicity and flexibility, changing it to string is usually better.
        
        Schema::table('projects', function (Blueprint $table) {
            $table->string('status')->default('active')->change();
        });

        DB::table('projects')
            ->whereIn('status', ['pending', 'in_progress'])
            ->update(['status' => 'active']);
        
        // Optional: Ensure all other statuses are valid, else set to active
        DB::table('projects')
            ->whereNotIn('status', ['active', 'completed', 'paused', 'cancelled', 'archived'])
            ->update(['status' => 'active']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending')->change();
        });
        
        DB::table('projects')
            ->whereIn('status', ['paused', 'cancelled', 'archived'])
            ->update(['status' => 'pending']);
            
        DB::table('projects')
            ->where('status', 'active')
            ->update(['status' => 'in_progress']);
    }
};
