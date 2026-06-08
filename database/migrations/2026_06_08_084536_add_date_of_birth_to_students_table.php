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
    Schema::table('students', function (Blueprint $table) {
        // age কলামের পরে date_of_birth কলামটি যোগ করা হচ্ছে (এটি nullable করা ভালো)
        $table->date('date_of_birth')->nullable()->after('age'); 
    });
}

public function down(): void
{
    Schema::table('students', function (Blueprint $table) {
        $table->dropColumn('date_of_birth');
    });
}
};
