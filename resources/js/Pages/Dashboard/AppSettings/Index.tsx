import { useState, useEffect } from "react";
import { toast } from "sonner";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import FileInput from "../../../components/form/input/FileInput";
import { getAppSettings, updateAppSettings, type UpdateAppSettingsPayload } from "../../../api/features/dashboard/app-setings";
import type { AppSettings } from "../../../api/features/dashboard/app-setings/Types";
import { X } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function AppSettingsIndex() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
    const [formData, setFormData] = useState({
        app_name: "",
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ app_name?: string; general?: string }>({});

    useEffect(() => {
        fetchAppSettings();
    }, []);

    const fetchAppSettings = async () => {
        try {
            setFetching(true);
            const data = await getAppSettings();
            setAppSettings(data);
            setFormData({
                app_name: data.app_name || "",
            });
            if (data.app_logo) {
                setLogoPreview(data.app_logo);
            }
            if (data.app_favicon) {
                setFaviconPreview(data.app_favicon);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch app settings");
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }
            setFaviconFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFaviconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview(appSettings?.app_logo || null);
    };

    const removeFavicon = () => {
        setFaviconFile(null);
        setFaviconPreview(appSettings?.app_favicon || null);
    };

    const validateForm = (): boolean => {
        const newErrors: { app_name?: string } = {};

        if (!formData.app_name.trim()) {
            newErrors.app_name = "App name is required";
        } else if (formData.app_name.trim().length > 255) {
            newErrors.app_name = "App name must not exceed 255 characters";
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
            const payload: UpdateAppSettingsPayload = {
                app_name: formData.app_name.trim(),
                app_logo: logoFile || null,
                app_favicon: faviconFile || null,
            };

            const updated = await updateAppSettings(payload);
            setAppSettings(updated);

            // Update previews if new files were uploaded
            if (logoFile) {
                setLogoFile(null);
            }
            if (faviconFile) {
                setFaviconFile(null);
            }

            toast.success("App settings updated successfully");
        } catch (error: any) {
            if (error.message) {
                const errorMessage = error.message;

                if (errorMessage.includes("app_name")) {
                    setErrors({
                        app_name: errorMessage,
                    });
                } else {
                    setErrors({
                        general: errorMessage,
                    });
                }
            } else {
                setErrors({
                    general: "Failed to update app settings. Please try again.",
                });
            }
            toast.error(error.message || "Failed to update app settings");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading app settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="App Settings" subTitle="Manage your application settings including name, logo, and favicon" listBreadcrumb={["App Settings"]} />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {errors.general && (
                    <div className="p-4 rounded-lg bg-error-500/10 dark:bg-error-500/20 border border-error-500/30 dark:border-error-500/50">
                        <p className="text-sm text-error-500">{errors.general}</p>
                    </div>
                )}

                {/* App Name */}
                <div>
                    <Label htmlFor="app_name" required>
                        App Name
                    </Label>
                    <Input
                        id="app_name"
                        name="app_name"
                        type="text"
                        value={formData.app_name}
                        onChange={handleInputChange}
                        placeholder="Enter app name"
                        error={!!errors.app_name}
                        hint={errors.app_name}
                    />
                </div>

                {/* App Logo */}
                <div>
                    <Label htmlFor="app_logo">App Logo</Label>
                    <div className="space-y-3">
                        {logoPreview && (
                            <div className="relative inline-block">
                                <img
                                    src={logoPreview}
                                    alt="App Logo Preview"
                                    className="h-32 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-contain bg-gray-50 dark:bg-gray-800 p-2"
                                />
                                {(logoFile || appSettings?.app_logo) && (
                                    <button
                                        type="button"
                                        onClick={removeLogo}
                                        className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-error-500 text-white hover:bg-error-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                        <FileInput
                            onChange={handleLogoChange}
                            className="accept-image"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Recommended: PNG, JPG, SVG. Max size: 2MB
                        </p>
                    </div>
                </div>

                {/* App Favicon */}
                <div>
                    <Label htmlFor="app_favicon">App Favicon</Label>
                    <div className="space-y-3">
                        {faviconPreview && (
                            <div className="relative inline-block">
                                <img
                                    src={faviconPreview}
                                    alt="App Favicon Preview"
                                    className="h-16 w-16 rounded-lg border border-gray-200 dark:border-gray-700 object-contain bg-gray-50 dark:bg-gray-800 p-2"
                                />
                                {(faviconFile || appSettings?.app_favicon) && (
                                    <button
                                        type="button"
                                        onClick={removeFavicon}
                                        className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-error-500 text-white hover:bg-error-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                        <FileInput
                            onChange={handleFaviconChange}
                            className="accept-image"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Recommended: ICO, PNG. Max size: 2MB. Size: 32x32 or 16x16 pixels
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                app_name: appSettings?.app_name || "",
                            });
                            setLogoFile(null);
                            setFaviconFile(null);
                            setLogoPreview(appSettings?.app_logo || null);
                            setFaviconPreview(appSettings?.app_favicon || null);
                            setErrors({});
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        disabled={loading}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 text-sm font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Updating...
                            </>
                        ) : (
                            "Update Settings"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

