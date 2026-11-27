<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('reference')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            $table->string('title');
            $table->unsignedBigInteger('price');
            $table->string('transaction'); // vente | location
            $table->string('type');        // villa | appartement | terrain | studio | bureau
            $table->string('city');
            $table->string('neighborhood');
            $table->string('region')->default('Cameroun');

            $table->unsignedSmallInteger('rooms')->default(0);
            $table->unsignedSmallInteger('bedrooms')->default(0);
            $table->unsignedSmallInteger('bathrooms')->default(0);
            $table->unsignedInteger('surface');
            $table->unsignedInteger('land')->nullable();
            $table->unsignedSmallInteger('parking')->default(0);

            $table->text('image');
            $table->json('gallery');
            $table->text('description');
            $table->text('description2')->nullable();
            $table->json('features');
            $table->json('documents');

            $table->string('condition')->default('ancien');
            $table->string('seller_type')->default('particulier');
            $table->string('seller');
            $table->decimal('seller_rating', 3, 1)->default(0);
            $table->unsignedInteger('seller_reviews')->default(0);
            $table->string('seller_since')->nullable();
            $table->text('seller_description')->nullable();
            $table->string('seller_phone')->nullable();

            $table->boolean('is_new')->default(true);
            $table->date('published_at')->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->boolean('price_dropped')->default(false);
            $table->unsignedBigInteger('original_price')->nullable();
            $table->unsignedSmallInteger('year_built')->nullable();
            $table->unsignedSmallInteger('floor')->nullable();
            $table->unsignedSmallInteger('total_floors')->nullable();

            $table->string('status')->default('pending')->index(); // pending | approved | rejected
            $table->text('rejection_reason')->nullable();
            $table->foreignId('moderated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('moderated_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
