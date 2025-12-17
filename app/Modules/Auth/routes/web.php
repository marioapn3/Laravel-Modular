<?php

use App\Modules\Auth\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->name('auth.')->group(function () {
    // Route::get('/', [AuthController::class, 'index'])->name('index');
    // Route::get('/{id}', [AuthController::class, 'show'])->name('show');
});
