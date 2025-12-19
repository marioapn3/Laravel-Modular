<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Controllers\Web\UserController;

Route::prefix('user')->name('user.')->group(function () {
    // Route::get('/', [UserController::class, 'index'])->name('index');
    // Route::get('/{id}', [UserController::class, 'show'])->name('show');
});