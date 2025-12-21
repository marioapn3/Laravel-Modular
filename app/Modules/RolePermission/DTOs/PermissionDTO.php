<?php

namespace App\Modules\RolePermission\DTOs;

use App\Modules\RolePermission\Requests\PermissionRequest;

class PermissionDTO
{
    private function __construct(
        public readonly string $name,
        public readonly string $guardName,
    ) {}

    public static function fromRequest(
        PermissionRequest $request
    ): self {
        return new self(
            name: $request->name,
            guardName: $request->guard_name ?? 'web',
        );
    }
}

