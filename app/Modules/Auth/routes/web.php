<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Controllers\Web\AuthController;

Route::prefix('auth')->name('auth.')->group(function () {
    // Route::get('/', [AuthController::class, 'index'])->name('index');
    // Route::get('/{id}', [AuthController::class, 'show'])->name('show');
});