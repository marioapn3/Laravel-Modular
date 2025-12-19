<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Controllers\Api\ApiUserController;

Route::prefix('user')->name('user.')->group(function () {
    // Route::get('/', [ApiUserController::class, 'index'])->name('index');
    // Route::get('/{id}', [ApiUserController::class, 'show'])->name('show');
});