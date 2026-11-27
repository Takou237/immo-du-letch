<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminContentController;
use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('admin.dashboard'));

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');

    Route::middleware('admin')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/listings', [AdminDashboardController::class, 'listings'])->name('listings');
        Route::get('/listings/create', [AdminDashboardController::class, 'createListing'])->name('listings.create');
        Route::post('/listings', [AdminDashboardController::class, 'storeListing'])->name('listings.store');
        Route::get('/listings/{listing}', [AdminDashboardController::class, 'showListing'])->name('listings.show');
        Route::get('/listings/{listing}/edit', [AdminDashboardController::class, 'editListing'])->name('listings.edit');
        Route::put('/listings/{listing}', [AdminDashboardController::class, 'updateListing'])->name('listings.update');
        Route::patch('/listings/{listing}/moderate', [AdminDashboardController::class, 'moderateListing'])->name('listings.moderate');
        Route::delete('/listings/{listing}', [AdminDashboardController::class, 'destroyListing'])->name('listings.destroy');

        Route::get('/articles', [AdminContentController::class, 'articles'])->name('articles');
        Route::post('/articles', [AdminContentController::class, 'storeArticle'])->name('articles.store');
        Route::put('/articles/{article}', [AdminContentController::class, 'updateArticle'])->name('articles.update');
        Route::delete('/articles/{article}', [AdminContentController::class, 'destroyArticle'])->name('articles.destroy');

        Route::get('/faqs', [AdminContentController::class, 'faqs'])->name('faqs');
        Route::post('/faqs', [AdminContentController::class, 'storeFaq'])->name('faqs.store');
        Route::put('/faqs/{faq}', [AdminContentController::class, 'updateFaq'])->name('faqs.update');
        Route::delete('/faqs/{faq}', [AdminContentController::class, 'destroyFaq'])->name('faqs.destroy');

        Route::get('/settings', [AdminContentController::class, 'settings'])->name('settings');
        Route::put('/settings', [AdminContentController::class, 'updateSettings'])->name('settings.update');
        Route::post('/slides', [AdminContentController::class, 'storeSlide'])->name('slides.store');
        Route::put('/slides/{slide}', [AdminContentController::class, 'updateSlide'])->name('slides.update');
        Route::delete('/slides/{slide}', [AdminContentController::class, 'destroySlide'])->name('slides.destroy');

        Route::get('/users', [AdminDashboardController::class, 'users'])->name('users');
        Route::patch('/users/{user}/toggle-active', [AdminDashboardController::class, 'toggleUserActive'])->name('users.toggle-active');
        Route::patch('/users/{user}/toggle-role', [AdminDashboardController::class, 'toggleUserRole'])->name('users.toggle-role');

        Route::get('/inquiries', [AdminDashboardController::class, 'inquiries'])->name('inquiries');
        Route::patch('/inquiries/{inquiry}/status', [AdminDashboardController::class, 'updateInquiryStatus'])->name('inquiries.status');
        Route::delete('/inquiries/{inquiry}', [AdminDashboardController::class, 'destroyInquiry'])->name('inquiries.destroy');
    });
});
