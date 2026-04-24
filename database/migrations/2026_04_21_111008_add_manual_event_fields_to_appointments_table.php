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
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('title')->nullable()->after('id');
            $table->string('type')->default('client_visit')->after('title');
            $table->dateTime('end_date')->nullable()->after('appointment_date');
            $table->foreignId('client_id')->nullable()->change();
            $table->foreignId('user_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['title', 'type', 'end_date']);
            $table->foreignId('client_id')->nullable(false)->change();
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};
