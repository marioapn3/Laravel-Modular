<?php

namespace App\Modules\RolePermission\DTOs;

class SyncPermissionsDTO
{
    private function __construct(
        public readonly array $permissionIds,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            permissionIds: $data['permission_ids'] ?? [],
        );
    }
}

