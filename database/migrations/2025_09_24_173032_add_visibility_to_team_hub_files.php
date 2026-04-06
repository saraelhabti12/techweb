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
        Schema::table('team_hub_files', function (Blueprint $table) {
            $table->enum('visibility', ['all', 'selected'])->default('all');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_hub_files', function (Blueprint $table) {
            //
        });
    }
};
