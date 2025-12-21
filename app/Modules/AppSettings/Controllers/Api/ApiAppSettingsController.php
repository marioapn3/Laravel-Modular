<?php

namespace App\Modules\AppSettings\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\AppSettings\DTOs\AppSettingDTO;
use App\Modules\AppSettings\Requests\AppSettingRequest;
use App\Modules\AppSettings\Services\Api\ApiAppSettingsService;
use Illuminate\Http\JsonResponse;

class ApiAppSettingsController extends Controller
{
    protected $apiAppSettingsService;

    public function __construct(ApiAppSettingsService $apiAppSettingsService)
    {
        $this->apiAppSettingsService = $apiAppSettingsService;
    }

    public function getAppSettings()
    {
        try {
            $appSettings = $this->apiAppSettingsService->getAppSettings();
            return $this->success($appSettings, 'App settings fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function updateAppSettings(AppSettingRequest $request)
    {
        try {
            $dto = AppSettingDTO::fromRequest($request);
            $appSettings = $this->apiAppSettingsService->updateAppSettings($dto);
            return $this->success($appSettings, 'App settings updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
