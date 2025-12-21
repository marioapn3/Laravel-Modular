import { useState, useEffect, useCallback } from "react";
import { useFetchWithPagination } from "../../../api/hooks/useFetchWithPagination";
import { getRoles } from "../../../api/features/dashboard/roles-permissions";
import ProTable, { Column } from "../../../components/tables/ProTables/ProTable";
import { Role, RolePaginationResponse } from "../../../api/features/dashboard/roles-permissions/Types";
import Badge from "../../../components/ui/badge/Badge";
import { Edit, Trash2, Shield, Search, X, Plus, Key, Link2 } from "lucide-react";
import Button from "../../../components/ui/button/Button";
import { router } from "@inertiajs/react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ModalRole from "./ModalRole";
import ModalDeleteRole from "./ModalDeleteRole";
import ModalPermission from "./ModalPermission";
import ModalSyncPermissions from "./ModalSyncPermissions";
import { toast } from "sonner";

function RolesList() {
    const { data, loading, refetch } = useFetchWithPagination<RolePaginationResponse>(getRoles, { perPage: 15 });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [isSyncPermissionsModalOpen, setIsSyncPermissionsModalOpen] = useState(false);
    const [roleToSyncPermissions, setRoleToSyncPermissions] = useState<Role | null>(null);

    const getSearchFromUrl = useCallback(() => {
        const urlObj = new URL(window.location.href);
        return urlObj.searchParams.get("search") || "";
    }, []);

    const [searchValue, setSearchValue] = useState(getSearchFromUrl);

    useEffect(() => {
        setSearchValue(getSearchFromUrl());
    }, [getSearchFromUrl]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const url = new URL(window.location.href);
            const currentSearch = url.searchParams.get("search") || "";

            if (searchValue !== currentSearch) {
                url.searchParams.set("search", searchValue);
                url.searchParams.set("page", "1");

                if (!searchValue.trim()) {
                    url.searchParams.delete("search");
                }

                router.visit(url.toString(), {
                    preserveState: true,
                    preserveScroll: false,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue]);

    const columns: Column<Role>[] = [
        {
            key: "id",
            header: "ID",
            className: "w-20",
        },
        {
            key: "name",
            header: "Role Name",
            render: (role) => (
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-brand-100 rounded-lg dark:bg-brand-900">
                        <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                            {role.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {role.guard_name}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "guard_name",
            header: "Guard",
            render: (role) => (
                <Badge size="sm" color="primary">
                    {role.guard_name}
                </Badge>
            ),
        },
        {
            key: "created_at",
            header: "Created At",
            render: (role) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90">
                    {new Date(role.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            ),
        },
        {
            key: "updated_at",
            header: "Updated At",
            render: (role) => (
                <span className="text-gray-800 text-theme-sm dark:text-white/90">
                    {new Date(role.updated_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            className: "text-right",
            headerClassName: "text-right",
            render: (role) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        startIcon={<Link2 className="w-4 h-4" />}
                        onClick={(e) => {
                            e?.stopPropagation();
                            setRoleToSyncPermissions(role);
                            setIsSyncPermissionsModalOpen(true);
                        }}
                    >
                        Permissions
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        startIcon={<Edit className="w-4 h-4" />}
                        onClick={(e) => {
                            e?.stopPropagation();
                            setSelectedRole(role);
                            setIsModalOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        startIcon={<Trash2 className="w-4 h-4" />}
                        onClick={(e) => {
                            e?.stopPropagation();
                            setRoleToDelete(role);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set("page", page.toString());
        router.visit(url.toString(), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchValue("");
    };

    const handleOpenCreateModal = () => {
        setSelectedRole(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRole(null);
    };

    const handleModalSuccess = () => {
        toast.success("Role updated successfully");
        refetch();
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
    };

    const handleDeleteSuccess = () => {
        toast.success("Role deleted successfully");
        refetch();
    };

    const handlePermissionSuccess = () => {
        toast.success("Permission created successfully");
    };

    const handleSyncPermissionsSuccess = () => {
        toast.success("Permissions synced successfully");
        refetch();
    };

    const handleClosePermissionModal = () => {
        setIsPermissionModalOpen(false);
    };

    const handleCloseSyncPermissionsModal = () => {
        setIsSyncPermissionsModalOpen(false);
        setRoleToSyncPermissions(null);
    };


    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Role Permissions" subTitle="Manage roles and their permissions" listBreadcrumb={["Roles"]} />

            {/* Search Bar and Create Buttons */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search roles by name or guard..."
                        className="w-full pl-10 pr-10 h-11 rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                    {searchValue && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <Button
                    variant="outline"
                    startIcon={<Key className="w-4 h-4" />}
                    onClick={() => setIsPermissionModalOpen(true)}
                >
                    Create Permission
                </Button>
                <Button
                    variant="primary"
                    startIcon={<Plus className="w-4 h-4" />}
                    onClick={handleOpenCreateModal}
                >
                    Create Role
                </Button>
            </div>

            <ProTable<Role>
                data={data?.data}
                columns={columns}
                pagination={data ?? null}
                loading={loading}
                emptyMessage="No roles found"
                emptyDescription="Get started by creating a new role."
                onPageChange={handlePageChange}
                onRowClick={(role) => {
                    console.log("Row clicked:", role);
                }}
            />

            {/* Create/Edit Modal */}
            <ModalRole
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleModalSuccess}
                role={selectedRole}
            />

            {/* Delete Confirmation Modal */}
            <ModalDeleteRole
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onSuccess={handleDeleteSuccess}
                role={roleToDelete}
            />

            {/* Create Permission Modal */}
            <ModalPermission
                isOpen={isPermissionModalOpen}
                onClose={handleClosePermissionModal}
                onSuccess={handlePermissionSuccess}
            />

            {/* Sync Permissions Modal */}
            <ModalSyncPermissions
                isOpen={isSyncPermissionsModalOpen}
                onClose={handleCloseSyncPermissionsModal}
                onSuccess={handleSyncPermissionsSuccess}
                role={roleToSyncPermissions}
            />
        </div>
    );
}

export default RolesList;
