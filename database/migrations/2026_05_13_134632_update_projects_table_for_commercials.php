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
        Schema::table('projects', function (Blueprint $table) {
            // Drop old foreign key if it exists
            $table->dropForeign(['commercial_id']);
        });

        Schema::table('projects', function (Blueprint $table) {
             // Re-add commercial_id but point to commercials table
             $table->foreign('commercial_id')
                   ->references('id')
                   ->on('commercials')
                   ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['commercial_id']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->foreign('commercial_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }
};
