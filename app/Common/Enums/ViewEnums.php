<?php

namespace App\Common\Enums;

enum ViewEnums: string
{
    case LOGIN = 'Auth/Login';

        // Dashboard Module
    case DASHBOARD_HOME = 'Dashboard/Home/Index';

        // Role Permission Module
    case ROLE_PERMISSION_INDEX = 'Dashboard/RolePermissions/Index';

        // App Settings Module
    case APP_SETTINGS_INDEX = 'Dashboard/AppSettings/Index';
}
