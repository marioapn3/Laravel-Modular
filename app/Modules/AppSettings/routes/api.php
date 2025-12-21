<?php

use App\Common\Enums\RouteEnums;
use Illuminate\Support\Facades\Route;
use App\Modules\AppSettings\Controllers\Api\ApiAppSettingsController;

Route::prefix('v1')->group(function () {
    Route::prefix('app-settings')->name('app-settings.')->group(function () {
        Route::controller(ApiAppSettingsController::class)->group(function () {
            Route::get('/', 'getAppSettings')->name(RouteEnums::APP_SETTINGS_GET_APP_SETTINGS->value);
            Route::put('/', 'updateAppSettings')->name(RouteEnums::APP_SETTINGS_UPDATE_APP_SETTINGS->value);
        });
    });
});
