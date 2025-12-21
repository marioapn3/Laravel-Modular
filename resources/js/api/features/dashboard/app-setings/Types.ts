import type { Response } from "../../../../components/tables/ProTables/ProTable";

export interface AppSettings {
    id: number
    app_name: string
    app_logo: string
    app_favicon: string
    created_at: string
    updated_at: string
}

export type AppSettingsResponse = Response<AppSettings>
