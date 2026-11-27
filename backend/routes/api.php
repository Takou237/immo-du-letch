<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\UserActionController;
use Illuminate\Support\Facades\Route;

// Healthcheck
Route::get('/health', fn () => response()->json(['status' => 'ok']));

// Contenu dynamique du site (articles, FAQ, carrousel, stats)
Route::get('/site-content', [SiteContentController::class, 'index']);

// Authentification
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'google']);

// Annonces publiques (validées)
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{slug}', [ListingController::class, 'show']);

// Demandes de contact (auth optionnelle)
Route::post('/listings/{slug}/inquiries', [UserActionController::class, 'storeInquiry'])
    ->middleware('api.token:optional');

// Routes authentifiées (utilisateur connecté)
Route::middleware('api.token:required')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/my-listings', [ListingController::class, 'myListings']);
    Route::post('/listings', [ListingController::class, 'store']);
    Route::delete('/listings/{slug}', [ListingController::class, 'destroy']);

    Route::get('/favorites', [UserActionController::class, 'favorites']);
    Route::post('/favorites/{slug}/toggle', [UserActionController::class, 'toggleFavorite']);

    Route::get('/saved-searches', [UserActionController::class, 'savedSearches']);
    Route::post('/saved-searches', [UserActionController::class, 'storeSavedSearch']);
    Route::delete('/saved-searches/{id}', [UserActionController::class, 'destroySavedSearch']);
});
