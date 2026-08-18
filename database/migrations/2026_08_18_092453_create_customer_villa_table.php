<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_villa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('villa_id')->constrained('villas')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['customer_id', 'villa_id']);
        });

        // Drop the old villa_id column from customers table
        Schema::table('customers', function (Blueprint $table) {
            $table->dropForeign(['villa_id']);
            $table->dropColumn('villa_id');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->foreignId('villa_id')->nullable()->constrained('villas')->nullOnDelete();
        });

        Schema::dropIfExists('customer_villa');
    }
};
