<?php

namespace App\Modules\RolePermission\Services\Api;

use App\Modules\RolePermission\DTOs\PermissionDTO;
use App\Modules\RolePermission\DTOs\SyncPermissionsDTO;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ApiPermissionService
{
    public function getAllPermissions()
    {
        return Permission::orderBy('name')->get();
    }

    public function createPermission(PermissionDTO $dto)
    {
        $permission = Permission::create([
            'name' => $dto->name,
            'guard_name' => $dto->guardName,
        ]);
        return $permission;
    }

    public function syncPermissionsToRole($roleId, SyncPermissionsDTO $dto)
    {
        $role = Role::find($roleId);
        if (!$role) {
            throw new \Exception('Role not found');
        }

        $permissions = Permission::whereIn('id', $dto->permissionIds)->get();
        $role->syncPermissions($permissions);

        return $role->load('permissions');
    }

    public function getRolePermissions($roleId)
    {
        $role = Role::find($roleId);
        if (!$role) {
            throw new \Exception('Role not found');
        }

        return $role->permissions;
    }
}
