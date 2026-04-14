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
        // First, change to string to allow any value
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
        });

        // Then update existing 'approved' to 'accepted'
        DB::table('appointments')->where('status', 'approved')->update(['status' => 'accepted']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Change back 'accepted' to 'approved' before reverting to enum
        DB::table('appointments')->where('status', 'accepted')->update(['status' => 'approved']);

        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->change();
        });
    }
};
