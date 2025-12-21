<?php

use App\Common\Enums\RouteEnums;
use Illuminate\Support\Facades\Route;
use App\Modules\AppSettings\Controllers\Web\AppSettingsController;


Route::prefix('dashboard')->group(function () {
    Route::controller(AppSettingsController::class)->group(function () {
        Route::get('/app-settings', 'index')->name(RouteEnums::APP_SETTINGS_VIEW->value);
    });
});
