<?php

use App\Common\Enums\RouteEnums;
use App\Modules\RolePermission\Controllers\Api\ApiRoleController;
use App\Modules\RolePermission\Controllers\Api\ApiPermissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('role-permission')->name('role-permission.')->group(function () {
        Route::controller(ApiRoleController::class)->group(function () {
            Route::get('/roles', 'getRolesPagination')->name(RouteEnums::ROLE_PERMISSION_GET_ROLES_PAGINATION->value);
            Route::post('/roles', 'createRole')->name(RouteEnums::ROLE_PERMISSION_CREATE_ROLE->value);
            Route::put('/roles/{id}', 'updateRole')->name(RouteEnums::ROLE_PERMISSION_UPDATE_ROLE->value);
            Route::delete('/roles/{id}', 'deleteRole')->name(RouteEnums::ROLE_PERMISSION_DELETE_ROLE->value);
            Route::get('/roles/all', 'getAllRoles')->name(RouteEnums::ROLE_PERMISSION_GET_ALL_ROLES->value);
        });

        Route::controller(ApiPermissionController::class)->group(function () {
            Route::get('/permissions', 'getAllPermissions')->name(RouteEnums::ROLE_PERMISSION_GET_ALL_PERMISSIONS->value);
            Route::post('/permissions', 'createPermission')->name(RouteEnums::ROLE_PERMISSION_CREATE_PERMISSION->value);
            Route::post('/roles/{roleId}/sync-permissions', 'syncPermissionsToRole')->name(RouteEnums::ROLE_PERMISSION_SYNC_PERMISSIONS_TO_ROLE->value);
            Route::get('/roles/{roleId}/permissions', 'getRolePermissions')->name(RouteEnums::ROLE_PERMISSION_GET_ROLE_PERMISSIONS->value);
        });
    });
});
