<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Controllers\Api\ApiAuthController;

Route::prefix('auth')->name('auth.')->group(function () {
    Route::controller(ApiAuthController::class)->group(function () {
        Route::post('/register', 'register')->name('register');
        Route::post('/login', 'login')->name('login');
    });
});

