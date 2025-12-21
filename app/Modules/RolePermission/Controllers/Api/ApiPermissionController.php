<?php

namespace App\Modules\RolePermission\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\RolePermission\DTOs\PermissionDTO;
use App\Modules\RolePermission\DTOs\SyncPermissionsDTO;
use App\Modules\RolePermission\Requests\PermissionRequest;
use App\Modules\RolePermission\Services\Api\ApiPermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiPermissionController extends Controller
{
    protected ApiPermissionService $apiPermissionService;

    public function __construct(
        ApiPermissionService $apiPermissionService
    ) {
        $this->apiPermissionService = $apiPermissionService;
    }

    public function getAllPermissions()
    {
        try {
            $permissions = $this->apiPermissionService->getAllPermissions();
            return $this->success($permissions, 'Permissions fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function createPermission(PermissionRequest $request)
    {
        try {
            $dto = PermissionDTO::fromRequest($request);
            $permission = $this->apiPermissionService->createPermission($dto);
            return $this->success($permission, 'Permission created successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function syncPermissionsToRole($roleId, Request $request)
    {
        try {
            $request->validate([
                'permission_ids' => 'required|array',
                'permission_ids.*' => 'required|integer|exists:permissions,id',
            ]);

            $dto = SyncPermissionsDTO::fromArray($request->all());
            $role = $this->apiPermissionService->syncPermissionsToRole($roleId, $dto);
            return $this->success($role, 'Permissions synced to role successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getRolePermissions($roleId)
    {
        try {
            $permissions = $this->apiPermissionService->getRolePermissions($roleId);
            return $this->success($permissions, 'Role permissions fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}

