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
        // 1. Update clients table
        Schema::table('clients', function (Blueprint $table) {
            $table->string('whatsapp')->nullable()->after('phone');
            $table->string('company_name')->nullable()->after('whatsapp');
            $table->string('website')->nullable()->after('logo');
            
            // Changing enum values is difficult in some DBs, so let's use a string or raw query.
            // For now, let's just use string to be safe and flexible.
            $table->string('status')->default('prospect')->change();
        });

        // 2. Create client_files table
        Schema::create('client_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->string('file_path');
            $table->string('original_name');
            $table->string('type')->nullable(); // document, image, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_files');

        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['whatsapp', 'company_name', 'website']);
            // We can't easily revert the enum change to its exact original state automatically in some DBs.
        });
    }
};
