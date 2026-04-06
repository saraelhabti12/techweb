<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            // Ajouter un champ time
            $table->time('time')->after('date')->nullable();

            // Changer dateTime en date seulement
            $table->date('date')->change();
        });
    }

    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dateTime('date')->change();
            $table->dropColumn('time');
        });
    }
};
