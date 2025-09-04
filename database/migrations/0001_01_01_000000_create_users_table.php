<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
// Migration : C’est la classe de base que toutes les migrations héritent.
// Blueprint : Sert à définir la structure des tables (colonnes, index, clés primaires, etc.).
// Schema : Fournit des méthodes pour interagir avec la base de données (créer, modifier, supprimer des tables).

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
             // une colonne dans la table users qui garde “Est-ce que cet utilisateur a confirmé son adresse e-mail ?”
            // Après la vérification : Laravel met automatiquement la date et l’heure de la confirmation.
            // Quand l’utilisateur crée un compte (avec email + mot de passe), Laravel peut envoyer un e-mail de confirmation avec un lien.
            $table->string('password');
            $table->rememberToken();
            //une colonne spéciale utilisée par Laravel pour la fonction Remember Me) lorsque l’utilisateur se connecte.
            $table->timestamps();
        });
        
        // la table pour gérer la réinitialisation de mot de passe.

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
