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
        Schema::table('clients', function (Blueprint $table) {
            $table->string('email')->nullable()->after('name');
            $table->string('address')->nullable()->after('phone');
            $table->string('logo')->nullable()->after('city');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->string('client_name')->nullable();
            $table->string('client_phone')->nullable();
            $table->string('client_email')->nullable();
            $table->string('client_address')->nullable();
            $table->string('client_city')->nullable();
            $table->string('client_logo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['email', 'address', 'logo']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'client_name',
                'client_phone',
                'client_email',
                'client_address',
                'client_city',
                'client_logo',
            ]);
        });
    }
};
