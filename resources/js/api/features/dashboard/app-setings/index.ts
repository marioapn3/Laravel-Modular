import type { AppSettings } from "./Types";

export interface UpdateAppSettingsPayload {
    app_name: string;
    app_logo?: File | null;
    app_favicon?: File | null;
}

export const getAppSettings = async (): Promise<AppSettings> => {
    const res = await fetch(`/api/v1/app-settings`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || "Failed to fetch app settings");
    }

    return response.data;
};

export const updateAppSettings = async (payload: UpdateAppSettingsPayload): Promise<AppSettings> => {
    const formData = new FormData();
    formData.append("app_name", payload.app_name);

    if (payload.app_logo) {
        formData.append("app_logo", payload.app_logo);
    }

    if (payload.app_favicon) {
        formData.append("app_favicon", payload.app_favicon);
    }

    const res = await fetch(`/api/v1/app-settings`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
    });

    const response = await res.json();

    if (!res.ok) {
        // Handle validation errors
        if (response.errors) {
            const errorMessages = Object.values(response.errors).flat();
            throw new Error(errorMessages.join(", ") || "Validation failed");
        }
        throw new Error(response.message || "Failed to update app settings");
    }

    return response.data;
};
