<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title');            
            $table->dateTime('date');                
            $table->string('person')->nullable(); 
            $table->text('content')->nullable(); 
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
