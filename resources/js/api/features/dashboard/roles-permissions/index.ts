import { RolePaginationResponse, Role, Permission } from "./Types";

export const getRoles = async (page: number = 1, perPage: number = 15, search?: string) => {
    const url = new URL(`/api/v1/role-permission/roles`, window.location.origin);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("per_page", perPage.toString());
    
    if (search && search.trim()) {
        url.searchParams.set("search", search.trim());
    }
    
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch roles");
    return res.json() as Promise<RolePaginationResponse>;
};

export interface CreateRolePayload {
    name: string;
}

export interface UpdateRolePayload {
    name: string;
}

export const createRole = async (payload: CreateRolePayload): Promise<Role> => {
    const res = await fetch(`/api/v1/role-permission/roles`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(payload),
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to create role");
    }

    return response.data;
};

export const updateRole = async (id: number, payload: UpdateRolePayload): Promise<Role> => {
    const res = await fetch(`/api/v1/role-permission/roles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(payload),
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to update role");
    }

    return response.data;
};

export const deleteRole = async (id: number): Promise<void> => {
    const res = await fetch(`/api/v1/role-permission/roles/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to delete role");
    }
};

// Permission APIs
export const getPermissions = async (): Promise<Permission[]> => {
    const res = await fetch(`/api/v1/role-permission/permissions`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to fetch permissions");
    }

    return response.data;
};

export interface CreatePermissionPayload {
    name: string;
    guard_name?: string;
}

export const createPermission = async (payload: CreatePermissionPayload): Promise<Permission> => {
    const res = await fetch(`/api/v1/role-permission/permissions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(payload),
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to create permission");
    }

    return response.data;
};

export interface SyncPermissionsPayload {
    permission_ids: number[];
}

export const syncPermissionsToRole = async (roleId: number, payload: SyncPermissionsPayload): Promise<Role> => {
    const res = await fetch(`/api/v1/role-permission/roles/${roleId}/sync-permissions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(payload),
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to sync permissions to role");
    }

    return response.data;
};

export const getRolePermissions = async (roleId: number): Promise<Permission[]> => {
    const res = await fetch(`/api/v1/role-permission/roles/${roleId}/permissions`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to fetch role permissions");
    }

    return response.data;
};
