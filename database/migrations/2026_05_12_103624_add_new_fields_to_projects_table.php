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
            $table->foreignId('project_manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('commercial_type')->default('internal'); // internal, external
            $table->foreignId('commercial_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('commercial_name')->nullable();
            $table->string('commercial_phone')->nullable();
            $table->string('commercial_email')->nullable();
            $table->decimal('commercial_commission', 5, 2)->nullable();
            $table->text('commercial_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['project_manager_id']);
            $table->dropForeign(['commercial_id']);
            $table->dropColumn([
                'project_manager_id',
                'commercial_type',
                'commercial_id',
                'commercial_name',
                'commercial_phone',
                'commercial_email',
                'commercial_commission',
                'commercial_notes'
            ]);
        });
    }
};
