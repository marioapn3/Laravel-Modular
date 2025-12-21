<?php

namespace App\Common\Enums;

enum RouteEnums: string
{
    // ========= Auth Module =========
    case LOGIN_VIEW = 'auth.login.view';
    case LOGIN_POST = 'auth.login.post';

        // ========= Dashboard Module =========
    case DASHBOARD_HOME_VIEW = 'dashboard.home.view';

        // ========= Role Permission Module =========
    case ROLE_PERMISSION_GET_ROLES_PAGINATION = 'role-permission.roles.get-roles-pagination';
    case ROLE_PERMISSION_CREATE_ROLE = 'role-permission.roles.create-role';
    case ROLE_PERMISSION_UPDATE_ROLE = 'role-permission.roles.update-role';
    case ROLE_PERMISSION_DELETE_ROLE = 'role-permission.roles.delete-role';
    case ROLE_PERMISSION_GET_ALL_ROLES = 'role-permission.roles.get-all-roles';
    case ROLE_PERMISSION_GET_ALL_PERMISSIONS = 'role-permission.permissions.get-all-permissions';
    case ROLE_PERMISSION_CREATE_PERMISSION = 'role-permission.permissions.create-permission';
    case ROLE_PERMISSION_SYNC_PERMISSIONS_TO_ROLE = 'role-permission.permissions.sync-permissions-to-role';
    case ROLE_PERMISSION_GET_ROLE_PERMISSIONS = 'role-permission.permissions.get-role-permissions';

    // ========= App Settings Module =========
    case APP_SETTINGS_VIEW = 'app-settings.view';
    case APP_SETTINGS_GET_APP_SETTINGS = 'app-settings.get-app-settings';
    case APP_SETTINGS_UPDATE_APP_SETTINGS = 'app-settings.update-app-settings';
}
