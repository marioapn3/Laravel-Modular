<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Dashboard\Controllers\Api\ApiDashboardController;

Route::prefix('dashboard')->name('dashboard.')->group(function () {
    // Route::get('/', [ApiDashboardController::class, 'index'])->name('index');
    // Route::get('/{id}', [ApiDashboardController::class, 'show'])->name('show');
});