<?php

namespace App\Modules\AppSettings\Services\Api;

use App\Helpers\ImageUploader;
use App\Modules\AppSettings\DTOs\AppSettingDTO;
use App\Modules\AppSettings\Models\AppSettings;

class ApiAppSettingsService
{
    protected $imageUploader;

    public function __construct(ImageUploader $imageUploader)
    {
        $this->imageUploader = $imageUploader;
    }

    public function getAppSettings()
    {
        return AppSettings::first();
    }

    public function updateAppSettings(AppSettingDTO $dto)
    {
        $appSettings = AppSettings::first();
        if ($dto->app_logo) {
            $logoPath = $this->imageUploader->upload($dto->app_logo, 'app-settings');
            $appSettings->app_logo = $logoPath;
        }
        if ($dto->app_favicon) {
            $faviconPath = $this->imageUploader->upload($dto->app_favicon, 'app-settings');
            $appSettings->app_favicon = $faviconPath;
        }
        $appSettings->update([
            'app_name' => $dto->app_name,
            'app_logo' => $logoPath,
            'app_favicon' => $faviconPath,
        ]);
        return $appSettings;
    }
}
