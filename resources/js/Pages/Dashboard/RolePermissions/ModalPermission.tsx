import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { createPermission } from "../../../api/features/dashboard/roles-permissions";
import { Loader2 } from "lucide-react";

interface ModalPermissionProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormErrors {
    name?: string;
    guard_name?: string;
    general?: string;
}

export default function ModalPermission({ isOpen, onClose, onSuccess }: ModalPermissionProps) {
    const [formData, setFormData] = useState({
        name: "",
        guard_name: "web",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: "",
                guard_name: "web",
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Permission name is required";
        } else if (formData.name.trim().length > 255) {
            newErrors.name = "Permission name must not exceed 255 characters";
        }

        if (formData.guard_name && formData.guard_name.trim().length > 255) {
            newErrors.guard_name = "Guard name must not exceed 255 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            await createPermission({
                name: formData.name.trim(),
                guard_name: formData.guard_name.trim() || "web",
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            if (error.message) {
                const errorMessage = error.message;
                
                if (errorMessage.includes("name")) {
                    setErrors({
                        name: errorMessage,
                    });
                } else if (errorMessage.includes("guard")) {
                    setErrors({
                        guard_name: errorMessage,
                    });
                } else {
                    setErrors({
                        general: errorMessage,
                    });
                }
            } else {
                setErrors({
                    general: "Failed to create permission. Please try again.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Create New Permission
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Fill in the information to create a new permission.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* General Error Message */}
                    {errors.general && (
                        <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-900/20">
                            <p className="text-sm text-error-700 dark:text-error-400">
                                {errors.general}
                            </p>
                        </div>
                    )}

                    {/* Permission Name Field */}
                    <div>
                        <Label htmlFor="name" required>
                            Permission Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter permission name (e.g., create-user, read-post)"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            disabled={loading}
                            hint={errors.name}
                        />
                    </div>

                    {/* Guard Name Field */}
                    <div>
                        <Label htmlFor="guard_name">
                            Guard Name
                        </Label>
                        <Input
                            id="guard_name"
                            name="guard_name"
                            type="text"
                            placeholder="web"
                            value={formData.guard_name}
                            onChange={handleChange}
                            error={!!errors.guard_name}
                            disabled={loading}
                            hint={errors.guard_name}
                        />
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                            Default: web
                        </p>
                    </div>

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
                            disabled={loading}
                            startIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                        >
                            {loading ? "Creating..." : "Create Permission"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

