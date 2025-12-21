import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Role, Permission } from "../../../api/features/dashboard/roles-permissions/Types";
import { getPermissions, syncPermissionsToRole, getRolePermissions } from "../../../api/features/dashboard/roles-permissions";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface ModalSyncPermissionsProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role: Role | null;
}

export default function ModalSyncPermissions({ isOpen, onClose, onSuccess, role }: ModalSyncPermissionsProps) {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && role) {
            fetchPermissions();
            fetchRolePermissions();
        } else {
            setSelectedPermissionIds([]);
            setError(null);
        }
    }, [isOpen, role]);

    const fetchPermissions = async () => {
        try {
            setFetching(true);
            const data = await getPermissions();
            setPermissions(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch permissions");
            toast.error(err.message || "Failed to fetch permissions");
        } finally {
            setFetching(false);
        }
    };

    const fetchRolePermissions = async () => {
        if (!role) return;
        
        try {
            const data = await getRolePermissions(role.id);
            setSelectedPermissionIds(data.map((p) => p.id));
        } catch (err: any) {
            console.error("Failed to fetch role permissions:", err);
        }
    };

    const handleTogglePermission = (permissionId: number) => {
        setSelectedPermissionIds((prev) => {
            if (prev.includes(permissionId)) {
                return prev.filter((id) => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedPermissionIds.length === permissions.length) {
            setSelectedPermissionIds([]);
        } else {
            setSelectedPermissionIds(permissions.map((p) => p.id));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!role) return;

        setLoading(true);
        setError(null);

        try {
            await syncPermissionsToRole(role.id, {
                permission_ids: selectedPermissionIds,
            });

            toast.success("Permissions synced to role successfully");
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to sync permissions to role");
            toast.error(err.message || "Failed to sync permissions to role");
        } finally {
            setLoading(false);
        }
    };

    if (!role) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Sync Permissions to Role
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Select permissions to assign to <span className="font-semibold">{role.name}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-900/20">
                            <p className="text-sm text-error-700 dark:text-error-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Select All Button */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                        <Label>Select Permissions</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAll}
                            disabled={fetching || loading}
                        >
                            {selectedPermissionIds.length === permissions.length ? "Deselect All" : "Select All"}
                        </Button>
                    </div>

                    {/* Permissions List */}
                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {fetching ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading permissions...</span>
                            </div>
                        ) : permissions.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500 dark:text-gray-400">No permissions available</p>
                            </div>
                        ) : (
                            permissions.map((permission) => {
                                const isSelected = selectedPermissionIds.includes(permission.id);
                                return (
                                    <label
                                        key={permission.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                            isSelected
                                                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-500"
                                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleTogglePermission(permission.id)}
                                            className="w-4 h-4 text-brand-500 rounded border-gray-300 dark:border-gray-600 focus:ring-brand-500 focus:ring-2 cursor-pointer"
                                            disabled={loading}
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {permission.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Guard: {permission.guard_name}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <Check className="w-5 h-5 text-brand-500" />
                                        )}
                                    </label>
                                );
                            })
                        )}
                    </div>

                    {/* Selected Count */}
                    {permissions.length > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                            {selectedPermissionIds.length} of {permissions.length} permissions selected
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || fetching}
                            startIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                        >
                            {loading ? "Syncing..." : "Sync Permissions"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

