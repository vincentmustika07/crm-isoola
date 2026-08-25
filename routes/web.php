<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VillaController;
use App\Http\Controllers\CustomerController;

// Auth routes (guest only)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    // Aplikasi ini cuma punya satu password admin, jadi tanpa throttle
    // penyerang bisa mencoba ribuan password per menit tanpa hambatan.
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected routes
Route::middleware('admin')->group(function () {
    Route::redirect('/', '/villas');
    Route::resource('villas', VillaController::class);
    Route::resource('customers', CustomerController::class);
});
